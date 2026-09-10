"use client";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { SpringValue } from "../lib/spring";
import { materia } from "../lib/materia";

export function useHeroLight(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const sensorHandler = useRef<
    ((event: DeviceOrientationEvent) => void) | null
  >(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    let visible = true;
    const x = new SpringValue(0.5, 120, 20),
      y = new SpringValue(0.4, 120, 20),
      energy = new SpringValue(0, 120, 20);
    const tick = (_time: number, delta: number) => {
      element.style.setProperty(
        "--hero-light-x",
        `${x.step(delta / 1000) * 100}%`,
      );
      element.style.setProperty(
        "--hero-light-y",
        `${y.step(delta / 1000) * 100}%`,
      );
      element.style.setProperty(
        "--hero-light-energy",
        String(energy.step(delta / 1000)),
      );
      element.style.setProperty("--hero-tilt-x", `${(y.value - 0.4) * -8}deg`);
      element.style.setProperty("--hero-tilt-y", `${(x.value - 0.5) * 10}deg`);
      if (x.settled && y.settled && energy.settled) gsap.ticker.remove(tick);
    };
    const move = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      x.target = (event.clientX - bounds.left) / bounds.width;
      y.target = (event.clientY - bounds.top) / bounds.height;
      energy.target = 1;
      gsap.ticker.add(tick);
    };
    const leave = () => {
      energy.target = 0;
      gsap.ticker.add(tick);
    };
    const orientation = (event: DeviceOrientationEvent) => {
      if (
        !visible ||
        event.gamma === null ||
        event.beta === null ||
        document.visibilityState !== "visible"
      )
        return;
      x.target = Math.max(0, Math.min(1, 0.5 + event.gamma / 80));
      y.target = Math.max(0, Math.min(1, 0.5 + (event.beta - 45) / 100));
      materia.tiltX.target = (y.target - 0.5) * -0.3;
      materia.tiltY.target = (x.target - 0.5) * 0.3;
      energy.target = 1;
      gsap.ticker.add(tick);
    };
    sensorHandler.current = orientation;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) materia.tiltX.target = materia.tiltY.target = 0;
      if (!entry.isIntersecting) {
        gsap.ticker.remove(tick);
        energy.snap(0);
        element.style.setProperty("--hero-light-energy", "0");
      }
    });
    observer.observe(element);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    element.addEventListener("pointercancel", leave);
    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
      sensorHandler.current = null;
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("pointercancel", leave);
      window.removeEventListener("deviceorientation", orientation);
      materia.tiltX.target = materia.tiltY.target = 0;
      [
        "--hero-light-x",
        "--hero-light-y",
        "--hero-light-energy",
        "--hero-tilt-x",
        "--hero-tilt-y",
      ].forEach((key) => element.style.removeProperty(key));
    };
  }, [enabled, ref]);
  return useCallback(async () => {
    if (!enabled || typeof DeviceOrientationEvent === "undefined") return false;
    const constructor =
      DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<string>;
      };
    try {
      if (
        constructor.requestPermission &&
        (await constructor.requestPermission()) !== "granted"
      )
        return false;
      if (sensorHandler.current)
        window.addEventListener("deviceorientation", sensorHandler.current);
      return true;
    } catch {
      return false;
    }
  }, [enabled]);
}
