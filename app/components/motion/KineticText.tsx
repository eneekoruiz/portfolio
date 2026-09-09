"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { materia } from "../../lib/materia";
import { SpringValue } from "../../lib/spring";

export function KineticText({
  text,
  enabled,
  className = "",
}: {
  text: string;
  enabled: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      !enabled ||
      matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches
    )
      return;
    const characters = Array.from(
      element.querySelectorAll<HTMLElement>("[data-kinetic-char]"),
    );
    const letters = characters.map(() => new SpringValue(0, 185, 21));
    const tension = new SpringValue(0, 150, 22);
    const release = gsap.parseEase("expo.out");
    let visible = false;
    let enteredAt = -1;
    let releaseAt = -1;
    let releaseFrom = 0;
    let previousVelocity = 0;
    const tick = (time: number, delta: number) => {
      if (!visible) return;
      const velocity = Math.max(-1, Math.min(1, materia.velocity / 65));
      if (Math.abs(velocity) < 0.025 && Math.abs(previousVelocity) >= 0.025) {
        releaseAt = time;
        releaseFrom = tension.target;
      }
      tension.target =
        Math.abs(velocity) >= 0.025
          ? velocity
          : releaseAt >= 0
            ? releaseFrom *
              (1 - release(Math.min(1, (time - releaseAt) / 0.45)))
            : 0;
      previousVelocity = velocity;
      const value = tension.step(delta / 1000);
      const changing = !tension.settled || Math.abs(value) > 0.001;
      if (changing || element.style.willChange) {
        element.style.setProperty(
          "--type-width",
          String(100 - Math.abs(value) * 13),
        );
        element.style.setProperty(
          "--type-weight",
          String(850 + Math.abs(value) * 80),
        );
        element.style.transform = `perspective(1100px) skew(${value * -3.5}deg,${value * 1.4}deg) scale3d(${1 + Math.abs(value) * 0.028},${1 - Math.abs(value) * 0.035},1)`;
        element.style.willChange = changing ? "transform" : "";
      }
      for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        if (time - enteredAt < i * 0.014) continue;
        if (letter.target === 1 && letter.settled) continue;
        letter.target = 1;
        const progress = letter.step(delta / 1000);
        characters[i].style.transform =
          `translate3d(0,${(1 - progress) * 95}%,${(1 - progress) * -90}px) rotateX(${(1 - progress) * -85}deg)`;
        characters[i].style.opacity = String(
          Math.max(0, Math.min(1, progress * 2)),
        );
        characters[i].style.willChange = letter.settled
          ? ""
          : "transform, opacity";
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        if (enteredAt < 0) {
          enteredAt = gsap.ticker.time;
          for (const char of characters) {
            char.style.opacity = "0";
          }
        }
        gsap.ticker.add(tick);
      } else {
        gsap.ticker.remove(tick);
        element.style.willChange = "";
      }
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
      element.style.transform = element.style.willChange = "";
      element.style.removeProperty("--type-width");
      element.style.removeProperty("--type-weight");
      for (const char of characters) char.removeAttribute("style");
    };
  }, [text, enabled]);
  return (
    <span ref={ref} className={`kinetic-type block origin-left ${className}`}>
      {Array.from(text).map((char, i) => (
        <span
          key={`${char}-${i}`}
          data-kinetic-char
          className="inline-block origin-bottom"
          aria-hidden="true"
        >
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </span>
  );
}
