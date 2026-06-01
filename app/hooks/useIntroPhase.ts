"use client";

import { useCallback } from "react";
import { useIntro } from "../components/IntroProvider";

export function useIntroPhase(mounted: boolean) {
  const { phase, setPhase, markSeen } = useIntro();

  const hasSeen =
    typeof window !== "undefined" && window.__hasSeenIntro === true;

  if (hasSeen && phase !== "ready") {
    setPhase("ready");
  }

  const ready = phase === "ready" || hasSeen;

  const onPreloaderDone = useCallback(() => {
    setPhase("splash");
  }, [setPhase]);

  const onSplashComplete = useCallback(() => {
    setPhase("ready");
    markSeen();
  }, [setPhase, markSeen]);

  return {
    phase: hasSeen ? "ready" : phase,
    ready,
    onPreloaderDone,
    onSplashComplete,
  };
}

