/**
 * Small inline icons. Inline SVG keeps the dependency list at zero.
 *
 * House rules, so a new icon never looks bolted on:
 *   - 20×20 viewBox, artwork inside a 2.5–17.5 box.
 *   - `currentColor` stroke, 1.5 width, round caps and joins. No fills.
 *   - `aria-hidden` — icons are decoration, the text beside them carries the
 *     meaning. Nothing in this app is icon-only.
 *   - Sized by the caller on the 4px scale: h-4 (16), h-5 (20), h-6 (24).
 */

export interface IconProps {
  className?: string;
}

/** Every icon shares this frame; only the paths differ. */
function Icon({
  className = '',
  strokeWidth = 1.5,
  children,
}: IconProps & { strokeWidth?: number; children: React.ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ state -- */

export function CheckIcon({ className }: IconProps) {
  // Heavier stroke: this one sits reversed out of a filled success square.
  return (
    <Icon className={className} strokeWidth={2.25}>
      <path d="M4 10.5 8 14.5 16 6" />
    </Icon>
  );
}

export function CircleCheckIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="m6.75 10.25 2.25 2.25 4.25-4.75" />
    </Icon>
  );
}

export function FlameIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M10 2.5c2.5 3 4.5 4.75 4.5 8a4.5 4.5 0 0 1-9 0c0-1.5.6-2.6 1.5-3.6.3 1.2.9 1.9 1.6 2.1-.2-2.6.6-4.6 1.4-6.5Z" />
    </Icon>
  );
}

export function TrophyIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M6 3.5h8v4.25a4 4 0 0 1-8 0V3.5Z" />
      <path d="M6 4.75H4a2 2 0 0 0 2 2.25" />
      <path d="M14 4.75h2a2 2 0 0 1-2 2.25" />
      <path d="M10 11.75v2.75" />
      <path d="M6.75 17h6.5" />
    </Icon>
  );
}

export function AlertIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 6.25v4.5" />
      <path d="M10 13.5h.01" />
    </Icon>
  );
}

/* -------------------------------------------------------------- resources -- */

export function BookIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M3.5 16a2 2 0 0 1 2-2h11" />
      <path d="M5.5 2h11v16h-11a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
    </Icon>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M8.25 7.25 13 10l-4.75 2.75V7.25Z" />
    </Icon>
  );
}

export function ArticleIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M11.5 2.5H6A1.5 1.5 0 0 0 4.5 4v12A1.5 1.5 0 0 0 6 17.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5l-4-4Z" />
      <path d="M11.5 2.5v4h4" />
      <path d="M7.5 10.5h5" />
      <path d="M7.5 13.5h5" />
    </Icon>
  );
}

export function PersonIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="10" cy="7" r="3" />
      <path d="M4.5 16.5a5.5 5.5 0 0 1 11 0" />
    </Icon>
  );
}

export function PeopleIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="8" cy="7.5" r="2.75" />
      <path d="M3 16.5a5 5 0 0 1 10 0" />
      <path d="M13.25 5.1a2.75 2.75 0 0 1 0 4.8" />
      <path d="M15.25 16.5a5 5 0 0 0-1.5-3.55" />
    </Icon>
  );
}

export function SlidesIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <rect x="3" y="3.5" width="14" height="9.5" rx="1.5" />
      <path d="M10 13v3" />
      <path d="M7 16.5h6" />
    </Icon>
  );
}

/* ------------------------------------------------------------ way-finding -- */

export function SunIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="10" cy="10" r="3.5" />
      <path d="M10 2.5v1.75" />
      <path d="M10 15.75v1.75" />
      <path d="M17.5 10h-1.75" />
      <path d="M4.25 10H2.5" />
      <path d="m15.3 4.7-1.25 1.25" />
      <path d="M5.95 14.05 4.7 15.3" />
      <path d="m15.3 15.3-1.25-1.25" />
      <path d="M5.95 5.95 4.7 4.7" />
    </Icon>
  );
}

