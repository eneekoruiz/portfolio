"use client";

import { useEffect, useRef } from "react";
import { createBurstFX } from "../../lib/burst-fx";

/**
 * The 2D layer of the opening's explosions (sparks, earth, dust, shock ring).
 * It sits above the name so the fireworks fly in front of the letters, listens
 * for `hero-burst`, and clears itself when the opening is skipped.
 */
export function BurstLayer() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    // Phones get lighter bursts: same choreography, fewer particles.
    const light = matchMedia("(max-width: 767px)").matches;
    const fx = createBurstFX(canvas, light ? 0.55 : 1);
    if (!fx) return;
    const onBurst = (event: Event) => {
      const { x, y, power = 2, tint, delay } = (event as CustomEvent<{
        x: number;
        y: number;
        power?: number;
        tint?: "ember" | "brand";
        delay?: number;
      }>).detail;
      // A late cue after the visitor scrolled away would simulate unseen sparks.
      if (y < -innerHeight * 0.5 || y > innerHeight * 1.5) return;
      fx.burst(x, y, { power, tint, delay });
    };
    const onClear = () => fx.clear();
    window.addEventListener("hero-burst", onBurst);
    window.addEventListener("hero-burst-clear", onClear);
    return () => {
      window.removeEventListener("hero-burst", onBurst);
      window.removeEventListener("hero-burst-clear", onClear);
      fx.dispose();
    };
  }, []);
  return <canvas ref={ref} className="burst-layer" aria-hidden="true" />;
}
