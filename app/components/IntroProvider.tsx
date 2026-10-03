"use client";
import {
  createContext,
  useCallback,
  useContext,
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
/** Content is readable in the server response; decoration never gates navigation. */
export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("ready");
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
