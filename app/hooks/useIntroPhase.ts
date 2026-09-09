"use client";

import { useCallback } from "react";
import { useIntro } from "../components/IntroProvider";

export function useIntroPhase(_mounted: boolean) {
  const { phase, setPhase, markSeen } = useIntro();

  // Keep the first client render identical to SSR. IntroProvider reads storage
  // after hydration; reading it here leaves server visibility attributes stale.
  const ready = phase === "ready";

  const onPreloaderDone = useCallback(() => {
    setPhase("splash");
  }, [setPhase]);

  const onSplashComplete = useCallback(() => {
    setPhase("ready");
    markSeen();
  }, [setPhase, markSeen]);

  return {
    phase,
    ready,
    onPreloaderDone,
    onSplashComplete,
  };
}
