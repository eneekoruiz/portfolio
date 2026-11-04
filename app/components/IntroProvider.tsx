"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clearNavState } from "../lib/navigationPersistence";

export type IntroPhase = "checking" | "overture" | "ready";

interface IntroContextValue {
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
  markSeen: () => void;
}

const IntroContext = createContext<IntroContextValue | null>(null);

// The opening shot plays on every full load of the home page (it is short and
// any input skips it). Client-side returns keep the provider mounted, so it
// never replays when coming back from a case study.
function shouldPlayIntro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (location.pathname !== "/" || location.hash) return false;
    const entry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    // Back from a case study restores the reel position instead.
    if (entry?.type === "back_forward") return false;
    // A fresh load or a reload starts at the top: a stale saved position used
    // to drop the page mid-way and play the opening off-screen.
    clearNavState();
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    window.__lenis?.scrollTo(0, { immediate: true, force: true });
    return true;
  } catch {
    return false;
  }
}

/** Content is readable in the server response; decoration never gates navigation. */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("overture");

  useEffect(() => {
    if (!shouldPlayIntro()) {
      setPhase("ready");
    }
  }, []);

  const markSeen = useCallback(() => setPhase("ready"), []);

  const value = useMemo(
    () => ({ phase, setPhase, markSeen }),
    [phase, markSeen],
  );

  return (
    <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
  );
}

export function useIntro() {
  const context = useContext(IntroContext);
  if (!context) throw new Error("useIntro must be used inside IntroProvider");
  return context;
}
