"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { materia } from "../../lib/materia";
/** Native scrolling: no permanent animation loop and no interception of touch input. */
export function SmoothScroll() {
  const pathname = usePathname();
  useEffect(() => {
    let frame = 0,
      previous = scrollY,
      time = performance.now();
    const bar = document.getElementById("scroll-progress");
    const update = () => {
      frame = 0;
      const now = performance.now();
      materia.velocity = Math.max(
        -40,
        Math.min(40, ((scrollY - previous) * 16) / Math.max(16, now - time)),
      );
      materia.scrollTime = now;
      previous = scrollY;
      time = now;
      if (bar)
        bar.style.transform =
          "scaleX(" +
          Math.max(
            0,
            Math.min(
              1,
              scrollY /
                Math.max(
                  1,
                  document.documentElement.scrollHeight - innerHeight,
                ),
            ),
          ) +
          ")";
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      materia.velocity = 0;
    };
  }, [pathname]);
  return null;
}
