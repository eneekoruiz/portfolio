"use client";

import { useMotionEnabled } from "../../hooks/useMotionEnabled";

interface InfiniteMarqueeProps {
  text: string;
  speed?: number;
}

export function InfiniteMarquee({ text, speed = 25 }: InfiniteMarqueeProps) {
  const motion = useMotionEnabled();

  // Create an array to repeat the text a few times to fill the screen width
  const items = Array(6).fill(text);

  return (
    <div className="relative flex w-full overflow-hidden border-y border-ink/15 py-4 md:py-6 bg-page/80 backdrop-blur-sm z-20">
      <div 
        className="flex whitespace-nowrap will-change-transform items-center"
        style={{
          animation: motion ? `marquee ${speed}s linear infinite` : "none",
        }}
      >
        {items.map((item, idx) => (
          <span
            key={idx}
            className="flex items-center text-[clamp(2.5rem,5vw,5rem)] font-black uppercase leading-none tracking-[-0.05em] text-transparent"
            style={{ WebkitTextStroke: "1px var(--ink)" }}
          >
            {item}
            <span className="mx-8 inline-block h-4 w-4 md:h-6 md:w-6 rounded-full bg-brand" aria-hidden="true" />
          </span>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}} />
    </div>
  );
}
