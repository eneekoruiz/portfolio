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
      className={`materia-surface about-metric relative flex flex-col justify-center overflow-hidden rounded-2xl border border-ink/15 transition-colors duration-300 ${className}`}
      data-metric-index={index}
    >
      <dl
        ref={visualRef}
        data-metric-visual
        data-metric-copy={value.length > 4 || undefined}
      >
        <dt className="mb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-lead">
          {label}
        </dt>
        <dd className="font-black leading-tight tracking-[-0.04em] text-ink">
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
      <div className="about-composition relative z-10 grid">
        <div data-section-reveal className="relative">
          <p className="about-copy max-w-3xl text-pretty font-medium tracking-[-0.025em] text-ink relative z-10">
            <MaskedCopy text={t.mf} enabled={motion} />
          </p>
          <Link
            ref={linkRef}
            href="/curriculum"
            className="about-cv materia-button relative z-10 border border-ink/20 bg-page/90 text-ink"
          >
            {t.ctaCv}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div data-section-reveal className="about-metrics grid grid-cols-3">
          {t.metrics.map(([value, label], index) => (
            <MetricCard
              key={label}
              value={value}
              label={label}
              motion={motion}
              index={index}
            />
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
