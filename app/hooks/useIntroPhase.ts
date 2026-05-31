"use client";

import { useCallback } from "react";
import { useIntro } from "../components/IntroProvider";

export function useIntroPhase(mounted: boolean) {
  const { phase, setPhase, markSeen } = useIntro();

  const ready =
    phase === "ready" ||
    (mounted &&
      typeof window !== "undefined" &&
      window.__hasSeenIntro === true);

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
