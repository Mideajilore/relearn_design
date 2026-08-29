import { RESOURCE_GROUPS } from '../content/guide';
import type { Track } from '../types';
import { Badge } from './Badge';
import { Card, Eyebrow } from './Card';
import { ResourceLink } from './ResourceLink';
import { RESOURCE_KIND_ICONS, SparkIcon } from './icons';

interface TrackSectionProps {
  track: Track;
  index: number;
  /** Marks the track that is this month's focus. */
  isFocus?: boolean;
  monthName: string;
}

export function TrackSection({ track, index, isFocus = false, monthName }: TrackSectionProps) {
  const groups = RESOURCE_GROUPS.map((group) => ({
    ...group,
    items: track.resources.filter((resource) => resource.kind === group.kind),
  })).filter((group) => group.items.length > 0);

  return (
    <section id={track.id} className="scroll-mt-12">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Eyebrow>
              Track {index + 1} · {monthName}
            </Eyebrow>
            <h2 className="mt-2 text-xl font-semibold leading-snug text-grey-900">{track.title}</h2>
            <p className="mt-2 max-w-reading leading-relaxed text-grey-500">{track.premise}</p>
          </div>

          {isFocus ? <Badge tone="success">This month’s focus</Badge> : null}
        </div>

        <div className="mt-6 space-y-6">
          {groups.map((group) => (
            <div key={group.kind}>
              <Eyebrow icon={RESOURCE_KIND_ICONS[group.kind]}>{group.label}</Eyebrow>
              <ul className="mt-3 space-y-2">
                {group.items.map((resource) => (
                  <ResourceLink key={`${resource.title}-${resource.url}`} resource={resource} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-control border border-grey-200 bg-grey-50 p-4">
          <Eyebrow icon={SparkIcon}>Do</Eyebrow>
          <p className="mt-2 max-w-reading leading-relaxed text-grey-700">{track.action}</p>
        </div>
      </Card>
    </section>
  );
}
