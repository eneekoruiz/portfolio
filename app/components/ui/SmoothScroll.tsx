'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function SmoothScroll() {
  useEffect(() => {
    // 1. Inicializamos Lenis con una configuración premium
    const lenis = new Lenis({
      duration: 1.2, // El tiempo que tarda en frenar (mantequilla pura)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva de inercia
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2, // En táctil/móvil responde un poco más rápido
    });

    // 2. Sincronizamos Lenis con GSAP ScrollTrigger (¡Crucial para tus animaciones!)
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Desactiva el lag smoothing de GSAP para evitar conflictos de inercia
    gsap.ticker.lagSmoothing(0);

    // 3. Limpieza al desmontar
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return null; // Este componente no pinta nada, solo hace la magia por detrás
}