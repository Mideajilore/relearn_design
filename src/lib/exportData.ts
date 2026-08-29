import type { AppState } from '../types';
import { todayISO } from './date';

/** Everything the tracker knows, as a portable JSON file. */
export function downloadStateAsJson(state: AppState): void {
  const payload = {
    app: 'operators-guide',
    version: 1,
    exportedAt: new Date().toISOString(),
    monthOverride: state.monthOverride ?? null,
    entries: Object.values(state.entries).sort((a, b) => a.date.localeCompare(b.date)),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = `operators-guide-${todayISO()}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
