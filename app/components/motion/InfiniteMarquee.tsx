"use client";

import type { CSSProperties } from "react";
import { useViewportMotion } from "../../hooks/useViewportMotion";

interface InfiniteMarqueeProps {
  text: string;
  speed?: number;
}

export function InfiniteMarquee({ text, speed = 25 }: InfiniteMarqueeProps) {
  const { ref, active } = useViewportMotion<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-marquee-active={active}
      className="relative flex w-full overflow-hidden border-y border-ink/15 py-4 md:py-6 bg-page/80 z-20"
    >
      <span className="sr-only">{text}</span>
      <div
        aria-hidden="true"
        className="portfolio-marquee-track flex whitespace-nowrap items-center"
        style={
          { "--marquee-duration": `${Math.max(10, speed)}s` } as CSSProperties
        }
      >
        {Array.from({ length: 6 }, (_, index) => (
          <span
            key={index}
            className="flex items-center text-[clamp(2.5rem,5vw,5rem)] font-black uppercase leading-none tracking-[-0.05em] text-transparent"
            style={{ WebkitTextStroke: "1px var(--ink)" }}
          >
            {text}
            <span className="mx-8 inline-block h-4 w-4 md:h-6 md:w-6 rounded-full bg-brand" />
          </span>
        ))}
      </div>
    </div>
  );
}
