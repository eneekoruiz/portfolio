"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { SpringValue } from "../lib/spring";

/** Keep the optical container still; move only its visual contents. */
export function useSpringTilt(
  hostRef: RefObject<HTMLElement | null>,
  visualRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  flip = false,
) {
  useEffect(() => {
    const host = hostRef.current,
      visual = visualRef.current;
    if (
      !host ||
      !visual ||
      !enabled ||
      matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches
    )
      return;
    const x = new SpringValue(0, 150, 20),
      y = new SpringValue(0, 150, 20),
      lift = new SpringValue(0, 170, 22);
    const tick = (_time: number, delta: number) => {
      visual.style.transform = `perspective(1100px) translate3d(0,${lift.step(delta / 1000)}px,0) rotateX(${x.step(delta / 1000)}deg) rotateY(${y.step(delta / 1000)}deg)`;
      if (x.settled && y.settled && lift.settled) {
        visual.style.willChange = "";
        gsap.ticker.remove(tick);
      }
    };
    const wake = () => {
      visual.style.willChange = "transform";
      gsap.ticker.add(tick);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = host.getBoundingClientRect();
      x.target = flip
        ? 0
        : (0.5 - (event.clientY - bounds.top) / bounds.height) * 8;
      y.target = flip
        ? 180
        : ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
      lift.target = flip ? 0 : -3;
      wake();
    };
    const leave = () => {
      x.target = y.target = lift.target = 0;
      wake();
    };
    const focus = () => {
      y.target = flip ? 180 : 3;
      lift.target = flip ? 0 : -3;
      wake();
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointercancel", leave);
    host.addEventListener("focusin", focus);
    host.addEventListener("focusout", leave);
    return () => {
      gsap.ticker.remove(tick);
      visual.style.transform = visual.style.willChange = "";
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointercancel", leave);
      host.removeEventListener("focusin", focus);
      host.removeEventListener("focusout", leave);
    };
  }, [hostRef, visualRef, enabled, flip]);
}
