import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface StepTrackerProps {
  /** 1-based index of the current step. */
  current: number;
  /** Short label for each step, in order. */
  steps: string[];
  /** Per-step completion, in order (index 0 = step 1). */
  completed: boolean[];
  /** Jump to a 1-based step. Only called for reachable steps. */
  onJump: (step: number) => void;
}

// A step is reachable once every step before it is complete, so you can jump
// back freely but can't skip ahead past an unfinished step.
function isReachable(index: number, completed: boolean[]): boolean {
  return completed.slice(0, index).every(Boolean);
}

export function StepTracker({
  current,
  steps,
  completed,
  onJump,
}: StepTrackerProps) {
  return (
    <nav aria-label="Progress" className="mt-4">
      <ol className="flex items-center">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === current;
          const isDone = completed[index];
          const reachable = isReachable(index, completed);
          const canJump = reachable && !isCurrent;

          return (
            <li
              key={label}
              className={cn('flex items-center', index < steps.length - 1 && 'flex-1')}
            >
              <button
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'group flex items-center gap-2 rounded-full text-left transition-opacity',
                  canJump ? 'cursor-pointer' : 'cursor-default',
                  !reachable && 'opacity-45'
                )}
                disabled={!canJump}
                type="button"
                onClick={() => canJump && onJump(stepNumber)}
              >
                <span
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-full border font-mono text-xs font-semibold transition-colors',
                    isCurrent
                      ? 'border-accent-deep bg-accent-deep text-paper-bright'
                      : isDone
                        ? 'border-accent bg-accent/15 text-accent-deep group-hover:bg-accent/25'
                        : 'border-line bg-paper-bright text-ink-muted'
                  )}
                >
                  {isDone && !isCurrent ? <Check size={14} /> : stepNumber}
                </span>
                <span
                  className={cn(
                    'hidden text-[13px] font-semibold sm:inline',
                    isCurrent ? 'text-ink' : 'text-ink-muted'
                  )}
                >
                  {label}
                </span>
              </button>

              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'mx-2 h-px flex-1 transition-colors',
                    completed[index] ? 'bg-accent/40' : 'bg-line'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
