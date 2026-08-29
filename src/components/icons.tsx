/** Small inline icons. Inline SVG keeps the dependency list at zero. */

export function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 10.5 8 14.5 16 6" />
    </svg>
  );
}

export function ExternalIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6.5 3.5H3.5v9h9v-3" />
      <path d="M9.5 3.5h3v3" />
      <path d="M12.5 3.5 7.5 8.5" />
    </svg>
  );
}

export function FlameIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 2.5c2.5 3 4.5 4.75 4.5 8a4.5 4.5 0 0 1-9 0c0-1.5.6-2.6 1.5-3.6.3 1.2.9 1.9 1.6 2.1-.2-2.6.6-4.6 1.4-6.5Z" />
    </svg>
  );
}
