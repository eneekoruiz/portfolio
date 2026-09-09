"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { LiveStatus } from "../ui/LiveStatus";
import { KineticText } from "../motion/KineticText";
import { useMateriaSurface } from "../../hooks/useMateriaSurface";
import { useSpringHover } from "../../hooks/useSpringHover";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import type { Tx } from "../../types";

interface HeroProps {
  t: Tx;
  greeting: string;
  reduced: boolean;
  phase: string;
}

export function Hero({ t, greeting, reduced, phase }: HeroProps) {
  const motion = useMotionEnabled();
  const enabled = motion && !reduced && phase === "ready";
  const prismRef = useRef<HTMLDivElement>(null);
  useMateriaSurface(prismRef, "#0066ff", enabled, 26);
  const workRef = useSpringHover<HTMLAnchorElement>(enabled);
  const contactRef = useSpringHover<HTMLAnchorElement>(enabled);
  const cvRef = useSpringHover<HTMLAnchorElement>(enabled);
  const scrollTo = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    if (enabled && window.__lenis)
      window.__lenis.scrollTo(target, { offset: -90 });
    else target.scrollIntoView({ behavior: "instant" });
    history.replaceState(null, "", `#${id}`);
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  return (
    <section
      id="hero"
      aria-label="Eneko Ruiz"
      className="materia-hero relative flex min-h-[100svh] flex-col overflow-hidden px-5 pt-28 md:px-10 md:pt-32"
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 border-b border-ink/15 pb-5">
        <p className="text-xs font-medium tracking-wide text-lead">
          {greeting}
        </p>
        <LiveStatus label={t.status} />
      </div>
      <div className="relative mx-auto grid w-full max-w-[1440px] flex-1 items-center gap-8 py-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-0 lg:py-16">
        <div className="relative z-10 min-w-0">
          <h1 className="m-0 text-[clamp(5.3rem,16.5vw,16rem)] font-black uppercase leading-[0.78] tracking-[-0.07em] text-ink">
            <KineticText text="Eneko" enabled={enabled} />
            <KineticText
              text="Ruiz."
              enabled={enabled}
              className="mt-[0.13em] text-brand"
            />
          </h1>
          <div className="mt-10 flex max-w-xl items-start gap-5 md:mt-14">
            <span
              className="mt-2 h-px w-10 shrink-0 bg-brand"
              aria-hidden="true"
            />
            <div>
              <p className="text-base font-semibold text-ink md:text-xl">
                {t.role}
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-lead">
                {t.tagline}
              </p>
            </div>
          </div>
        </div>
        <div
          ref={prismRef}
          className="materia-surface hero-prism relative hidden min-h-[390px] self-stretch rounded-[26px] border border-ink/15 lg:block"
          data-materia-surface="hero"
        >
          <div className="absolute inset-x-5 top-5 flex items-center justify-between text-[10px] font-mono tracking-[0.18em] text-lead">
            <span>ER — 01</span>
            <span aria-hidden="true">↗</span>
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between border-t border-ink/15 pt-4">
            <span className="font-mono text-[10px] tracking-[0.14em] text-lead">
              SOFTWARE / SYSTEMS
            </span>
            <video
              src="/memoji.webm"
              autoPlay={enabled}
              loop={enabled}
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="h-16 w-16 shrink-0 rounded-full border border-ink/10 bg-black object-cover"
            />
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-6 border-t border-ink/15 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <a
            ref={workRef}
            href="#work"
            onClick={(e) => scrollTo(e, "work")}
            className="materia-button bg-ink text-page"
          >
            {t.ctaWork}
            <ArrowDown size={16} aria-hidden="true" />
          </a>
          <a
            ref={contactRef}
            href="#contact"
            onClick={(e) => scrollTo(e, "contact")}
            className="materia-button border border-ink/20 text-ink"
          >
            {t.ctaContact}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <Link
            ref={cvRef}
            href="/curriculum"
            className="materia-button text-lead"
          >
            {t.ctaCv}
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <span className="hidden items-center gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-lead md:flex">
          {t.scroll}
          <ArrowDown size={14} aria-hidden="true" />
        </span>
      </div>
    </section>
  );
}
