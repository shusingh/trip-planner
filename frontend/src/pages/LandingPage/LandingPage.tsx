import type { CSSProperties } from 'react';

import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Link as RouterLink } from 'react-router-dom';

import { buttonVariants } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import DefaultLayout from '@/layouts/default';
import { cn } from '@/lib/utils';

const steps = [
  { n: '01', title: 'Destination', description: 'Where to' },
  { n: '02', title: 'Dates', description: "When you're free" },
  { n: '03', title: 'Interests', description: 'What you love' },
];

const towers = [
  { x: '0%', y: '4%', w: '58px', h: '178px', c: '#b8b99d' },
  { x: '7%', y: '7%', w: '72px', h: '276px', c: '#9ca67d' },
  { x: '15%', y: '2%', w: '52px', h: '214px', c: '#c8c1ad' },
  { x: '20%', y: '10%', w: '86px', h: '336px', c: '#6e8848' },
  { x: '31%', y: '0%', w: '68px', h: '246px', c: '#a9aa88' },
  { x: '37%', y: '12%', w: '96px', h: '386px', c: '#506f32' },
  { x: '49%', y: '5%', w: '54px', h: '238px', c: '#d0c6b4' },
  { x: '55%', y: '14%', w: '84px', h: '320px', c: '#78915a' },
  { x: '66%', y: '1%', w: '70px', h: '270px', c: '#b7b899' },
  { x: '74%', y: '9%', w: '92px', h: '356px', c: '#5c7a3c' },
  { x: '86%', y: '3%', w: '56px', h: '206px', c: '#d8d0c0' },
];

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

function KyotoPreviewMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [135.7681, 35.0116],
      zoom: 15.45,
      pitch: 62,
      bearing: -28,
      interactive: false,
      attributionControl: false,
    });

    map.on('load', () => {
      ['poi_label', 'place_label_other', 'place_label_city', 'road_label'].forEach(
        (id) => {
          if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', 'none');
        }
      );

      const labelLayerId = map
        .getStyle()
        .layers?.find(
          (layer) =>
            layer.type === 'symbol' &&
            layer.layout &&
            'text-field' in layer.layout
        )?.id;

      if (map.getSource('openmaptiles') && !map.getLayer('landing-3d-buildings')) {
        map.addLayer(
          {
            id: 'landing-3d-buildings',
            source: 'openmaptiles',
            'source-layer': 'building',
            type: 'fill-extrusion',
            minzoom: 13,
            paint: {
              'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['coalesce', ['get', 'render_height'], 8],
                0,
                '#d8d0c0',
                50,
                '#9aa077',
                150,
                '#496b31',
              ],
              'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 8],
              'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
              'fill-extrusion-opacity': 0.78,
            },
          },
          labelLayerId
        );
      }
    });

    return () => map.remove();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-30 opacity-80 [filter:saturate(0.72)_contrast(0.9)]"
    />
  );
}

