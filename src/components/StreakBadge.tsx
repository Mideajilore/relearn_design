import { FlameIcon } from './icons';
import type { IconComponent } from './icons';

interface StreakBadgeProps {
  streak: number;
  /** Whether today itself is already logged as complete. */
  todayComplete: boolean;
}

export function StreakBadge({ streak, todayComplete }: StreakBadgeProps) {
  const live = streak > 0;

  return (
    <div className="flex items-center gap-3 rounded-card border border-grey-200 bg-white p-4">
      <span
        aria-hidden="true"
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-card ${
          live ? 'bg-success/10 text-success' : 'bg-grey-50 text-grey-300'
        }`}
      >
        <FlameIcon className="h-6 w-6" />
      </span>

      <div className="min-w-0">
        <p className={`text-2xl ${live ? 'text-success' : 'text-grey-500'}`}>
          {streak} {streak === 1 ? 'day' : 'days'}
        </p>
        <p className="text-sm text-grey-500">
          {live
            ? todayComplete
              ? 'Current streak — today is logged.'
              : 'Current streak — log today to keep it.'
            : 'No streak yet. Apply something and say where.'}
        </p>
      </div>
    </div>
  );
}

/** Compact stat used alongside the streak on History. */
export function Stat({
  value,
  label,
  icon: Glyph,
}: {
  value: string | number;
  label: string;
  icon?: IconComponent;
}) {
  return (
    <div className="rounded-card border border-grey-200 bg-white p-4">
      <p className="text-2xl text-grey-900">{value}</p>
      <p className="mt-1 flex items-center gap-2 text-sm text-grey-500">
        {Glyph ? <Glyph className="h-4 w-4 shrink-0" /> : null}
        <span className="min-w-0">{label}</span>
      </p>
    </div>
  );
}
