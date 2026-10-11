"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { LiveStatus } from "../ui/LiveStatus";
import { KineticText } from "../motion/KineticText";
import { useMateriaSurface } from "../../hooks/useMateriaSurface";
import { useSpringHover } from "../../hooks/useSpringHover";
import { useMotionPolicy } from "../../hooks/useMotionEnabled";
import { useHeroLight } from "../../hooks/useHeroLight";
import { SignatureLink } from "../ui/SignatureLink";
import { BrutalistHeroMotion } from "../motion/BrutalistHeroMotion";
import { SeismicWaveCanvas } from "../motion/SeismicWaveCanvas";
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
  const enabled = motion && !reduced && phase === "ready";
  const heroRef = useRef<HTMLElement>(null);
  const enableSensor = useHeroLight(heroRef, enabled);
  const [sensor, setSensor] = useState<"idle" | "enabled" | "unavailable">(
    "idle",
  );
  const prismRef = useRef<HTMLDivElement>(null);
  useMateriaSurface(prismRef, "#0066ff", enabled, 26);
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
      className="materia-hero relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pt-20 pb-4 md:px-10 md:pt-24 md:pb-6"
    >
      <SeismicWaveCanvas
        stageRef={heroRef}
        charRefs={charsRef}
      />
      <div className="hero-light" aria-hidden="true" />
      <div className="relative z-30 mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 border-b border-ink/15 pb-3 md:pb-4 shrink-0">
        <p className="text-xs font-medium tracking-wide text-lead">
          {greeting}
        </p>
        <LiveStatus label={t.status} />
      </div>
      <div className="hero-composition relative mx-auto grid w-full max-w-[1440px] flex-1 items-center gap-6 py-4 md:py-6 lg:gap-0 lg:py-4">
        <div className="relative z-10 min-w-0">
          <h1
            dir="ltr"
            className="m-0 text-[clamp(4.8rem,13vw,13.5rem)] font-black leading-[0.82] tracking-[-0.055em] select-none"
          >
            <div className="block text-ink">
              <span className="char-node inline-block will-change-transform" data-kinetic-char data-i="0">E</span>
              <span className="char-node inline-block will-change-transform" data-kinetic-char data-i="1">n</span>
              <span className="char-node inline-block will-change-transform" data-kinetic-char data-i="2">e</span>
              <span className="char-node inline-block will-change-transform" data-kinetic-char data-i="3">k</span>
              <span className="char-node inline-block will-change-transform" data-kinetic-char data-i="4">o</span>
            </div>
            <div className="block mt-1 text-brand">
              <span className="char-node inline-block will-change-transform" data-kinetic-char data-i="5">R</span>
              <span className="char-node inline-block will-change-transform" data-kinetic-char data-i="6">u</span>
              <span className="char-node inline-block will-change-transform" data-kinetic-char data-i="7">i</span>
              <span className="char-node inline-block will-change-transform" data-kinetic-char data-i="8">z</span>
              <span className="char-node inline-block will-change-transform text-brand" data-kinetic-char data-i="9">.</span>
            </div>
          </h1>
          <div className="hero-introduction mt-8 flex max-w-2xl items-start gap-5 md:mt-10 md:gap-6">
            <span
              className="mt-2.5 h-px w-10 md:w-16 shrink-0 bg-brand"
              aria-hidden="true"
            />
            <div>
              <p className="text-base font-semibold tracking-tight text-ink md:text-lg">
                {t.role}
              </p>
              <p className="mt-3 md:mt-4 max-w-md text-sm leading-relaxed text-lead md:text-base">
                {t.tagline}
              </p>
            </div>
          </div>
        </div>
        <div
          ref={prismRef}
          className="materia-surface hero-prism hero-identity-plate relative hidden min-h-[300px] lg:min-h-[340px] max-h-[460px] self-stretch rounded-[26px] border border-ink/15 md:block overflow-hidden shadow-2xl"
          data-materia-surface="hero"
        >
          <BrutalistHeroMotion enabled={enabled} />
        </div>
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 md:gap-6 border-t border-ink/15 py-3 md:py-4 shrink-0">
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
