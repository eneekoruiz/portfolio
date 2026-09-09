"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SpringValue } from "../lib/spring";

export function useSpringHover<T extends HTMLElement>(
  enabled: boolean,
  strength = 6,
) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      !enabled ||
      !matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const x = new SpringValue();
    const y = new SpringValue();
    const scale = new SpringValue(1, 280, 24);
    let running = false;
    const tick = (_time: number, delta: number) => {
      const dt = delta / 1000;
      element.style.transform = `translate3d(${x.step(dt)}px,${y.step(dt)}px,0) scale(${scale.step(dt)})`;
      if (x.settled && y.settled && scale.settled) {
        gsap.ticker.remove(tick);
        running = false;
        element.style.willChange = "";
      }
    };
    const wake = () => {
      if (running) return;
      running = true;
      element.style.willChange = "transform";
      gsap.ticker.add(tick);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = element.getBoundingClientRect();
      x.target = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
      y.target = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
      scale.target = 1.025;
      wake();
    };
    const leave = () => {
      x.target = y.target = 0;
      scale.target = 1;
      wake();
    };
    const focus = () => {
      scale.target = 1.025;
      wake();
    };
    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", leave);
    element.addEventListener("focus", focus);
    element.addEventListener("blur", leave);
    return () => {
      gsap.ticker.remove(tick);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("focus", focus);
      element.removeEventListener("blur", leave);
      element.style.transform = element.style.willChange = "";
    };
  }, [enabled, strength]);
  return ref;
}
