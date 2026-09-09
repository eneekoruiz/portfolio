"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SpringValue } from "../lib/spring";

export function useSpringAccordion(
  bodyRef: RefObject<HTMLDivElement | null>,
  contentRef: RefObject<HTMLDivElement | null>,
  expanded: boolean,
  animated: boolean,
  skip = false,
) {
  const springRef = useRef<SpringValue | null>(null);
  if (!springRef.current) springRef.current = new SpringValue(0, 280, 32);
  useLayoutEffect(() => {
    const body = bodyRef.current;
    const content = contentRef.current;
    const spring = springRef.current;
    if (!body || !content || !spring) return;
    let running = false;
    let contentHeight = content.offsetHeight;
    const instant =
      !animated || skip || matchMedia("(pointer: coarse)").matches;
    const tick = (_time: number, delta: number) => {
      const height = Math.max(0, spring.step(delta / 1000));
      body.style.height = `${height}px`;
      body.style.opacity = String(
        Math.min(1, height / Math.max(contentHeight * 0.35, 1)),
      );
      body.parentElement?.style.setProperty(
        "--accordion-progress",
        String(Math.min(1, height / Math.max(contentHeight, 1))),
      );
      if (spring.settled) {
        body.style.height = expanded ? "auto" : "0px";
        gsap.ticker.remove(tick);
        running = false;
        ScrollTrigger.refresh();
      }
    };
    const resize = () => {
      contentHeight = content.offsetHeight;
      spring.target = expanded ? contentHeight : 0;
      if (instant) {
        spring.snap(spring.target);
        body.style.height = expanded ? "auto" : "0px";
        body.style.opacity = expanded ? "1" : "0";
        body.parentElement?.style.setProperty(
          "--accordion-progress",
          expanded ? "1" : "0",
        );
        return;
      }
      body.style.height = `${Math.max(0, spring.value)}px`;
      if (!running) {
        running = true;
        gsap.ticker.add(tick);
      }
    };
    // Keep the in-flight position and velocity on a rapid toggle.
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(content);
    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [bodyRef, contentRef, expanded, animated, skip]);
}
