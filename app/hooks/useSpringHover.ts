"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { SpringValue } from "../lib/spring";

export function useSpringHover<T extends HTMLElement>(
  enabled: boolean,
  strength = 6,
  scopeRef?: RefObject<HTMLElement | null>,
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
    const scope = scopeRef?.current ?? element;
    let pressed = false;
    let hovering = false;
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
      // Measure the rest position: the animated hitbox must not feed its own spring.
      const dx = event.clientX - (rect.left + rect.width / 2 - x.value);
      const dy = event.clientY - (rect.top + rect.height / 2 - y.value);
      hovering = element.contains(event.target as Node);
      if (scope !== element) {
        const neighbor = (event.target as Element).closest("a,button");
        if (neighbor && neighbor !== element) return leave();
        const force = Math.max(0, 1 - Math.hypot(dx, dy) / 360);
        x.target = Math.max(-strength, Math.min(strength, dx * force * 0.42));
        y.target = Math.max(-strength, Math.min(strength, dy * force * 0.42));
      } else {
        x.target =
          Math.max(-0.5, Math.min(0.5, dx / (rect.width / scale.value))) *
          strength;
        y.target =
          Math.max(-0.5, Math.min(0.5, dy / (rect.height / scale.value))) *
          strength;
      }
      scale.target = pressed ? 0.96 : hovering ? 1.025 : 1;
      wake();
    };
    const leave = () => {
      pressed = hovering = false;
      x.target = y.target = 0;
      scale.target = element.matches(":focus-visible") ? 1.025 : 1;
      wake();
    };
    const down = (event: PointerEvent) => {
      if (event.button !== 0 || event.pointerType === "touch") return;
      pressed = true;
      scale.target = 0.96;
      wake();
    };
    const up = () => {
      if (!pressed) return;
      pressed = false;
      scale.target = hovering || element.matches(":focus-visible") ? 1.025 : 1;
      wake();
    };
    const focus = () => {
      scale.target = 1.025;
      wake();
    };
    scope.addEventListener("pointermove", move, { passive: true });
    scope.addEventListener("pointerleave", leave);
    scope.addEventListener("pointercancel", leave);
    element.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("blur", leave);
    element.addEventListener("focus", focus);
    element.addEventListener("blur", leave);
    return () => {
      gsap.ticker.remove(tick);
      scope.removeEventListener("pointermove", move);
      scope.removeEventListener("pointerleave", leave);
      scope.removeEventListener("pointercancel", leave);
      element.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("blur", leave);
      element.removeEventListener("focus", focus);
      element.removeEventListener("blur", leave);
      element.style.transform = element.style.willChange = "";
    };
  }, [enabled, strength, scopeRef]);
  return ref;
}
