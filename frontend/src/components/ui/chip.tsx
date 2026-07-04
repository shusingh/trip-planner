import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface ChipProps {
  selected?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  children: ReactNode;
}

export function Chip({ selected, onClick, icon, children }: ChipProps) {
  return (
    <button
      className={cn(
        'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
        selected
          ? 'border-accent-deep bg-accent-deep text-paper-bright'
          : 'border-line bg-paper-bright/80 text-ink hover:border-accent-deep hover:bg-paper'
      )}
      type="button"
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}
