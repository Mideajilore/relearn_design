import type { ReactNode } from 'react';

type Tone = 'neutral' | 'success' | 'quiet';

const TONES: Record<Tone, string> = {
  neutral: 'border-grey-200 bg-grey-50 text-grey-700',
  success: 'border-success/30 bg-success/10 text-success',
  quiet: 'border-grey-200 bg-white text-grey-500',
};

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-control border px-3 py-1 text-sm ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
