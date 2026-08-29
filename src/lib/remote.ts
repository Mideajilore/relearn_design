import type { SupabaseClient } from '@supabase/supabase-js';
import type { DailyEntry } from '../types';

/**
 * The remote half of the data layer.
 *
 * `RemoteStore` is an interface rather than a direct Supabase call so the sync
 * rules in `storage.ts` can be tested against an in-memory double — and so a
 * different backend later is one implementation, not a rewrite.
 */

export interface RemoteStore {
  fetchEntries(): Promise<DailyEntry[]>;
  upsertEntries(entries: DailyEntry[]): Promise<void>;
  removeEntry(date: string): Promise<void>;
  fetchMonthOverride(): Promise<number | null>;
  saveMonthOverride(month: number | null): Promise<void>;
  /** Delete every row belonging to this owner key. */
  clear(): Promise<void>;
}

interface EntryRow {
  date: string;
  owner_key: string;
  read: boolean;
  input: boolean;
  applied: boolean;
  applied_where: string;
  updated_at: string;
}

function toEntry(row: EntryRow): DailyEntry {
  return {
    date: row.date,
    read: Boolean(row.read),
    input: Boolean(row.input),
    applied: Boolean(row.applied),
    appliedWhere: row.applied_where ?? '',
    updatedAt: row.updated_at,
  };
}

function toRow(entry: DailyEntry, ownerKey: string): EntryRow {
  return {
    date: entry.date,
    owner_key: ownerKey,
    read: entry.read,
    input: entry.input,
    applied: entry.applied,
    applied_where: entry.appliedWhere,
    updated_at: entry.updatedAt ?? new Date().toISOString(),
  };
}

/** Supabase-backed implementation. Every query is scoped to `ownerKey`. */
export function createSupabaseRemote(client: SupabaseClient, ownerKey: string): RemoteStore {
  return {
    async fetchEntries() {
      const { data, error } = await client
        .from('daily_entries')
        .select('date, owner_key, read, input, applied, applied_where, updated_at')
        .eq('owner_key', ownerKey);
      if (error) throw new Error(error.message);
      return (data as EntryRow[]).map(toEntry);
    },

    async upsertEntries(entries) {
      if (entries.length === 0) return;
      const { error } = await client
        .from('daily_entries')
        .upsert(
          entries.map((entry) => toRow(entry, ownerKey)),
          { onConflict: 'date,owner_key' },
        );
      if (error) throw new Error(error.message);
    },

    async removeEntry(date) {
      const { error } = await client
        .from('daily_entries')
        .delete()
        .eq('owner_key', ownerKey)
        .eq('date', date);
      if (error) throw new Error(error.message);
    },

    async fetchMonthOverride() {
      const { data, error } = await client
        .from('settings')
        .select('month_override')
        .eq('owner_key', ownerKey)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return (data?.month_override as number | null | undefined) ?? null;
    },

    async saveMonthOverride(month) {
      const { error } = await client
        .from('settings')
        .upsert({ owner_key: ownerKey, month_override: month }, { onConflict: 'owner_key' });
      if (error) throw new Error(error.message);
    },

    async clear() {
      const entries = await client.from('daily_entries').delete().eq('owner_key', ownerKey);
      if (entries.error) throw new Error(entries.error.message);
      const settings = await client.from('settings').delete().eq('owner_key', ownerKey);
      if (settings.error) throw new Error(settings.error.message);
    },
  };
}
