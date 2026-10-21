"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { sandCrack, triggerTectonicImpact, wakeSand } from "../lib/tectonic";

const TREMOR_HITS = 7;

/**
 * Opening shot, played on the hero itself: welcome card, tremor, a breach rips
 * open in the sand, the name rises out of it, impact, then the interface.
 * Any key, click, wheel or touch skips to the final frame.
 */
export function useHeroCinematic(
  heroRef: RefObject<HTMLElement | null>,
  run: boolean,
  onDone: () => void,
) {
  useEffect(() => {
    const hero = heroRef.current;
    if (!run || !hero) return;
    const title = hero.querySelector<HTMLElement>("h1");
    const chars = hero.querySelectorAll<HTMLElement>("h1 [data-kinetic-char]");
    const ui = hero.querySelectorAll<HTMLElement>("[data-cine-ui]");
    const welcome = hero.querySelector<HTMLElement>("[data-cine-welcome]");
    if (!title || chars.length === 0) {
      onDone();
      return;
    }

    // The breach runs along the title's baseline zone.
    const heroBox = hero.getBoundingClientRect();
    const titleBox = title.getBoundingClientRect();
    sandCrack.x = 0.5;
    sandCrack.y = (titleBox.top + titleBox.height * 0.52 - heroBox.top) / heroBox.height;
    sandCrack.open = 0;
    sandCrack.glow = 0;
    const centre = () => {
      const box = hero.getBoundingClientRect();
      return [box.left + box.width * sandCrack.x, box.top + box.height * sandCrack.y] as const;
    };

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      onDone();
    };

    const tl = gsap.timeline({ onComplete: finish, onUpdate: wakeSand });
    tl.set(chars, { opacity: 0, y: 70, rotationX: -75, transformOrigin: "50% 100%" })
      .set(ui, { opacity: 0, y: 14 })
      // The card sits on the breach line so it can fall into it.
      .set(welcome, { top: `${sandCrack.y * 100}%`, yPercent: -50, opacity: 0, y: 8, letterSpacing: "0.35em" });

    // 1 · Stillness: the welcome card settles on calm sand.
    tl.to(welcome, { opacity: 1, y: 0, letterSpacing: "0.12em", duration: 0.9, ease: "power3.out" }, 0.15);

    // 2 · Tremor: grains jump, the frame shakes, the card loses its footing.
    tl.add(() => {
      for (let i = 0; i < TREMOR_HITS; i++)
        gsap.delayedCall(i * 0.11, () => {
          const [x, y] = centre();
          triggerTectonicImpact(
            x + (Math.random() - 0.5) * heroBox.width * 0.5,
            y + (Math.random() - 0.5) * 90,
            0.22 + Math.random() * 0.15,
          );
        });
    }, 1.05);
    tl.to(hero, { x: 3, y: -2, duration: 0.05, repeat: 13, yoyo: true, ease: "none" }, 1.05)
      .set(hero, { x: 0, y: 0 }, 1.8);

    // 3 · The breach: it rips outward from the centre; the card falls into it.
    tl.to(sandCrack, { open: 1, duration: 0.95, ease: "expo.out" }, 1.55)
      .to(sandCrack, { glow: 1, duration: 0.7, ease: "power2.out" }, 1.65)
      .to(welcome, { opacity: 0, y: 26, filter: "blur(6px)", duration: 0.45, ease: "power3.in" }, 1.6);

    // 4 · The name climbs out of the breach, letter by letter.
    tl.to(chars, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.85,
      ease: "expo.out",
      stagger: 0.065,
    }, 2.05);

    // 5 · Impact: shockwave from the breach, light surge, then it seals into a scar.
    tl.add(() => {
      const [x, y] = centre();
      triggerTectonicImpact(x, y, 1.9);
    }, 2.85)
      .fromTo(title, { scale: 1.035 }, { scale: 1, duration: 0.6, ease: "expo.out" }, 2.85)
      .to(sandCrack, { glow: 1.7, duration: 0.12, ease: "power2.out" }, 2.85)
      .to(sandCrack, { glow: 0, duration: 1.4, ease: "power2.inOut" }, 2.97)
      .to(sandCrack, { open: 0, duration: 1.8, ease: "power2.inOut" }, 3.1);

    // 6 · The interface arrives once the ground is quiet.
    // Inline styles are cleared in the cleanup, after the phase change removes
    // the hiding CSS; clearing them here would blink everything out for a frame.
    tl.to(ui, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.07 }, 3.05);

    const skip = (event: Event) => {
      if (event instanceof KeyboardEvent && ["Tab", "Shift", "Alt", "Control", "Meta"].includes(event.key))
        return;
      tl.progress(1);
      sandCrack.open = 0;
      sandCrack.glow = 0;
      wakeSand();
    };
    const skipEvents = ["keydown", "pointerdown", "wheel", "touchmove"] as const;
    for (const type of skipEvents) window.addEventListener(type, skip, { passive: true });

    return () => {
      for (const type of skipEvents) window.removeEventListener(type, skip);
      tl.kill();
      gsap.set([chars, ui, title, welcome, hero], { clearProps: "transform,opacity,filter,letterSpacing" });
      sandCrack.open = 0;
      sandCrack.glow = 0;
      wakeSand();
    };
  }, [heroRef, run, onDone]);
}
