"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import gsap from "gsap";
import { SpringValue } from "../../lib/spring";
import { frontRadius } from "../../lib/sand-renderer";

/**
 * ShockType — display type that takes the same shockwaves as the sand.
 *
 * Every line is fitted edge to edge of its container. When the height caps the
 * size, the width axis of the variable font widens the letters instead, so the
 * line still spans the full measure at any aspect ratio.
 *
 * Each letter carries a spring. A shock schedules an impulse for the moment the
 * front (frontRadius, shared with the shader) reaches that letter: it widens,
 * gains weight, jumps and settles with its own overshoot. Only per-letter custom
 * properties are written, so a frame restyles a handful of nodes.
 */

const WDTH_MIN = 25;
const WDTH_MAX = 151;
const SPEED = 950;
const DRAG = 1.15;

/** Seconds until a front of this amplitude reaches `distance` px, or Infinity. */
function arrival(distance: number, amplitude: number) {
  const reach = SPEED * (0.7 + 0.3 * Math.min(amplitude, 4));
  const ratio = (distance * DRAG) / reach;
  return ratio >= 1 ? Infinity : -Math.log(1 - ratio) / DRAG;
}

export interface ShockTypeHandle {
  /** Sends a front from (x, y) in client px; `delay` in seconds. */
  shock(x: number, y: number, amplitude: number, delay?: number): void;
  element(): HTMLElement | null;
}

interface ShockTypeProps {
  lines: string[];
  className?: string;
  lineClassNames?: string[];
  /** Fit each line to the container width. */
  fit?: boolean;
  /** Upper bound for the fitted font size, in px, given the container. */
  maxSize?: (container: HTMLElement) => number;
  /** React to tectonic impacts dispatched on the window (clicks, CTAs). */
  listen?: boolean;
  /** Letters lean towards the pointer as it moves over the container. */
  pressure?: boolean;
  /** Joined scripts (Arabic, Devanagari) lose their shaping when split. */
  whole?: boolean;
  /** Lines may wrap between words (headings); implies no fitting. */
  wrap?: boolean;
  enabled: boolean;
}

function units(line: string, whole: boolean) {
  if (whole) return [line];
  if (typeof Intl !== "undefined" && "Segmenter" in Intl)
    return Array.from(
      new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(line),
      (part) => part.segment,
    );
  return Array.from(line);
}

interface Letter {
  element: HTMLElement;
  spring: SpringValue;
  push: number;
  pending: { at: number; impulse: number; push: number }[];
  last: string;
}

