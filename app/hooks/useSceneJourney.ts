"use client";

import { useEffect, type RefObject } from "react";
import { materia } from "../lib/materia";

const CHAPTERS = ["hero", "skills", "about", "work", "values", "contact"];
const COMPOSITIONS = [1, -0.65, 0.75, -0.55, 0.55, 0.1];

/** Cache layout on resize; scrolling changes only the shared spring targets. */
export function useSceneJourney(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled || !ref.current) return;
    let anchors: number[] = [];
    let frame = 0;
    let needsMeasure = true;
    const update = () => {
      frame = 0;
      if (needsMeasure) {
        anchors = CHAPTERS.map((id) => {
          const section = document.getElementById(id);
          return section
            ? section.getBoundingClientRect().top + window.scrollY
            : Infinity;
        });
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
      materia.chapter.target = index + blend;
      materia.composition.target =
        COMPOSITIONS[index] +
        (COMPOSITIONS[next] - COMPOSITIONS[index]) * blend;
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
    materia.studio.target = 0;
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", measure);
    };
  }, [enabled, ref]);
}
