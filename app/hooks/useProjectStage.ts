"use client";

import { useEffect, type RefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

let refreshFrame = 0;
function batchScrollTriggerRefresh() {
  if (refreshFrame || typeof window === "undefined") return;
  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = 0;
    ScrollTrigger.refresh();
  });
}

/** Scroll owns the studio entrance. There is no idle ticker or wheel trapping. */
export function useProjectStage(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  key: string,
) {
  useEffect(() => {
    const host = ref.current;
    const header = host?.querySelector<HTMLElement>(".work-surface-header");
    if (!host || !header || !enabled) return;
    let disposed = false;
    let frame = 0;
    let trigger: ScrollTrigger | undefined;
    const update = (self: ScrollTrigger) => {
      const enter = Math.min(1, self.progress / 0.38);
      const leave = Math.max(0, (self.progress - 0.86) / 0.14);
      host.style.setProperty("--stage-enter", enter.toFixed(4));
      host.style.setProperty("--stage-leave", leave.toFixed(4));
      host.dataset.stageProgress = self.progress.toFixed(4);
    };
    const measure = () => {
      if (disposed) return;
      trigger?.kill();
      host.dataset.projectStage = "active";
      // Long translations and short landscape screens keep a readable entry
      // without holding content larger than the available viewport.
      if (
        window.innerHeight < 620 ||
        header.getBoundingClientRect().height > window.innerHeight - 116
      )
        host.dataset.projectStage = "entry";
      trigger = ScrollTrigger.create({
        trigger: host,
        start: "top 88%",
        end: "bottom 12%",
        invalidateOnRefresh: true,
        onUpdate: update,
        onRefresh: update,
      });
      update(trigger);
      batchScrollTriggerRefresh();
    };
    const resize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("resize", resize, { passive: true });
    document.fonts.ready.then(() => {
      if (!disposed) resize();
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      trigger?.kill();
      delete host.dataset.projectStage;
      delete host.dataset.stageProgress;
      host.style.removeProperty("--stage-enter");
      host.style.removeProperty("--stage-leave");
    };
  }, [ref, enabled, key]);
}
