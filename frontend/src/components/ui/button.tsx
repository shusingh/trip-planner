import type { ButtonHTMLAttributes } from 'react';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[5px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40',
  {
    variants: {
      variant: {
        primary: 'bg-accent-deep text-paper-bright shadow-[0_18px_38px_-24px_rgba(67,95,29,0.72)] hover:bg-accent',
        ghost: 'bg-transparent text-ink-soft hover:text-ink',
        outline: 'border border-line bg-paper-bright text-ink hover:border-accent-deep hover:bg-paper',
      },
      size: {
        md: 'px-7 py-3 text-[15px]',
        sm: 'px-5 py-2.5 text-sm',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';
