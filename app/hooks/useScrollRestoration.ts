"use client";

import { useEffect, useLayoutEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PROJECTS_NAV_KEY = "projects_nav_state";

export function useScrollRestoration(ready: boolean) {
  // Safe layout-level instant scroll restoration
  useLayoutEffect(() => {
    if (!ready) return;
    try {
      const saved = JSON.parse(
        sessionStorage.getItem(PROJECTS_NAV_KEY) || "{}",
      );
      if (saved.scrollY != null) {
        window.__lenis?.stop?.();
        window.scrollTo({
          top: saved.scrollY,
          behavior: "instant" as ScrollBehavior,
        });
      }
    } catch (_) {}
  }, [ready]);

  // Synchronized Lenis scroll and ScrollTrigger refresh
  useEffect(() => {
    if (!ready) return;
    const lenis = window.__lenis;
    try {
      const saved = JSON.parse(
        sessionStorage.getItem(PROJECTS_NAV_KEY) || "{}",
      );
      if (saved.scrollY != null) {
        lenis?.scrollTo?.(saved.scrollY, { immediate: true, force: true });
        lenis?.start?.();
      }
    } catch (_) {}
    ScrollTrigger.refresh();
  }, [ready]);

  // Hash scroll transition
  useEffect(() => {
    if (!ready) return;
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    const id = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(id);
  }, [ready]);
}
