"use client";

/**
 * useScrollVelocitySkew — Awwwards-grade scroll velocity skew effect
 * ──────────────────────────────────────────────────────────────────
 * Reads Lenis scroll velocity and applies a smooth skewY transform
 * to the target element, creating the signature "rubbery scroll"
 * seen on top creative portfolios (Basement Studio, ActiveTheory, etc.)
 *
 * Usage:
 *   const skewRef = useScrollVelocitySkew<HTMLDivElement>({ maxSkew: 6 });
 *   <div ref={skewRef}>content</div>
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface SkewOptions {
  /** Maximum skewY angle in degrees. Default: 5 */
  maxSkew?: number;
  /** LERP factor — higher = snappier. Default: 0.1 */
  ease?: number;
  /** Whether the effect is active. Default: true */
  enabled?: boolean;
}

export function useScrollVelocitySkew<T extends HTMLElement>(
  options: SkewOptions = {},
) {
  const { maxSkew = 5, ease = 0.1, enabled = true } = options;
  const ref = useRef<T>(null);
  const currentSkew = useRef(0);
  const rafRef = useRef<number>(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const el = ref.current;
    if (!el) return;

    // Listen to Lenis scroll events for velocity
    const onScroll = (e: any) => {
      velocityRef.current = e.velocity || 0;
    };

    // Wait for Lenis to be available
    const setupLenis = () => {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.on("scroll", onScroll);
        return true;
      }
      return false;
    };

    let retries = 0;
    const trySetup = () => {
      if (!setupLenis() && retries < 20) {
        retries++;
        setTimeout(trySetup, 150);
      }
    };
    trySetup();

    // rAF loop: LERP current skew toward velocity-based target
    const tick = () => {
      const targetSkew = gsap.utils.clamp(
        -maxSkew,
        maxSkew,
        velocityRef.current * 0.5,
      );
      currentSkew.current += (targetSkew - currentSkew.current) * ease;

      // Only update DOM when value is significant (saves paint calls)
      if (Math.abs(currentSkew.current) > 0.01) {
        gsap.set(el, {
          skewY: currentSkew.current,
          force3D: true,
        });
      } else if (currentSkew.current !== 0) {
        gsap.set(el, { skewY: 0 });
        currentSkew.current = 0;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.__lenis?.off?.("scroll", onScroll);
      if (el) gsap.set(el, { skewY: 0 });
    };
  }, [maxSkew, ease, enabled]);

  return ref;
}
