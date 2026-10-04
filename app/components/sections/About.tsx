"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tx } from "../../types";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { useMateriaSurface } from "../../hooks/useMateriaSurface";
import { useSpringHover } from "../../hooks/useSpringHover";
import { SectionFrame } from "./SectionFrame";

import { MaskedCopy } from "../motion/MaskedCopy";
import { useSpringTilt } from "../../hooks/useSpringTilt";

interface MetricCardProps {
  value: string;
  label: string;
  motion: boolean;
  className?: string;
  index: number;
}

function MetricCard({
  value,
  label,
  motion,
  className = "",
  index,
}: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDListElement>(null);
  useMateriaSurface(ref, "#0066ff", motion, 20);
  useSpringTilt(ref, visualRef, motion);

  return (
    <div
      ref={ref}
      className={`materia-surface about-metric relative overflow-hidden rounded-[24px] border border-ink/15 p-6 md:p-8 transition-colors duration-300 flex flex-col justify-end ${className}`}
      data-metric-index={index}
    >
      <span className="about-metric-index" aria-hidden="true">
        0{index + 1} / ER
      </span>
      <dl ref={visualRef} data-metric-visual>
        <dt className="mb-4 font-mono text-[10px] uppercase tracking-[0.15em] text-lead">
          {label}
        </dt>
        <dd className="text-4xl md:text-5xl lg:text-6xl font-black leading-none tracking-[-0.07em] text-ink">
          {value}
        </dd>
      </dl>
    </div>
  );
}

export function About({ t }: { t: Tx }) {
  const motion = useMotionEnabled();
  const linkRef = useSpringHover<HTMLAnchorElement>(motion);

  return (
    <SectionFrame id="about" index="02" label={t.abLb} title={t.abH}>
      <div className="relative z-10">
        <div
          data-section-reveal
          className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5"
        >
          <div className="about-manifesto col-span-2 md:col-span-2 row-span-2 materia-surface relative overflow-hidden rounded-[24px] border border-ink/15 p-6 md:p-8 lg:p-10 bg-page/40 flex flex-col justify-between">
            <span className="about-quote-mark" aria-hidden="true">
              “
            </span>
            <p className="text-pretty text-[clamp(1.2rem,2vw,2rem)] font-medium leading-[1.4] tracking-[-0.025em] text-ink relative z-10 mb-10">
              <MaskedCopy text={t.mf} enabled={motion} />
            </p>
            <Link
              ref={linkRef}
              href="/curriculum"
              className="materia-button w-fit relative z-10 border border-ink/20 bg-ink text-page !min-h-[44px] !px-6"
            >
              {t.ctaCv}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <MetricCard
            value={t.metrics[0][0]}
            label={t.metrics[0][1]}
            motion={motion}
            index={0}
            className="col-span-1"
          />
          <MetricCard
            value={t.metrics[1][0]}
            label={t.metrics[1][1]}
            motion={motion}
            index={1}
            className="col-span-1"
          />
          <MetricCard
            value={t.metrics[2][0]}
            label={t.metrics[2][1]}
            motion={motion}
            index={2}
            className="col-span-2"
          />
        </div>
      </div>
    </SectionFrame>
  );
}
