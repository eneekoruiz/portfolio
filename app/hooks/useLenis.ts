'use client';

/**
 * useLenis — Smooth scroll via Lenis + GSAP ticker
 * ─────────────────────────────────────────────────
 * FIX CRÍTICO: eliminado el bucle requestAnimationFrame() manual.
 * Antes, Lenis se tickeaba DOS veces por frame:
 *   1. vía requestAnimationFrame(raf)
 *   2. vía gsap.ticker.add()
 * Esto causaba que cada frame de scroll ejecutara lenis.raf() dos veces,
 * duplicando el desplazamiento calculado → tirones/jank visible.
 *
 * La solución correcta es usar EXCLUSIVAMENTE gsap.ticker como driver,
 * que ya corre en sincronía con rAF internamente.
 *
 * FIX SECUNDARIO: la función tickerFn se guarda en una ref para poder
 * pasarla exactamente a gsap.ticker.remove() en el cleanup, evitando
 * que los tickers se acumulen en re-renders.
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function useLenis(ready: boolean, reduced: boolean): void {
  // Guardamos la referencia de la fn del ticker para poder limpiarla
  const tickerFnRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    if (!ready || reduced) return;

    let lenis: Lenis;

    import('lenis')
      .then(({ default: Lenis }) => {
        lenis = new Lenis({
          // Duración más corta para una sensación más directa
          duration:           0.92,
          easing:             (t: number) => 1 - Math.pow(1 - t, 3),
          smoothWheel:        true,
          gestureOrientation: 'both',
          // Syncronizar con GSAP ticker para evitar doble tick
          autoRaf: false,
        });

        // Exponer globalmente para el lock de scroll de modales
        window.__lenis = lenis;

        /**
         * ✅ ÚNICO driver: gsap.ticker
         * gsap.ticker corre internamente en rAF, por lo que Lenis
         * se actualiza exactamente UNA vez por frame, en sincronía
         * perfecta con todas las animaciones de ScrollTrigger.
         *
         * gsap.ticker.time está en segundos → multiplicar por 1000 para ms
         */
        tickerFnRef.current = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tickerFnRef.current);

        // lagSmoothing(0) previene que GSAP "salte" frames tras pérdida de foco
        gsap.ticker.lagSmoothing(0);

        // Actualizar ScrollTrigger en cada evento de scroll de Lenis
        lenis.on('scroll', ScrollTrigger.update);
      })
      .catch(() => {
        // Si Lenis no carga (SSR, red, etc.) el scroll nativo sigue funcionando
      });

    return () => {
      // ✅ Limpiar el ticker con la referencia exacta de la función
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
        tickerFnRef.current = null;
      }
      lenis?.destroy?.();
      delete window.__lenis;
    };
  }, [ready, reduced]);
}
