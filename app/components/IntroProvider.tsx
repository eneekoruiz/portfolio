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

export type IntroPhase = "checking" | "loading" | "splash" | "ready";

interface IntroContextValue {
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
  markSeen: () => void;
}

const IntroContext = createContext<IntroContextValue | null>(null);

const STORAGE_KEY = "portfolio_intro_seen_v4";

function checkIsFirstVisit(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return false;
    if (localStorage.getItem("portfolio-motion-enabled") === "false")
      return false;
    return !sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

/** Content is readable in the server response; decoration never gates navigation. */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("ready");

  useEffect(() => {
    if (checkIsFirstVisit()) {
      setPhase("loading");
    }
  }, []);

  const markSeen = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, "true");
      }
    } catch {}
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
  const context = useContext(IntroContext);
  if (!context) throw new Error("useIntro must be used inside IntroProvider");
  return context;
}
