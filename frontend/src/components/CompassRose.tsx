export interface CompassRoseProps {
  size?: number;
  className?: string;
}

// A traditional 8-point compass rose, drawn to match the Atlas aesthetic
// (fine ink linework) rather than a generic circle-and-needle glyph.
export function CompassRose({ size = 56, className }: CompassRoseProps) {
  const spike = (rotate: number, opacity: number) => (
    <polygon
      fill="currentColor"
      fillOpacity={opacity}
      points="50,4 58,50 50,44 42,50"
      transform={`rotate(${rotate} 50 50)`}
    />
  );

  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 100 100"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" opacity="0.9" r="47" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="50" cy="50" opacity="0.45" r="39" stroke="currentColor" strokeWidth="1" />

      {[0, 90, 180, 270].map((deg) => (
        <g key={deg}>{spike(deg, 1)}</g>
      ))}
      {[45, 135, 225, 315].map((deg) => (
        <g key={deg}>{spike(deg, 0.45)}</g>
      ))}

      <circle cx="50" cy="50" fill="currentColor" r="3.5" />
    </svg>
  );
}
