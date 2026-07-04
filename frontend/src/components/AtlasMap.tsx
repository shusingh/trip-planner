import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { cn } from '@/lib/utils';

// OpenFreeMap is a free, keyless vector-tile provider (no API key, unlimited).
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

export interface AtlasMarker {
  id: string;
  lat: number;
  lng: number;
  color: string;
  label: string;
  title: string;
  description?: string;
}

export interface AtlasMapHandle {
  flyTo: (center: [number, number], zoom?: number) => void;
  setMarkers: (markers: AtlasMarker[]) => void;
  fitToMarkers: (markers: AtlasMarker[]) => void;
  focusMarker: (id: string) => void;
}

export interface AtlasMapProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  onMarkerClick?: (id: string) => void;
}

export const AtlasMap = forwardRef<AtlasMapHandle, AtlasMapProps>(
  (
    {
      className,
      initialCenter = [15, 25],
      initialZoom = 1.6,
      onMarkerClick,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

    useEffect(() => {
      if (!containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: initialCenter,
        zoom: initialZoom,
        attributionControl: false,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
      mapRef.current = map;

      // SPA route transitions can leave the canvas sized from a stale layout
      // pass; keep it in sync with its container explicitly.
      const resizeObserver = new ResizeObserver(() => map.resize());
      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
        map.remove();
        mapRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      flyTo(center, zoom = 10) {
        mapRef.current?.flyTo({ center, zoom, duration: 2000 });
      },
      setMarkers(markers) {
        markersRef.current.forEach((m) => m.remove());
        markersRef.current.clear();

        const map = mapRef.current;
        if (!map) return;

        markers.forEach((place, i) => {
          setTimeout(() => {
            const el = document.createElement('div');
            el.style.width = '30px';
            el.style.height = '30px';
            el.style.borderRadius = '50% 50% 50% 0';
            el.style.transform = 'rotate(-45deg)';
            el.style.background = place.color;
            el.style.display = 'flex';
            el.style.alignItems = 'center';
            el.style.justifyContent = 'center';
            el.style.boxShadow = '0 3px 8px rgba(0,0,0,.3)';
            el.style.cursor = 'pointer';

            const num = document.createElement('b');
            num.textContent = place.label;
            num.style.transform = 'rotate(45deg)';
            num.style.color = '#fff';
            num.style.font = '700 12px Inter, sans-serif';
            el.appendChild(num);

            el.addEventListener('click', () => onMarkerClick?.(place.id));

            const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
              .setLngLat([place.lng, place.lat])
              .setPopup(
                new maplibregl.Popup({ offset: 24 }).setHTML(
                  `<strong>${place.title}</strong>${place.description ? `<br/>${place.description}` : ''}`
                )
              )
              .addTo(map);

            markersRef.current.set(place.id, marker);
          }, i * 120);
        });
      },
      fitToMarkers(markers) {
        const map = mapRef.current;
        if (!map || markers.length === 0) return;

        const bounds = new maplibregl.LngLatBounds();
        markers.forEach((m) => bounds.extend([m.lng, m.lat]));
        map.fitBounds(bounds, { padding: 80, duration: 1600, maxZoom: 14 });
      },
      focusMarker(id) {
        const map = mapRef.current;
        const marker = markersRef.current.get(id);
        if (!map || !marker) return;

        const lngLat = marker.getLngLat();
        map.flyTo({ center: lngLat, zoom: 14, duration: 1100 });
        setTimeout(() => marker.togglePopup(), 1100);
      },
    }));

    return <div ref={containerRef} className={cn('h-full w-full', className)} />;
  }
);
AtlasMap.displayName = 'AtlasMap';
