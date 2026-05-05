'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PREMIUM PRELOADER — Minimalist high-fidelity reveal
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ESTÉTICA:
 *   - Fondo negro puro con ruido orgánico (vía globals.css)
 *   - Tipografía masiva con tracking negativo y efecto "shimmer"
 *   - Progreso visual mediante una línea ultra-fina y resplandor radial
 *   - Transición de salida tipo "Cinematic Zoom & Fade"
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const barContainerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const exitFired = useRef(false);

  // Stable ref to onDone
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // ── Counter Logic (High precision) ──────────────────────────────────────
  useEffect(() => {
    let v = 0;
    let rafId: number;

    const tick = () => {
      // Random but smooth increments
      const inc = Math.random() * 3 + 1;
      v += inc;
      
      if (v >= 100) {
        setN(100);
        // Small delay to let the user see "100%" before exit
        setTimeout(() => playExit(), 150);
        return;
      }
      
      setN(Math.round(v));
      rafId = requestAnimationFrame(() => {
        setTimeout(tick, 20 + Math.random() * 15);
      });
    };

    tick();
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // ── Exit Animation (Cinematic & Premium) ──────────────────────────────
  const playExit = useCallback(() => {
    if (exitFired.current) return;
    exitFired.current = true;

    const tl = gsap.timeline({
      onComplete: () => onDoneRef.current(),
    });

    tl
      // 1. Zoom and fade out the UI elements
      .to([numRef.current, barContainerRef.current], {
        scale: 1.1,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.inOut',
        stagger: 0.1,
      })
      // 2. Light pulse
      .to(lightRef.current, {
        scale: 2,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      }, '-=0.3')
      // 3. Fade entire container
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      }, '-=0.2');
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-page text-ink overflow-hidden"
    >
      {/* ── Ambient Light (Follows progress) ── */}
      <div
        ref={lightRef}
        className="absolute pointer-events-none rounded-full opacity-30"
        style={{
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(0,102,255,0.15) 0%, transparent 70%)',
          filter: 'blur(100px)',
          transform: `scale(${0.8 + (n / 100) * 0.4})`,
        }}
      />

      {/* ── Main Counter ── */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          ref={numRef}
          className="font-black text-[clamp(6rem,18vw,14rem)] tracking-[-0.06em] leading-none mb-4 select-none gpu-accelerated"
        >
          {n.toString().padStart(2, '0')}
        </div>

        {/* ── Progress Bar (Minimalist) ── */}
        <div 
          ref={barContainerRef}
          className="flex flex-col items-center gap-4 opacity-50"
        >
          <div className="w-48 h-[1px] bg-ink/10 relative overflow-hidden">
            <div
              ref={barRef}
              className="absolute inset-0 bg-ink origin-left"
              style={{ 
                transform: `scaleX(${n / 100})`,
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
              }}
            />
          </div>
          
          <div className="flex items-center gap-3">
             <span className="font-mono text-[9px] tracking-[0.5em] uppercase opacity-40 font-bold">
               {n < 100 ? 'System Loading' : 'Complete'}
             </span>
             <div className={`w-1 h-1 rounded-full bg-brand ${n < 100 ? 'animate-pulse' : ''}`} />
          </div>
        </div>
      </div>

      {/* ── Corner Indices (Premium Detail) ── */}
      <div className="absolute top-10 left-10 flex flex-col gap-1 opacity-20">
        <div className="w-8 h-px bg-ink" />
        <span className="font-mono text-[8px] tracking-[0.2em] uppercase">Eneko Ruiz</span>
      </div>
      <div className="absolute bottom-10 right-10 flex items-center gap-4 opacity-20">
        <span className="font-mono text-[8px] tracking-[0.2em] uppercase">Est. 2026</span>
        <div className="w-8 h-px bg-ink" />
      </div>
    </div>
  );
}
