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
        'flex items-center gap-2 rounded-full border-[1.5px] px-4 py-2 text-sm font-medium transition-colors',
        selected
          ? 'border-accent-deep bg-accent-deep text-white'
          : 'border-line bg-white text-ink hover:border-accent-deep'
      )}
      type="button"
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}
