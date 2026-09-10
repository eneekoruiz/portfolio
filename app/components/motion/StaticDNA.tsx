"use client";

// The same double-strand silhouette survives paused motion or unavailable WebGL.
// SVG keeps the identity visible without a render loop or an image request.
const pairs = Array.from({ length: 52 }, (_, i) => {
  const y = i * 16;
  const x = Math.sin((i / 51) * Math.PI * 6) * 90;
  return { x, y };
});
const strand = (direction: number) =>
  pairs
    .map(({ x, y }, i) => `${i ? "L" : "M"}${150 + x * direction},${y}`)
    .join(" ");

export function StaticDNA() {
  return (
    <svg
      data-dna-static
      aria-hidden="true"
      viewBox="0 0 300 820"
      className="dna-static absolute right-[8%] top-1/2 h-[110%] w-[min(65vw,480px)] -translate-y-1/2 -rotate-12"
      fill="none"
    >
      {pairs.map(({ x, y }, i) => (
        <g key={i}>
          <path
            d={`M${150 + x},${y}H${150 - x}`}
            stroke="var(--lead)"
            strokeOpacity="0.35"
          />
          <circle cx={150 + x} cy={y} r="3" fill="var(--brand)" />
          <circle cx={150 - x} cy={y} r="3" fill="var(--lead)" />
        </g>
      ))}
      <path d={strand(1)} stroke="var(--brand)" strokeWidth="2" />
      <path d={strand(-1)} stroke="var(--lead)" strokeWidth="2" />
    </svg>
  );
}
