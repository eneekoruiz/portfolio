"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tx } from "../../types";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { useMateriaSurface } from "../../hooks/useMateriaSurface";
import { useSpringHover } from "../../hooks/useSpringHover";
import { SectionFrame } from "./SectionFrame";

interface MetricCardProps {
  value: string;
  label: string;
  motion: boolean;
}

function MetricCard({ value, label, motion }: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  useMateriaSurface(ref, "#0066ff", motion, 20);

  return (
    <div
      ref={ref}
      className="materia-surface relative overflow-hidden rounded-[20px] border border-ink/15 p-6 transition-colors duration-300"
    >
      <dt className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-lead">
        {label}
      </dt>
      <dd className="text-5xl font-black leading-none tracking-[-0.07em] text-ink">
        {value}
      </dd>
    </div>
  );
}

export function About({ t }: { t: Tx }) {
  const motion = useMotionEnabled();
  const linkRef = useSpringHover<HTMLAnchorElement>(motion);

  return (
    <SectionFrame id="about" index="02" label={t.abLb} title={t.abH}>
      <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
        <div data-section-reveal>
          <p className="max-w-3xl text-pretty text-[clamp(1.15rem,2.3vw,2rem)] font-medium leading-[1.5] tracking-[-0.025em] text-ink">
            {t.mf}
          </p>
          <Link
            ref={linkRef}
            href="/curriculum"
            className="materia-button mt-8 border border-ink/20 bg-page/90 text-ink"
          >
            {t.ctaCv}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <dl
          data-section-reveal
          className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1"
        >
          {t.metrics.map(([value, label]) => (
            <MetricCard
              key={label}
              value={value}
              label={label}
              motion={motion}
            />
          ))}
        </dl>
      </div>
    </SectionFrame>
  );
}
