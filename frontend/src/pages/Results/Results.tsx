import type { RecommendationResponse, Place } from '@/types/recommendations';
import type { AtlasMarker, AtlasMapHandle } from '@/components/AtlasMap';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, Navigate, Link as RouterLink } from 'react-router-dom';

import { AtlasShell } from '@/layouts/atlas-shell';
import { buttonVariants } from '@/components/ui/button';
import { PlaceCard } from './components/PlaceCard';
import { cn } from '@/lib/utils';

interface LocationState {
  data: RecommendationResponse;
  destination: string;
}

const CATEGORIES: { key: 'attractions' | 'food' | 'other'; label: string; color: string }[] = [
  { key: 'attractions', label: 'Attractions', color: '#567a26' },
  { key: 'food', label: 'Food', color: '#2f7d5c' },
  { key: 'other', label: 'Local finds', color: '#1a1a1f' },
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
          <div className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
            Your itinerary sketch
          </div>
          <h1 className="mt-1 font-serif text-2xl font-medium">
            {state.destination}
          </h1>
        </div>
      }
      showVeil={false}
      centerContent={false}
    >
      <div className="-mx-7 -mt-2 mb-6 flex gap-6 border-b border-line px-7">
        {CATEGORIES.map(({ key, label }) => {
          const count = (groups[key] || []).length;
          return (
            <button
              key={key}
              className={cn(
                '-mb-px border-b-2 pb-3 pt-1 text-sm font-semibold transition-colors',
                activeCat === key
                  ? 'border-accent text-accent-deep'
                  : 'border-transparent text-ink-soft hover:text-ink'
              )}
              type="button"
              onClick={() => setActiveCat(key)}
            >
              {label}
              {count > 0 && (
                <span className="ml-1.5 font-mono text-[11px] text-ink-muted">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Keying on the active category remounts the list so cards replay their
          staggered entrance when you switch tabs. */}
      <div key={activeCat} className="space-y-2">
        {activePlaces.length === 0 && (
          <p className="text-sm text-ink-soft">Nothing here yet.</p>
        )}
        {activePlaces.map((place, i) => {
          const id = `${activeCat}-${i}`;
          const color = CATEGORIES.find((c) => c.key === activeCat)!.color;

          return (
            <PlaceCard
              key={id}
              active={activeId === id}
              color={color}
              index={i}
              place={place}
              onSelect={() => handleCardClick(activeCat, i)}
            />
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
