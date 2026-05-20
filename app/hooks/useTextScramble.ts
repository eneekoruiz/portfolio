"use client";

/**
 * useTextScramble — "Hacker" text reveal effect
 * ──────────────────────────────────────────────
 * Scrambles characters that progressively resolve to the final text.
 * Perfect for hero titles and project headings to match an engineering aesthetic.
 *
 * Usage:
 *   const { text, ref } = useTextScramble('Eneko Ruiz', { trigger: 'mount' });
 *   <h1 ref={ref}>{text}</h1>
 *
 * Characters used for scramble: monospace-friendly glyphs.
 */

import { useEffect, useRef, useState, useCallback } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

interface ScrambleOptions {
  /** How the scramble triggers. 'mount' = on component mount, 'inView' = on scroll into viewport. Default: 'inView' */
  trigger?: "mount" | "inView";
  /** Duration per character resolve in ms. Default: 40 */
  charSpeed?: number;
  /** Number of scramble iterations before each char resolves. Default: 3 */
  iterations?: number;
  /** Initial delay before starting in ms. Default: 0 */
  delay?: number;
  /** IntersectionObserver threshold. Default: 0.3 */
  threshold?: number;
}

export function useTextScramble(
  finalText: string,
  options: ScrambleOptions = {},
) {
  const {
    trigger = "inView",
    charSpeed = 25,
    iterations = 2,
    delay = 0,
    threshold = 0.3,
  } = options;

  const [displayText, setDisplayText] = useState(finalText);
  const ref = useRef<HTMLElement>(null);
  const hasRun = useRef(false);
  const frameRef = useRef<number>(0);

  const scramble = useCallback(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const chars = finalText.split("");
    const totalSteps = chars.length * iterations;
    let step = 0;

    const tick = () => {
      const resolvedCount = Math.floor(step / iterations);
      const output = chars
        .map((char, i) => {
          if (char === " ") return " "; // Preserve spaces
          if (i < resolvedCount) return char; // Already resolved
          if (i === resolvedCount) {
            // Currently scrambling this char
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          // Future chars — show random
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setDisplayText(output);
      step++;

      if (step <= totalSteps) {
        frameRef.current = window.setTimeout(tick, charSpeed);
      } else {
        // Final resolve — ensure exact text
        setDisplayText(finalText);
      }
    };

    window.setTimeout(tick, delay);
  }, [finalText, charSpeed, iterations, delay]);

  useEffect(() => {
    // Reset when finalText changes
    hasRun.current = false;
    setDisplayText(finalText);
  }, [finalText]);

  useEffect(() => {
    if (trigger === "mount") {
      scramble();
      return () => window.clearTimeout(frameRef.current);
    }

    // 'inView' — use IntersectionObserver
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          scramble();
          io.disconnect();
        }
      },
      { threshold },
    );

    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(frameRef.current);
    };
  }, [trigger, scramble, threshold]);

  return { text: displayText, ref };
}
