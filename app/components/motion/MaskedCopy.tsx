"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SpringValue } from "../../lib/spring";

export function MaskedCopy({
  text,
  enabled,
}: {
  text: string;
  enabled: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      !enabled ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const words = Array.from(
      element.querySelectorAll<HTMLElement>("[data-masked-word]"),
    );
    const springs = words.map(() => new SpringValue(0, 180, 23));
    let started = false,
      start = 0;
    const finish = () => {
      gsap.ticker.remove(tick);
      words.forEach((word) => word.removeAttribute("style"));
    };
    const tick = (time: number, delta: number) => {
      let settled = true;
      springs.forEach((spring, index) => {
        if (time - start < index * 0.009) {
          settled = false;
          return;
        }
        spring.target = 1;
        const progress = spring.step(delta / 1000);
        words[index].style.transform =
          `translate3d(0,${(1 - progress) * 110}%,0) skewY(${(1 - progress) * 8}deg)`;
        if (!spring.settled) settled = false;
      });
      if (settled) finish();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        start = gsap.ticker.time;
        words.forEach((word) => {
          word.style.transform = "translate3d(0,110%,0)";
          word.style.willChange = "transform";
        });
        gsap.ticker.add(tick);
      } else if (started && !entry.isIntersecting) finish();
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      finish();
    };
  }, [enabled, text]);
  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, index) => (
          <span
            key={index}
            className="mr-[0.25em] inline-block overflow-hidden align-bottom pb-[0.1em]"
          >
            <span data-masked-word className="inline-block">
              {word}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
