import { CheckIcon } from './icons';

interface CheckItemProps {
  label: string;
  time?: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}

/**
 * One checkable daily action. The whole row is the hit target — it needs to be
 * comfortable to tap on a phone.
 */
export function CheckItem({ label, time, description, checked, onChange }: CheckItemProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 rounded-control border border-grey-200 bg-white p-3 text-left transition-colors hover:border-grey-300 hover:bg-grey-50 focus:outline-none focus-visible:border-grey-500 focus-visible:ring-2 focus-visible:ring-grey-200"
    >
      <span
        aria-hidden="true"
        className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-control border transition-colors ${
          checked ? 'border-success bg-success text-white' : 'border-grey-300 bg-white'
        }`}
      >
        {checked ? <CheckIcon className="h-4 w-4" /> : null}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-2">
          <span className={checked ? 'text-grey-900' : 'text-grey-900'}>{label}</span>
          {time ? <span className="text-sm text-grey-500">{time}</span> : null}
        </span>
        {description ? (
          <span className="mt-1 block text-sm leading-relaxed text-grey-500">{description}</span>
        ) : null}
      </span>
    </button>
  );
}
