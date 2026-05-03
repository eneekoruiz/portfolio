'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type IntroPhase = 'checking' | 'loading' | 'splash' | 'ready';

interface IntroContextValue {
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
  markSeen: () => void;
}

const IntroContext = createContext<IntroContextValue | null>(null);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  // Keep first render identical on server and client to avoid hydration mismatches.
  const [phase, setPhase] = useState<IntroPhase>('checking');

  // Estado persistente solo durante la sesión SPA (se resetea con F5)
  const [hasSeen, setHasSeen] = useState(false);

  useEffect(() => {
    if (phase !== 'checking') return;
    // Si ya lo hemos visto en esta sesión de navegación, saltamos al final
    setPhase(hasSeen ? 'ready' : 'loading');
  }, [phase, hasSeen]);

  const markSeen = useCallback(() => {
    setHasSeen(true);
    setPhase('ready');
  }, []);

  const value = useMemo(
    () => ({ phase, setPhase, markSeen }),
    [phase, markSeen],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) {
    throw new Error('useIntro must be used inside IntroProvider');
  }
  return ctx;
}
