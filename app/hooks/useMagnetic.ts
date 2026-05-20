"use client";

/**
 * useMagnetic — GSAP-powered magnetic attraction for buttons
 * ──────────────────────────────────────────────────────────
 * Attracts the element toward the cursor on hover with a smooth
 * parallax offset on the inner text/child element.
 *
 * Usage:
 *   const magnetRef = useMagnetic<HTMLButtonElement>();
 *   <button ref={magnetRef}>Click me</button>
 *
 * The first child element inside gets a subtler parallax movement
 * for a premium "depth" feel.
 *
 * Only activates on devices with a fine pointer (mouse).
 */

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface MagneticOptions {
  /** Strength of the attraction (0–1). Default: 0.35 */
  strength?: number;
  /** Inner child parallax multiplier (0–1). Default: 0.15 */
  innerStrength?: number;
  /** Magnetic range in px around the button center. Default: 0.65 (relative to size) */
  range?: number;
  /** Duration of the return spring. Default: 0.7 */
  returnDuration?: number;
}

export function useMagnetic<T extends HTMLElement>(
  options: MagneticOptions = {},
) {
  const {
    strength = 0.35,
    innerStrength = 0.15,
    range = 0.65,
    returnDuration = 0.7,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Only on devices with a precise pointer (mouse)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const inner = el.firstElementChild as HTMLElement | null;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const currentX = (gsap.getProperty(el, "x") as number) || 0;
      const currentY = (gsap.getProperty(el, "y") as number) || 0;

      const cx = rect.left - currentX + rect.width / 2;
      const cy = rect.top - currentY + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      gsap.to(el, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.3,
        ease: "power3.out",
        overwrite: true,
      });

      if (inner) {
        gsap.to(inner, {
          x: dx * innerStrength,
          y: dy * innerStrength,
          duration: 0.3,
          ease: "power3.out",
          overwrite: true,
        });
      }
    };

    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: returnDuration,
        ease: "elastic.out(1, 0.4)",
        overwrite: true,
      });
      if (inner) {
        gsap.to(inner, {
          x: 0,
          y: 0,
          duration: returnDuration,
          ease: "elastic.out(1, 0.4)",
          overwrite: true,
        });
      }
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      // Reset transforms on cleanup
      gsap.set(el, { x: 0, y: 0 });
      if (inner) gsap.set(inner, { x: 0, y: 0 });
    };
  }, [strength, innerStrength, range, returnDuration]);

  return ref;
}
