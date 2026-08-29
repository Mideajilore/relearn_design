import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card, Eyebrow, SectionTitle } from '../components/Card';
import { CheckItem } from '../components/CheckItem';
import { PageHeader } from '../components/PageHeader';
import { StreakBadge } from '../components/StreakBadge';
import { CADENCE, WEEKLY_REP } from '../content/guide';
import { formatLong, monthLabel } from '../lib/date';
import { downloadStateAsJson } from '../lib/exportData';
import { focusTrack, ROTATION_ORDER, trackForMonth } from '../lib/rotation';
import { currentStreak, isComplete } from '../lib/streak';
import { useTracker } from '../lib/tracker';

export function Today() {
  const {
    state,
    loading,
    today,
    todayEntry,
    persistent,
    updateToday,
    setAction,
    setMonthOverride,
    resetAll,
  } = useTracker();

  const track = focusTrack(today, state.monthOverride);
  const streak = currentStreak(state.entries, today);
  const complete = isComplete(todayEntry);

  // Local mirror so typing stays responsive; committed on change and on blur.
  const [note, setNote] = useState(todayEntry.appliedWhere);
  useEffect(() => setNote(todayEntry.appliedWhere), [todayEntry.appliedWhere, today]);

  const [confirmingReset, setConfirmingReset] = useState(false);

  if (loading) {
    return <p className="text-grey-500">Loading your tracker…</p>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Today"
        lede={<span className="text-grey-700">{formatLong(today)}</span>}
      />

      {!persistent ? (
        <Card padding="sm">
          <p className="text-sm text-grey-500">
            Browser storage is unavailable here, so today’s entries won’t survive a reload.
          </p>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <StreakBadge streak={streak} todayComplete={complete} />

        <Card>
          <Eyebrow>This month’s focus</Eyebrow>
          <SectionTitle className="mt-2 text-lg">{track.title}</SectionTitle>
          <p className="mt-2 text-sm leading-relaxed text-grey-500">{track.premise}</p>
          <Link
            to={`/guide#${track.id}`}
            className="mt-3 inline-block rounded-control text-grey-700 underline decoration-grey-300 underline-offset-4 transition-colors hover:text-grey-900 hover:decoration-grey-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-grey-200"
          >
            Open this track in the guide
          </Link>
        </Card>
      </div>

      {/* ---------------------------------------------------- daily cadence -- */}
      <Card as="section">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionTitle className="text-lg">The daily cadence</SectionTitle>
          {complete ? <Badge tone="success">Day complete</Badge> : <Badge tone="quiet">In progress</Badge>}
        </div>
        <p className="mt-2 max-w-reading text-sm leading-relaxed text-grey-500">
          Roughly 30–45 minutes. Small and consistent beats heroic and abandoned.
        </p>

        <div className="mt-4 space-y-2">
          {CADENCE.map((slot) => (
            <CheckItem
              key={slot.id}
              label={slot.slot}
              time={slot.time}
              description={slot.what}
              checked={todayEntry[slot.id]}
              onChange={(next) => setAction(slot.id, next)}
            />
          ))}
        </div>
      </Card>

      {/* ------------------------------------------------------ applied where -- */}
      <Card as="section" className={complete ? 'border-success/40' : undefined}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionTitle className="text-lg">
            <label htmlFor="applied-where">Applied where</label>
          </SectionTitle>
          {complete ? <Badge tone="success">Counts</Badge> : null}
        </div>

        <p className="mt-2 max-w-reading text-sm leading-relaxed text-grey-500">
          The real project or conversation you used it in. A day only counts when{' '}
          <span className="text-grey-700">Apply</span> is checked and this isn’t empty — reading
          alone doesn’t count.
        </p>

        <textarea
          id="applied-where"
          value={note}
          rows={3}
          placeholder="e.g. Reframed the brief on the Acme onboarding call before showing any screens."
          onChange={(event) => {
            setNote(event.target.value);
            updateToday({ appliedWhere: event.target.value });
          }}
          onBlur={(event) => updateToday({ appliedWhere: event.target.value })}
          className="mt-4 block w-full resize-y rounded-control border border-grey-300 bg-white p-3 leading-relaxed text-grey-700 placeholder:text-grey-300 focus:border-grey-500 focus:outline-none focus:ring-2 focus:ring-grey-200"
        />
      </Card>

      {/* ------------------------------------------------------ weekly rep -- */}
      <Card as="section" padding="sm">
        <Eyebrow>Weekly</Eyebrow>
        <p className="mt-2 max-w-reading leading-relaxed text-grey-700">{WEEKLY_REP}</p>
      </Card>

      {/* --------------------------------------------------------- settings -- */}
      <Card as="section">
        <SectionTitle className="text-lg">Focus track</SectionTitle>
        <p className="mt-2 max-w-reading text-sm leading-relaxed text-grey-500">
          The rotation follows the calendar. Override it if you want to run a different track.
        </p>

        <label htmlFor="month-override" className="mt-4 block text-sm text-grey-500">
          Override
        </label>
        <select
          id="month-override"
          value={state.monthOverride ?? 'auto'}
          onChange={(event) =>
            setMonthOverride(event.target.value === 'auto' ? null : Number(event.target.value))
          }
          className="mt-2 block w-full rounded-control border border-grey-300 bg-white p-3 text-grey-700 focus:border-grey-500 focus:outline-none focus:ring-2 focus:ring-grey-200 sm:max-w-reading"
        >
          <option value="auto">Follow the calendar (auto)</option>
          {ROTATION_ORDER.map((month) => {
            const rotationTrack = trackForMonth(month);
            if (!rotationTrack) return null;
            return (
              <option key={month} value={month}>
                {monthLabel(month)} — {rotationTrack.title}
              </option>
            );
          })}
        </select>
      </Card>

      {/* ------------------------------------------------------------- data -- */}
      <Card as="section">
        <SectionTitle className="text-lg">Your data</SectionTitle>
        <p className="mt-2 max-w-reading text-sm leading-relaxed text-grey-500">
          Everything lives in this browser. Export it before you clear site data or switch machines.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={() => downloadStateAsJson(state)}>
            Export JSON
          </Button>

          {confirmingReset ? (
            <>
              <Button
                variant="primary"
                onClick={async () => {
                  await resetAll();
                  setNote('');
                  setConfirmingReset(false);
                }}
              >
                Yes, delete everything
              </Button>
              <Button variant="quiet" onClick={() => setConfirmingReset(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="quiet" onClick={() => setConfirmingReset(true)}>
              Reset all data
            </Button>
          )}
        </div>

        {confirmingReset ? (
          <p className="mt-3 text-sm text-grey-500">
            This permanently deletes every logged day and your override. It can’t be undone.
          </p>
        ) : null}
      </Card>
    </div>
  );
}
