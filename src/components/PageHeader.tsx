import type { ReactNode } from 'react';

/**
 * The one place 700-weight is allowed: the main header of a route.
 * Nothing else in the app is bold.
 */
export function PageHeader({ title, lede }: { title: string; lede?: ReactNode }) {
  return (
    <div className="max-w-reading">
      <h1 className="text-3xl font-bold leading-tight text-grey-900 sm:text-4xl">{title}</h1>
      {lede ? <p className="mt-3 leading-relaxed text-grey-500">{lede}</p> : null}
    </div>
  );
}
