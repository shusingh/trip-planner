import type { InputHTMLAttributes, ReactNode } from 'react';

import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  startContent?: ReactNode;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, startContent, className, ...props }, ref) => (
    <div className="rounded-lg border border-line bg-paper-bright/80 px-4 py-3 shadow-[0_16px_34px_-30px_rgba(26,26,31,0.38)] transition-colors focus-within:border-accent-deep">
      <label className="mb-0.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-accent-deep">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {startContent}
        <input
          ref={ref}
          className={cn(
            'w-full border-none bg-transparent font-medium text-ink outline-none placeholder:text-ink-soft/60',
            className
          )}
          {...props}
        />
      </div>
    </div>
  )
);
Field.displayName = 'Field';
