// Fetches a representative photo for a place by name using Wikipedia's public
// API. Keyless and CORS-enabled (origin=*), in keeping with the app's free-tier
// stack (OpenFreeMap tiles, Photon geocoding).

interface WikiPage {
  index: number;
  title: string;
  thumbnail?: { source: string };
}

// Resolved results are cached for the session; `null` means "looked up, none
// found" so we don't re-fetch known misses.
const cache = new Map<string, string | null>();

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'of',
  'and',
  'at',
  'in',
  'on',
  'near',
  'hidden',
  'local',
  'tucked',
  'away',
  'best',
  'famous',
  'old',
  'new',
  'little',
]);

function significantWords(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word));
}

// Guards against the search returning a confidently-wrong photo: the matched
// article title should share at least one meaningful word with the place name,
// otherwise we prefer a fallback tile over a misleading image.
function isRelevant(query: string, title: string): boolean {
  const queryWords = significantWords(query);
  if (queryWords.length === 0) return false;
  const titleWords = new Set(significantWords(title));
  return queryWords.some((word) => titleWords.has(word));
}

export async function fetchPlaceImage(
  name: string,
  signal?: AbortSignal
): Promise<string | null> {
  const key = name.trim();
  if (!key) return null;
  if (cache.has(key)) return cache.get(key) ?? null;

  const url =
    'https://en.wikipedia.org/w/api.php' +
    '?action=query&format=json&origin=*' +
    '&generator=search&gsrlimit=1&gsrnamespace=0' +
    `&gsrsearch=${encodeURIComponent(key)}` +
    '&prop=pageimages&piprop=thumbnail&pithumbsize=320';

  try {
    const resp = await fetch(url, { signal });
    if (!resp.ok) throw new Error(`status ${resp.status}`);

    const data = await resp.json();
    const pages: WikiPage[] = Object.values(data?.query?.pages ?? {});
    const top = pages.sort((a, b) => a.index - b.index)[0];

    const source =
      top?.thumbnail?.source && isRelevant(key, top.title)
        ? top.thumbnail.source
        : null;

    cache.set(key, source);
    return source;
  } catch (error) {
    // Abort is expected when a card unmounts mid-flight; don't cache those.
    if ((error as Error).name !== 'AbortError') cache.set(key, null);
    return null;
  }
}
