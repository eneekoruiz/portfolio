'use client';

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

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type IntroPhase = 'checking' | 'loading' | 'splash' | 'ready';

interface IntroContextValue {
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
  markSeen: () => void;
}

const IntroContext = createContext<IntroContextValue | null>(null);

// Global variable survives client-side navigation but resets on full reload
let hasSeenGlobal = false;

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>(() => {
    if (typeof window === 'undefined') return 'checking';
    try {
      if (hasSeenGlobal || sessionStorage.getItem('hasSeenIntro') === 'true') {
        return 'ready';
      }
    } catch (_) {}
    return 'loading';
  });

  useEffect(() => {
    if (phase === 'checking') {
      setPhase('loading');
    }
  }, [phase]);

  const markSeen = useCallback(() => {
    hasSeenGlobal = true;
    try {
      sessionStorage.setItem('hasSeenIntro', 'true');
    } catch (_) {}
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
