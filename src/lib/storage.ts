/**
 * Typed, async key/value storage.
 *
 * The public interface (`get`, `set`, `getAll`, `remove`) is unchanged from
 * v1 — components and routes are untouched by the addition of sync. What
 * changed is what sits underneath:
 *
 *   write  → localStorage immediately (instant UI), then upsert to Supabase.
 *            A failed upsert is queued and retried on reconnect.
 *   read   → Supabase when reachable, merged over the local cache with
 *            last-write-wins on `updatedAt`; the local cache alone otherwise.
 *
 * With no Supabase env configured the remote half is simply absent and this
 * behaves exactly as v1 did: local-only, fully working offline.
 */

import type { AppState, DailyEntry } from '../types';
import { createSupabaseRemote, type RemoteStore } from './remote';
import { isSupabaseConfigured, OWNER_KEY, supabase } from './supabase';

export interface KeyValueStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  getAll<T>(): Promise<Record<string, T>>;
  remove(key: string): Promise<void>;
}

const NAMESPACE = 'operators-guide:';
const ENTRY_PREFIX = 'entry:';
const SETTINGS_KEY = 'settings';
const PENDING_KEY = 'sync:pending';
const MIGRATED_KEY = 'sync:migrated';

/** Remote calls get a deadline so a flaky network can't hang first paint. */
const REMOTE_TIMEOUT_MS = 6000;

interface Settings {
  monthOverride: number | null;
}

// ---------------------------------------------------------------------------
// Local cache (localStorage, with an in-memory fallback)
// ---------------------------------------------------------------------------

