import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

import { Field } from '@/components/ui/input';
import { searchDestinations, type GeocodeResult } from '@/lib/geocode';

export interface StepDestinationProps {
  destination: string;
  onChange: (value: string) => void;
  onSelectCoords: (coords: { lat: number; lng: number }) => void;
}

export default function StepDestination({
  destination,
  onChange,
  onSelectCoords,
}: StepDestinationProps) {
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const skipNextSearch = useRef(false);

  useEffect(() => {
    abortRef.current?.abort();

    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }

    if (destination.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const results = await searchDestinations(destination, controller.signal);
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch {
        // aborted or network hiccup; leave suggestions as-is
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [destination]);

  const pick = (result: GeocodeResult) => {
    skipNextSearch.current = true;
    setOpen(false);
    setSuggestions([]);
    onChange(result.label);
    onSelectCoords({ lat: result.lat, lng: result.lng });
  };

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-3xl font-semibold tracking-tight">
        Where do you want to go?
      </h2>
      <div className="relative">
        <Field
          autoComplete="off"
          label="Destination"
          placeholder="e.g., Paris, France"
          startContent={<MapPin className="text-ink-soft" size={18} />}
          value={destination}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
        />
        {open && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-xl border border-line bg-white shadow-lg">
            {suggestions.map((s, i) => (
              <li key={`${s.label}-${i}`}>
                <button
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-paper"
                  type="button"
                  onClick={() => pick(s)}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
