import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'quiet';

const VARIANTS: Record<Variant, string> = {
  primary: 'border-accent bg-accent text-white hover:bg-grey-700 hover:border-grey-700',
  secondary: 'border-grey-300 bg-white text-grey-700 hover:bg-grey-50',
  quiet: 'border-transparent bg-white text-grey-500 hover:bg-grey-50 hover:text-grey-700',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'secondary', className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-control border px-4 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-grey-200 disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
    />
  );
}
