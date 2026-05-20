"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import type { Tx } from "../types";

const RETURN_OVERLAY_ID = "return-overlay";

export function useProjectNavigation(t: Tx) {
  const [mounted, setMounted] = useState(false);

  // Dynamic Tab Title Change
  useEffect(() => {
    const originalTitle = document.title;
    const handleVisibilityChange = () => {
      document.title = document.hidden ? t.tabAway : t.tabBack;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = originalTitle;
    };
  }, [t]);

  // Global Transition Cleanup on Mount
  useEffect(() => {
    const cleanup = () => {
      document
        .querySelectorAll(
          '[id*="overlay"], [id*="transition"], [id*="curtain"]',
        )
        .forEach((el) => {
          if (
            el.id === RETURN_OVERLAY_ID ||
            el.id === "project-transition-layer"
          )
            return;
          gsap.to(el, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => el.remove(),
          });
        });
      window.__lenis?.start?.();
    };
    cleanup();
    setMounted(true);
    const timer = setTimeout(cleanup, 800);
    return () => clearTimeout(timer);
  }, []);

  return mounted;
}
