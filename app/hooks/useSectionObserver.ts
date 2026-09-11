"use client";

import { useEffect } from "react";
import gsap from "gsap";
import type { Tx } from "../types";
import { useMotionEnabled } from "./useMotionEnabled";

export function useSectionObserver(
  ready: boolean,
  t: Tx,
  navInnerRef: React.RefObject<HTMLDivElement | null>,
  indRef: React.RefObject<HTMLDivElement | null>,
  activeLinkRef: React.MutableRefObject<HTMLAnchorElement | null>,
  onSectionChange?: (id: string) => void,
) {
  const motion = useMotionEnabled();
  useEffect(() => {
    if (!ready) return;
    const main = document.getElementById("main-content");
    if (!main) return;
    const indicatorElement = indRef.current;
    const links = Array.from(
      navInnerRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
    );
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    let entries: { id: string; top: number }[] = [];
    let needsMeasure = true,
      frame = 0,
      current = "";
    const update = () => {
      frame = 0;
      if (needsMeasure) {
        entries = [...t.hrefs, "#github"]
          .flatMap((href) => {
            const section = document.getElementById(href.slice(1));
            return section
              ? [
                  {
                    id: section.id,
                    top: section.getBoundingClientRect().top + scrollY,
                  },
                ]
              : [];
          })
          .sort((a, b) => a.top - b.top);
        needsMeasure = false;
      }
      const cursor = scrollY + innerHeight * 0.25;
      let id = "hero";
      for (const entry of entries) {
        if (entry.top <= cursor) id = entry.id;
        else break;
      }
      // The repository list belongs to Work in both navigation maps.
      if (id === "github") id = "work";
      if (meta)
        meta.content = document.documentElement.classList.contains("dark")
          ? "#080b12"
          : "#f5f5f7";
      if (current === id) return;
      current = id;
      const link = links.find((item) => item.getAttribute("href") === "#" + id);
      for (const item of links) item.removeAttribute("aria-current");
      if (link) {
        link.setAttribute("aria-current", "location");
        activeLinkRef.current = link;
        const indicator = indRef.current,
          nav = navInnerRef.current;
        if (indicator && nav && nav.offsetWidth > 0) {
          const rect = link.getBoundingClientRect(),
            bounds = nav.getBoundingClientRect();
          gsap.killTweensOf(indicator);
          const pose = {
            x: rect.left - bounds.left,
            width: rect.width,
            height: rect.height,
            scaleX: 1,
            opacity: 0.65,
          };
          if (motion)
            gsap.to(indicator, {
              ...pose,
              duration: 0.52,
              ease: "elastic.out(1.1, 0.75)",
              overwrite: true,
            });
          else gsap.set(indicator, pose);
        }
      }
      onSectionChange?.(id);
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      needsMeasure = true;
      queue();
    };
    const viewport = () => {
      current = "";
      measure();
    };
    const resize = new ResizeObserver((entries) => {
      if (entries.some((entry) => entry.target === navInnerRef.current))
        current = "";
      measure();
    });
    resize.observe(main);
    if (navInnerRef.current) resize.observe(navInnerRef.current);
    // Lazy sections may mount after ready; keep their identity instead of filtering
    // nodes and accidentally assigning another section's index.
    const children = new MutationObserver(measure);
    children.observe(main, { childList: true, subtree: true });
    const theme = new MutationObserver(queue);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", viewport);
    queue();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      children.disconnect();
      theme.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", viewport);
      if (indicatorElement) gsap.killTweensOf(indicatorElement);
      for (const link of links) link.removeAttribute("aria-current");
    };
  }, [ready, t, motion, navInnerRef, indRef, activeLinkRef, onSectionChange]);
}
