"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { sandCrack, triggerTectonicImpact, wakeSand } from "../lib/tectonic";

/** Amplitude of the opening blast: the strongest front the sand can carry. */
export const BLAST = 4;
// If the overture never reports its impact, the hero still arrives.
const FAILSAFE_MS = 9000;

/**
 * Second half of the opening, played on the hero itself. The overture ends in
 * an implosion and dispatches `overture-impact`; from that point one impact
 * drives everything: the front travels through the sand and through the name
 * (ShockType listens to the same event), the frame takes a single dry jolt, a
 * short split scars the epicentre and the interface lands once the wave passed.
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

    const blast = (x: number, y: number) => {
      if (tl) return;
      const box = hero.getBoundingClientRect();
      sandCrack.x = (x - box.left) / box.width;
      sandCrack.y = (y - box.top) / box.height;
      sandCrack.length = Math.min(0.16, 240 / box.width);
      sandCrack.open = 0;
      sandCrack.pour = 0;
      tl = gsap.timeline({ onComplete: finish, onUpdate: wakeSand });
      tl.set(ui, { opacity: 0, y: 14 });
      // The impact: sand and type take the same front.
      tl.add(() => triggerTectonicImpact(x, y, BLAST), 0);
      // One dry jolt, not a long tremor.
      tl.to(hero, {
        keyframes: [
          { x: -7, y: 3, duration: 0.05 },
          { x: 5, y: -2, duration: 0.06 },
          { x: -2, y: 1, duration: 0.07 },
          { x: 0, y: 0, duration: 0.1 },
        ],
        ease: "power2.out",
      }, 0);
      // The epicentre scars: a short split that the sand fills back in.
      tl.to(sandCrack, { open: 0.7, duration: 0.18, ease: "expo.out" }, 0)
        .to(sandCrack, { pour: 1, duration: 0.25 }, 0.05)
        .to(sandCrack, { open: 0, pour: 0, duration: 2.2, ease: "power2.inOut" }, 0.6);
      // The interface lands once the front has crossed the screen.
      tl.to(ui, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.06,
      }, 0.5);
      // Release the page before the scar has fully healed.
      tl.add(finish, 1.5);
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
      tl.progress(1);
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
      sandCrack.open = 0;
      sandCrack.pour = 0;
      wakeSand();
    };
  }, [heroRef, run, onDone]);
}
