'use client';

export function DNAHelix({ accent, secondary, darkMode }: { accent: string; secondary: string; darkMode: boolean }) {
  const W = 120, H = 1200, steps = 80;
  const strandA: string[] = [];
  const strandB: string[] = [];
  const rungs: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 6;
    const y = (i / steps) * H;
    const xA = W / 2 + Math.sin(t) * (W * 0.38);
    const xB = W / 2 + Math.sin(t + Math.PI) * (W * 0.38);
    strandA.push(`${i === 0 ? 'M' : 'L'} ${xA.toFixed(2)} ${y.toFixed(2)}`);
    strandB.push(`${i === 0 ? 'M' : 'L'} ${xB.toFixed(2)} ${y.toFixed(2)}`);
    if (i % 4 === 0 && i > 0 && i < steps) {
      rungs.push({ x1: xA, y1: y, x2: xB, y2: y });
    }
  }

  return (
    <svg className="helix-svg w-full h-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <filter id="helix-glow" x="-50%" y="-5%" width="200%" height="110%">
          <feGaussianBlur stdDeviation={darkMode ? '3' : '1.5'} result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="strand-grad-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.1" />
          <stop offset="40%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="60%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="strand-grad-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={secondary} stopOpacity="0.05" />
          <stop offset="50%" stopColor={secondary} stopOpacity="0.5" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path className="helix-strand-a" d={strandA.join(' ')} fill="none" stroke="url(#strand-grad-a)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" filter="url(#helix-glow)" />
      <path className="helix-strand-b" d={strandB.join(' ')} fill="none" stroke="url(#strand-grad-b)" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
      {rungs.map((r, i) => (
        <g key={i}>
          <line className="helix-rung" x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke={accent} strokeWidth="0.35" opacity="0.25" strokeDasharray="1.5 1.5" />
          <circle cx={(r.x1 + r.x2) / 2} cy={r.y1} r="0.8" fill={i % 3 === 0 ? accent : secondary} opacity="0.35" />
        </g>
      ))}
    </svg>
  );
}