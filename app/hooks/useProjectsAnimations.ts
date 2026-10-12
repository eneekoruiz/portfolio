"use client";
import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreferredMotion } from "./usePreferredMotion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

interface Props {
  sectionRef: RefObject<HTMLElement | null>;
  load: boolean;
  expandedIdx: number | null;
  motionEnabled: boolean;
}

export function useProjectsAnimations({
  sectionRef,
  load,
  expandedIdx,
  motionEnabled,
}: Props) {
  const reduced = usePreferredMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (
      !section ||
      load ||
      !motionEnabled ||
      reduced ||
      matchMedia("(pointer: coarse)").matches
    )
      return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".work-row-anim",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.035,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".projects-list",
            start: "top 96%",
            once: true,
          },
          onComplete() {
            gsap.set(".work-row-anim", { clearProps: "transform,opacity" });
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [sectionRef, load, motionEnabled, reduced]);

  // Refrescar ScrollTrigger cuando se expande/contrae una tarjeta
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 320);
    return () => clearTimeout(timer);
  }, [expandedIdx]);
}
