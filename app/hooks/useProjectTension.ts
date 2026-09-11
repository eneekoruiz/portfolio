"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { materia } from "../lib/materia";
import { SpringValue } from "../lib/spring";

/** Move the typography and interior panels, preserving the DOM/WebGL lens bounds. */
export function useProjectTension(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  expanded: boolean,
  index: number,
) {
  useEffect(() => {
    const host = ref.current;
    if (!host || !enabled || matchMedia("(pointer: coarse)").matches) return;
    const title = host.querySelector<HTMLElement>("[data-project-title]");
    const panels = Array.from(
      host.querySelectorAll<HTMLElement>("[data-work-panel]"),
    );
    const wave = new SpringValue(0, 105 - Math.min(index, 4) * 9, 18);
    const x = new SpringValue(0, 130, 20),
      y = new SpringValue(0, 130, 20);
    const energy = new SpringValue(0, 150, 22);
    const reveal = panels.map(
      () => new SpringValue(host.dataset.expanded === "true" ? 1 : 0, 165, 22),
    );
    let visible = false;
    const tick = (_time: number, delta: number) => {
      const dt = delta / 1000;
      wave.target = Math.max(-1, Math.min(1, materia.velocity / 40));
      const flow = wave.step(dt),
        px = x.step(dt),
        py = y.step(dt),
        glow = energy.step(dt);
      const moving =
        !wave.settled || !x.settled || !y.settled || !energy.settled;
      if (title) {
        title.style.transform = `perspective(900px) translate3d(${px * 5}px,${flow * -7}px,${glow * 12}px) rotateX(${flow * 6 - py * 3}deg) rotateY(${px * 5}deg) skewY(${flow * 0.8}deg)`;
        title.style.willChange = moving ? "transform" : "";
      }
      host.style.setProperty("--work-turn", `${flow * 18 + px * 12}deg`);
      host.style.setProperty("--work-energy", String(glow));
      let complete = true;
      reveal.forEach((spring, i) => {
        spring.target = host.dataset.expanded === "true" ? 1 : 0;
        const progress = spring.step(dt / (1 + i * 0.14));
        panels[i].style.transform =
          `perspective(900px) translate3d(0,${(1 - progress) * (16 + i * 6)}px,0) rotateX(${(1 - progress) * -5}deg)`;
        panels[i].style.willChange = spring.settled ? "" : "transform";
        if (!spring.settled) complete = false;
      });
      if (!moving && complete && Math.abs(materia.velocity) < 0.01)
        gsap.ticker.remove(tick);
    };
    const wake = () => {
      if (visible && document.visibilityState === "visible")
        gsap.ticker.add(tick);
      else gsap.ticker.remove(tick);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const box = host.getBoundingClientRect();
      x.target = Math.max(
        -1,
        Math.min(1, ((event.clientX - box.left) / box.width - 0.5) * 2),
      );
      y.target = Math.max(
        -1,
        Math.min(1, ((event.clientY - box.top) / box.height - 0.5) * 2),
      );
      energy.target = 1;
      wake();
    };
    const leave = (event?: Event) => {
      x.target = y.target = 0;
      const focused =
        event?.type === "focusout"
          ? ((event as FocusEvent).relatedTarget as Node | null)
          : document.activeElement;
      energy.target = host.contains(focused) ? 0.45 : 0;
      wake();
    };
    const focus = () => {
      energy.target = 0.45;
      wake();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        x.target = y.target = energy.target = 0;
      }
      wake();
    });
    observer.observe(host);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointercancel", leave);
    host.addEventListener("focusin", focus);
    host.addEventListener("focusout", leave);
    host.addEventListener("project-tension-update", wake);
    window.addEventListener("scroll", wake, { passive: true });
    document.addEventListener("visibilitychange", wake);
    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointercancel", leave);
      host.removeEventListener("focusin", focus);
      host.removeEventListener("focusout", leave);
      host.removeEventListener("project-tension-update", wake);
      window.removeEventListener("scroll", wake);
      document.removeEventListener("visibilitychange", wake);
      host.style.removeProperty("--work-turn");
      host.style.removeProperty("--work-energy");
      for (const element of [title, ...panels]) {
        if (element) element.style.transform = element.style.willChange = "";
      }
    };
  }, [enabled, index, ref]);
  useEffect(() => {
    ref.current?.dispatchEvent(new Event("project-tension-update"));
  }, [expanded, ref]);
}
