/**
 * Dates are handled in the user's local timezone throughout. `toISODate` must
 * never go via `Date.prototype.toISOString()` — that shifts to UTC and can put
 * an evening entry on the wrong day.
 */

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function todayISO(now: Date = new Date()): string {
  return toISODate(now);
}

/** Shift an ISO date by whole days, staying in local time. */
export function shiftISODate(iso: string, days: number): string {
  const date = fromISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function formatLong(iso: string): string {
  return fromISODate(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShort(iso: string): string {
  return fromISODate(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function monthLabel(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleDateString(undefined, { month: 'long' });
}

/** Every ISO date in the calendar month containing `iso`. */
export function daysInMonthOf(iso: string): string[] {
  const date = fromISODate(iso);
  const year = date.getFullYear();
  const month = date.getMonth();
  const count = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: count }, (_, i) => toISODate(new Date(year, month, i + 1)));
}

/** Weekday index (0 = Monday) of the first day of the month containing `iso`. */
export function firstWeekdayOffset(iso: string): number {
  const date = fromISODate(iso);
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  return (first.getDay() + 6) % 7;
}
