"use client";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { SpringValue } from "../../lib/spring";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";

export function SectionFrame({ id, index, label, title, children, className = "" }: {
  id: string; index: string; label: string; title: string; children: ReactNode; className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const motion = useMotionEnabled();
  useEffect(() => {
    const element = ref.current;
    if (!element || !motion || matchMedia("(pointer: coarse)").matches) return;
    const items = Array.from(element.querySelectorAll<HTMLElement>("[data-section-reveal]"));
    const springs = items.map(() => new SpringValue(0, 190, 24));
    let started = false;
    let start = 0;
    const finish = () => {
      gsap.ticker.remove(tick);
      for (const item of items) { item.style.removeProperty("transform"); item.style.removeProperty("opacity"); item.style.removeProperty("will-change"); }
    };
    const tick = (time: number, delta: number) => {
      let settled = true;
      springs.forEach((spring, i) => {
        if (time - start < i * 0.018) { settled = false; return; }
        spring.target = 1;
        const value = spring.step(delta / 1000);
        items[i].style.transform = `perspective(1000px) translate3d(0,${(1-value)*26}px,0) rotateX(${(1-value)*-8}deg)`;
        items[i].style.opacity = String(Math.min(1, Math.max(0, value * 2)));
        if (!spring.settled) settled = false;
      });
      if (settled) finish();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        start = gsap.ticker.time;
        for (const item of items) { item.style.opacity = "0"; item.style.willChange = "transform, opacity"; }
        gsap.ticker.add(tick);
      } else if (started && !entry.isIntersecting) finish();
    }, { threshold: 0.08 });
    observer.observe(element);
    return () => { observer.disconnect(); finish(); };
  }, [motion, title]);
  return <section ref={ref} id={id} aria-labelledby={`${id}-heading`} className={`editorial-section relative z-10 mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28 ${className}`}>
    <header data-section-reveal className="mb-10 md:mb-14">
      <div className="mb-6 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-lead"><span className="text-brand">{index}</span><span className="h-px w-10 bg-ink/20" aria-hidden="true" /><span>{label}</span></div>
      <h2 id={`${id}-heading`} className="max-w-5xl text-balance text-[clamp(2.5rem,6.4vw,6.5rem)] font-black leading-[0.98] tracking-[-0.06em] text-ink">{title}</h2>
    </header>
    {children}
  </section>;
}
