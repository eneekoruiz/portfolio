"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { materia } from "../../lib/materia";
import { SpringValue } from "../../lib/spring";

export function KineticText({
  text,
  enabled,
  className = "",
  interactive = false,
  delay = 0,
  wrap = false,
}: {
  text: string;
  enabled: boolean;
  className?: string;
  interactive?: boolean;
  delay?: number;
  wrap?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      !enabled ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const characters = Array.from(
      element.querySelectorAll<HTMLElement>("[data-kinetic-char]"),
    );
    const letters = characters.map(() => new SpringValue(0, 135, 17));
    const waves = characters.map(() => new SpringValue(0, 170, 18));
    const tiltX = new SpringValue(0, 130, 20);
    const tiltY = new SpringValue(0, 130, 20);
    const tension = new SpringValue(0, 150, 22);
    const release = gsap.parseEase("expo.out");
    let visible = false;
    let enteredAt = -1;
    let releaseAt = -1;
    let releaseFrom = 0;
    let previousVelocity = 0;
    const tick = (time: number, delta: number) => {
      if (!visible) return;
      const velocity = Math.max(-1, Math.min(1, materia.velocity / 32));
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
      const rx = tiltX.step(delta / 1000);
      const ry = tiltY.step(delta / 1000);
      const changing =
        !tension.settled ||
        !tiltX.settled ||
        !tiltY.settled ||
        Math.abs(value) > 0.001;
      if (changing || element.style.willChange) {
        element.style.setProperty(
          "--type-width",
          String(100 - Math.abs(value) * 13),
        );
        element.style.setProperty(
          "--type-weight",
          String(850 + Math.abs(value) * 80),
        );
        element.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) skew(${value * -5}deg,${value * 2}deg) scale3d(${1 + Math.abs(value) * 0.035},${1 - Math.abs(value) * 0.045},1)`;
        element.style.willChange = changing ? "transform" : "";
      }
      for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        if (time - enteredAt < delay + i * (interactive ? 0.055 : 0.014))
          continue;
        const wave = waves[i];
        if (letter.target === 1 && letter.settled && wave.settled) continue;
        letter.target = 1;
        const progress = letter.step(delta / 1000);
        const lift = wave.step(delta / 1000);
        characters[i].style.transform =
          `translate3d(0,calc(${(1 - progress) * 100}% - ${lift * 0.075}em),${(1 - progress) * -240 + lift * 35}px) rotateX(${(1 - progress) * -100 + lift * 8}deg) rotateY(${lift * (i % 2 ? 6 : -6)}deg)`;
        characters[i].style.opacity = String(
          Math.max(0, Math.min(1, progress * 2)),
        );
        characters[i].style.willChange =
          letter.settled && wave.settled ? "" : "transform, opacity";
      }
    };
    const move = (event: PointerEvent) => {
      if (!interactive || event.pointerType === "touch") return;
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / Math.max(1, bounds.width);
      const y = (event.clientY - bounds.top) / Math.max(1, bounds.height);
      tiltX.target = (0.5 - y) * 7;
      tiltY.target = (x - 0.5) * 9;
      for (let i = 0; i < waves.length; i++) {
        const distance = x - (i + 0.5) / waves.length;
        waves[i].target = Math.exp(-distance * distance * 32);
      }
    };
    const leave = () => {
      tiltX.target = tiltY.target = 0;
      for (const wave of waves) wave.target = 0;
    };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    element.addEventListener("pointercancel", leave);
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
        leave();
        gsap.ticker.remove(tick);
        element.style.willChange = "";
      }
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("pointercancel", leave);
      gsap.ticker.remove(tick);
      element.style.transform = element.style.willChange = "";
      element.style.removeProperty("--type-width");
      element.style.removeProperty("--type-weight");
      for (const char of characters) char.removeAttribute("style");
    };
  }, [text, enabled, interactive, delay]);
  return (
    <span
      ref={ref}
      data-kinetic-interactive={interactive || undefined}
      className={`kinetic-type block origin-left ${wrap ? "kinetic-wrap" : ""} ${className}`}
    >
      {wrap
        ? text.split(" ").map((word, index) => (
            <span
              key={index}
              className="inline-block whitespace-nowrap"
              aria-hidden="true"
            >
              {Array.from(word).map((char, i) => (
                <span
                  key={i}
                  data-kinetic-char
                  className="inline-block origin-bottom"
                >
                  {char}
                </span>
              ))}
              {index < text.split(" ").length - 1 ? "\u00a0" : ""}
            </span>
          ))
        : Array.from(text).map((char, i) => (
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