function probeLocalStorage(): boolean {
  try {
    const probe = `${NAMESPACE}__probe__`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/**
 * In-memory fallback so the app still works in private windows or wherever
 * storage is blocked — it just won't persist across a reload.
 */
const memory = new Map<string, string>();
const available = typeof window !== 'undefined' && probeLocalStorage();

function readRaw(key: string): string | null {
  return available ? window.localStorage.getItem(key) : (memory.get(key) ?? null);
}

function writeRaw(key: string, value: string): void {
  if (available) window.localStorage.setItem(key, value);
  else memory.set(key, value);
}

function removeRaw(key: string): void {
  if (available) window.localStorage.removeItem(key);
  else memory.delete(key);
}

function allKeys(): string[] {
  const keys = available ? Object.keys(window.localStorage) : [...memory.keys()];
  return keys.filter((k) => k.startsWith(NAMESPACE));
}

function localGet<T>(key: string): T | null {
  const raw = readRaw(NAMESPACE + key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function localSet<T>(key: string, value: T): void {
  writeRaw(NAMESPACE + key, JSON.stringify(value));
}

function localAll<T>(): Record<string, T> {
  const out: Record<string, T> = {};
  for (const fullKey of allKeys()) {
    const raw = readRaw(fullKey);
    if (raw === null) continue;
    try {
      out[fullKey.slice(NAMESPACE.length)] = JSON.parse(raw) as T;
    } catch {
      // Skip anything that isn't ours or got corrupted.
    }
  }
  return out;
}

/** Whether writes will survive a reload. Surfaced in the UI as a warning. */
export const storageIsPersistent = available;

// ---------------------------------------------------------------------------
// Remote wiring
// ---------------------------------------------------------------------------

const defaultRemote: RemoteStore | null =
  supabase && isSupabaseConfigured ? createSupabaseRemote(supabase, OWNER_KEY) : null;

let remoteOverride: RemoteStore | null | undefined;

function getRemote(): RemoteStore | null {
  return remoteOverride !== undefined ? remoteOverride : defaultRemote;
}

/** True when sync is configured — used by the tests and worth exporting. */
export const syncIsConfigured = isSupabaseConfigured;

function isOnline(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine !== false;
}

function withTimeout<T>(work: Promise<T>): Promise<T> {
  return Promise.race([
    work,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('remote timed out')), REMOTE_TIMEOUT_MS),
    ),
  ]);
}

// ---------------------------------------------------------------------------
// Offline queue
// ---------------------------------------------------------------------------

type PendingOp = { key: string; op: 'set' | 'remove' };

function readPending(): PendingOp[] {
  return localGet<PendingOp[]>(PENDING_KEY) ?? [];
}

function writePending(ops: PendingOp[]): void {
  localSet(PENDING_KEY, ops);
}

function queuePending(key: string, op: PendingOp['op']): void {
  const ops = readPending().filter((pending) => pending.key !== key);
  ops.push({ key, op });
  writePending(ops);
}

/** Replay everything that failed to reach Supabase. Safe to call repeatedly. */
export async function flushPending(remote: RemoteStore | null = getRemote()): Promise<void> {
  if (!remote || !isOnline()) return;

  const ops = readPending();
  if (ops.length === 0) return;

  const stillPending: PendingOp[] = [];

  for (const pending of ops) {
    try {
      await pushKey(remote, pending.key, pending.op);
    } catch {
      stillPending.push(pending);
    }
  }

  writePending(stillPending);
}

/** Route one cache key to the table that backs it. */
async function pushKey(remote: RemoteStore, key: string, op: PendingOp['op']): Promise<void> {
  if (key.startsWith(ENTRY_PREFIX)) {
    const date = key.slice(ENTRY_PREFIX.length);
    if (op === 'remove') {
      await remote.removeEntry(date);
      return;
    }
    const entry = localGet<DailyEntry>(key);
    if (entry) await remote.upsertEntries([entry]);
    return;
  }

  if (key === SETTINGS_KEY) {
    const settings = localGet<Settings>(key);
    await remote.saveMonthOverride(op === 'remove' ? null : (settings?.monthOverride ?? null));
  }
  // Anything else (the sync bookkeeping keys) is local-only by design.
}

function isSyncedKey(key: string): boolean {
  return key.startsWith(ENTRY_PREFIX) || key === SETTINGS_KEY;
}

// ---------------------------------------------------------------------------
// The store
// ---------------------------------------------------------------------------

export const storage: KeyValueStore = {
  async get<T>(key: string): Promise<T | null> {
    const local = localGet<T>(key);

    const remote = getRemote();
    if (!remote || !isSyncedKey(key) || !isOnline()) return local;

    try {
      if (key.startsWith(ENTRY_PREFIX)) {
        const date = key.slice(ENTRY_PREFIX.length);
        const entries = await withTimeout(remote.fetchEntries());
        const match = entries.find((entry) => entry.date === date);
        const winner = newer(local as DailyEntry | null, match ?? null);
        if (winner) localSet(key, winner);
        return (winner as T) ?? local;
      }

      const monthOverride = await withTimeout(remote.fetchMonthOverride());
      const settings: Settings = { monthOverride };
      localSet(key, settings);
      return settings as T;
    } catch {
      return local;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    // Local first, always — the UI must never wait on the network.
    localSet(key, value);

    const remote = getRemote();
    if (!remote || !isSyncedKey(key)) return;

    if (!isOnline()) {
      queuePending(key, 'set');
      return;
    }

    try {
      await withTimeout(pushKey(remote, key, 'set'));
    } catch {
      queuePending(key, 'set');
    }
  },

  async getAll<T>(): Promise<Record<string, T>> {
    const local = localAll<T>();

    const remote = getRemote();
    if (!remote || !isOnline()) return local;

    try {
      await migrateLocalToRemote(remote);
      await flushPending(remote);

      const [entries, monthOverride] = await Promise.all([
        withTimeout(remote.fetchEntries()),
        withTimeout(remote.fetchMonthOverride()),
      ]);

      const merged: Record<string, unknown> = { ...local };

      for (const remoteEntry of entries) {
        const key = ENTRY_PREFIX + remoteEntry.date;
        const winner = newer(localGet<DailyEntry>(key), remoteEntry);
        if (winner) {
          merged[key] = winner;
          localSet(key, winner);
        }
      }

      const settings: Settings = { monthOverride };
      merged[SETTINGS_KEY] = settings;
      localSet(SETTINGS_KEY, settings);

      return merged as Record<string, T>;
    } catch {
      return local;
    }
  },

  async remove(key: string): Promise<void> {
    removeRaw(NAMESPACE + key);

    const remote = getRemote();
    if (!remote || !isSyncedKey(key)) return;

    if (!isOnline()) {
      queuePending(key, 'remove');
      return;
    }

    try {
      await withTimeout(pushKey(remote, key, 'remove'));
    } catch {
      queuePending(key, 'remove');
    }
  },
};

/** Last write wins. An entry with no timestamp is treated as the older one. */
function newer(a: DailyEntry | null, b: DailyEntry | null): DailyEntry | null {
  if (!a) return b;
  if (!b) return a;
  return (b.updatedAt ?? '') >= (a.updatedAt ?? '') ? b : a;
}

// ---------------------------------------------------------------------------
// One-time migration of v1 local data
// ---------------------------------------------------------------------------

/**
 * Carries a v1 install's history up to Supabase the first time it runs.
 *
 * Only fires when there is local data and the remote has none for this owner
 * key, so it can never overwrite what another device already synced. The
 * "done" flag is written only after a successful push — a failure here leaves
 * it unset so the next load retries rather than silently losing history.
 */
export async function migrateLocalToRemote(
  remote: RemoteStore | null = getRemote(),
): Promise<'skipped' | 'migrated' | 'not-needed'> {
  if (!remote) return 'skipped';
  if (localGet<boolean>(MIGRATED_KEY)) return 'skipped';

  const localEntries = Object.entries(localAll<unknown>())
    .filter(([key]) => key.startsWith(ENTRY_PREFIX))
    .map(([, value]) => value as DailyEntry)
    .filter((entry) => entry && typeof entry.date === 'string');

  if (localEntries.length === 0) {
    localSet(MIGRATED_KEY, true);
    return 'not-needed';
  }

  const remoteEntries = await withTimeout(remote.fetchEntries());
  if (remoteEntries.length > 0) {
    // Another device already populated this owner key — nothing to carry over.
    localSet(MIGRATED_KEY, true);
    return 'not-needed';
  }

  // v1 entries have no timestamp; stamp them so later edits can win cleanly.
  const stamped = localEntries.map((entry) => ({
    ...entry,
    updatedAt: entry.updatedAt ?? new Date(`${entry.date}T12:00:00`).toISOString(),
  }));

  await withTimeout(remote.upsertEntries(stamped));
  for (const entry of stamped) localSet(ENTRY_PREFIX + entry.date, entry);

  const settings = localGet<Settings>(SETTINGS_KEY);
  if (settings && settings.monthOverride != null) {
    await withTimeout(remote.saveMonthOverride(settings.monthOverride));
  }

  localSet(MIGRATED_KEY, true);
  return 'migrated';
}

// Retry queued writes as soon as the browser says we're back.
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    void flushPending();
  });
}

