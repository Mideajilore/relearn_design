import type { ReactNode } from 'react';
import type { IconComponent } from './icons';

interface CardProps {
  children: ReactNode;
  /** 16px by default, 24px for the roomier cards. */
  padding?: 'sm' | 'md';
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
}

const PADDING = {
  sm: 'p-4',
  md: 'p-4 sm:p-6',
} as const;

export function Card({ children, padding = 'md', className = '', as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={`rounded-card border border-grey-200 bg-white ${PADDING[padding]} ${className}`}
    >
      {children}
    </Tag>
  );
}

/**
 * 600-weight section title. Use for section and track titles only.
 *
 * An `icon` is always decorative — it repeats what the title already says, and
 * sits in grey-500 so the words stay the loudest thing in the row.
 */
export function SectionTitle({
  children,
  icon: Glyph,
  className = '',
}: {
  children: ReactNode;
  icon?: IconComponent;
  className?: string;
}) {
  return (
    <h2 className={`flex items-center gap-2 font-semibold text-grey-900 ${className}`}>
      {Glyph ? <Glyph className="h-5 w-5 shrink-0 text-grey-500" /> : null}
      <span className="min-w-0">{children}</span>
    </h2>
  );
}

/** Small all-caps eyebrow for grouping inside a card. */
export function Eyebrow({ children, icon: Glyph }: { children: ReactNode; icon?: IconComponent }) {
  return (
    <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-grey-500">
      {Glyph ? <Glyph className="h-4 w-4 shrink-0" /> : null}
      <span className="min-w-0">{children}</span>
    </p>
  );
}

export function Divider({ className = '' }: { className?: string }) {
  return <hr className={`border-0 border-t border-grey-200 ${className}`} />;
}
