import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Card, Eyebrow, SectionTitle } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { PersonLink, ResourceLink } from '../components/ResourceLink';
import { TrackSection } from '../components/TrackSection';
import {
  CadenceIcon,
  CalendarIcon,
  ClockIcon,
  PeopleIcon,
  RepeatIcon,
  SlidesIcon,
  SparkIcon,
} from '../components/icons';
import {
  BONUS,
  CADENCE,
  FOLLOW_LIST,
  FOLLOW_LIST_CAVEAT,
  GUIDE_CLOSER,
  GUIDE_PREMISE,
  TRACKS,
  WEEKLY_REP,
} from '../content/guide';
import { monthLabel } from '../lib/date';
import { focusTrack, ROTATION_ORDER, trackForMonth } from '../lib/rotation';
import { useTracker } from '../lib/tracker';

export function Guide() {
  const { state, today } = useTracker();
  const focus = focusTrack(today, state.monthOverride);
  const { hash } = useLocation();

  // Deep links from Today (/guide#communication) should land on the track.
  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  return (
    <div className="space-y-8">
      <PageHeader title="The Operator's Guide" lede={GUIDE_PREMISE} />

      {/* -------------------------------------------------------- rotation -- */}
      <Card as="section">
        <SectionTitle icon={CalendarIcon} className="text-lg">The rotation</SectionTitle>
        <p className="mt-2 max-w-reading text-sm leading-relaxed text-grey-500">
          One track per month as your focus; the daily cadence runs across all of them.
        </p>

        <ol className="mt-4 space-y-2">
          {ROTATION_ORDER.map((month) => {
            const track = trackForMonth(month);
            if (!track) return null;
            const isFocus = track.id === focus.id;
            return (
              <li key={month}>
                <a
                  href={`#${track.id}`}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-control border p-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-grey-200 ${
                    isFocus
                      ? 'border-success/30 bg-success/10'
                      : 'border-grey-200 bg-white hover:bg-grey-50'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="text-sm text-grey-500">{monthLabel(month)}</span>
                    <span className="mt-1 block text-grey-900">{track.title}</span>
                  </span>
                  {isFocus ? <Badge tone="success">Focus</Badge> : null}
                </a>
              </li>
            );
          })}
        </ol>
      </Card>

      {/* ---------------------------------------------------------- tracks -- */}
      <div className="space-y-4">
        {TRACKS.map((track, index) => (
          <TrackSection
            key={track.id}
            track={track}
            index={index}
            isFocus={track.id === focus.id}
            monthName={monthLabel(track.month)}
          />
        ))}
      </div>

      {/* ----------------------------------------------------------- bonus -- */}
      <Card as="section">
        <SectionTitle icon={SlidesIcon} className="text-lg">
          {BONUS.title}
        </SectionTitle>
        <ul className="mt-4 space-y-2">
          {BONUS.resources.map((resource) => (
            <ResourceLink key={`${resource.title}-${resource.url}`} resource={resource} />
          ))}
        </ul>
      </Card>

      {/* --------------------------------------------------------- cadence -- */}
      <Card as="section">
        <SectionTitle icon={ClockIcon} className="text-lg">The daily cadence</SectionTitle>
        <p className="mt-2 max-w-reading text-sm leading-relaxed text-grey-500">
          ~30–45 min. Small and consistent beats heroic and abandoned.
        </p>

        <ul className="mt-4 space-y-2">
          {CADENCE.map((slot) => (
            <li
              key={slot.id}
              className="rounded-control border border-grey-200 bg-white p-3"
            >
              <span className="flex flex-wrap items-center gap-2">
                <CadenceIcon id={slot.icon} className="h-4 w-4 shrink-0 text-grey-500" />
                <span className="text-grey-900">{slot.slot}</span>
                <span className="text-sm text-grey-500">{slot.time}</span>
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-grey-500">{slot.what}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-control border border-grey-200 bg-grey-50 p-4">
          <Eyebrow icon={RepeatIcon}>Weekly</Eyebrow>
          <p className="mt-2 max-w-reading leading-relaxed text-grey-700">{WEEKLY_REP}</p>
        </div>
      </Card>

      {/* ----------------------------------------------------- follow list -- */}
      <Card as="section">
        <SectionTitle icon={PeopleIcon} className="text-lg">
          The consolidated follow list
        </SectionTitle>
        <p className="mt-2 max-w-reading text-sm leading-relaxed text-grey-500">
          {FOLLOW_LIST_CAVEAT}
        </p>

        <div className="mt-4 space-y-6">
          {FOLLOW_LIST.map((group) => (
            <div key={group.group}>
              <Eyebrow>{group.group}</Eyebrow>
              <ul className="mt-2 divide-y divide-grey-200">
                {group.people.map((person) => (
                  <PersonLink
                    key={person.name}
                    name={person.name}
                    note={person.note}
                    url={person.url}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Card as="section" padding="sm">
        <Eyebrow icon={SparkIcon}>The whole guide in one line</Eyebrow>
        <p className="mt-2 max-w-reading leading-relaxed text-grey-700">{GUIDE_CLOSER}</p>
      </Card>
    </div>
  );
}
