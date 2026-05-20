"use client";

import { useCallback, useEffect } from "react";

export function useLenisSetup() {
  const start = useCallback(() => {
    window.__lenis?.start?.();
  }, []);

  const stop = useCallback(() => {
    window.__lenis?.stop?.();
  }, []);

  // Ensure global Lenis scroll is active on mount
  useEffect(() => {
    window.__lenis?.start?.();
  }, []);

  return { start, stop };
}