// ---------------------------------------------------------------------------
// App-shaped helpers. One record per day keeps the cache shape identical to
// the `daily_entries` table, so the two halves map onto each other directly.
// ---------------------------------------------------------------------------

export async function loadState(): Promise<AppState> {
  const all = await storage.getAll<unknown>();
  const entries: Record<string, DailyEntry> = {};

  for (const [key, value] of Object.entries(all)) {
    if (!key.startsWith(ENTRY_PREFIX)) continue;
    const entry = value as DailyEntry;
    if (entry && typeof entry.date === 'string') entries[entry.date] = entry;
  }

  const settings = (all[SETTINGS_KEY] as Settings | undefined) ?? null;

  return { entries, monthOverride: settings?.monthOverride ?? null };
}

export async function saveEntry(entry: DailyEntry): Promise<void> {
  await storage.set(ENTRY_PREFIX + entry.date, {
    ...entry,
    updatedAt: new Date().toISOString(),
  });
}

export async function saveMonthOverride(monthOverride: number | null): Promise<void> {
  await storage.set<Settings>(SETTINGS_KEY, { monthOverride });
}

export async function clearAll(): Promise<void> {
  for (const fullKey of allKeys()) removeRaw(fullKey);

  const remote = getRemote();
  if (!remote) return;

  try {
    await withTimeout(remote.clear());
  } catch {
    // Local is already wiped; the remote copy is cleared on the next
    // successful connection via the queued tombstone below.
    queuePending(SETTINGS_KEY, 'remove');
  }
}

// ---------------------------------------------------------------------------
// Test seams. Exported so the sync rules can be exercised against an
// in-memory double instead of a live Supabase project.
// ---------------------------------------------------------------------------

export const __testing = {
  setRemote(store: RemoteStore | null | undefined): void {
    remoteOverride = store;
  },
  resetLocal(): void {
    for (const fullKey of allKeys()) removeRaw(fullKey);
  },
  readLocal: localGet,
  writeLocal: localSet,
  pending: readPending,
  keys: { ENTRY_PREFIX, SETTINGS_KEY, MIGRATED_KEY, PENDING_KEY },
};
