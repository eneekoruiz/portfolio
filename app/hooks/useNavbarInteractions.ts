"use client";

import { useCallback, useRef } from "react";
import gsap from "gsap";

export function useNavbarInteractions(
  navInnerRef: React.RefObject<HTMLDivElement | null>,
  indRef: React.RefObject<HTMLDivElement | null>,
  activeLinkRef: React.RefObject<HTMLAnchorElement | null>,
) {
  const activeAnimRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);

  const onNavEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = e.currentTarget;
      if (!indRef.current || !navInnerRef.current) return;
      const r = el.getBoundingClientRect();
      const nr = navInnerRef.current.getBoundingClientRect();
      const targetX = r.left - nr.left;
      const currentX = gsap.getProperty(indRef.current, "x") as number;
      const distance = Math.abs(targetX - currentX);
      const stretch = Math.min(1.4, 1 + distance / 220);

      // Kill previous animations instantly to support mid-way interruption
      if (activeAnimRef.current) {
        activeAnimRef.current.kill();
      }
      gsap.killTweensOf(indRef.current);

      // Spring-based elastic timeline with physical stretch-and-recoil
      const tl = gsap.timeline();
      activeAnimRef.current = tl;

      tl.to(indRef.current, {
        x: targetX,
        width: r.width,
        scaleX: stretch,
        height: r.height,
        opacity: 1,
        duration: 0.3,
        ease: "power3.out",
      }).to(
        indRef.current,
        {
          scaleX: 1,
          duration: 0.48,
          ease: "elastic.out(1.1, 0.6)",
        },
        "-=0.12",
      );
    },
    [navInnerRef, indRef],
  );

  const onNavContainerLeave = useCallback(() => {
    const active = activeLinkRef.current;
    const nr = navInnerRef.current?.getBoundingClientRect();

    if (activeAnimRef.current) {
      activeAnimRef.current.kill();
    }
    gsap.killTweensOf(indRef.current);

    if (active && nr && indRef.current) {
      const r = active.getBoundingClientRect();
      activeAnimRef.current = gsap.to(indRef.current, {
        x: r.left - nr.left,
        width: r.width,
        height: r.height,
        scaleX: 1,
        opacity: 0.65,
        duration: 0.45,
        ease: "elastic.out(1.1, 0.75)",
      });
    } else if (indRef.current) {
      activeAnimRef.current = gsap.to(indRef.current, {
        opacity: 0,
        scaleX: 1,
        duration: 0.15,
        ease: "power2.out",
      });
    }
  }, [navInnerRef, indRef, activeLinkRef]);

  return {
    onNavEnter,
    onNavContainerLeave,
  };
}
