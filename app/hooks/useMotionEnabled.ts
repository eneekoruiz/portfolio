"use client";

import { useEffect, useState } from "react";
import { usePreferredMotion } from "./usePreferredMotion";

export function useMotionEnabled(): boolean {
  const reduced = usePreferredMotion();
  const [userExplicit, setUserExplicit] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("portfolio-motion-enabled");
      if (stored !== null) {
        setUserExplicit(stored === "true");
      }
    } catch {}

    const handleMotionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled?: boolean }>;
      if (typeof customEvent.detail?.enabled === "boolean") {
        setUserExplicit(customEvent.detail.enabled);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key !== "portfolio-motion-enabled" || e.newValue === null) return;
      setUserExplicit(e.newValue === "true");
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

  if (userExplicit !== null) {
    return userExplicit;
  }
  return !reduced;
}
