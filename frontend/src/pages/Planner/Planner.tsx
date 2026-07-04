import type { DateRange } from 'react-day-picker';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import StepDestination from './components/StepDestination';
import StepDates from './components/StepDates';
import StepInterests, { type Pace } from './components/StepInterests';
import { StepTracker } from './components/StepTracker';

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
  const [pace, setPace] = useState<Pace>('balanced');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Per-step completion, in order (index 0 = step 1). Drives both the Next
  // button and which steps the tracker will let you jump to.
  const stepCompletion = [
    destination.trim().length > 0,
    !!(dateRange?.from && dateRange?.to),
    tags.length > 0,
  ];
  const isStepValid = stepCompletion[step - 1];

  const handleNext = () => {
    if (isStepValid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));
  // Jumping is only offered for reachable steps (every earlier step complete),
  // so this guard mirrors the tracker's own gating.
  const handleJump = (target: number) => {
    if (stepCompletion.slice(0, target - 1).every(Boolean)) setStep(target);
  };
  const toggleTag = (label: string) =>
    setTags((cur) =>
      cur.includes(label) ? cur.filter((t) => t !== label) : [...cur, label]
    );
  const addCustomTag = (label: string) =>
    setTags((cur) => (cur.includes(label) ? cur : [...cur, label]));

  const handleSelectCoords = (coords: { lat: number; lng: number }) => {
    setDestinationCoords(coords);
    mapRef.current?.flyTo([coords.lng, coords.lat], 14.4);
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
        pace,
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
        <div>
          <RouterLink
            aria-label="Michi home"
            className="flex w-fit items-center gap-2.5 font-serif text-[22px] font-medium tracking-tight"
            to="/"
          >
            <span className="grid size-6 place-items-center rounded-full border border-ink/15 bg-[conic-gradient(from_45deg,#567a26,#2f7d5c,#ded5c5,#567a26)] shadow-[inset_0_0_0_4px_rgba(248,244,236,0.55)]">
              <span className="size-2 rounded-full bg-paper-bright" />
            </span>
            Michi
          </RouterLink>
          <StepTracker
            completed={stepCompletion}
            current={step}
            steps={['Destination', 'Dates', 'Interests']}
            onJump={handleJump}
          />
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
            <StepInterests
              pace={pace}
              selectedTags={tags}
              onAddCustom={addCustomTag}
              onPaceChange={setPace}
              onToggleTag={toggleTag}
            />
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
