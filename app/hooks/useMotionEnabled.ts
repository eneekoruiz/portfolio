"use client";

import { useEffect, useState } from "react";
import { usePreferredMotion } from "./usePreferredMotion";

export function useMotionEnabled(): boolean {
  const reduced = usePreferredMotion();
  const [enabled, setEnabled] = useState(true); // Always true on first render to match SSR

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      setEnabled(localStorage.getItem("portfolio-motion-enabled") !== "false");
    } catch {}

    const handleMotionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled?: boolean }>;
      if (typeof customEvent.detail?.enabled === "boolean") {
        setEnabled(customEvent.detail.enabled);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key !== "portfolio-motion-enabled" || e.newValue === null) return;
      setEnabled(e.newValue !== "false");
    };

    window.addEventListener("portfolio-motion-changed", handleMotionChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "portfolio-motion-changed",
        handleMotionChange,
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return enabled && !reduced;
}
