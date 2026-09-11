"use client";

import { useRef } from "react";
import type { Tx } from "../../types";
import { SectionFrame } from "./SectionFrame";
import { useMateriaSurface } from "../../hooks/useMateriaSurface";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { useSpringTilt } from "../../hooks/useSpringTilt";
import { NetworkParticles } from "../motion/Particles";

interface BentoCardProps {
  item: Tx["vals"][number];
  index: number;
  motion: boolean;
}

function BentoCard({ item, index, motion }: BentoCardProps) {
  const ref = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  useMateriaSurface(ref, "#0066ff", motion, 24);
  useSpringTilt(ref, visualRef, motion);
  const { icon: Icon, t: title, d: description } = item;

  return (
    <article
      ref={ref}
      tabIndex={0}
      data-section-reveal
      className={`materia-surface philosophy-card relative flex min-h-60 flex-col overflow-hidden rounded-[24px] border border-ink/15 p-6 md:p-8 ${[0, 3, 4].includes(index) ? "md:col-span-2" : ""} ${index === 0 || index === 4 ? "bg-brand/5" : "bg-page/75"}`}
    >
      <div ref={visualRef} data-bento-visual className="relative z-10">
        <div className="mb-10 flex items-center justify-between text-brand">
          <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
          <span className="font-mono text-[10px] tracking-wider text-lead">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="mb-3 text-2xl font-bold leading-tight tracking-[-0.04em] text-ink">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-lead">{description}</p>
      </div>
    </article>
  );
}

export function Philosophy({ t }: { t: Tx }) {
  const motion = useMotionEnabled();

  return (
    <SectionFrame id="values" index="04" label={t.valLb} title={t.valH}>
      <span id="philosophy" className="absolute top-0" aria-hidden="true" />
      <NetworkParticles />
      <div className="relative z-10 grid gap-4 md:grid-cols-3">
        {t.vals.map((item, index) => (
          <BentoCard key={item.t} item={item} index={index} motion={motion} />
        ))}
      </div>
    </SectionFrame>
  );
}
