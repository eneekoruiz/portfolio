"use client";

import { useEffect, useRef } from "react";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";

/** Pointer events wake a short interpolation; idle cursors do no work. */
export function CustomCursor() {
  const enabled = useMotionEnabled();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    const media = matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)",
    );
    let visible = false;
    let frame = 0;
    let lastTime = 0;
    let x = -100,
      y = -100,
      targetX = -100,
      targetY = -100;
    const draw = (now: number) => {
      frame = 0;
      if (!visible || !media.matches || document.visibilityState !== "visible")
        return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const blend = 1 - Math.exp(-30 * dt);
      x += (targetX - x) * blend;
      y += (targetY - y) * blend;
      const settled =
        Math.abs(targetX - x) < 0.1 && Math.abs(targetY - y) < 0.1;
      if (settled) {
        x = targetX;
        y = targetY;
      }
      element.style.transform = `translate3d(${x - 24}px,${y - 24}px,0)`;
      if (!settled) frame = requestAnimationFrame(draw);
      else element.style.willChange = "";
    };
    const hide = () => {
      visible = false;
      cancelAnimationFrame(frame);
      frame = 0;
      element.style.opacity = "0";
      element.style.willChange = "";
      document.documentElement.classList.remove("has-custom-cursor");
    };
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== "mouse") {
        hide();
        return;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      const target = event.target;
      const hovering =
        target instanceof Element &&
        !!target.closest(
          "a,button,input,textarea,select,[role=button],[data-cursor-plus],[data-cursor-minus]",
        );
      element.dataset.hovering = String(hovering);
      if (!visible) {
        x = targetX;
        y = targetY;
        element.style.transform = `translate3d(${x - 24}px,${y - 24}px,0)`;
        element.style.opacity = "1";
        visible = true;
        document.documentElement.classList.add("has-custom-cursor");
      }
      if (!frame) {
        lastTime = performance.now();
        element.style.willChange = "transform";
        frame = requestAnimationFrame(draw);
      }
    };
    const out = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };
    const mediaChanged = () => {
      if (!media.matches) hide();
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", out);
    window.addEventListener("blur", hide);
    media.addEventListener("change", mediaChanged);
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", out);
      window.removeEventListener("blur", hide);
      media.removeEventListener("change", mediaChanged);
    };
  }, [enabled]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-custom-cursor
      className="custom-cursor fixed top-0 left-0 pointer-events-none z-[100000] mix-blend-difference hidden md:block"
      style={{ opacity: 0 }}
    >
      <div className="custom-cursor-visual rounded-full" />
    </div>
  );
}
