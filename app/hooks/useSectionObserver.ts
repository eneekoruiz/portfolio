"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Tx } from "../types";

interface SectionMap {
  id: string;
  c: string;
}

export function useSectionObserver(
  ready: boolean,
  t: Tx,
  navInnerRef: React.RefObject<HTMLDivElement | null>,
  indRef: React.RefObject<HTMLDivElement | null>,
  activeLinkRef: React.MutableRefObject<HTMLAnchorElement | null>,
  onSectionChange?: (id: string) => void,
) {
  useEffect(() => {
    if (!ready) return;
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (!meta) return;

    const map: SectionMap[] = [
      { id: "hero", c: "#f5f5f7" },
      { id: "skills", c: "#ffffff" },
      { id: "work", c: "#f5f5f7" },
      { id: "github", c: "#ffffff" },
      { id: "about", c: "#f5f5f7" },
      { id: "values", c: "#ffffff" },
      { id: "contact", c: "#f5f5f7" },
    ];

    const observers = map.map(({ id, c }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) meta.content = c;
        },
        { threshold: 0.4 },
      );
      io.observe(el);
      return io;
    });

    return () => observers.forEach((io) => io?.disconnect());
  }, [ready]);

  useEffect(() => {
    if (!ready) return;

    // Combine navbar sections with internal sections we want to track (like #github)
    const trackedIds = [...t.hrefs, "#github"];
    const sections = trackedIds
      .map((h: string) => document.querySelector(h))
      .filter(Boolean) as HTMLElement[];
    const navLinks =
      navInnerRef.current?.querySelectorAll<HTMLAnchorElement>("a");

    if (!sections.length) return;

    const ctx = gsap.context(() => {
      function setActive(id: string, idx: number) {
        // Only update navbar indicator if the section has a corresponding nav link
        if (
          navLinks &&
          idx < navLinks.length &&
          indRef.current &&
          navInnerRef.current
        ) {
          const link = navLinks[idx];
          if (link) {
            activeLinkRef.current = link;
            const r = link.getBoundingClientRect();
            const nr = navInnerRef.current.getBoundingClientRect();
            if (indRef.current) {
              gsap.killTweensOf(indRef.current);
              gsap.to(indRef.current, {
                x: r.left - nr.left,
                width: r.width,
                height: r.height,
                scaleX: 1,
                opacity: 0.65,
                duration: 0.52,
                ease: "elastic.out(1.1, 0.75)",
                overwrite: "auto",
              });
            }
          }
        }

        if (onSectionChange) onSectionChange(id);
      }

      sections.forEach((sec, idx) => {
        const id = trackedIds[idx].replace("#", "");
        ScrollTrigger.create({
          trigger: sec,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => setActive(id, idx),
          onEnterBack: () => setActive(id, idx),
        });
      });

      if (window.scrollY < 100) setActive("hero", 0);
    });

    return () => ctx.revert();
  }, [ready, t, navInnerRef, indRef, activeLinkRef, onSectionChange]);
}
