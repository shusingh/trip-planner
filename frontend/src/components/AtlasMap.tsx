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
  initialPitch?: number;
  initialBearing?: number;
  onMarkerClick?: (id: string) => void;
}

export const AtlasMap = forwardRef<AtlasMapHandle, AtlasMapProps>(
  (
    {
      className,
      initialCenter = [135.7681, 35.0116],
      initialZoom = 14.8,
      initialPitch = 48,
      initialBearing = -18,
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
        pitch: initialPitch,
        bearing: initialBearing,
        attributionControl: false,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
      mapRef.current = map;

      map.on('load', () => {
        ['poi_label', 'place_label_other', 'place_label_city', 'road_label'].forEach((id) => {
          if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', 'none');
        });

        const labelLayerId = map
          .getStyle()
          .layers?.find(
            (layer) =>
              layer.type === 'symbol' &&
              layer.layout &&
              'text-field' in layer.layout
          )?.id;

        if (map.getSource('openmaptiles') && !map.getLayer('michi-3d-buildings')) {
          map.addLayer(
            {
              id: 'michi-3d-buildings',
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

    // Only one popup should be open at a time; close any others (optionally
    // sparing the one being opened) before showing a new one.
    const closeAllPopups = (exceptId?: string) => {
      markersRef.current.forEach((marker, id) => {
        if (exceptId && id === exceptId) return;
        const popup = marker.getPopup();
        if (popup && popup.isOpen()) popup.remove();
      });
    };

    useImperativeHandle(ref, () => ({
      flyTo(center, zoom = 10) {
        mapRef.current?.flyTo({ center, zoom, pitch: 62, bearing: -28, duration: 2000 });
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
            num.style.font = '700 12px Hanken Grotesk, sans-serif';
            el.appendChild(num);

            el.addEventListener('click', () => {
              // MapLibre toggles this marker's own popup; make sure every
              // other popup closes so only one stays open.
              closeAllPopups(place.id);
              onMarkerClick?.(place.id);
            });

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

        // Pitch and bearing must ride along in the same fitBounds call; a
        // separate easeTo afterwards starts a second camera animation from the
        // pre-fit position and cancels the pan, stranding the map on its
        // initial center (the "results are Paris but the map shows Kyoto" bug).
        const frame = () =>
          map.fitBounds(bounds, {
            padding: 80,
            maxZoom: 14,
            pitch: 62,
            bearing: -28,
            duration: 1600,
          });

        // A freshly mounted map may not have its style ready yet; a fitBounds
        // issued before load can be dropped, so defer until it is.
        if (map.loaded()) frame();
        else map.once('load', frame);
      },
      focusMarker(id) {
        const map = mapRef.current;
        const marker = markersRef.current.get(id);
        if (!map || !marker) return;

        closeAllPopups();
        const lngLat = marker.getLngLat();
        map.flyTo({ center: lngLat, zoom: 14, pitch: 66, bearing: -28, duration: 1100 });
        setTimeout(() => {
          const popup = marker.getPopup();
          if (popup && !popup.isOpen()) marker.togglePopup();
        }, 1100);
      },
    }));

    return <div ref={containerRef} className={cn('h-full w-full', className)} />;
  }
);
AtlasMap.displayName = 'AtlasMap';
