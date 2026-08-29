import type { DailyEntry } from '../types';
import { shiftISODate } from './date';

/**
 * Completion and streak logic. Pure functions, no storage, no React — so the
 * rules are testable in isolation (see `streak.test.ts`).
 */

/**
 * A day counts as complete when you applied something AND said where.
 * Reading alone doesn't count — that's the whole point of the guide.
 */
export function isComplete(entry?: DailyEntry | null): boolean {
  return Boolean(entry?.applied && entry.appliedWhere.trim().length > 0);
}

/**
 * Consecutive complete days ending at `today`.
 *
 * Today gets a grace period: if it isn't complete yet, the count runs back from
 * yesterday, so an unfinished morning doesn't read as a broken streak. A day
 * that is genuinely missed still resets it to 0.
 */
export function currentStreak(
  entries: Record<string, DailyEntry>,
  today: string,
): number {
  let cursor = isComplete(entries[today]) ? today : shiftISODate(today, -1);
  let count = 0;

  while (isComplete(entries[cursor])) {
    count += 1;
    cursor = shiftISODate(cursor, -1);
  }

  return count;
}

/** The longest run of complete days ever recorded. */
export function longestStreak(entries: Record<string, DailyEntry>): number {
  const completeDays = Object.keys(entries).filter((date) => isComplete(entries[date])).sort();

  let best = 0;
  let run = 0;
  let previous: string | null = null;

  for (const date of completeDays) {
    run = previous !== null && shiftISODate(previous, 1) === date ? run + 1 : 1;
    best = Math.max(best, run);
    previous = date;
  }

  return best;
}

/** Total days marked complete. */
export function totalComplete(entries: Record<string, DailyEntry>): number {
  return Object.values(entries).filter((entry) => isComplete(entry)).length;
}

/** True when a day has any activity at all — worth showing in history. */
export function hasActivity(entry: DailyEntry): boolean {
  return entry.read || entry.input || entry.applied || entry.appliedWhere.trim().length > 0;
}

export function emptyEntry(date: string): DailyEntry {
  return { date, read: false, input: false, applied: false, appliedWhere: '' };
}
