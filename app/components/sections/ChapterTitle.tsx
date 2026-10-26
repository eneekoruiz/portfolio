"use client";
import { useEffect, useRef } from "react";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { ShockType, type ShockTypeHandle } from "../motion/ShockType";

/**
 * A chapter title that lands: when its chapter arrives, a small front runs
 * through the letters from the left edge, the hero's blast in miniature.
 */
export function ChapterTitle({
  id,
  title,
  fit = false,
}: {
  id: string;
  title: string;
  /** Run the title edge to edge (the closing chapter). */
  fit?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const type = useRef<ShockTypeHandle>(null);
  const motion = useMotionEnabled();
  useEffect(() => {
    const heading = ref.current;
    const chapter = heading?.closest("section");
    if (!heading || !chapter || !motion) return;
    let landed = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Every arrival lands, but never twice in quick succession.
        const now = performance.now();
        if (now - landed < 1500) return;
        landed = now;
        const box = heading.getBoundingClientRect();
        type.current?.shock(box.left - 60, box.top + box.height * 0.6, 1.5);
      },
      { threshold: 0.3 },
    );
    observer.observe(chapter);
    return () => observer.disconnect();
  }, [motion]);
  return (
    <h2 ref={ref} id={id} className={`chapter-title ${fit ? "chapter-title-fit" : ""}`}>
      <ShockType
        ref={type}
        lines={[title]}
        fit={fit}
        wrap={!fit}
        maxSize={() => innerHeight * 0.3}
        enabled={motion}
      />
    </h2>
  );
}
