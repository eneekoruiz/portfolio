'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * useLenis
 * Initializes Lenis smooth scroll when ready
 * @param ready - Whether the page is ready for smooth scroll
 * @param reduced - Whether user prefers reduced motion
 */
export function useLenis(ready: boolean, reduced: boolean): void {
  useEffect(() => {
    if (!ready || reduced) return;

    let lenis: any;

    import('lenis')
      .then(({ default: Lenis }) => {
        lenis = new Lenis({
          duration: 1.25,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          gestureOrientation: 'both',
        });

        // Expose for modal scroll lock
      (window as any).__lenis = lenis;

      const raf = (t: number) => {
          lenis.raf(t);
          requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((t: number) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      })
      .catch(() => {
        // Silently fail if Lenis cannot be loaded
      });

    return () => {
      lenis?.destroy?.();
    };
  }, [ready, reduced]);
}
