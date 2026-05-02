'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function SmoothScroll() {
  const tickerFnRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 0.68,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: 'vertical',
      gestureOrientation: 'both',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.35,
      autoRaf: false,
    });

    (window as any).__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    tickerFnRef.current = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFnRef.current);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
        tickerFnRef.current = null;
      }
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return null;
}