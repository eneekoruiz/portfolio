'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PRELOADER — Terminal-style loading with grid, blue glow & text expansion exit
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ESTÉTICA:
 *   - Cuadrícula de fondo (grid lines) visible a 0.06/0.10 opacity
 *   - Resplandor azul pulsante detrás del porcentaje (--brand color)
 *   - Barra de progreso animada bajo los mensajes técnicos
 *
 * ANIMACIÓN DE SALIDA (Professional Slide):
 *   Cuando el contador llega a 100%, se dispara un timeline GSAP secuencial:
 *     1. El mensaje técnico y la barra se desvanecen rápidamente
 *     2. El porcentaje hace un ligero scale + fade out elegante
 *     3. El contenedor entero se desliza hacia arriba (yPercent: -100)
 *     4. onDone() se llama al final del slide
 *
 * FIX: Se elimina el setTimeout que causaba desincronización entre el
 *      fin del conteo y la animación de salida.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

const TECH_MESSAGES = [
  'Initialising Data Streams...',
  'Compiling MVC Logic...',
  'Mapping Semantic DOM...',
  'Bootstrapping Firebase SDK...',
  'Hydrating React Tree...',
  'Resolving Mongoose Refs...',
  'Validating Bcrypt Salts...',
  'Mounting ScrollTrigger...',
  'Parsing Atomic Transactions...',
  'Calibrating GSAP Timeline...',
  'Injecting WCAG 2.1 Layer...',
  'Warming JAX-WS Endpoints...',
  'System Ready.',
];

export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const exitFired = useRef(false);

  // Stable ref to onDone so the counter effect doesn't re-trigger
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // ── Rotating tech messages ─────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setMsgIdx(i => (i + 1) % (TECH_MESSAGES.length - 1));
    }, 280);
    return () => clearInterval(id);
  }, []);

  // ── Pulsing glow animation (loops while loading) ──────────────────────
  useEffect(() => {
    if (!glowRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(glowRef.current,
        { scale: 1, opacity: 0.4 },
        {
          scale: 1.35, opacity: 0.7,
          duration: 1.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // ── Exit animation — fires exactly when counter reaches 100% ──────────
  const playExit = useCallback(() => {
    if (exitFired.current) return;
    exitFired.current = true;

    const tl = gsap.timeline({
      onComplete: () => onDoneRef.current(),
    });

    tl
      // 1. Tech message & progress bar fade out fast
      .to([textRef.current, barRef.current], {
        opacity: 0,
        y: -10,
        duration: 0.2,
        stagger: 0.05,
        ease: 'power2.in',
      })
      // 2. Number fades out with a subtle scale up (not massive)
      .to(numRef.current, {
        scale: 1.15,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
      }, '-=0.1')
      // 3. Glow fades out
      .to(glowRef.current, {
        opacity: 0,
        scale: 1.5,
        duration: 0.3,
        ease: 'power2.inOut',
      }, '<')
      // 4. Elegant slide up of the entire container (more fluid transition to splash)
      .to(containerRef.current, {
        yPercent: -100,
        duration: 0.65,
        ease: 'power4.inOut',
      }, '-=0.15');
  }, []);

  // ── Counter logic ─────────────────────────────────────────────────────
  useEffect(() => {
    let v = 0;
    let rafId: number;

    const tick = () => {
      v += Math.random() * 4 + 1.5;
      if (v >= 100) {
        setN(100);
        setMsgIdx(TECH_MESSAGES.length - 1);
        // Trigger exit on next frame so React has painted the "100%"
        rafId = requestAnimationFrame(() => playExit());
        return;
      }
      setN(Math.round(v));
      setTimeout(tick, 18 + Math.random() * 12);
    };

    setTimeout(tick, 30);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [playExit]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-page text-ink overflow-hidden"
    >
      {/* ── Grid background ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.10]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Scanline overlay for tech feel ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)',
        }}
      />

      {/* ── Blue glow (pulsing) ── */}
      <div
        ref={glowRef}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '220px',
          height: '220px',
          background: 'radial-gradient(circle, rgba(var(--brand-rgb), 0.6) 0%, rgba(var(--brand-rgb), 0.2) 45%, transparent 70%)',
          filter: 'blur(40px)',
          opacity: 0.4,
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Percentage number */}
        <div
          ref={numRef}
          className="font-black text-[clamp(4rem,12vw,11rem)] tracking-[-0.04em] leading-none origin-center select-none"
          style={{ willChange: 'transform, opacity' }}
        >
          {n}%
        </div>

        {/* Tech message + progress bar */}
        <div className="flex flex-col items-center gap-3">
          <p
            ref={textRef}
            className="font-mono text-[10px] tracking-[0.4em] uppercase text-lead font-bold"
          >
            {TECH_MESSAGES[msgIdx]}
          </p>

          {/* Progress bar */}
          <div
            ref={barRef}
            className="w-36 h-[2px] bg-black/5 dark:bg-white/5 relative overflow-hidden rounded-full"
          >
            <div
              className="absolute inset-0 origin-left transition-transform duration-100 ease-out rounded-full"
              style={{
                transform: `scaleX(${n / 100})`,
                background: `linear-gradient(90deg, rgba(var(--brand-rgb), 0.6), rgba(var(--brand-rgb), 1))`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Corner markers (tech aesthetic) ── */}
      <div className="absolute top-6 left-6 w-5 h-5 border-l border-t border-current opacity-[0.08] dark:opacity-[0.12]" />
      <div className="absolute top-6 right-6 w-5 h-5 border-r border-t border-current opacity-[0.08] dark:opacity-[0.12]" />
      <div className="absolute bottom-6 left-6 w-5 h-5 border-l border-b border-current opacity-[0.08] dark:opacity-[0.12]" />
      <div className="absolute bottom-6 right-6 w-5 h-5 border-r border-b border-current opacity-[0.08] dark:opacity-[0.12]" />

      {/* ── Bottom status line ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-40">
        <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
        <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-lead font-bold">
          SYS.BOOT
        </span>
      </div>
    </div>
  );
}
