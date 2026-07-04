export interface GeocodeResult {
  label: string;
  lat: number;
  lng: number;
}

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

function formatLabel(p: PhotonFeature['properties']): string {
  return [p.name, p.city, p.state, p.country].filter(Boolean).join(', ');
}

// Photon (komoot) is a free, keyless geocoder built for search-as-you-type use.
export async function searchDestinations(
  query: string,
  signal?: AbortSignal
): Promise<GeocodeResult[]> {
  if (query.trim().length < 2) return [];

  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&layer=city&layer=locality`;
  const resp = await fetch(url, { signal });

  if (!resp.ok) return [];

  const data = await resp.json();
  const features: PhotonFeature[] = data.features || [];

  return features.map((f) => ({
    label: formatLabel(f.properties),
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
  }));
}
