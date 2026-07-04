import type { CSSProperties } from 'react';
import type { DateRange } from 'react-day-picker';

import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import 'react-day-picker/style.css';

import { cn } from '@/lib/utils';

export interface DateRangeFieldProps {
  range: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

// react-day-picker themes ranges via CSS custom properties rather than
// per-day classNames; overriding classNames instead breaks the built-in
// gradient that joins range_start/range_end into the range_middle fill.
const rdpVars = {
  '--rdp-accent-color': '#1d3557',
  '--rdp-accent-background-color': '#e7ecf2',
  '--rdp-today-color': '#e07a3f',
} as CSSProperties;

// The `classNames` prop replaces each key's default class outright rather
// than appending to it, so custom classes must be merged with the library's
// own defaults or its range/selection background rules (which target
// `.rdp-day_button`, etc.) stop matching entirely.
const defaultClassNames = getDefaultClassNames();

export function DateRangeField({ range, onChange }: DateRangeFieldProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="rounded-xl border-[1.5px] border-line bg-white p-3">
      <DayPicker
        classNames={{
          day_button: cn(
            defaultClassNames.day_button,
            // A hover background would visually tie with the (equal-specificity)
            // solid selected/range fill and can hide white selected-day text
            // under the cursor right after a click; a ring never fights the fill.
            'rounded-full transition-shadow hover:ring-2 hover:ring-accent-deep/30'
          ),
          chevron: cn(defaultClassNames.chevron, 'fill-accent-deep'),
        }}
        disabled={{ before: today }}
        mode="range"
        selected={range}
        style={rdpVars}
        onSelect={onChange}
      />
    </div>
  );
}
