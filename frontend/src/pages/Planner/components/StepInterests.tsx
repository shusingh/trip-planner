import { useState } from 'react';
import {
  Map,
  Utensils,
  Star,
  Moon,
  BookOpen,
  Trees,
  Mountain,
  Landmark,
  ShoppingBag,
  Pencil,
  Plus,
  X,
} from 'lucide-react';

import { Chip } from '@/components/ui/chip';
import { cn } from '@/lib/utils';

export type Pace = 'relaxed' | 'balanced' | 'packed';

export interface StepInterestsProps {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onAddCustom: (tag: string) => void;
  pace: Pace;
  onPaceChange: (pace: Pace) => void;
}

const TAGS = [
  { label: 'Must-see Attractions', Icon: Map },
  { label: 'Great Food', Icon: Utensils },
  { label: 'Hidden Gems', Icon: Star },
  { label: 'Nightlife', Icon: Moon },
  { label: 'History', Icon: BookOpen },
  { label: 'Nature', Icon: Trees },
  { label: 'Adventure', Icon: Mountain },
  { label: 'Culture', Icon: Landmark },
  { label: 'Shopping', Icon: ShoppingBag },
];

const PRESET_LABELS = new Set(TAGS.map((t) => t.label));

const PACES: { value: Pace; label: string; sub: string }[] = [
  { value: 'relaxed', label: 'Relaxed', sub: '2-3 / day' },
  { value: 'balanced', label: 'Balanced', sub: '4-5 / day' },
  { value: 'packed', label: 'Packed', sub: '6+ / day' },
];

export default function StepInterests({
  selectedTags,
  onToggleTag,
  onAddCustom,
  pace,
  onPaceChange,
}: StepInterestsProps) {
  const [draft, setDraft] = useState('');

  // Anything selected that isn't one of the presets is a typed-in interest;
  // render those separately so they can be removed.
  const customTags = selectedTags.filter((t) => !PRESET_LABELS.has(t));

  const commitDraft = () => {
    const value = draft.trim();
    if (!value) return;
    onAddCustom(value);
    setDraft('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-serif text-3xl font-medium tracking-tight">
          What are you into?
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Pick a few, or add your own.
          <span className="ml-1.5 font-mono text-xs font-semibold text-accent-deep">
            {selectedTags.length} selected
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {TAGS.map(({ label, Icon }) => (
          <Chip
            key={label}
            icon={<Icon size={16} />}
            selected={selectedTags.includes(label)}
            onClick={() => onToggleTag(label)}
          >
            {label}
          </Chip>
        ))}
        {customTags.map((tag) => (
          <button
            key={tag}
            className="flex items-center gap-2 rounded-full border border-dashed border-accent-deep bg-accent-deep px-4 py-2 text-sm font-semibold text-paper-bright transition-colors"
            type="button"
            onClick={() => onToggleTag(tag)}
          >
            <Pencil size={14} />
            {tag}
            <X className="opacity-70" size={15} />
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="min-w-0 flex-1 rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-accent"
          placeholder="Add your own, e.g. specialty coffee, jazz bars…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitDraft();
            }
          }}
        />
        <button
          className="inline-flex items-center gap-1 rounded-lg border border-accent-deep px-3.5 text-sm font-semibold text-accent-deep transition-colors hover:bg-accent/10 disabled:opacity-40"
          disabled={!draft.trim()}
          type="button"
          onClick={commitDraft}
        >
          <Plus size={15} />
          Add
        </button>
      </div>

      <div className="border-t border-line pt-5">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">Pace of the trip</span>
          <span className="font-mono text-xs font-semibold capitalize text-accent-deep">
            {pace}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-paper-deep p-1">
          {PACES.map(({ value, label, sub }) => (
            <button
              key={value}
              className={cn(
                'rounded-lg py-2 text-sm font-semibold transition-colors',
                pace === value
                  ? 'bg-paper-bright text-accent-deep shadow-[0_2px_8px_-3px_rgba(26,26,31,0.3)]'
                  : 'text-ink-soft hover:text-ink'
              )}
              type="button"
              onClick={() => onPaceChange(value)}
            >
              {label}
              <span className="mt-0.5 block font-mono text-[11px] font-medium text-ink-muted">
                {sub}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
