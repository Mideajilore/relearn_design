/**
 * Typed, async key/value storage.
 *
 * The interface is deliberately small and Promise-based so the localStorage
 * driver below can be swapped for a backend (Supabase, an API) without a single
 * component changing. Components must never touch `localStorage` directly —
 * they go through `storage` or, better, through the helpers at the bottom.
 */

export interface KeyValueStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  getAll<T>(): Promise<Record<string, T>>;
  remove(key: string): Promise<void>;
}

const NAMESPACE = 'operators-guide:';

function isAvailable(): boolean {
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
const available = typeof window !== 'undefined' && isAvailable();

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

export const storage: KeyValueStore = {
  async get<T>(key: string): Promise<T | null> {
    const raw = readRaw(NAMESPACE + key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    writeRaw(NAMESPACE + key, JSON.stringify(value));
  },

  async getAll<T>(): Promise<Record<string, T>> {
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
  },

  async remove(key: string): Promise<void> {
    removeRaw(NAMESPACE + key);
  },
};

/** Whether writes will survive a reload. Surfaced in the UI as a warning. */
export const storageIsPersistent = available;

// ---------------------------------------------------------------------------
// App-shaped helpers. One record per day keeps the shape close to a future
// `daily_entries` table, so the Supabase swap is a driver change, not a
// re-modelling exercise.
// ---------------------------------------------------------------------------

import type { AppState, DailyEntry } from '../types';

const ENTRY_PREFIX = 'entry:';
const SETTINGS_KEY = 'settings';

interface Settings {
  monthOverride: number | null;
}

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
  await storage.set(ENTRY_PREFIX + entry.date, entry);
}

export async function saveMonthOverride(monthOverride: number | null): Promise<void> {
  await storage.set<Settings>(SETTINGS_KEY, { monthOverride });
}

export async function clearAll(): Promise<void> {
  const all = await storage.getAll<unknown>();
  await Promise.all(Object.keys(all).map((key) => storage.remove(key)));
}
