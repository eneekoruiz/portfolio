"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animateLiquidCurtainOut } from "../components/motion/LiquidCurtain";

const PROJECTS_NAV_KEY = "projects_nav_state";
const RETURN_OVERLAY_ID = "return-overlay";

export function useReturnTransition(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    const overlay = document.getElementById(RETURN_OVERLAY_ID);
    if (!overlay) {
      window.__lenis?.start?.();
      try {
        sessionStorage.removeItem(PROJECTS_NAV_KEY);
      } catch (_) {}
      return;
    }

    let cancelled = false;
    const reveal = () => {
      if (cancelled) return;
      const isSVG = overlay.tagName.toLowerCase() === "svg";
      if (isSVG) {
        animateLiquidCurtainOut(overlay as unknown as SVGSVGElement, {
          duration: 0.45,
          onComplete: () => {
            try {
              sessionStorage.removeItem(PROJECTS_NAV_KEY);
            } catch (_) {}
            window.__lenis?.start?.();
            ScrollTrigger.refresh();
          },
        });
      } else {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.34,
          ease: "power3.out",
          onComplete: () => {
            overlay.remove();
            try {
              sessionStorage.removeItem(PROJECTS_NAV_KEY);
            } catch (_) {}
            window.__lenis?.start?.();
            ScrollTrigger.refresh();
          },
        });
      }
    };

    const raf1 = requestAnimationFrame(() => {
      if (cancelled) return;
      const raf2 = requestAnimationFrame(() => {
        if (cancelled) return;
        const raf3 = requestAnimationFrame(reveal);
        overlay.setAttribute("data-raf3", String(raf3));
      });
      overlay.setAttribute("data-raf2", String(raf2));
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      const r2 = Number(overlay.getAttribute("data-raf2"));
      if (r2) cancelAnimationFrame(r2);
      const r3 = Number(overlay.getAttribute("data-raf3"));
      if (r3) cancelAnimationFrame(r3);
    };
  }, [ready]);
}
