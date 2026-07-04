import { useEffect, useState } from 'react';

import { CompassRose } from '@/components/CompassRose';

const LINES = [
  'Consulting local friends…',
  'Reading the neighbourhood maps…',
  'Tasting the street food (twice)…',
  'Marking the good spots in ink…',
  'Waking up the free-tier server, this can take a moment…',
];

export function LoadingSequence() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setI((n) => (n + 1) % LINES.length);
    }, 2200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="py-16 text-center">
      <CompassRose className="mx-auto animate-spin-slow text-accent" size={48} />
      <p className="mt-4 min-h-[24px] font-serif text-lg text-ink-soft">
        {LINES[i]}
      </p>
    </div>
  );
}
