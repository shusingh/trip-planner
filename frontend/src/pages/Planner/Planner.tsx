import type { DateRange } from 'react-day-picker';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

import StepDestination from './components/StepDestination';
import StepDates from './components/StepDates';
import StepInterests from './components/StepInterests';

import { LoadingSequence } from '@/components/LoadingSequence';
import { buttonVariants } from '@/components/ui/button';
import { AtlasShell } from '@/layouts/atlas-shell';
import { type AtlasMapHandle } from '@/components/AtlasMap';
import { cn } from '@/lib/utils';

const TOTAL_STEPS = 3;

export default function PlannerPage() {
  const navigate = useNavigate();
  const mapRef = useRef<AtlasMapHandle>(null);

  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [destinationCoords, setDestinationCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStepValid =
    step === 1
      ? destination.trim().length > 0
      : step === 2
        ? !!(dateRange?.from && dateRange?.to)
        : tags.length > 0;

  const handleNext = () => {
    if (isStepValid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));
  const toggleTag = (label: string) =>
    setTags((cur) =>
      cur.includes(label) ? cur.filter((t) => t !== label) : [...cur, label]
    );

  const handleSelectCoords = (coords: { lat: number; lng: number }) => {
    setDestinationCoords(coords);
    mapRef.current?.flyTo([coords.lng, coords.lat], 9);
  };

  const handleSubmit = async () => {
    if (!isStepValid || !dateRange?.from || !dateRange?.to) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        destination,
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd'),
        tags,
      };

      const base = import.meta.env.VITE_API_BASE_URL || '';
      const resp = await fetch(`${base}/api/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const bodyText = await resp.text();
        let msg = `Status ${resp.status}`;

        try {
          const data = JSON.parse(bodyText);

          if (typeof data.error === 'string') {
            msg = data.error;
          } else if (Array.isArray(data.detail)) {
            msg = data.detail
              .map((d: any) => d.msg || JSON.stringify(d))
              .join('; ');
          } else {
            msg = JSON.stringify(data);
          }
        } catch {
          if (bodyText) msg = bodyText;
        }

        throw new Error(msg);
      }

      const data = await resp.json();

      navigate('/planner/results', {
        state: { data, destination, destinationCoords },
      });
    } catch (err: any) {
      setError(
        err.message || 'Failed to fetch recommendations. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AtlasShell
      ref={mapRef}
      panelHeader={
        <div className="flex items-center justify-between">
          <span className="font-serif text-lg font-bold tracking-tight">
            Trip<span className="text-accent">Atlas</span>
          </span>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={cn(
                  'h-1 w-5 rounded-full transition-colors',
                  n <= step ? 'bg-accent-deep' : 'bg-line'
                )}
              />
            ))}
          </div>
        </div>
      }
      showVeil={!destinationCoords}
    >
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <LoadingSequence />
      ) : (
        <>
          {step === 1 && (
            <StepDestination
              destination={destination}
              onChange={setDestination}
              onSelectCoords={handleSelectCoords}
            />
          )}
          {step === 2 && (
            <StepDates dateRange={dateRange} onChange={setDateRange} />
          )}
          {step === 3 && (
            <StepInterests selectedTags={tags} onToggleTag={toggleTag} />
          )}

          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <button
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                type="button"
                onClick={handleBack}
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <span />
            )}

            <button
              className={cn(buttonVariants({ size: 'sm' }))}
              disabled={!isStepValid}
              type="button"
              onClick={step < TOTAL_STEPS ? handleNext : handleSubmit}
            >
              {step < TOTAL_STEPS ? 'Next' : 'Submit'}
              {step < TOTAL_STEPS ? (
                <ArrowRight size={16} />
              ) : (
                <Check size={16} />
              )}
            </button>
          </div>
        </>
      )}
    </AtlasShell>
  );
}
