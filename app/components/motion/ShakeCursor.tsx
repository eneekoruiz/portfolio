'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Premium Morphing Cursor
 * - Solid dot (8px) + trailing ring (36px)
 * - On hover: dot shrinks/hides, ring expands with glassmorphism
 * - Shake gesture: scale burst via ref interpolation
 * - SSR-safe: mounted-gate pattern
 * - z-[999999] — above everything
 */
export function ShakeCursor() {
  const [mounted, setMounted] = useState(false);

  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const mouseRef = useRef({ x: -300, y: -300 });
  const dotPos   = useRef({ x: -300, y: -300 });
  const ringPos  = useRef({ x: -300, y: -300 });
  const ringSize = useRef(36);
  const targRing = useRef(36);
  const dotAlpha = useRef(1);
  const targDotA = useRef(1);
  const scaleRef = useRef(1);
  const targScale= useRef(1);
  const shakeTO  = useRef<ReturnType<typeof setTimeout>>();
  const isGlass  = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!window.matchMedia('(pointer:fine)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let hasMovedOnce = false;

    /* ── Mouse tracking ── */
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      if (!hasMovedOnce) {
        hasMovedOnce = true;
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
      }
      // Shake detection
      const spd = Math.abs(e.movementX) + Math.abs(e.movementY);
      if (spd > 32) {
        targScale.current = 2.8;
        clearTimeout(shakeTO.current);
        shakeTO.current = setTimeout(() => { targScale.current = 1; }, 700);
      }
    };

    /* ── Hover: dot vanishes, ring becomes glass bubble ── */
    const onEnter = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('a,button,[data-h]')) return;
      isGlass.current = true;
      targRing.current = 52;
      targDotA.current = 0;
      // Apply glassmorphism style
      ring.style.background     = 'rgba(0,102,255,0.06)';
      ring.style.backdropFilter = 'blur(8px)';
      ring.style.borderColor    = 'rgba(0,102,255,0.35)';
      ring.style.borderWidth    = '1px';
    };
    const onLeave = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('a,button,[data-h]')) return;
      isGlass.current = false;
      targRing.current = 36;
      targDotA.current = 1;
      // Restore solid ring
      ring.style.background     = 'transparent';
      ring.style.backdropFilter = '';
      ring.style.borderColor    = 'rgba(0,102,255,0.5)';
      ring.style.borderWidth    = '1.5px';
    };

    /* ── 144fps rAF loop — direct DOM mutation ── */
    const animate = () => {
      const m  = mouseRef.current;
      const dp = dotPos.current;
      const rp = ringPos.current;

      // Lerp positions
      dp.x += (m.x - dp.x) * 0.88;
      dp.y += (m.y - dp.y) * 0.88;
      rp.x += (m.x - rp.x) * 0.12;
      rp.y += (m.y - rp.y) * 0.12;

      // Lerp ring size
      ringSize.current += (targRing.current - ringSize.current) * 0.18;
      // Lerp dot alpha
      dotAlpha.current += (targDotA.current - dotAlpha.current) * 0.18;
      // Lerp scale
      scaleRef.current += (targScale.current - scaleRef.current) * 0.09;

      const s = scaleRef.current;
      const rs = ringSize.current;
      const rOff = rs / 2;

      // Apply transforms — dot centered on cursor (offset by half of 8px = 4px)
      dot.style.transform  = `translate3d(${dp.x - 4}px,${dp.y - 4}px,0) scale(${s})`;
      dot.style.opacity    = String(dotAlpha.current);
      ring.style.width     = `${rs}px`;
      ring.style.height    = `${rs}px`;
      ring.style.transform = `translate3d(${rp.x - rOff}px,${rp.y - rOff}px,0) scale(${s})`;

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
      {/* Solid dot */}
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
          boxShadow: '0 0 12px rgba(0,102,255,0.6)',
          opacity: 0,
          willChange: 'transform, opacity',
          transition: 'opacity 0.1s',
        }}
      />
      {/* Trailing ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          zIndex: 999998,
          pointerEvents: 'none',
          width: '36px', height: '36px',
          borderRadius: '9999px',
          border: '1.5px solid rgba(0,102,255,0.5)',
          background: 'transparent',
          opacity: 0,
          willChange: 'transform, width, height',
          transition: 'border-color 0.2s, background 0.2s, backdrop-filter 0.2s, border-width 0.2s',
        }}
      />
    </>
  );
}
