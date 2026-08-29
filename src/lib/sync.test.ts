import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DailyEntry } from '../types';
import type { RemoteStore } from './remote';
import {
  __testing,
  clearAll,
  flushPending,
  loadState,
  migrateLocalToRemote,
  saveEntry,
  saveMonthOverride,
} from './storage';
import { currentStreak } from './streak';

/**
 * An in-memory stand-in for Supabase, so the sync rules can be exercised
 * without a live project: same interface, same call shapes.
 */
function fakeRemote() {
  const entries = new Map<string, DailyEntry>();
  let monthOverride: number | null = null;
  let offline = false;
  const calls = { upsert: 0, fetch: 0 };

  function guard() {
    if (offline) throw new Error('network unreachable');
  }

  const store: RemoteStore = {
    async fetchEntries() {
      guard();
      calls.fetch += 1;
      return [...entries.values()].map((entry) => ({ ...entry }));
    },
    async upsertEntries(incoming) {
      guard();
      calls.upsert += 1;
      for (const entry of incoming) entries.set(entry.date, { ...entry });
    },
    async removeEntry(date) {
      guard();
      entries.delete(date);
    },
    async fetchMonthOverride() {
      guard();
      return monthOverride;
    },
    async saveMonthOverride(month) {
      guard();
      monthOverride = month;
    },
    async clear() {
      guard();
      entries.clear();
      monthOverride = null;
    },
  };

  return {
    store,
    calls,
    rows: entries,
    get override() {
      return monthOverride;
    },
    goOffline() {
      offline = true;
    },
    goOnline() {
      offline = false;
    },
  };
}

function v1Entry(date: string, where = 'Client call'): DailyEntry {
  // No updatedAt — exactly how v1 wrote entries before sync existed.
  return { date, read: true, input: true, applied: true, appliedWhere: where };
}

/** Seed the local cache the way a v1 install would have left it. */
function seedV1Local(dates: string[]) {
  for (const date of dates) {
    __testing.writeLocal(__testing.keys.ENTRY_PREFIX + date, v1Entry(date));
  }
}

let remote: ReturnType<typeof fakeRemote>;

beforeEach(() => {
  __testing.resetLocal();
  remote = fakeRemote();
  __testing.setRemote(remote.store);
});

