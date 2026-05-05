'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * IDENTITY SPLASH — Pantalla de bienvenida con animación de caracteres
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * POSICIÓN EN EL FLUJO: phase === 'splash' (entre Preloader y contenido)
 *
 * FIXES aplicados:
 *  - z-index elevado a 9998 para estar por encima de todo excepto el cursor
 *    (9999) y el Preloader (9999). Antes podía quedar debajo del contenido
 *    si visibility:hidden no se aplicaba a tiempo.
 *  - gsap.context() con cleanup .revert() para evitar fugas de memoria
 *    en React Strict Mode (doble ejecución de useEffect en desarrollo).
 *  - Los estados iniciales de los .char se fijan con gsap.set() DENTRO
 *    del contexto, no con clases Tailwind, para garantizar consistencia
 *    aunque el componente se monte dos veces.
 *  - FIX Punto 4: onComplete ya NO se pasa al constructor del timeline.
 *    Solo se llama UNA vez, al final del timeline, mediante .add().
 *    Antes se disparaba dos veces (constructor + .add()), causando
 *    un doble setState en el padre.
 *  - Timeline fluido: las duraciones y eases están calibradas para
 *    evitar tirones entre pasos.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Lang } from '../../lib/types';

const WELCOME_TEXT: Record<Lang, string> = {
  es: 'Bienvenido',
  en: 'Welcome',
  eu: 'Ongi etorri',
  fr: 'Bienvenue',
  it: 'Benvenuto',
  de: 'Willkommen',
  pt: 'Bem-vindo',
  ca: 'Benvingut',
  gl: 'Benvido',
  ja: 'ようこそ',
};

interface IdentitySplashProps {
  onComplete: () => void;
  onReveal:   () => void;
  lang:       Lang;
  /** Si es false, el splash está montado pero esperando para empezar su animación */
  active:     boolean;
}

export function IdentitySplash({ onComplete, onReveal, lang, active }: IdentitySplashProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef      = useRef<HTMLDivElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);

  // Stable refs to prevent stale closures in the timeline
  const onCompleteRef = useRef(onComplete);
  const onRevealRef   = useRef(onReveal);
  onCompleteRef.current = onComplete;
  onRevealRef.current   = onReveal;

  const word = WELCOME_TEXT[lang] ?? 'Welcome';
  useEffect(() => {
    if (!textRef.current || !lineRef.current || !containerRef.current) return;

    if (!active) {
      const ctx = gsap.context(() => {
        const chars = textRef.current!.querySelectorAll<HTMLElement>('.char');
        gsap.set(chars,           { yPercent: 110, opacity: 0 });
        gsap.set(lineRef.current, { scaleX: 0 });
      });
      return () => ctx.revert();
    }

    const ctx = gsap.context(() => {
      const chars = textRef.current!.querySelectorAll<HTMLElement>('.char');

      // ── Timeline de entrada + salida ───────────────────────────────────
      const tl = gsap.timeline();

      tl
        .to(lineRef.current, {
          scaleX: 1, duration: 0.35, ease: 'power3.out',
        })
        .to(chars, {
          yPercent: 0, opacity: 1,
          stagger: 0.025, duration: 0.48, ease: 'power3.out',
        }, '-=0.15')
        .to(lineRef.current, {
          scaleX: 0, duration: 0.3, ease: 'power3.in',
        }, '-=0.40')
        .to({}, { duration: 0.35 })
        .to(chars, {
          yPercent: -120, opacity: 0,
          stagger: 0.02, duration: 0.3, ease: 'power3.in',
        })
        .add(() => {
          onRevealRef.current?.();
        }, '-=0.1')
        .to(containerRef.current, {
          yPercent: -100, duration: 0.65, ease: 'power3.out',
        }, '<')
        .add(() => {
          onCompleteRef.current?.();
        });

    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]); // Re-ejecutar cuando active pase a true

  return (
    <div
      ref={containerRef}
      // z-[9998]: por encima de contenido
      className="fixed inset-0 z-[9998] bg-black text-white flex flex-col items-center justify-center"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center">
        {/*
          Máscara de overflow: las letras "nacen" subiendo desde abajo
        */}
        <div className="overflow-hidden pb-2 mb-8">
          <div ref={textRef} className="flex">
            {word.split('').map((char, i) => (
              <span
                key={i}
                className="char font-black text-[clamp(4rem,10vw,8.5rem)] tracking-[-0.05em] leading-none inline-block gpu-accelerated"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        </div>

        {/* Línea animada + nombre */}
        <div className="flex items-center gap-6">
          <div className="h-[1px] w-12 bg-white/10 rounded-full overflow-hidden">
            <div
              ref={lineRef}
              className="h-full w-full bg-brand origin-center"
            />
          </div>
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/40 font-bold">
            Eneko Ruiz
          </span>
        </div>
      </div>
    </div>
  );
}
