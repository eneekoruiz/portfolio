import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

interface UseProjectsAnimationsProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  load: boolean;
  expandedIdx: number | null;
  motionEnabled: boolean;
}

export function useProjectsAnimations({
  sectionRef,
  load,
  expandedIdx,
  motionEnabled,
}: UseProjectsAnimationsProps) {
  const expandedIdxRef = useRef<number | null>(expandedIdx);

  // Keep ref up to date
  useEffect(() => {
    if (!motionEnabled) return;

    expandedIdxRef.current = expandedIdx;
    if (
      expandedIdx !== null &&
      document.querySelectorAll(".work-row-anim").length > 0
    ) {
      // Immediately smooth out active skew or translation on expand to prevent sudden jerks
      gsap.to(".work-row-anim", {
        skewY: 0,
        y: 0,
        duration: 0.3,
        overwrite: "auto",
      });
    }
  }, [expandedIdx, motionEnabled]);

  useEffect(() => {
    if (load || !motionEnabled) return;

    let onScrollEnd: (() => void) | undefined;

    const ctx = gsap.context(() => {
      // 1. Header Entrance
      gsap.fromTo(
        ".projects-header",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 99%",
            once: true,
          },
        },
      );

      // 2. Cinematic Title Character Reveal
      const titleChars = sectionRef.current?.querySelectorAll(".title-char");
      if (titleChars && titleChars.length > 0) {
        gsap.fromTo(
          titleChars,
          { y: "100%", rotateX: -90, opacity: 0 },
          {
            y: 0,
            rotateX: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.015,
            ease: "expo.out",
            scrollTrigger: {
              trigger: ".projects-header",
              start: "top 99%",
            },
          },
        );
      }

      // 3. Project Rows entrance fade and slide
      gsap.fromTo(
        ".work-row-anim",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.15,
          stagger: 0.012,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".projects-list",
            start: "top 99%",
            once: true,
          },
        },
      );

      // 4. Wave Inertia Scrolling Effect (Efecto Ola)
      const rows = gsap.utils.toArray<HTMLElement>(".work-row-anim");
      if (rows.length > 0) {
        let lastUpdate = 0;

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            if (expandedIdxRef.current !== null) {
              gsap.set(rows, { skewY: 0, y: 0, overwrite: "auto" });
              return;
            }

            const now = Date.now();
            if (now - lastUpdate < 32) return; // Throttle to ~30fps to save CPU
            lastUpdate = now;

            const v = self.getVelocity();
            const skew = gsap.utils.clamp(-6, 6, v / 180);
            const yOffset = gsap.utils.clamp(-20, 20, v / 100);

            gsap.to(rows, {
              skewY: skew,
              y: yOffset,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
          },
        });

        // Soft recovery when scroll stops
        onScrollEnd = () => {
          gsap.to(rows, {
            skewY: 0,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);
      }
    });

    return () => {
      ctx.revert();
      if (onScrollEnd) {
        ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
      }
    };
  }, [load, sectionRef, motionEnabled]);
}
