import type { ReactNode } from 'react';

import { forwardRef } from 'react';

import { AtlasMap, type AtlasMapHandle } from '@/components/AtlasMap';
import { CompassRose } from '@/components/CompassRose';
import { cn } from '@/lib/utils';

export interface AtlasShellProps {
  panelHeader: ReactNode;
  children: ReactNode;
  showVeil?: boolean;
  veilTitle?: string;
  veilSubtitle?: string;
  onMarkerClick?: (id: string) => void;
  centerContent?: boolean;
}

export const AtlasShell = forwardRef<AtlasMapHandle, AtlasShellProps>(
  (
    {
      panelHeader,
      children,
      showVeil = false,
      veilTitle = 'Where to, this time?',
      veilSubtitle = 'The map follows your plans as you type.',
      onMarkerClick,
      centerContent = true,
    },
    mapRef
  ) => {
    return (
      <div className="grid h-screen grid-cols-1 md:grid-cols-[460px_1fr]">
        <aside className="relative z-10 flex flex-col overflow-y-auto border-r border-line bg-paper-bright/45 shadow-[18px_0_60px_-48px_rgba(26,26,31,0.5)]">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_8%,rgba(255,255,255,0.35),transparent_38%),radial-gradient(circle_at_88%_92%,rgba(86,122,38,0.07),transparent_42%)]" />
          <div className="border-b border-line px-7 py-5">{panelHeader}</div>
          <div className="relative flex flex-1 flex-col px-7 py-8">
            <div className={cn('w-full', centerContent && 'my-auto')}>
              {children}
            </div>
          </div>
        </aside>

        <div className="relative hidden overflow-hidden md:block">
          <AtlasMap ref={mapRef} onMarkerClick={onMarkerClick} />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(70%_78%_at_0%_42%,rgba(239,234,224,0.86)_0%,rgba(239,234,224,0.34)_44%,transparent_72%),linear-gradient(90deg,rgba(239,234,224,0.2),transparent_42%)]" />
          <div
            className={cn(
              'pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(248,244,236,0.94),rgba(239,234,224,0.78)_48%,rgba(86,122,38,0.28))] transition-opacity duration-700',
              showVeil ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="text-center text-ink">
              <CompassRose className="mx-auto animate-spin-slow" size={64} />
              <h2 className="mt-3 font-serif text-3xl font-medium">
                {veilTitle}
              </h2>
              <p className="mt-1.5 text-ink-soft">{veilSubtitle}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
AtlasShell.displayName = 'AtlasShell';
