"use client";

import { useCallback } from "react";
import gsap from "gsap";

export function useNavbarInteractions(
  navInnerRef: React.RefObject<HTMLDivElement | null>,
  indRef: React.RefObject<HTMLDivElement | null>,
  activeLinkRef: React.RefObject<HTMLAnchorElement | null>,
) {
  const onNavEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = e.currentTarget;
      if (!indRef.current || !navInnerRef.current) return;
      const r = el.getBoundingClientRect();
      const nr = navInnerRef.current.getBoundingClientRect();
      const targetX = r.left - nr.left;
      const currentX = gsap.getProperty(indRef.current, "x") as number;
      const distance = Math.abs(targetX - currentX);
      const stretch = Math.min(1.4, 1 + distance / 200);

      const tl = gsap.timeline();
      tl.to(indRef.current, {
        x: targetX,
        width: r.width,
        scaleX: stretch,
        height: r.height,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
      }).to(
        indRef.current,
        {
          scaleX: 1,
          duration: 0.45,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.15",
      );
    },
    [navInnerRef, indRef],
  );

  const onNavContainerLeave = useCallback(() => {
    const active = activeLinkRef.current;
    const nr = navInnerRef.current?.getBoundingClientRect();
    if (active && nr && indRef.current) {
      const r = active.getBoundingClientRect();
      gsap.to(indRef.current, {
        x: r.left - nr.left,
        width: r.width,
        height: r.height,
        opacity: 0.65,
        duration: 0.24,
        ease: "power3.out",
      });
    } else if (indRef.current) {
      gsap.to(indRef.current, { opacity: 0, duration: 0.12 });
    }
  }, [navInnerRef, indRef, activeLinkRef]);

  return {
    onNavEnter,
    onNavContainerLeave,
  };
}
