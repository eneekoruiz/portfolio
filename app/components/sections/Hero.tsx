"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { LiveStatus } from "../ui/LiveStatus";
import { useSpringHover } from "../../hooks/useSpringHover";
import { useMotionPolicy } from "../../hooks/useMotionEnabled";
import { useHeroLight } from "../../hooks/useHeroLight";
import { SignatureLink } from "../ui/SignatureLink";
import { KineticText } from "../motion/KineticText";
import { SeismicWaveCanvas } from "../motion/SeismicWaveCanvas";
import { triggerTectonicImpact } from "../../lib/tectonic";
import type { Tx, Lang } from "../../types";
import { UI_COPY } from "../../data/interface-translations";

interface HeroProps {
  t: Tx;
  greeting: string;
  reduced: boolean;
  phase: string;
  lang?: Lang;
}

export function Hero({ t, greeting, reduced, phase, lang = "es" }: HeroProps) {
  const ui = UI_COPY[lang];
  const { enabled: motion } = useMotionPolicy();
  const enabled = motion && !reduced;
  const heroRef = useRef<HTMLElement>(null);
  const enableSensor = useHeroLight(heroRef, enabled);
  const [sensor, setSensor] = useState<"idle" | "enabled" | "unavailable">(
    "idle",
  );
  const contactRef = useSpringHover<HTMLAnchorElement>(enabled, 6);
  const charsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!heroRef.current) return;
    const elements = Array.from(
      heroRef.current.querySelectorAll<HTMLElement>("[data-kinetic-char]"),
    );
    charsRef.current = elements;
  }, [enabled]);

  const scrollTo = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    triggerTectonicImpact(event.clientX, event.clientY, 1.15);
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    if (enabled && window.__lenis)
      window.__lenis.scrollTo(target, { offset: -90 });
    else
      window.scrollTo({
        top: Math.max(0, target.getBoundingClientRect().top + scrollY - 90),
        behavior: "instant",
      });
    history.replaceState(null, "", `#${id}`);
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Eneko Ruiz"
      className="materia-hero relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pt-24 pb-8 md:px-10 md:pt-28 md:pb-12"
    >
      <SeismicWaveCanvas
        stageRef={heroRef}
        charRefs={charsRef}
      />
      <div className="hero-light" aria-hidden="true" />
      <div className="relative z-30 mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 border-b border-ink/10 pb-3 md:pb-4 shrink-0">
        <p className="text-xs font-medium tracking-wide text-lead">
          {greeting}
        </p>
        <LiveStatus label={t.status} />
      </div>
      <div className="hero-composition relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center text-center py-2 md:py-3 my-auto">
        <div className="relative z-10 flex flex-col items-center w-full">
          <h1
            dir="ltr"
            className="m-0 text-[clamp(3.8rem,18.5vw,5.2rem)] md:text-[clamp(5.2rem,21.5vh,18.5rem)] font-black leading-[0.80] tracking-[-0.035em] select-none text-center [overflow-wrap:anywhere] min-w-0"
          >
            <div className="block text-ink">
              <KineticText
                text="Eneko"
                enabled={enabled}
                interactive={true}
                className="inline-block"
              />
            </div>
            <div className="block mt-1 md:mt-2 text-brand">
              <KineticText
                text="Ruiz."
                enabled={enabled}
                interactive={true}
                className="inline-block"
              />
            </div>
          </h1>

          <div className="hero-introduction mt-3 md:mt-5 flex flex-col items-center text-center max-w-xl px-4">
            <span
              className="h-px w-10 bg-brand/50 mb-2.5"
              aria-hidden="true"
            />
            <p className="text-sm md:text-lg font-semibold tracking-tight text-ink">
              {t.role}
            </p>
            <p className="mt-1 text-xs md:text-sm leading-relaxed text-lead max-w-md">
              {t.tagline}
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-3 md:gap-6 border-t border-ink/15 py-2.5 md:py-3.5 shrink-0">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <SignatureLink
            label={t.ctaWork}
            kind="work"
            onClick={(e) => scrollTo(e, "work")}
          />
          <a
            ref={contactRef}
            data-magnetic-contact
            href="#contact"
            onClick={(e) => scrollTo(e, "contact")}
            className="materia-button border border-ink/20 text-ink"
          >
            {t.ctaContact}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <SignatureLink label={t.ctaCv} kind="cv" />
          {enabled && (
            <button
              type="button"
              className="hero-sensor materia-button border border-ink/15 text-lead"
              onClick={async () =>
                setSensor((await enableSensor()) ? "enabled" : "unavailable")
              }
            >
              {sensor === "enabled"
                ? ui.tiltEnabled
                : sensor === "unavailable"
                  ? ui.tiltTouch
                  : ui.tiltEnable}
            </button>
          )}
        </div>
        <span className="hidden items-center gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-lead md:flex">
          {t.scroll}
          <ArrowDown size={14} aria-hidden="true" />
        </span>
      </div>
    </section>
  );
}
