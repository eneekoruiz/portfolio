"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useMotionEnabled } from "./useMotionEnabled";

export function useGsapOrchestration(
  mainRef: React.RefObject<HTMLDivElement | null>,
  ready: boolean,
  reduced: boolean,
) {
  const motionEnabled = useMotionEnabled();
  const motionPaused = reduced || !motionEnabled;

  // Preset entrance properties to avoid layout shifts on first render
  useLayoutEffect(() => {
    if (!ready || motionPaused) return;
    if (document.querySelectorAll(".n-el").length > 0)
      gsap.set(".n-el", { opacity: 0, y: -14 });
    if (document.querySelectorAll(".h-ln").length > 0)
      gsap.set(".h-ln", { yPercent: 115 });
    if (document.querySelectorAll(".h-fd").length > 0)
      gsap.set(".h-fd", { opacity: 0, y: 16 });
    if (document.querySelectorAll(".memoji").length > 0)
      gsap.set(".memoji", { opacity: 0, x: 60 });
  }, [ready, motionPaused]);

  // Orchestrate timelines using @gsap/react safe-scoping
  useGSAP(
    () => {
      if (motionPaused) return;

      // Parallax hero
      if (document.querySelector(".h-txt")) {
        gsap.to(".h-txt", {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.45,
          },
        });
      }

      if (document.querySelector(".memoji")) {
        gsap.to(".memoji", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.45,
          },
        });
      }

      // Section headings reveal
      const headings = document.querySelectorAll<HTMLElement>(".sec-h");
      if (headings.length) {
        headings.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.24,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 83%",
                once: true,
              },
            },
          );
        });
      }

      // Dynamic intro stagger timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      const hasNel = document.querySelectorAll(".n-el").length > 0;
      const hasHln = document.querySelectorAll(".h-ln").length > 0;
      const hasHfd = document.querySelectorAll(".h-fd").length > 0;
      const hasMemoji = document.querySelectorAll(".memoji").length > 0;

      if (hasNel || hasHln || hasHfd || hasMemoji) {
        if (hasNel) {
          tl.to(".n-el", { opacity: 1, y: 0, duration: 0.12, stagger: 0.015 });
        }
        if (hasHln) {
          tl.to(
            ".h-ln",
            { yPercent: 0, duration: 0.25, stagger: 0.02 },
            hasNel ? "-=0.1" : undefined,
          );
        }
        if (hasHfd) {
          tl.to(
            ".h-fd",
            { opacity: 1, y: 0, duration: 0.18, stagger: 0.02 },
            hasNel || hasHln ? "-=0.15" : undefined,
          );
        }
        if (hasMemoji) {
          tl.to(
            ".memoji",
            { opacity: 1, x: 0, duration: 0.3, ease: "power3.out" },
            hasNel || hasHln || hasHfd ? "-=0.25" : undefined,
          );
        }
      }
    },
    { scope: mainRef, dependencies: [ready, motionPaused] },
  );
}
