import type { DateRange } from 'react-day-picker';

import { DateRangeField } from '@/components/ui/date-range-field';

export interface StepDatesProps {
  dateRange: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

export default function StepDates({ dateRange, onChange }: StepDatesProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-3xl font-medium tracking-tight">
        When will you travel?
      </h2>
      <DateRangeField range={dateRange} onChange={onChange} />
    </div>
  );
}
