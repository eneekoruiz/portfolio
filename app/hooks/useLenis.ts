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

export function useLenis(ready: boolean, reduced: boolean): void {
  // Guardamos la referencia de la fn del ticker para poder limpiarla
  const tickerFnRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    if (!ready || reduced) return;

    let lenis: any;

    import('lenis')
      .then(({ default: Lenis }) => {
        lenis = new Lenis({
          // Duración ligeramente reducida (1.25→1.05) para sensación más snappy
          duration:           1.05,
          easing:             (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel:        true,
          gestureOrientation: 'vertical',
          // Syncronizar con GSAP ticker para evitar doble tick
          autoRaf: false,
        });

        // Exponer globalmente para el lock de scroll de modales
        (window as any).__lenis = lenis;

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
      delete (window as any).__lenis;
    };
  }, [ready, reduced]);
}
