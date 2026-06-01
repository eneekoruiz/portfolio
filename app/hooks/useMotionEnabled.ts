"use client";

import { useEffect, useState } from "react";

export function useMotionEnabled(): boolean {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return true; // Default to true during SSR
    return localStorage.getItem("portfolio-motion-enabled") !== "false";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initial =
      localStorage.getItem("portfolio-motion-enabled") !== "false";
    setEnabled(initial);

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

  return enabled;
}
