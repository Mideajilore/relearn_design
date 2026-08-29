import type { Resource } from '../types';
import { ExternalIcon, RESOURCE_KIND_ICONS } from './icons';

/**
 * One outbound resource. Always opens in a new tab, always shows its full
 * title and note — nothing here truncates.
 *
 * The leading glyph is the resource's kind (book / watch / read / follow), so a
 * long track reads as groups at a glance instead of a wall of links. It's
 * decoration only: the kind is already stated by the group heading above.
 */
export function ResourceLink({ resource }: { resource: Resource }) {
  const KindIcon = RESOURCE_KIND_ICONS[resource.kind];

  return (
    <li>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-control border border-grey-200 bg-white p-3 transition-colors hover:border-grey-300 hover:bg-grey-50 focus:outline-none focus-visible:border-grey-500 focus-visible:ring-2 focus-visible:ring-grey-200"
      >
        <span className="flex items-start gap-3">
          {KindIcon ? (
            <span
              aria-hidden="true"
              className="mt-px flex h-8 w-8 shrink-0 items-center justify-center rounded-control border border-grey-200 bg-grey-50 text-grey-500 transition-colors group-hover:border-grey-300 group-hover:text-grey-700"
            >
              <KindIcon className="h-4 w-4" />
            </span>
          ) : null}

          <span className="min-w-0 flex-1">
            <span className="block text-grey-900">
              {resource.title}
              {resource.by ? <span className="text-grey-500"> — {resource.by}</span> : null}
            </span>
            {resource.note ? (
              <span className="mt-1 block text-sm leading-relaxed text-grey-500">
                {resource.note}
              </span>
            ) : null}
          </span>

          <ExternalIcon className="mt-2 h-4 w-4 shrink-0 text-grey-300 transition-colors group-hover:text-grey-500" />
        </span>
      </a>
    </li>
  );
}

/**
 * A plain person row for the consolidated follow list.
 *
 * Deliberately has no leading glyph: every row here is a person, so one would
 * repeat on all of them and tell the reader nothing. The section heading
 * carries that. The kind glyph only earns its place where kinds are mixed.
 */
export function PersonLink({ name, note, url }: { name: string; note?: string; url: string }) {
  return (
    <li>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-3 rounded-control px-3 py-2 transition-colors hover:bg-grey-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-grey-200"
      >
        <span className="min-w-0 flex-1">
          <span className="text-grey-900">{name}</span>
          {note ? <span className="text-grey-500"> — {note}</span> : null}
        </span>

        <ExternalIcon className="mt-1 h-4 w-4 shrink-0 text-grey-300 transition-colors group-hover:text-grey-500" />
      </a>
    </li>
  );
}
