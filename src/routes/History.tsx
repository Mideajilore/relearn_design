import { Card, Eyebrow, SectionTitle } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Stat } from '../components/StreakBadge';
import { CheckIcon } from '../components/icons';
import { CADENCE } from '../content/guide';
import { daysInMonthOf, firstWeekdayOffset, formatLong, fromISODate } from '../lib/date';
import { currentStreak, hasActivity, isComplete, longestStreak, totalComplete } from '../lib/streak';
import { useTracker } from '../lib/tracker';
import type { DailyEntry } from '../types';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function History() {
  const { state, loading, today } = useTracker();

  if (loading) {
    return <p className="text-grey-500">Loading your history…</p>;
  }

  const days = Object.values(state.entries)
    .filter(hasActivity)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-8">
      <PageHeader
        title="History"
        lede="Every day you logged, newest first. The point is the streak and the “Applied where” column, not the reading count."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat value={currentStreak(state.entries, today)} label="Current streak" />
        <Stat value={longestStreak(state.entries)} label="Longest streak" />
        <Stat value={totalComplete(state.entries)} label="Complete days" />
      </div>

      <MonthHeatmap entries={state.entries} today={today} />

      {days.length === 0 ? (
        <Card as="section">
          <SectionTitle className="text-lg">Nothing logged yet</SectionTitle>
          <p className="mt-2 max-w-reading leading-relaxed text-grey-500">
            Check off a slot on Today and write where you applied it. Days show up here as soon as
            there’s something on them.
          </p>
        </Card>
      ) : (
        <section>
          <SectionTitle className="text-lg">Logged days</SectionTitle>
          <ul className="mt-4 space-y-4">
            {days.map((entry) => (
              <HistoryRow key={entry.date} entry={entry} isToday={entry.date === today} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function HistoryRow({ entry, isToday }: { entry: DailyEntry; isToday: boolean }) {
  const complete = isComplete(entry);

  return (
    <Card as="li" className={complete ? 'border-success/40' : undefined}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-grey-900">
            {formatLong(entry.date)}
            {isToday ? <span className="text-grey-500"> · today</span> : null}
          </p>
          <p className="mt-1 text-sm text-grey-500">
            {complete ? 'Complete' : 'Logged, not complete'}
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-2">
          {CADENCE.map((slot) => {
            const done = entry[slot.id];
            return (
              <li
                key={slot.id}
                className={`inline-flex items-center gap-2 rounded-control border px-3 py-1 text-sm ${
                  done
                    ? 'border-success/30 bg-success/10 text-success'
                    : 'border-grey-200 bg-white text-grey-300'
                }`}
              >
                {done ? <CheckIcon className="h-4 w-4" /> : null}
                {slot.slot}
              </li>
            );
          })}
        </ul>
      </div>

      {entry.appliedWhere.trim() ? (
        <div className="mt-4 rounded-control border border-grey-200 bg-grey-50 p-4">
          <Eyebrow>Applied where</Eyebrow>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed text-grey-700">
            {entry.appliedWhere}
          </p>
        </div>
      ) : null}
    </Card>
  );
}

/** Calendar heatmap for the month containing today. */
function MonthHeatmap({
  entries,
  today,
}: {
  entries: Record<string, DailyEntry>;
  today: string;
}) {
  const days = daysInMonthOf(today);
  const offset = firstWeekdayOffset(today);
  const monthName = fromISODate(today).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card as="section">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle className="text-lg">{monthName}</SectionTitle>
        <span className="flex items-center gap-2 text-sm text-grey-500">
          <span className="inline-block h-3 w-3 rounded-control border border-grey-200 bg-white" />
          none
          <span className="ml-2 inline-block h-3 w-3 rounded-control border border-grey-300 bg-grey-200" />
          partial
          <span className="ml-2 inline-block h-3 w-3 rounded-control bg-success" />
          complete
        </span>
      </div>

      {/* w-fit keeps the cells square and compact instead of stretching them
          across the card. */}
      <div className="mt-4 grid w-fit grid-cols-7 gap-2">
        {WEEKDAYS.map((day, i) => (
          <div
            key={`${day}-${i}`}
            className="flex h-6 w-8 items-center justify-center text-xs text-grey-500 sm:w-12"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: offset }, (_, i) => (
          <div key={`pad-${i}`} aria-hidden="true" />
        ))}

        {days.map((iso) => {
          const entry = entries[iso];
          const complete = isComplete(entry);
          const partial = !complete && entry !== undefined && hasActivity(entry);
          const future = iso > today;

          const tone = complete
            ? 'bg-success text-white border-success'
            : partial
              ? 'bg-grey-200 text-grey-700 border-grey-300'
              : 'bg-white text-grey-300 border-grey-200';

          return (
            <div
              key={iso}
              title={`${iso} — ${complete ? 'complete' : partial ? 'partial' : 'nothing logged'}`}
              className={`flex h-8 w-8 items-center justify-center rounded-control border text-xs sm:h-12 sm:w-12 sm:text-sm ${tone} ${
                future ? 'opacity-50' : ''
              } ${iso === today ? 'ring-2 ring-grey-300' : ''}`}
            >
              {Number(iso.slice(8))}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