export function CompassIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="m12.8 7.2-1.6 4-4 1.6 1.6-4 4-1.6Z" />
    </Icon>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <rect x="3" y="4.5" width="14" height="13" rx="2" />
      <path d="M3 8.5h14" />
      <path d="M7 2.5v4" />
      <path d="M13 2.5v4" />
    </Icon>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 5.75V10l2.75 1.75" />
    </Icon>
  );
}

export function TargetIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <circle cx="10" cy="10" r="7.5" />
      <circle cx="10" cy="10" r="4.25" />
      <circle cx="10" cy="10" r="1.25" />
    </Icon>
  );
}

export function ListIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M7 5.5h9" />
      <path d="M7 10h9" />
      <path d="M7 14.5h9" />
      <path d="M3.75 5.5h.01" />
      <path d="M3.75 10h.01" />
      <path d="M3.75 14.5h.01" />
    </Icon>
  );
}

/* ----------------------------------------------------------------- action -- */

export function ExternalIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M8 4.5H4.5v11h11V12" />
      <path d="M12 4.5h3.5V8" />
      <path d="M15.5 4.5 10 10" />
    </Icon>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M4 10h11" />
      <path d="m11 6 4 4-4 4" />
    </Icon>
  );
}

export function PenIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M13.6 3.4a2 2 0 0 1 2.8 2.8L7.5 15.1l-3.75 1.15L4.9 12.5l8.7-9.1Z" />
      <path d="m12.4 4.7 2.9 2.9" />
    </Icon>
  );
}

export function RepeatIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M4 8.5A3.5 3.5 0 0 1 7.5 5h8" />
      <path d="M13 2.5 15.5 5 13 7.5" />
      <path d="M16 11.5A3.5 3.5 0 0 1 12.5 15h-8" />
      <path d="M7 12.5 4.5 15 7 17.5" />
    </Icon>
  );
}

export function SparkIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M11 2.5 4.5 11.5H9l-.5 6 6.5-9h-4.5l.5-6Z" />
    </Icon>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M10 3v9.5" />
      <path d="m6.25 8.75 3.75 3.75 3.75-3.75" />
      <path d="M3.5 14.5v1.5A1.5 1.5 0 0 0 5 17.5h10a1.5 1.5 0 0 0 1.5-1.5v-1.5" />
    </Icon>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <path d="M3.5 5.5h13" />
      <path d="M7.5 5.5V4A1.5 1.5 0 0 1 9 2.5h2A1.5 1.5 0 0 1 12.5 4v1.5" />
      <path d="m5.5 5.5.7 10.5a1.5 1.5 0 0 0 1.5 1.4h4.6a1.5 1.5 0 0 0 1.5-1.4l.7-10.5" />
      <path d="M8.5 9v5" />
      <path d="M11.5 9v5" />
    </Icon>
  );
}

export function ArchiveIcon({ className }: IconProps) {
  return (
    <Icon className={className}>
      <rect x="3" y="4" width="14" height="4" rx="1.25" />
      <path d="M4.5 8v7.5A1.5 1.5 0 0 0 6 17h8a1.5 1.5 0 0 0 1.5-1.5V8" />
      <path d="M8.25 11h3.5" />
    </Icon>
  );
}

/* ------------------------------------------------------------- resolvers -- */

export type IconComponent = (props: IconProps) => JSX.Element;

/** The icon standing in for each resource kind, used wherever resources list. */
export const RESOURCE_KIND_ICONS: Record<string, IconComponent> = {
  book: BookIcon,
  watch: PlayIcon,
  read: ArticleIcon,
  follow: PersonIcon,
};

/** The icon for each daily cadence slot, keyed by the ids in `content/guide`. */
export const CADENCE_ICONS: Record<string, IconComponent> = {
  book: BookIcon,
  play: PlayIcon,
  spark: SparkIcon,
};

/** Draws a cadence slot's glyph by id, so callers don't resolve it inline. */
export function CadenceIcon({ id, className }: { id: string } & IconProps) {
  const Glyph = CADENCE_ICONS[id];
  return Glyph ? <Glyph className={className} /> : null;
}