afterEach(() => {
  __testing.setRemote(undefined);
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------

describe('one-time migration of v1 data', () => {
  it('pushes existing local history up when the remote is empty', async () => {
    seedV1Local(['2026-08-27', '2026-08-28', '2026-08-29']);

    const result = await migrateLocalToRemote();

    expect(result).toBe('migrated');
    expect(remote.rows.size).toBe(3);
    expect([...remote.rows.keys()].sort()).toEqual([
      '2026-08-27',
      '2026-08-28',
      '2026-08-29',
    ]);
  });

  it('keeps the streak and the notes intact through migration', async () => {
    seedV1Local(['2026-08-27', '2026-08-28', '2026-08-29']);
    const before = currentStreak(
      Object.fromEntries(['2026-08-27', '2026-08-28', '2026-08-29'].map((d) => [d, v1Entry(d)])),
      '2026-08-29',
    );

    await migrateLocalToRemote();
    const after = await loadState();

    expect(before).toBe(3);
    expect(currentStreak(after.entries, '2026-08-29')).toBe(3);
    expect(after.entries['2026-08-28'].appliedWhere).toBe('Client call');
  });

  it('runs only once, even across many loads', async () => {
    seedV1Local(['2026-08-29']);

    await migrateLocalToRemote();
    const upsertsAfterFirst = remote.calls.upsert;

    await migrateLocalToRemote();
    await migrateLocalToRemote();
    await loadState();

    expect(await migrateLocalToRemote()).toBe('skipped');
    expect(remote.calls.upsert).toBe(upsertsAfterFirst);
  });

  it('never clobbers a remote that another device already populated', async () => {
    await remote.store.upsertEntries([
      { ...v1Entry('2026-08-20', 'From the laptop'), updatedAt: '2026-08-20T10:00:00.000Z' },
    ]);
    seedV1Local(['2026-08-29']);

    expect(await migrateLocalToRemote()).toBe('not-needed');
    expect(remote.rows.size).toBe(1);
    expect(remote.rows.get('2026-08-20')?.appliedWhere).toBe('From the laptop');
  });

  it('retries on the next load if the push failed', async () => {
    seedV1Local(['2026-08-29']);
    remote.goOffline();

    await expect(migrateLocalToRemote()).rejects.toThrow();
    expect(__testing.readLocal(__testing.keys.MIGRATED_KEY)).toBeNull();

    remote.goOnline();
    expect(await migrateLocalToRemote()).toBe('migrated');
    expect(remote.rows.size).toBe(1);
  });

  it('carries the month override up too', async () => {
    seedV1Local(['2026-08-29']);
    __testing.writeLocal(__testing.keys.SETTINGS_KEY, { monthOverride: 10 });

    await migrateLocalToRemote();

    expect(remote.override).toBe(10);
  });
});

// ---------------------------------------------------------------------------

describe('cross-device sync', () => {
  it('shows an entry written on device A when device B loads', async () => {
    // Device A writes.
    await saveEntry({
      date: '2026-08-29',
      read: true,
      input: true,
      applied: true,
      appliedWhere: 'Wrote the problem statement before opening Figma.',
    });
    expect(remote.rows.size).toBe(1);

    // Device B: empty local cache, same remote.
    __testing.resetLocal();
    const onDeviceB = await loadState();

    expect(onDeviceB.entries['2026-08-29'].appliedWhere).toBe(
      'Wrote the problem statement before opening Figma.',
    );
    expect(currentStreak(onDeviceB.entries, '2026-08-29')).toBe(1);
  });

  it('syncs the month override across devices', async () => {
    await saveMonthOverride(10);

    __testing.resetLocal();
    const onDeviceB = await loadState();

    expect(onDeviceB.monthOverride).toBe(10);
  });

  it('settles a same-day conflict with last write wins', async () => {
    await remote.store.upsertEntries([
      {
        date: '2026-08-29',
        read: true,
        input: false,
        applied: true,
        appliedWhere: 'Older, from the phone',
        updatedAt: '2026-08-29T08:00:00.000Z',
      },
    ]);

    __testing.writeLocal(__testing.keys.ENTRY_PREFIX + '2026-08-29', {
      date: '2026-08-29',
      read: true,
      input: true,
      applied: true,
      appliedWhere: 'Newer, from the laptop',
      updatedAt: '2026-08-29T19:00:00.000Z',
    });

    const state = await loadState();
    expect(state.entries['2026-08-29'].appliedWhere).toBe('Newer, from the laptop');
  });
});

// ---------------------------------------------------------------------------

describe('offline behaviour', () => {
  it('keeps the edit locally and queues it when the network is down', async () => {
    remote.goOffline();

    await saveEntry({
      date: '2026-08-29',
      read: true,
      input: false,
      applied: true,
      appliedWhere: 'Logged on the train.',
    });

    // The UI still sees it.
    const offlineState = await loadState();
    expect(offlineState.entries['2026-08-29'].appliedWhere).toBe('Logged on the train.');
    expect(remote.rows.size).toBe(0);
    expect(__testing.pending().map((p) => p.key)).toContain('entry:2026-08-29');
  });

  it('pushes queued edits once back online', async () => {
    remote.goOffline();
    await saveEntry({
      date: '2026-08-29',
      read: true,
      input: false,
      applied: true,
      appliedWhere: 'Logged on the train.',
    });

    remote.goOnline();
    await flushPending();

    expect(remote.rows.get('2026-08-29')?.appliedWhere).toBe('Logged on the train.');
    expect(__testing.pending()).toHaveLength(0);
  });

  it('a reload while still offline returns the local cache, not nothing', async () => {
    await saveEntry({
      date: '2026-08-29',
      read: true,
      input: false,
      applied: true,
      appliedWhere: 'Saved while online.',
    });

    remote.goOffline();
    const state = await loadState();

    expect(state.entries['2026-08-29'].appliedWhere).toBe('Saved while online.');
  });
});

// ---------------------------------------------------------------------------

describe('local-only mode (no Supabase configured)', () => {
  it('behaves exactly as v1 did', async () => {
    __testing.setRemote(null);

    await saveEntry({
      date: '2026-08-29',
      read: true,
      input: true,
      applied: true,
      appliedWhere: 'No backend needed.',
    });

    const state = await loadState();
    expect(state.entries['2026-08-29'].appliedWhere).toBe('No backend needed.');
    expect(__testing.pending()).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------

describe('reset', () => {
  it('clears both halves', async () => {
    await saveEntry(v1Entry('2026-08-29'));
    await saveMonthOverride(10);
    expect(remote.rows.size).toBe(1);

    await clearAll();

    expect(remote.rows.size).toBe(0);
    expect(remote.override).toBeNull();
    expect((await loadState()).entries).toEqual({});
  });
});
