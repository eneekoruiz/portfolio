"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { triggerHeroBurst } from "../lib/tectonic";

// If the overture never reports its impact, the hero still arrives.
const FAILSAFE_MS = 9000;

/** Strength of the big bang: the overture's hole follows the same front. */
export const BLAST = 4.2;

/** The beats of the opening, in seconds after the big bang. */
const BEATS = [
  // Where along the name each firework goes off (fraction of the letters), when, how hard.
  { at: 0.34, along: 0.2, power: 2.5 },
  { at: 0.74, along: 0.62, power: 2.9 },
  // The last one lands on the full stop, in the brand colour.
  { at: 1.16, along: 1, power: 3.5, tint: "brand" as const },
];
const UI_AT = 1.55;
const DONE_AT = 2.25;

/**
 * Second half of the opening, played on the hero itself. The overture ends in
 * an implosion and dispatches `overture-impact`; from there the ground gives
 * way. One big bang in the middle cracks and collapses the sand, then three
 * fireworks go off along the name: each cracks its own patch of ground, throws
 * sparks and earth, and uncovers the letters its blast reaches. The last lands
 * on the full stop. The interface arrives once the dust has started to settle.
 * Any key or click skips to the final frame.
 */
export function useHeroCinematic(
  heroRef: RefObject<HTMLElement | null>,
  run: boolean,
  onDone: () => void,
) {
  useEffect(() => {
    const hero = heroRef.current;
    if (!run || !hero) return;
    const root = document.documentElement;
    root.dataset.intro = "play";
    const ui = [
      ...document.querySelectorAll<HTMLElement>("[data-site-nav]"),
      ...hero.querySelectorAll<HTMLElement>("[data-cine-ui]"),
    ];
    let finished = false;
    let tl: gsap.core.Timeline | null = null;
    const finish = () => {
      if (finished) return;
      finished = true;
      onDone();
    };

    /** The letters of whichever name variant is on screen. */
    const letters = () =>
      [...hero.querySelectorAll<HTMLElement>(".hero-name [data-shock-line]")]
        .filter((line) => line.offsetParent)
        .flatMap((line) => [...line.querySelectorAll<HTMLElement>("[data-char]")]);
    const centre = (el: HTMLElement) => {
      const box = el.getBoundingClientRect();
      return [box.left + box.width / 2, box.top + box.height / 2] as const;
    };
    const jolt = (power: number) =>
      gsap.fromTo(
        hero,
        { x: 0, y: 0 },
        {
          keyframes: [
            { x: -(1.5 + power * 1.6), y: 1 + power * 0.8, duration: 0.04 },
            { x: 1 + power * 1.1, y: -(0.5 + power * 0.6), duration: 0.05 },
            { x: -power * 0.5, y: 0.5, duration: 0.06 },
            { x: 0, y: 0, duration: 0.1 },
          ],
          ease: "power2.out",
          overwrite: "auto",
        },
      );

    const blast = (x: number, y: number) => {
      if (tl) return;
      const chars = letters();
      tl = gsap.timeline();
      tl.set(ui, { opacity: 0, y: 14 });

      // The big bang, where the overture tore open.
      tl.add(() => {
        triggerHeroBurst(x, y, BLAST);
        jolt(BLAST);
      }, 0);

      // The fireworks: each one lights its own patch of name.
      for (const beat of BEATS) {
        tl.add(() => {
          const el = chars[Math.min(chars.length - 1, Math.round(beat.along * (chars.length - 1)))];
          if (!el) return;
          const [bx, by] = centre(el);
          triggerHeroBurst(bx, by, beat.power, { tint: beat.tint, reveal: true });
          jolt(beat.power * 0.8);
        }, beat.at);
      }

      // Interface and release.
      tl.to(ui, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.06 }, UI_AT);
      tl.add(finish, DONE_AT);
    };

    const onImpact = (event: Event) => {
      const { x, y } = (event as CustomEvent<{ x: number; y: number }>).detail;
      blast(x, y);
    };
    window.addEventListener("overture-impact", onImpact);
    const failsafe = window.setTimeout(() => {
      blast(innerWidth / 2, innerHeight / 2);
    }, FAILSAFE_MS);

    const skip = (event: Event) => {
      if (!tl) return;
      if (event instanceof KeyboardEvent && ["Tab", "Shift", "Alt", "Control", "Meta"].includes(event.key))
        return;
      tl.progress(1, true);
      window.dispatchEvent(new Event("hero-burst-clear"));
      finish();
    };
    const skipEvents = ["keydown", "pointerdown"] as const;
    for (const type of skipEvents) window.addEventListener(type, skip, { passive: true });

    return () => {
      window.removeEventListener("overture-impact", onImpact);
      window.clearTimeout(failsafe);
      for (const type of skipEvents) window.removeEventListener(type, skip);
      tl?.kill();
      gsap.set([...ui, hero], { clearProps: "transform,opacity" });
      delete root.dataset.intro;
    };
  }, [heroRef, run, onDone]);
}
