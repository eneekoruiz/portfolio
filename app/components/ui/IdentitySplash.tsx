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
 *  - onComplete se pasa como dependencia estable (useCallback en el padre).
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
  lang:       Lang;
}

export function IdentitySplash({ onComplete, lang }: IdentitySplashProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef      = useRef<HTMLDivElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);

  const word = WELCOME_TEXT[lang] ?? 'Welcome';

  useEffect(() => {
    if (!textRef.current || !lineRef.current || !containerRef.current) return;

    /**
     * gsap.context() garantiza que:
     *  1. Todas las animaciones quedan registradas bajo este contexto.
     *  2. ctx.revert() en el cleanup las cancela y resetea, evitando
     *     la doble ejecución de animaciones en React Strict Mode.
     */
    const ctx = gsap.context(() => {
      const chars = textRef.current!.querySelectorAll<HTMLElement>('.char');

      // ── Fijar estados iniciales (pre-animación) ────────────────────────
      gsap.set(chars,           { yPercent: 110, opacity: 0 });
      gsap.set(lineRef.current, { scaleX: 0 });

      // ── Timeline de entrada + salida ───────────────────────────────────
      const tl = gsap.timeline({ onComplete });

      tl
        // 1. Línea crece desde el centro
        .to(lineRef.current, {
          scaleX: 1, duration: 0.34, ease: 'expo.inOut',
        })
        // 2. Letras suben y aparecen (máscara overflow:hidden del padre)
        .to(chars, {
          yPercent: 0, opacity: 1,
          stagger: 0.02, duration: 0.44, ease: 'power3.out',
        }, '-=0.2')
        // 3. Línea encoge
        .to(lineRef.current, {
          scaleX: 0, duration: 0.28, ease: 'expo.inOut',
        }, '-=0.55')
        // 4. Pausa de lectura
        .to({}, { duration: 0.32 })
        // 5. Letras salen hacia arriba
        .to(chars, {
          yPercent: -120, opacity: 0,
          stagger: 0.015, duration: 0.28, ease: 'power3.in',
        })
        // 6. Fade out del fondo
        .to(containerRef.current, {
          opacity: 0, duration: 0.28, ease: 'power2.inOut',
        }, '-=0.25');

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      // z-[9998]: por encima de contenido (visible gracias a visibility:hidden
      // en page.tsx) pero por debajo del cursor (z-[99999])
      className="fixed inset-0 z-[9998] bg-page text-ink flex flex-col items-center justify-center will-change-[opacity]"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center">
        {/*
          Máscara de overflow: las letras "nacen" subiendo desde abajo
          gracias a yPercent:110 inicial + overflow-hidden en el contenedor.
        */}
        <div className="overflow-hidden pb-2 mb-5">
          <div ref={textRef} className="flex">
            {word.split('').map((char, i) => (
              <span
                key={i}
                className="char font-black text-[clamp(3.5rem,8vw,7rem)] tracking-[-0.03em] leading-none inline-block will-change-transform"
                /* opacity:0 y yPercent:110 los fija gsap.set() en useEffect */
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        </div>

        {/* Línea animada + nombre */}
        <div className="flex items-center gap-4">
          <div className="h-[2px] w-10 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              ref={lineRef}
              className="h-full w-full bg-brand origin-center will-change-transform"
              /* scaleX:0 lo fija gsap.set() en useEffect */
            />
          </div>
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-lead font-bold">
            Eneko Ruiz
          </span>
        </div>
      </div>
    </div>
  );
}
