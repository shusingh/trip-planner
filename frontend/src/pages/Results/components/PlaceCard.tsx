import type { CSSProperties } from 'react';
import type { Place } from '@/types/recommendations';

import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

import { fetchPlaceImage } from '@/lib/placeImage';
import { cn } from '@/lib/utils';

export interface PlaceCardProps {
  place: Place;
  index: number;
  color: string;
  active: boolean;
  onSelect: () => void;
}

// The leading letter used on the fallback tile, ignoring articles so
// "A tucked-away counter" shows "T" rather than "A".
function fallbackInitial(name: string): string {
  const cleaned = name.replace(/^(a|an|the)\s+/i, '').trim();
  return (cleaned[0] || name[0] || '?').toUpperCase();
}

function Thumbnail({
  place,
  index,
  color,
}: {
  place: Place;
  index: number;
  color: string;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'fallback'>(
    'loading'
  );

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    setSrc(null);

    fetchPlaceImage(place.name, controller.signal).then((url) => {
      if (controller.signal.aborted) return;
      if (url) setSrc(url);
      else setStatus('fallback');
    });

    return () => controller.abort();
  }, [place.name]);

  return (
    <div className="relative size-[92px] flex-none overflow-hidden rounded-[10px] border border-line bg-paper-deep">
      <span
        className="absolute left-1.5 top-1.5 z-10 grid size-[22px] place-items-center rounded-full text-[11px] font-bold text-white shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
        style={{ background: color }}
      >
        {index + 1}
      </span>

      {status === 'loading' && (
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(100deg,#ded5c5_30%,#e9e2d2_50%,#ded5c5_70%)] bg-[length:200%_100%]" />
      )}

      {status === 'fallback' && (
        <div
          className="absolute inset-0 grid place-items-center font-serif text-[30px] text-white/90"
          style={{ background: `linear-gradient(150deg, ${color}, ${color}cc)` }}
        >
          {fallbackInitial(place.name)}
        </div>
      )}

      {src && (
        <img
          alt={place.name}
          className={cn(
            'size-full object-cover transition-opacity duration-500',
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          )}
          loading="lazy"
          src={src}
          onLoad={() => setStatus('loaded')}
        />
      )}
    </div>
  );
}

export function PlaceCard({
  place,
  index,
  color,
  active,
  onSelect,
}: PlaceCardProps) {
  return (
    <div
      className={cn(
        'flex animate-card-in cursor-pointer gap-3.5 rounded-xl border border-transparent p-3 transition-colors hover:border-line hover:bg-paper-bright/70',
        active && 'border-line bg-paper-bright'
      )}
      role="button"
      style={{ animationDelay: `${index * 90}ms` } as CSSProperties}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <Thumbnail color={color} index={index} place={place} />

      <div className="min-w-0">
        <h3 className="mt-0.5 text-[15px] font-bold leading-snug">
          {place.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-ink-soft">
          {place.description}
        </p>
        {place.url && (
          <a
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-accent-deep hover:underline"
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
}
