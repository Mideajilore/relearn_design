import { TRACKS, trackById } from '../content/guide';
import type { Track } from '../types';
import { fromISODate } from './date';

/**
 * Month rotation, straight from the guide:
 *   Sept → Communication & Defending Decisions
 *   Oct  → Sales, Pitching & Negotiation
 *   Nov  → Design Thinking & Problem Framing
 *   Dec  → Decision-Making & Mental Models
 *   Jan  → Business & Product Sense
 *   Feb  → Networking & Personal Brand
 * Any other month falls back to the manual override, then to track 1.
 */
export const ROTATION: Record<number, string> = {
  9: 'communication',
  10: 'sales',
  11: 'design-thinking',
  12: 'decision-making',
  1: 'business',
  2: 'networking',
};

const DEFAULT_TRACK_ID = TRACKS[0].id;

/** The track a given rotation month maps to. */
export function trackForMonth(month: number): Track | undefined {
  const id = ROTATION[month];
  return id ? trackById(id) : undefined;
}

/**
 * The focus track for a date. A manual override always wins; otherwise the
 * calendar month decides, falling back to track 1 outside Sept–Feb.
 */
export function focusTrack(iso: string, monthOverride?: number | null): Track {
  if (monthOverride != null) {
    const overridden = trackForMonth(monthOverride);
    if (overridden) return overridden;
  }
  const month = fromISODate(iso).getMonth() + 1;
  return trackForMonth(month) ?? trackById(DEFAULT_TRACK_ID)!;
}

/** True when the calendar (not an override) puts this track in focus. */
export function isCalendarFocus(iso: string, track: Track): boolean {
  return ROTATION[fromISODate(iso).getMonth() + 1] === track.id;
}

/** The rotation in reading order: Sept → Feb. */
export const ROTATION_ORDER: number[] = [9, 10, 11, 12, 1, 2];
