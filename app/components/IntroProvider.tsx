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

// Lightweight WAAPI fallback polyfill for older browsers (prevents animation failures)
if (
  typeof window !== "undefined" &&
  typeof Element !== "undefined" &&
  !Element.prototype.animate
) {
  Element.prototype.animate = function (keyframes: any, options: any): any {
    const el = this as HTMLElement;
    const finalFrame = Array.isArray(keyframes)
      ? keyframes[keyframes.length - 1]
      : keyframes;

    if (finalFrame) {
      Object.keys(finalFrame).forEach((prop) => {
        try {
          const val = finalFrame[prop];
          (el.style as any)[prop] = val;
        } catch (e) {}
      });
    }

    const mockAnimation = {
      play: () => {},
      pause: () => {},
      cancel: () => {},
      finish: () => {},
      onfinish: null as any,
    };

    const duration =
      typeof options === "number" ? options : options?.duration || 0;

    setTimeout(() => {
      if (typeof mockAnimation.onfinish === "function") {
        mockAnimation.onfinish();
      }
    }, duration);

    return mockAnimation;
  };
}

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
      if (typeof window === "undefined") return false;
      return (
        window.__hasSeenIntro === true ||
        sessionStorage.getItem("hasSeenIntro") === "true"
      );
    };

    if (checkSeen()) {
      setPhase("ready");
    } else {
      setPhase("loading");
    }
  }, []);

  const markSeen = useCallback(() => {
    if (typeof window !== "undefined") {
      window.__hasSeenIntro = true;
      try {
        sessionStorage.setItem("hasSeenIntro", "true");
      } catch (e) {}
    }
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
