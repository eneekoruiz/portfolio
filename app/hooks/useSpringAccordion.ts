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
    const host = body.parentElement;
    const bounds = host?.getBoundingClientRect();
    let visible = !bounds || (bounds.bottom > 0 && bounds.top < innerHeight);
    const media = matchMedia(
      "(pointer: coarse), (prefers-reduced-motion: reduce)",
    );
    const instant = !animated || skip;
    const finish = () => {
      spring.snap(expanded ? contentHeight : 0);
      body.style.height = expanded ? "auto" : "0px";
      body.style.opacity = expanded ? "1" : "0";
      body.parentElement?.style.setProperty(
        "--accordion-progress",
        expanded ? "1" : "0",
      );
      gsap.ticker.remove(tick);
      running = false;
    };
    const tick = (_time: number, delta: number) => {
      if (!visible || media.matches || document.visibilityState !== "visible") {
        finish();
        return;
      }
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
        finish();
        ScrollTrigger.refresh();
      }
    };
    const resize = () => {
      const previousHeight = contentHeight;
      const expandedAtRest =
        expanded && spring.settled && body.style.height === "auto";
      contentHeight = content.offsetHeight;
      spring.target = expanded ? contentHeight : 0;
      if (
        instant ||
        media.matches ||
        !visible ||
        document.visibilityState !== "visible" ||
        expandedAtRest ||
        spring.settled
      ) {
        finish();
        if (expanded && previousHeight !== contentHeight)
          ScrollTrigger.refresh();
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
    const viewport = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && running) finish();
    });
    if (host) viewport.observe(host);
    const interrupt = () => {
      if (document.visibilityState !== "visible" || media.matches) finish();
    };
    document.addEventListener("visibilitychange", interrupt);
    media.addEventListener("change", interrupt);
    return () => {
      observer.disconnect();
      viewport.disconnect();
      document.removeEventListener("visibilitychange", interrupt);
      media.removeEventListener("change", interrupt);
      gsap.ticker.remove(tick);
    };
  }, [bodyRef, contentRef, expanded, animated, skip]);
}
