"use client";

import { useEffect, type RefObject } from "react";
import { materia, type OpticalSurface } from "../lib/materia";
import { SpringValue } from "../lib/spring";

export function useMateriaSurface(
  ref: RefObject<HTMLElement | null>,
  color: string,
  enabled = true,
  radius = 20,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    const surface: OpticalSurface = {
      element,
      color,
      radius,
      visible: true,
      hover: new SpringValue(),
      x: new SpringValue(0.5),
      y: new SpringValue(0.5),
      tangentX: new SpringValue(1),
      tangentY: new SpringValue(0),
    };
    materia.surfaces.add(surface);
    let previousX = 0;
    let previousY = 0;
    let hasPointer = false;
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = element.getBoundingClientRect();
      surface.x.target = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / rect.width),
      );
      surface.y.target = Math.max(
        0,
        Math.min(1, (event.clientY - rect.top) / rect.height),
      );
      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;
      const distance = Math.hypot(dx, dy);
      if (hasPointer && distance > 0.5) {
        surface.tangentX.target = dx / distance;
        surface.tangentY.target = dy / distance;
      }
      previousX = event.clientX;
      previousY = event.clientY;
      hasPointer = true;
      surface.hover.target = 1;
    };
    const leave = () => {
      hasPointer = false;
      surface.hover.target = element.contains(document.activeElement)
        ? 0.55
        : 0;
      surface.x.target = surface.y.target = 0.5;
    };
    const focus = () => {
      surface.hover.target = 0.55;
    };
    const blur = (event: FocusEvent) => {
      if (!element.contains(event.relatedTarget as Node | null))
        surface.hover.target = 0;
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        surface.visible = entry.isIntersecting;
        if (!entry.isIntersecting) leave();
      },
      { rootMargin: "80px" },
    );
    observer.observe(element);
    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", leave);
    element.addEventListener("focusin", focus);
    element.addEventListener("focusout", blur);
    return () => {
      observer.disconnect();
      materia.surfaces.delete(surface);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("focusin", focus);
      element.removeEventListener("focusout", blur);
      element.style.removeProperty("--surface-energy");
      element.style.removeProperty("--surface-x");
      element.style.removeProperty("--surface-y");
    };
  }, [ref, color, enabled, radius]);
}
