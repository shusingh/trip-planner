import type { InputHTMLAttributes, ReactNode } from 'react';

import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  startContent?: ReactNode;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, startContent, className, ...props }, ref) => (
    <div className="rounded-xl border-[1.5px] border-line bg-white px-4 py-3 transition-colors focus-within:border-accent-deep">
      <label className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
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
