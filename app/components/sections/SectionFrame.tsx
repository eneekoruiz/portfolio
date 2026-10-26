"use client";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { SpringValue } from "../../lib/spring";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { ChapterTitle } from "./ChapterTitle";

/**
 * A chapter: one screen, a title and its content. The title lands (see
 * ChapterTitle); the rest of the content settles in just after it.
 */
export function SectionFrame({
  id,
  title,
  children,
  className = "",
  fitTitle = false,
}: {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
  /** Run the title edge to edge (the closing chapter). */
  fitTitle?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const motion = useMotionEnabled();
  useEffect(() => {
    const element = ref.current;
    if (!element || !motion) return;
    const items = Array.from(
      element.querySelectorAll<HTMLElement>("[data-section-reveal]"),
    );
    const springs = items.map(() => new SpringValue(0, 190, 24));
    let start = -1;
    const finish = () => {
      gsap.ticker.remove(tick);
      for (const item of items) {
        item.style.removeProperty("transform");
        item.style.removeProperty("opacity");
      }
    };
    const tick = (time: number, delta: number) => {
      let settled = true;
      springs.forEach((spring, i) => {
        if (time - start < 0.12 + i * 0.05) {
          settled = false;
          return;
        }
        spring.target = 1;
        const value = spring.step(delta / 1000);
        items[i].style.transform = `translate3d(0,${(1 - value) * 22}px,0)`;
        items[i].style.opacity = String(Math.min(1, Math.max(0, value * 1.6)));
        if (!spring.settled) settled = false;
      });
      if (settled) finish();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || start >= 0) return;
        start = gsap.ticker.time;
        for (const item of items) item.style.opacity = "0";
        gsap.ticker.add(tick);
      },
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      finish();
    };
  }, [motion, title]);
  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`chapter relative z-10 ${className}`}
    >
      <header className="chapter-head">
        <ChapterTitle id={`${id}-heading`} title={title} fit={fitTitle} />
      </header>
      <div className="chapter-body">{children}</div>
    </section>
  );
}
