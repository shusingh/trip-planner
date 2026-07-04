import type { RecommendationResponse, Place } from '@/types/recommendations';
import type { AtlasMarker, AtlasMapHandle } from '@/components/AtlasMap';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, Navigate, Link as RouterLink } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

import { AtlasShell } from '@/layouts/atlas-shell';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LocationState {
  data: RecommendationResponse;
  destination: string;
}

const CATEGORIES: { key: 'attractions' | 'food' | 'other'; label: string; color: string }[] = [
  { key: 'attractions', label: 'Attractions', color: '#e07a3f' },
  { key: 'food', label: 'Food', color: '#2f7d5c' },
  { key: 'other', label: 'Local finds', color: '#1d3557' },
];

export default function ResultsPage() {
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const mapRef = useRef<AtlasMapHandle>(null);
  const [activeCat, setActiveCat] = useState<'attractions' | 'food' | 'other'>(
    'attractions'
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const groups = useMemo(() => {
    if (!state) return {} as Record<string, Place[]>;
    return {
      attractions: state.data.attractions || [],
      food: state.data.food || [],
      other: state.data.other || [],
    };
  }, [state]);

  const allMarkers: AtlasMarker[] = useMemo(() => {
    if (!state) return [];
    return CATEGORIES.flatMap(({ key, color }) =>
      (groups[key] || []).map((place, i) => ({
        id: `${key}-${i}`,
        lat: place.latitude,
        lng: place.longitude,
        color,
        label: String(i + 1),
        title: place.name,
        description: place.description,
      }))
    );
  }, [state, groups]);

  useEffect(() => {
    if (!state) return;
    mapRef.current?.setMarkers(allMarkers);
    mapRef.current?.fitToMarkers(allMarkers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (!state) {
    return <Navigate replace to="/planner" />;
  }

  const activePlaces = groups[activeCat] || [];

  const handleCardClick = (key: string, i: number) => {
    const id = `${key}-${i}`;
    setActiveId(id);
    mapRef.current?.focusMarker(id);
  };

  return (
    <AtlasShell
      ref={mapRef}
      panelHeader={
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-accent">
            Your itinerary sketch
          </div>
          <h1 className="mt-1 font-serif text-2xl font-semibold">
            {state.destination}
          </h1>
        </div>
      }
      showVeil={false}
    >
      <div className="-mx-7 -mt-8 mb-4 flex gap-2 border-b border-line px-7 pb-3">
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
              activeCat === key
                ? 'bg-accent-deep/10 text-accent-deep'
                : 'text-ink-soft hover:text-ink'
            )}
            type="button"
            onClick={() => setActiveCat(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {activePlaces.length === 0 && (
          <p className="text-sm text-ink-soft">Nothing here yet.</p>
        )}
        {activePlaces.map((place, i) => {
          const id = `${activeCat}-${i}`;
          const color = CATEGORIES.find((c) => c.key === activeCat)!.color;

          return (
            <div
              key={id}
              className={cn(
                'flex cursor-pointer gap-3 rounded-2xl p-3 transition-colors hover:bg-paper',
                activeId === id && 'bg-paper'
              )}
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(activeCat, i)}
            >
              <div
                className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: color }}
              >
                {i + 1}
              </div>
              <div>
                <h3 className="text-sm font-semibold">{place.name}</h3>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-soft">
                  {place.description}
                </p>
                {place.url && (
                  <a
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-accent-deep hover:underline"
                    href={place.url}
                    rel="noopener noreferrer"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Learn more <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <RouterLink
        className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mt-6 w-full')}
        to="/planner"
      >
        Plan another trip
      </RouterLink>
    </AtlasShell>
  );
}
