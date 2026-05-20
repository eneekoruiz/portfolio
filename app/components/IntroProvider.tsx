"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * INTRO PROVIDER — Phase state management for loading sequence
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Phases: 'checking' → 'loading' → 'splash' → 'ready'
 *
 * FIX Punto 5: Now reads `hasSeenIntro` from sessionStorage on mount.
 * Previously, the `hasSeen` flag was pure React state that reset on every
 * client-side navigation, causing the full Preloader + Splash to replay
 * when returning from /work/[id]. Now, once `markSeen()` is called,
 * it persists in sessionStorage for the entire browser session.
 *
 * This also ensures that when /work/[id] sets `hasSeenIntro` in
 * sessionStorage before navigating back, IntroProvider picks it up
 * and skips straight to 'ready'.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type IntroPhase = "checking" | "loading" | "splash" | "ready";

interface IntroContextValue {
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
  markSeen: () => void;
}

const IntroContext = createContext<IntroContextValue | null>(null);

// Global variable survives client-side navigation but resets on full reload
let hasSeenGlobal = false;

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("checking");

  useEffect(() => {
    // Determine the initial phase on the client after hydration
    const checkSeen = () => {
      try {
        // If it's a reload (F5), we ignore the session flag to show the preloader again
        const isReload =
          typeof window !== "undefined" &&
          (
            window.performance?.getEntriesByType(
              "navigation",
            )[0] as PerformanceNavigationTiming
          )?.type === "reload";

        if (isReload) {
          sessionStorage.removeItem("hasSeenIntro");
          return false;
        }

        return (
          hasSeenGlobal || sessionStorage.getItem("hasSeenIntro") === "true"
        );
      } catch (_) {
        return false;
      }
    };

    if (checkSeen()) {
      setPhase("ready");
    } else {
      setPhase("loading");
    }
  }, []);

  const markSeen = useCallback(() => {
    hasSeenGlobal = true;
    try {
      sessionStorage.setItem("hasSeenIntro", "true");
    } catch (_) {}
    setPhase("ready");
  }, []);

  const value = useMemo(
    () => ({ phase, setPhase, markSeen }),
    [phase, markSeen],
  );

  return (
    <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
  );
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) {
    throw new Error("useIntro must be used inside IntroProvider");
  }
  return ctx;
}
