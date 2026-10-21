"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { sandCrack, triggerTectonicImpact, wakeSand } from "../lib/tectonic";

const TREMOR_HITS = 7;

/**
 * Opening shot, played on the hero itself: welcome card, tremor, the sand
 * splits open and the name rises out of the split, then the interface.
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
    const lines = hero.querySelectorAll<HTMLElement>("h1 > div");
    const ui = hero.querySelectorAll<HTMLElement>("[data-cine-ui]");
    const welcome = hero.querySelector<HTMLElement>("[data-cine-welcome]");
    if (!title || lines.length < 2) {
      onDone();
      return;
    }
    const upper = lines[0].querySelectorAll<HTMLElement>("[data-kinetic-char]");
    const lower = lines[1].querySelectorAll<HTMLElement>("[data-kinetic-char]");
    const chars = [...upper, ...lower];

    // The split runs between the two lines of the name.
    const heroBox = hero.getBoundingClientRect();
    const titleBox = title.getBoundingClientRect();
    const splitY = titleBox.top + titleBox.height * 0.52 - heroBox.top;
    sandCrack.x = 0.5;
    sandCrack.y = splitY / heroBox.height;
    sandCrack.open = 0;
    sandCrack.pour = 0;
    // Clip edges, in % of the title box, that sit on the split line.
    const seam = ((splitY + heroBox.top - titleBox.top) / titleBox.height) * 100;
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
    tl.set(upper, { opacity: 0, yPercent: 70 })
      .set(lower, { opacity: 0, yPercent: -70 })
      .set(title, { clipPath: `inset(${seam}% -10% ${100 - seam}% -10%)` })
      .set(ui, { opacity: 0, y: 10 })
      // The card sits on the split line so it can fall into it.
      .set(welcome, { top: `${sandCrack.y * 100}%`, yPercent: -50, opacity: 0, y: 8, letterSpacing: "0.35em" });

    // 1 · Stillness: the welcome card settles on calm sand.
    tl.to(welcome, { opacity: 1, y: 0, letterSpacing: "0.12em", duration: 0.8, ease: "power3.out" }, 0.1);

    // 2 · Tremor: grains jump and the card loses its footing.
    tl.add(() => {
      for (let i = 0; i < TREMOR_HITS; i++)
        gsap.delayedCall(i * 0.1, () => {
          const [x, y] = centre();
          triggerTectonicImpact(
            x + (Math.random() - 0.5) * heroBox.width * 0.5,
            y + (Math.random() - 0.5) * 90,
            0.22 + Math.random() * 0.15,
          );
        });
    }, 0.9);
    tl.to(hero, { x: 2, y: -1.5, duration: 0.05, repeat: 11, yoyo: true, ease: "none" }, 0.9)
      .set(hero, { x: 0, y: 0 }, 1.5);

    // 3 · The sand splits from the centre outwards; the card drops into it.
    tl.to(sandCrack, { open: 0.55, duration: 0.7, ease: "expo.out" }, 1.35)
      .to(sandCrack, { pour: 1, duration: 0.4, ease: "power1.out" }, 1.4)
      .to(welcome, { opacity: 0, y: 22, scaleY: 0.6, filter: "blur(4px)", duration: 0.4, ease: "power3.in" }, 1.4);

    // 4 · The split widens and the name rises out of it: the first line climbs
    // up from the seam, the second drops down from it.
    tl.to(sandCrack, { open: 1, duration: 0.9, ease: "power3.out" }, 1.85)
      .to(title, { clipPath: "inset(-10% -10% -10% -10%)", duration: 1.1, ease: "expo.out" }, 1.9)
      .to(upper, { opacity: 1, yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.05 }, 1.9)
      .to(lower, { opacity: 1, yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.05 }, 1.98);

    // 5 · Impact, then the sand slides back in and fills the split.
    tl.add(() => {
      const [x, y] = centre();
      triggerTectonicImpact(x, y, 1.6);
    }, 2.6)
      .to(sandCrack, { open: 0, duration: 1.7, ease: "power2.inOut" }, 2.8)
      .to(sandCrack, { pour: 0, duration: 1.7, ease: "power2.in" }, 2.8);

    // 6 · The interface arrives once the ground is quiet.
    // Inline styles are cleared in the cleanup, after the phase change removes
    // the hiding CSS; clearing them here would blink everything out for a frame.
    tl.to(ui, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.07 }, 2.75);

    // Input in the first instants is usually leftover wheel inertia from the
    // previous page, not a request to skip.
    const armedAt = performance.now() + 450;
    const skip = (event: Event) => {
      if (performance.now() < armedAt) return;
      if (event instanceof KeyboardEvent && ["Tab", "Shift", "Alt", "Control", "Meta"].includes(event.key))
        return;
      if (event instanceof WheelEvent && Math.abs(event.deltaY) + Math.abs(event.deltaX) < 4) return;
      tl.progress(1);
      sandCrack.open = 0;
      sandCrack.pour = 0;
      wakeSand();
    };
    const skipEvents = ["keydown", "pointerdown", "wheel", "touchmove"] as const;
    for (const type of skipEvents) window.addEventListener(type, skip, { passive: true });

    return () => {
      for (const type of skipEvents) window.removeEventListener(type, skip);
      tl.kill();
      gsap.set([chars, ui, title, welcome, hero], {
        clearProps: "transform,opacity,filter,letterSpacing,clipPath",
      });
      sandCrack.open = 0;
      sandCrack.pour = 0;
      wakeSand();
    };
  }, [heroRef, run, onDone]);
}