export default function LandingPage() {
  return (
    <DefaultLayout>
      <section className="relative isolate -mt-[88px] min-h-[calc(100vh-73px)] overflow-hidden px-6 pb-16 pt-24 sm:px-8 lg:pt-24">
        <KyotoPreviewMap />
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(76%_82%_at_22%_40%,rgba(248,244,236,0.98)_0%,rgba(248,244,236,0.9)_31%,rgba(239,234,224,0.5)_53%,transparent_73%),linear-gradient(90deg,rgba(239,234,224,0.96)_0%,rgba(239,234,224,0.76)_30%,rgba(239,234,224,0.1)_58%,rgba(26,26,31,0)_100%),linear-gradient(180deg,rgba(248,244,236,0.28),rgba(46,110,82,0.1))]" />
        <div className="pointer-events-none absolute -left-[20%] -top-[20%] -z-10 h-[132%] w-[72%] bg-[radial-gradient(ellipse_62%_56%_at_45%_48%,rgba(248,244,236,0.98)_0%,rgba(248,244,236,0.86)_44%,rgba(239,234,224,0.32)_70%,transparent_100%)] blur-[2px]" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-6 -right-[7vw] -z-10 h-[54vh] min-h-[420px] w-[min(820px,58vw)] origin-[58%_100%] rotate-[-8deg] transform-gpu opacity-25 [filter:saturate(0.82)] [transform:perspective(980px)_rotateX(58deg)_rotateZ(-8deg)] max-sm:-right-[210px] max-sm:w-[760px] max-sm:opacity-20"
        >
          {towers.map((tower, index) => (
            <span
              key={`${tower.x}-${index}`}
              className="absolute bottom-[var(--y)] left-[var(--x)] h-[var(--h)] w-[var(--w)] skew-y-[-8deg] border border-ink/10 bg-[linear-gradient(180deg,rgba(248,244,236,0.7),var(--c))] shadow-[16px_20px_42px_-24px_rgba(26,26,31,0.52)] before:absolute before:right-[-16px] before:top-2.5 before:h-[calc(100%-10px)] before:w-4 before:origin-left before:skew-y-[42deg] before:bg-[color-mix(in_srgb,var(--c)_76%,#1a1a1f_24%)] before:opacity-70 before:content-[''] after:absolute after:-top-2.5 after:left-2 after:right-[-8px] after:h-5 after:origin-left after:skew-x-[-50deg] after:border after:border-ink/10 after:bg-[color-mix(in_srgb,var(--c)_54%,#f8f4ec_46%)] after:content-['']"
              style={
                {
                  '--x': tower.x,
                  '--y': tower.y,
                  '--w': tower.w,
                  '--h': tower.h,
                  '--c': tower.c,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[minmax(0,640px)_1fr]">
          <div className="min-w-0 max-w-[calc(100vw-48px)] pt-6 sm:max-w-none sm:pt-8">
            <p className="mb-6 flex items-center gap-3 font-mono text-[13px] font-semibold text-accent-deep [text-shadow:0_0_18px_rgba(239,234,224,0.95)] before:h-px before:w-7 before:bg-accent">
              AI itineraries on a living map
            </p>

            <h1 className="max-w-[calc(100vw-48px)] font-serif text-[52px] font-medium leading-[0.98] text-ink [text-shadow:0_0_18px_rgba(239,234,224,1),0_0_8px_rgba(239,234,224,1),0_1px_0_rgba(255,255,255,0.5)] sm:max-w-[650px] sm:text-7xl lg:text-[82px]">
              Plan your
              <br />
              <span className="italic text-accent">
                perfect<span className="block sm:inline"> trip</span>
              </span>
              <br />
              with AI
            </h1>

            <p className="mt-8 max-w-[330px] text-[17px] leading-8 text-ink-soft [text-shadow:0_0_18px_rgba(239,234,224,0.95)] sm:max-w-[500px] sm:text-lg">
              Tell {siteConfig.name} where you are going, when you will be
              there, and the kind of day you want. It returns a calm itinerary
              you can read, edit, and explore in real space.
            </p>

            <div className="mt-9 grid max-w-[548px] grid-cols-1 gap-3 sm:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.n}
                  className="rounded-lg border border-line bg-paper-bright/75 p-4 shadow-[0_16px_34px_-30px_rgba(26,26,31,0.38)] backdrop-blur-md"
                >
                  <div className="font-mono text-xs font-semibold text-accent">
                    {step.n}
                  </div>
                  <div className="mt-2 text-sm font-bold text-ink">
                    {step.title}
                  </div>
                  <div className="mt-0.5 text-[13px] text-ink-muted">
                    {step.description}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <RouterLink
                aria-label="Start planning your trip"
                className={cn(
                  buttonVariants({ variant: 'primary', size: 'md' }),
                  'rounded-[5px] font-mono text-sm'
                )}
                to="/planner"
              >
                Start planning
                <ArrowRight size={16} />
              </RouterLink>
              <RouterLink
                className="font-mono text-[13px] font-semibold text-accent-deep underline decoration-accent/40 underline-offset-4 [text-shadow:0_0_18px_rgba(239,234,224,0.95)]"
                to="/planner"
              >
                Build an example trip
              </RouterLink>
            </div>
          </div>

          <div className="relative hidden min-h-[520px] lg:block">
            <div className="absolute bottom-8 right-0 w-[286px] rounded-[10px] border border-ink/15 bg-paper-bright/80 p-[18px] text-ink shadow-[0_22px_60px_-36px_rgba(26,26,31,0.45)] backdrop-blur-md">
              <div className="text-[15px] font-bold">A Kyoto day, mapped</div>
              <p className="mt-1.5 text-[13px] leading-6 text-ink-soft">
                Quiet temples, matcha breaks, garden walks, and dinner lanes
                arranged into a route you can refine.
              </p>
              <span className="mt-3 inline-flex rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-accent-deep">
                Live map preview
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 border-t border-line px-6 py-16 sm:px-8 lg:grid-cols-3">
        <div className="border-l border-line pl-5">
          <h2 className="font-serif text-[21px] font-medium">
            A city you can feel
          </h2>
          <p className="mt-2 text-[15px] leading-7 text-ink-soft">
            Skylines rise as you zoom in, with the map acting as texture and
            context rather than visual noise.
          </p>
        </div>
        <div className="border-l border-line pl-5">
          <h2 className="font-serif text-[21px] font-medium">
            Built from your words
          </h2>
          <p className="mt-2 text-[15px] leading-7 text-ink-soft">
            Three plain inputs shape the trip: destination, dates, and the kind
            of places you want to remember.
          </p>
        </div>
        <div className="border-l border-line pl-5">
          <h2 className="font-serif text-[21px] font-medium">
            Ready to refine
          </h2>
          <p className="mt-2 text-[15px] leading-7 text-ink-soft">
            The first draft arrives quickly, then you can swap stops, follow
            links, and keep planning from the map.
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
}
