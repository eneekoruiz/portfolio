"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { materia } from "../../lib/materia";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { usePreferredMotion } from "../../hooks/usePreferredMotion";

export function SmoothScroll() {
  const tickerFnRef = useRef<((time: number) => void) | null>(null);
  const enabled = useMotionEnabled();
  const reduced = usePreferredMotion();

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion || reduced || !enabled) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "both",
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
      autoRaf: false,
    });

    window.__lenis = lenis;
    lenis.on("scroll", (e: Lenis) => {
      ScrollTrigger.update();
      materia.velocity = e.velocity;
      materia.scrollTime = performance.now();
    });

    tickerFnRef.current = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFnRef.current);
    gsap.ticker.lagSmoothing(0);

    // Scroll Progress Bar Logic
    const ctx = gsap.context(() => {
      gsap.to("#scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    });

    return () => {
      ctx.revert();
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
        tickerFnRef.current = null;
      }
      lenis.destroy();
      delete window.__lenis;
      materia.velocity = 0;
    };
  }, [enabled, reduced]);

  return null;
}
