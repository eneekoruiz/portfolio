"use client";

import { useEffect, type RefObject } from "react";
import { materia, wakeMateria } from "../lib/materia";

const CHAPTERS = ["hero", "work", "about", "skills", "values", "contact"];
const COMPOSITIONS = [1, -0.65, 0.75, -0.55, 0.55, 0.1];
// Colour arc: cold sea at the opening, warm earth in the middle, ember at the close.
const TINTS = [
  "var(--brand)",
  "var(--brand)",
  "#6b7a8f",
  "#8a6f5a",
  "var(--lead)",
  "var(--ember)",
];
const TINT_STEPS = 20;

/** Cache layout on resize; scrolling changes only the shared spring targets. */
export function useSceneJourney(
  ref: RefObject<HTMLElement | null>,
  ready: boolean,
  motion: boolean,
) {
  useEffect(() => {
    // The colour arc is not motion, so it runs even when motion is off.
    if (!ready || !ref.current) return;
    let anchors: number[] = [];
    let frame = 0;
    let needsMeasure = true;
    let lastTint = "";
    // Only the few elements that paint the chapter colour get it. Setting it on
    // the root used to restyle the whole document on every step of the scroll.
    const CONSUMERS = "#scroll-progress, .projects-reel-progress";
    let consumers: HTMLElement[] = [];
    const update = () => {
      frame = 0;
      if (needsMeasure) {
        anchors = CHAPTERS.map((id) => {
          const section = document.getElementById(id);
          return section
            ? section.getBoundingClientRect().top + window.scrollY
            : Infinity;
        });
        consumers = Array.from(document.querySelectorAll<HTMLElement>(CONSUMERS));
        needsMeasure = false;
      }
      const cursor = window.scrollY + window.innerHeight * 0.2;
      let index = 0;
      while (index < anchors.length - 1 && cursor >= anchors[index + 1])
        index++;
      const next = Math.min(index + 1, anchors.length - 1);
      const length = anchors[next] - anchors[index];
      const t =
        Number.isFinite(length) && length > 0
          ? Math.max(0, Math.min(1, (cursor - anchors[index]) / length))
          : 0;
      const blend = t * t * (3 - 2 * t);
      if (motion) {
        materia.chapter.target = index + blend;
        materia.composition.target =
          COMPOSITIONS[index] +
          (COMPOSITIONS[next] - COMPOSITIONS[index]) * blend;
      }
      // Quantised so the colour changes ~20 times per chapter, not every frame.
      const mix = Math.round((1 - blend) * TINT_STEPS) * (100 / TINT_STEPS);
      const tint = `color-mix(in oklab, ${TINTS[index]} ${mix}%, ${TINTS[next]})`;
      if (tint !== lastTint) {
        lastTint = tint;
        for (const element of consumers) element.style.setProperty("--chapter", tint);
      }
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      needsMeasure = true;
      queue();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(ref.current);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", measure);
    if (motion) materia.studio.target = 0;
    update();
    wakeMateria();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", measure);
      for (const element of consumers) element.style.removeProperty("--chapter");
    };
  }, [ready, motion, ref]);
}
