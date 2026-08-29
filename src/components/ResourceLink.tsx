import type { Resource } from '../types';
import { ExternalIcon } from './icons';

/**
 * One outbound resource. Always opens in a new tab, always shows its full
 * title and note — nothing here truncates.
 */
export function ResourceLink({ resource }: { resource: Resource }) {
  return (
    <li>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-control border border-grey-200 bg-white p-3 transition-colors hover:border-grey-300 hover:bg-grey-50 focus:outline-none focus-visible:border-grey-500 focus-visible:ring-2 focus-visible:ring-grey-200"
      >
        <span className="flex items-start gap-2">
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
          <ExternalIcon className="mt-1 h-4 w-4 shrink-0 text-grey-300 transition-colors group-hover:text-grey-500" />
        </span>
      </a>
    </li>
  );
}

/** A plain person row for the consolidated follow list. */
export function PersonLink({ name, note, url }: { name: string; note?: string; url: string }) {
  return (
    <li>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-2 rounded-control px-3 py-2 transition-colors hover:bg-grey-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-grey-200"
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