export const ShockType = forwardRef<ShockTypeHandle, ShockTypeProps>(
  function ShockType(
    {
      lines,
      className = "",
      lineClassNames = [],
      fit = true,
      maxSize,
      listen = false,
      pressure = false,
      whole = false,
      wrap = false,
      enabled,
    },
    ref,
  ) {
    const rootRef = useRef<HTMLSpanElement>(null);
    const lettersRef = useRef<Letter[]>([]);
    const wakeRef = useRef<() => void>(() => {});
    const maxSizeRef = useRef(maxSize);
    maxSizeRef.current = maxSize;
    const key = lines.join("\n");

    // Fit before paint; again once the variable font lands and on resize.
    useLayoutEffect(() => {
      const root = rootRef.current;
      if (!root || !fit || wrap) return;
      const lineElements = Array.from(
        root.querySelectorAll<HTMLElement>("[data-shock-line]"),
      );
      const measure = (line: HTMLElement, size: number, wdth: number, track = 0) => {
        line.style.setProperty("--fit-size", `${size}px`);
        line.style.setProperty("--fit-wdth", String(wdth));
        line.style.setProperty("--fit-track", `${track}px`);
        return line.scrollWidth;
      };
      const run = () => {
        const container = root.parentElement ?? root;
        const width = container.clientWidth;
        if (!width) return;
        const cap = maxSizeRef.current?.(container) ?? Infinity;
        for (const line of lineElements) {
          const natural = measure(line, 100, 100);
          if (!natural) continue;
          let size = (100 * width) / natural;
          let wdth = 100;
          if (size > cap) {
            // Height-bound: keep the size, widen the letters to fill the line.
            size = cap;
            const narrow = measure(line, size, 100);
            const wide = measure(line, size, WDTH_MAX);
            wdth =
              wide <= width
                ? WDTH_MAX
                : 100 + ((width - narrow) / Math.max(1, wide - narrow)) * (WDTH_MAX - 100);
          }
          // Width is not perfectly linear in size (kerning, hinting, the font
          // swapping in): converge on the measure instead of trusting one guess.
          const axis = Math.max(WDTH_MIN, Math.min(WDTH_MAX, wdth));
          for (let pass = 0; pass < 5; pass++) {
            const actual = measure(line, size, axis);
            if (!actual || Math.abs(actual - width) <= 1) break;
            size = Math.min(cap, size * Math.max(0.5, Math.min(2, width / actual)));
          }
          const settled = measure(line, size, axis);
          // Still short at the widest cut (very wide, very low screens): open
          // the tracking so the line still ends on the edge.
          const gaps = line.querySelectorAll("[data-char]").length - 1;
          if (settled < width - 2 && gaps > 0) {
            const track = (width - settled) / gaps;
            const trial = measure(line, size, axis, track);
            if (trial > width) measure(line, size, axis, track * (width / trial));
          }
        }
        root.dataset.fitted = "true";
      };
      run();
      // The height cap depends on the hero's own height, which settles after
      // the first paint: watch it too and fit again on the next frames.
      const frame = requestAnimationFrame(() => requestAnimationFrame(run));
      const observer = new ResizeObserver(run);
      observer.observe(root.parentElement ?? root);
      const section = root.closest("section");
      if (section) observer.observe(section);
      document.fonts?.ready.then(run).catch(() => {});
      document.fonts?.addEventListener?.("loadingdone", run);
      return () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        document.fonts?.removeEventListener?.("loadingdone", run);
      };
    }, [key, fit, wrap]);

    useEffect(() => {
      const root = rootRef.current;
      if (!root) return;
      const letters: Letter[] = Array.from(
        root.querySelectorAll<HTMLElement>("[data-char]"),
        (element) => ({
          element,
          spring: new SpringValue(0, 240, 13),
          push: 0,
          pending: [],
          last: "",
        }),
      );
      lettersRef.current = letters;
      if (!enabled) {
        wakeRef.current = () => {};
        return;
      }
      let running = false;
      const tick = (_time: number, deltaMs: number) => {
        const now = performance.now() / 1000;
        const dt = deltaMs / 1000;
        let busy = false;
        for (const letter of letters) {
          if (letter.pending.length) {
            busy = true;
            letter.pending = letter.pending.filter((hit) => {
              if (hit.at > now) return true;
              letter.spring.velocity += hit.impulse;
              letter.push = hit.push;
              return false;
            });
          }
          if (!letter.spring.settled) {
            letter.spring.step(dt);
            busy = true;
          }
          const s = letter.spring.value;
          const value = `${s.toFixed(3)}|${(letter.push * s).toFixed(1)}`;
          if (value !== letter.last) {
            letter.last = value;
            letter.element.style.setProperty("--s", s.toFixed(3));
            letter.element.style.setProperty("--sx", (letter.push * s).toFixed(1));
          }
        }
        if (!busy) {
          gsap.ticker.remove(tick);
          running = false;
        }
      };
      const wake = () => {
        if (running || document.visibilityState !== "visible") return;
        running = true;
        gsap.ticker.add(tick);
      };
      wakeRef.current = wake;

      const cleanups: (() => void)[] = [];
      if (listen) {
        const onImpact = (event: Event) => {
          const { x, y, intensity = 1 } =
            (event as CustomEvent<{ x?: number; y?: number; intensity?: number }>).detail ?? {};
          if (x === undefined || y === undefined) return;
          const box = root.getBoundingClientRect();
          // Only fronts that can still reach the type move it.
          const distance = Math.max(0, box.top - y, y - box.bottom);
          if (distance > frontRadius(6, intensity)) return;
          handle.shock(x, y, intensity);
        };
        window.addEventListener("tectonic-impact", onImpact);
        cleanups.push(() => window.removeEventListener("tectonic-impact", onImpact));
      }
      if (pressure && matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const area = root.closest("section") ?? root;
        let boxes: DOMRect[] = [];
        const onEnter = () => {
          boxes = letters.map((letter) => letter.element.getBoundingClientRect());
        };
        const onMove = (event: PointerEvent) => {
          if (!boxes.length) onEnter();
          letters.forEach((letter, i) => {
            const box = boxes[i];
            const dx = event.clientX - (box.left + box.width / 2);
            const dy = event.clientY - (box.top + box.height / 2);
            const near = Math.exp(-(dx * dx + dy * dy) / (2 * 140 * 140));
            // A soft, held swell under the pointer; impacts ride on top.
            letter.spring.target = near * 0.22;
            letter.push = 0;
          });
          wake();
        };
        const onLeave = () => {
          boxes = [];
          for (const letter of letters) letter.spring.target = 0;
          wake();
        };
        area.addEventListener("pointerenter", onEnter);
        area.addEventListener("pointermove", onMove as EventListener, { passive: true });
        area.addEventListener("pointerleave", onLeave);
        window.addEventListener("scroll", onLeave, { passive: true });
        cleanups.push(() => {
          area.removeEventListener("pointerenter", onEnter);
          area.removeEventListener("pointermove", onMove as EventListener);
          area.removeEventListener("pointerleave", onLeave);
          window.removeEventListener("scroll", onLeave);
        });
      }
      return () => {
        cleanups.forEach((fn) => fn());
        gsap.ticker.remove(tick);
        for (const letter of letters) {
          letter.element.style.removeProperty("--s");
          letter.element.style.removeProperty("--sx");
        }
      };
      // handle is stable for the lifetime of the letters.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, enabled, listen, pressure]);

    const handle: ShockTypeHandle = {
      shock(x, y, amplitude, delay = 0) {
        const letters = lettersRef.current;
        // The variant hidden at this breakpoint has nothing to move.
        if (!letters.length || !rootRef.current?.offsetParent) return;
        const now = performance.now() / 1000 + delay;
        const boxes = letters.map((letter) => letter.element.getBoundingClientRect());
        letters.forEach((letter, i) => {
          const box = boxes[i];
          const cx = box.left + box.width / 2;
          const cy = box.top + box.height / 2;
          const distance = Math.hypot(cx - x, cy - y);
          const t = arrival(distance, amplitude);
          if (!Number.isFinite(t)) return;
          // The front loses energy as it travels, as it does in the sand.
          const energy = Math.min(amplitude, 4) * Math.exp(-1.1 * t);
          if (energy < 0.04) return;
          letter.pending.push({
            at: now + t,
            impulse: 9 * energy,
            push: Math.sign(cx - x) * Math.min(14, 4 + energy * 4),
          });
        });
        wakeRef.current();
      },
      element: () => rootRef.current,
    };
    useImperativeHandle(ref, () => handle);

    return (
      <span ref={rootRef} className={`shock-type ${className}`}>
        {lines.map((line, lineIndex) => (
          <span
            key={lineIndex}
            data-shock-line
            aria-hidden="true"
            className={`shock-line ${wrap ? "shock-wrap" : ""} ${lineClassNames[lineIndex] ?? ""}`}
          >
            {(wrap ? line.split(/(\s+)/) : [line]).map((word, w) =>
              /^\s+$/.test(word) ? (
                <span key={w} className="shock-space">
                  {" "}
                </span>
              ) : (
                // Words never break inside: letters are grouped per word.
                <span key={w} className="shock-word">
                  {units(word, whole).map((char, i) =>
                    char === " " ? (
                      <span key={i} className="shock-space">
                        {" "}
                      </span>
                    ) : (
                      <span key={i} data-char>
                        {char}
                      </span>
                    ),
                  )}
                </span>
              ),
            )}
          </span>
        ))}
        <span className="sr-only">{lines.join(" ")}</span>
      </span>
    );
  },
);
