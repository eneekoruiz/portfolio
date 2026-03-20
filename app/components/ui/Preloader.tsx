'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  useEffect(() => {
    let v = 0;
    const tick = () => {
      v += Math.random() * 3.5 + 0.8;
      if (v >= 100) {
        setN(100);
        setTimeout(() => {
          if (reduced) { onDone(); return; }
          gsap.to(ref.current, { yPercent: -105, duration: .75, ease: 'power4.inOut', onComplete: onDone });
        }, 320);
        return;
      }
      setN(Math.round(v));
      setTimeout(tick, 22 + Math.random() * 16);
    };
    setTimeout(tick, 60);
  }, []); // eslint-disable-line

  return (
    <div ref={ref} className="loader" aria-live="polite">
      <div className="loader-num" style={{ fontSize: 'clamp(7rem,22vw,18rem)' }}>{n}</div>
      <p className="text-[10px] font-bold tracking-[.22em] uppercase text-lead mt-2">LOADING</p>
      <div className="loader-bar" style={{ width: `${n}%` }} />
    </div>
  );
}
