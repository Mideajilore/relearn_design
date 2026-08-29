import type { ReactNode } from 'react';

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

/** 600-weight section title. Use for section and track titles only. */
export function SectionTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h2 className={`font-semibold text-grey-900 ${className}`}>{children}</h2>;
}

/** Small all-caps eyebrow for grouping inside a card. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-widest text-grey-500">{children}</p>
  );
}

export function Divider({ className = '' }: { className?: string }) {
  return <hr className={`border-0 border-t border-grey-200 ${className}`} />;
}
