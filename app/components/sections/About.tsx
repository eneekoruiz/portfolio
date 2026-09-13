"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tx } from "../../types";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { useMateriaSurface } from "../../hooks/useMateriaSurface";
import { useSpringHover } from "../../hooks/useSpringHover";
import { SectionFrame } from "./SectionFrame";
import { NetworkParticles } from "../motion/Particles";
import { MaskedCopy } from "../motion/MaskedCopy";
import { useSpringTilt } from "../../hooks/useSpringTilt";

interface MetricCardProps {
  value: string;
  label: string;
  motion: boolean;
}

function MetricCard({ value, label, motion }: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  useMateriaSurface(ref, "#0066ff", motion, 20);
  useSpringTilt(ref, visualRef, motion);

  return (
    <div
      ref={ref}
      className="materia-surface relative overflow-hidden rounded-[20px] border border-ink/15 p-6 transition-colors duration-300"
    >
      <div ref={visualRef} data-metric-visual>
        <dt className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-lead">
          {label}
        </dt>
        <dd className="text-5xl font-black leading-none tracking-[-0.07em] text-ink">
          {value}
        </dd>
      </div>
    </div>
  );
}

export function About({ t }: { t: Tx }) {
  const motion = useMotionEnabled();
  const linkRef = useSpringHover<HTMLAnchorElement>(motion);

  return (
    <SectionFrame id="about" index="02" label={t.abLb} title={t.abH}>
      <NetworkParticles />
      <div className="relative z-10 grid gap-10 lg:gap-14">
        <div data-section-reveal className="relative">
          <div className="absolute -inset-8 -z-10 bg-page/90 blur-2xl rounded-[3rem]" aria-hidden="true" />
          <p className="max-w-3xl text-pretty text-[clamp(1.4rem,2.8vw,2.4rem)] font-medium leading-[1.5] tracking-[-0.025em] text-ink relative z-10">
            <MaskedCopy text={t.mf} enabled={motion} />
          </p>
          <Link
            ref={linkRef}
            href="/curriculum"
            className="materia-button mt-8 relative z-10 border border-ink/20 bg-page/90 text-ink"
          >
            {t.ctaCv}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <dl data-section-reveal className="grid gap-4 sm:grid-cols-3">
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
