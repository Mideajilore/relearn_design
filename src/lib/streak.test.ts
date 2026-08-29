import { describe, expect, it } from 'vitest';
import type { DailyEntry } from '../types';
import { currentStreak, isComplete, longestStreak, totalComplete } from './streak';

function entry(date: string, over: Partial<DailyEntry> = {}): DailyEntry {
  return { date, read: false, input: false, applied: false, appliedWhere: '', ...over };
}

function complete(date: string): DailyEntry {
  return entry(date, { read: true, input: true, applied: true, appliedWhere: 'Client call' });
}

function index(...list: DailyEntry[]): Record<string, DailyEntry> {
  return Object.fromEntries(list.map((e) => [e.date, e]));
}

describe('isComplete', () => {
  it('needs applied AND a non-empty note', () => {
    expect(isComplete(complete('2026-09-01'))).toBe(true);
    expect(isComplete(entry('2026-09-01', { applied: true, appliedWhere: '' }))).toBe(false);
    expect(isComplete(entry('2026-09-01', { applied: true, appliedWhere: '   ' }))).toBe(false);
    expect(isComplete(entry('2026-09-01', { applied: false, appliedWhere: 'Somewhere' }))).toBe(
      false,
    );
  });

  it('does not count reading alone', () => {
    expect(isComplete(entry('2026-09-01', { read: true, input: true }))).toBe(false);
  });

  it('handles missing days', () => {
    expect(isComplete(undefined)).toBe(false);
    expect(isComplete(null)).toBe(false);
  });
});

describe('currentStreak', () => {
  it('counts two complete days in a row as 2', () => {
    const entries = index(complete('2026-09-01'), complete('2026-09-02'));
    expect(currentStreak(entries, '2026-09-02')).toBe(2);
  });

  it('resets after a gap', () => {
    const entries = index(complete('2026-09-01'), complete('2026-09-02'), complete('2026-09-05'));
    expect(currentStreak(entries, '2026-09-05')).toBe(1);
  });

  it('is 0 when nothing has been logged', () => {
    expect(currentStreak({}, '2026-09-05')).toBe(0);
  });

  it('keeps yesterday alive while today is still unfinished', () => {
    const entries = index(complete('2026-09-01'), complete('2026-09-02'));
    expect(currentStreak(entries, '2026-09-03')).toBe(2);
  });

  it('drops to 0 once a full day is missed', () => {
    const entries = index(complete('2026-09-01'), complete('2026-09-02'));
    expect(currentStreak(entries, '2026-09-04')).toBe(0);
  });

  it('ignores incomplete days in the run', () => {
    const entries = index(
      complete('2026-09-01'),
      entry('2026-09-02', { read: true }),
      complete('2026-09-03'),
    );
    expect(currentStreak(entries, '2026-09-03')).toBe(1);
  });

  it('crosses month boundaries', () => {
    const entries = index(complete('2026-09-30'), complete('2026-10-01'));
    expect(currentStreak(entries, '2026-10-01')).toBe(2);
  });
});

describe('longestStreak', () => {
  it('finds the best run, not the current one', () => {
    const entries = index(
      complete('2026-09-01'),
      complete('2026-09-02'),
      complete('2026-09-03'),
      complete('2026-09-10'),
    );
    expect(longestStreak(entries)).toBe(3);
  });

  it('is 0 with no complete days', () => {
    expect(longestStreak(index(entry('2026-09-01', { read: true })))).toBe(0);
  });
});

describe('totalComplete', () => {
  it('counts only complete days', () => {
    const entries = index(complete('2026-09-01'), entry('2026-09-02', { read: true }));
    expect(totalComplete(entries)).toBe(1);
  });
});
