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
    if (!host || !visual || !enabled) return;
    const pointer = matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const x = new SpringValue(0, 150, 20),
      y = new SpringValue(0, 150, 20),
      lift = new SpringValue(0, 170, 22);
    let visible = false;
    const reset = () => {
      gsap.ticker.remove(tick);
      x.snap(0);
      y.snap(0);
      lift.snap(0);
      visual.style.transform = visual.style.willChange = "";
    };
    const tick = (_time: number, delta: number) => {
      if (
        !visible ||
        !pointer.matches ||
        document.visibilityState !== "visible"
      ) {
        reset();
        return;
      }
      visual.style.transform = `perspective(1100px) translate3d(0,${lift.step(delta / 1000)}px,0) rotateX(${x.step(delta / 1000)}deg) rotateY(${y.step(delta / 1000)}deg)`;
      if (x.settled && y.settled && lift.settled) {
        visual.style.willChange = "";
        gsap.ticker.remove(tick);
      }
    };
    const wake = () => {
      if (
        !visible ||
        !pointer.matches ||
        document.visibilityState !== "visible"
      )
        return;
      visual.style.willChange = "transform";
      gsap.ticker.add(tick);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !visible || !pointer.matches) return;
      const bounds = host.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return reset();
      const px = Math.max(
        0,
        Math.min(1, (event.clientX - bounds.left) / bounds.width),
      );
      const py = Math.max(
        0,
        Math.min(1, (event.clientY - bounds.top) / bounds.height),
      );
      x.target = flip ? 0 : (0.5 - py) * 8;
      y.target = flip ? 180 : (px - 0.5) * 10;
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
    const blur = (event: FocusEvent) => {
      if (
        event.relatedTarget instanceof Node &&
        host.contains(event.relatedTarget)
      )
        return;
      leave();
    };
    const visibility = () => {
      if (document.visibilityState !== "visible") reset();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio > 0;
      if (!visible) reset();
    });
    observer.observe(host);
    const resize = new ResizeObserver(reset);
    resize.observe(host);
    pointer.addEventListener("change", reset);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", reset);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointercancel", leave);
    host.addEventListener("focusin", focus);
    host.addEventListener("focusout", blur);
    return () => {
      observer.disconnect();
      resize.disconnect();
      pointer.removeEventListener("change", reset);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", reset);
      reset();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointercancel", leave);
      host.removeEventListener("focusin", focus);
      host.removeEventListener("focusout", blur);
    };
  }, [hostRef, visualRef, enabled, flip]);
}
