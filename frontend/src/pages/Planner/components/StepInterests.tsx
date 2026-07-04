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
} from 'lucide-react';

import { Chip } from '@/components/ui/chip';

export interface StepInterestsProps {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
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

export default function StepInterests({
  selectedTags,
  onToggleTag,
}: StepInterestsProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-3xl font-semibold tracking-tight">
        Select your interests
      </h2>
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
      </div>
    </div>
  );
}
