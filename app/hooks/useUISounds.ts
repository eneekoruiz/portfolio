'use client';

/**
 * useUISounds — Sound Design Hook (Prepared Stubs)
 * ──────────────────────────────────────────────────
 * Provides sound stubs ready to be wired with actual audio files.
 * Each method is a no-op by default. To enable sounds, place audio
 * files in /public/sounds/ and set `enabled: true`.
 *
 * Designed to be non-blocking and silent by default so the portfolio
 * works perfectly without any audio assets.
 *
 * Usage:
 *   const { playClick, playSwoosh, playStaticNoise } = useUISounds();
 *   <button onClick={playClick}>Magnetic CTA</button>
 */

import { useRef, useCallback } from 'react';

interface UISoundsOptions {
  /** Master switch. When false, all play* calls are silent no-ops. Default: false */
  enabled?: boolean;
  /** Global volume (0–1). Default: 0.3 */
  volume?: number;
}

interface UISoundsReturn {
  /** Short click/tap sound — for magnetic buttons and interactive elements */
  playClick: () => void;
  /** Whoosh/swoosh — for the liquid curtain transition */
  playSwoosh: () => void;
  /** Brief static noise crackle — for the text scramble effect */
  playStaticNoise: () => void;
}

/**
 * Play an audio file with error swallowing.
 * Returns the HTMLAudioElement if successful, null otherwise.
 */
function playAudio(src: string, volume: number): HTMLAudioElement | null {
  try {
    const audio = new Audio(src);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.play().catch(() => {
      // Silently fail — browsers block autoplay until user interaction.
    });
    return audio;
  } catch {
    return null;
  }
}

export function useUISounds(options: UISoundsOptions = {}): UISoundsReturn {
  const { enabled = false, volume = 0.3 } = options;

  // Track active audio to prevent overlapping
  const clickRef   = useRef<HTMLAudioElement | null>(null);
  const swooshRef  = useRef<HTMLAudioElement | null>(null);
  const staticRef  = useRef<HTMLAudioElement | null>(null);

  const playClick = useCallback(() => {
    if (!enabled) return;
    // Expected file: /public/sounds/click.mp3 (short, ~50ms, subtle tap)
    clickRef.current?.pause();
    clickRef.current = playAudio('/sounds/click.mp3', volume * 0.8);
  }, [enabled, volume]);

  const playSwoosh = useCallback(() => {
    if (!enabled) return;
    // Expected file: /public/sounds/swoosh.mp3 (~300ms, liquid whoosh)
    swooshRef.current?.pause();
    swooshRef.current = playAudio('/sounds/swoosh.mp3', volume);
  }, [enabled, volume]);

  const playStaticNoise = useCallback(() => {
    if (!enabled) return;
    // Expected file: /public/sounds/static.mp3 (~200ms, light crackle/digital noise)
    staticRef.current?.pause();
    staticRef.current = playAudio('/sounds/static.mp3', volume * 0.5);
  }, [enabled, volume]);

  return { playClick, playSwoosh, playStaticNoise };
}
