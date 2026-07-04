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
    },
    mapRef
  ) => {
    return (
      <div className="grid h-screen grid-cols-1 md:grid-cols-[460px_1fr]">
        <aside className="flex flex-col overflow-y-auto border-r border-line bg-panel">
          <div className="border-b border-line px-7 py-5">{panelHeader}</div>
          <div className="flex flex-1 flex-col px-7 py-8">
            <div className="my-auto w-full">{children}</div>
          </div>
        </aside>

        <div className="relative hidden md:block">
          <AtlasMap ref={mapRef} onMarkerClick={onMarkerClick} />
          <div
            className={cn(
              'pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-accent-deep/90 to-accent-deep/65 transition-opacity duration-700',
              showVeil ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="text-center text-white">
              <CompassRose className="mx-auto animate-spin-slow" size={64} />
              <h2 className="mt-3 font-serif text-3xl font-semibold">
                {veilTitle}
              </h2>
              <p className="mt-1.5 text-white/80">{veilSubtitle}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
AtlasShell.displayName = 'AtlasShell';
