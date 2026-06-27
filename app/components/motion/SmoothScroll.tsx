"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll() {
  const tickerFnRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

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
    const dispMap = document.getElementById("liquid-displacement-map");
    const setDispScale = dispMap
      ? (val: number) => {
          gsap.to(dispMap, {
            attr: { scale: val },
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      : null;

    lenis.on("scroll", (e: any) => {
      ScrollTrigger.update();
      if (setDispScale) {
        const vel = Math.abs(e.velocity || 0);
        const dispScale = gsap.utils.clamp(0, 18, vel * 0.12);
        setDispScale(dispScale);
      }
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
    };
  }, []);

  return null;
}
