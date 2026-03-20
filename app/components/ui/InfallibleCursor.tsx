'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Premium Morphing Cursor — InfallibleCursor
 * • Solid dot (8px) + lagging ring (36px) via Lerp
 * • Shake: speed > 80 → burst to scale 4.5, elastic return
 * • Hover links/buttons: dot fades out, ring expands to 52px + glassmorphism
 * • SSR-safe: mounted-gate pattern
 * • z-index: 999999, will-change: transform
 */
export function InfallibleCursor() {
  const [mounted, setMounted] = useState(false);
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);

  // Lerp state refs (avoid re-renders)
  const mx = useRef(-300); const my = useRef(-300);
  const dx = useRef(-300); const dy = useRef(-300);
  const rx = useRef(-300); const ry = useRef(-300);
  const ringW   = useRef(36);
  const dotOpacity = useRef(1);
  const scale   = useRef(1);
  const targScale  = useRef(1);
  const isHover = useRef(false);
  const shakeTO = useRef<ReturnType<typeof setTimeout>>();
  const hasMoved = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!window.matchMedia('(pointer:fine)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX;
      my.current = e.clientY;

      if (!hasMoved.current) {
        hasMoved.current = true;
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
      }

      // Shake: combined movement > 80px
      const speed = Math.abs(e.movementX) + Math.abs(e.movementY);
      if (speed > 80) {
        targScale.current = 4.5;
        clearTimeout(shakeTO.current);
        shakeTO.current = setTimeout(() => { targScale.current = 1; }, 750);
      }
    };

    const onEnter = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('a,button,[data-h]')) return;
      isHover.current = true;
      // Ring → glass bubble
      ring.style.background     = 'rgba(0,102,255,0.07)';
      ring.style.backdropFilter = 'blur(10px) saturate(1.5)';
      ring.style.borderColor    = 'rgba(0,102,255,0.4)';
      ring.style.borderWidth    = '1px';
    };
    const onLeave = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('a,button,[data-h]')) return;
      isHover.current = false;
      ring.style.background     = 'transparent';
      ring.style.backdropFilter = '';
      ring.style.borderColor    = 'rgba(0,102,255,0.55)';
      ring.style.borderWidth    = '1.5px';
    };

    const animate = () => {
      // Lerp positions
      dx.current += (mx.current - dx.current) * 0.9;
      dy.current += (my.current - dy.current) * 0.9;
      rx.current += (mx.current - rx.current) * 0.12;
      ry.current += (my.current - ry.current) * 0.12;

      // Lerp ring size
      const targW = isHover.current ? 52 : 36;
      ringW.current += (targW - ringW.current) * 0.18;

      // Lerp dot opacity
      const targDotOp = isHover.current ? 0 : 1;
      dotOpacity.current += (targDotOp - dotOpacity.current) * 0.18;

      // Lerp scale
      scale.current += (targScale.current - scale.current) * 0.1;
      const s = scale.current;
      const w = ringW.current;

      dot.style.transform  = `translate3d(${dx.current - 4}px,${dy.current - 4}px,0) scale(${s})`;
      dot.style.opacity    = String(Math.max(0, dotOpacity.current));
      ring.style.transform = `translate3d(${rx.current - w / 2}px,${ry.current - w / 2}px,0) scale(${s})`;
      ring.style.width     = `${w}px`;
      ring.style.height    = `${w}px`;

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', onEnter, true);
    document.addEventListener('mouseleave', onLeave, true);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter, true);
      document.removeEventListener('mouseleave', onLeave, true);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(shakeTO.current);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          zIndex: 999999,
          pointerEvents: 'none',
          width: '8px', height: '8px',
          borderRadius: '9999px',
          background: '#0066ff',
          boxShadow: '0 0 14px rgba(0,102,255,0.65)',
          opacity: 0,
          willChange: 'transform, opacity',
          transition: 'opacity 0.08s',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          zIndex: 999998,
          pointerEvents: 'none',
          width: '36px', height: '36px',
          borderRadius: '9999px',
          border: '1.5px solid rgba(0,102,255,0.55)',
          background: 'transparent',
          opacity: 0,
          willChange: 'transform, width, height',
          transition: 'border-color 0.2s, background 0.2s, backdrop-filter 0.2s, border-width 0.15s',
        }}
      />
    </>
  );
}
