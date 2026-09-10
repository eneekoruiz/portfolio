"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { LiveStatus } from "../ui/LiveStatus";
import { KineticText } from "../motion/KineticText";
import { useMateriaSurface } from "../../hooks/useMateriaSurface";
import { useSpringHover } from "../../hooks/useSpringHover";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { useHeroLight } from "../../hooks/useHeroLight";
import { SignatureLink } from "../ui/SignatureLink";
import type { Tx, Lang } from "../../types";

interface HeroProps {
  t: Tx;
  greeting: string;
  reduced: boolean;
  phase: string;
  lang?: Lang;
}

export function Hero({ t, greeting, reduced, phase, lang = "es" }: HeroProps) {
  const motion = useMotionEnabled();
  const enabled = motion && !reduced && phase === "ready";
  const portraitRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = portraitRef.current;
    if (!video) return;
    let visible = false;
    const update = () => {
      if (enabled && visible && document.visibilityState === "visible")
        void video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(video);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      video.pause();
    };
  }, [enabled]);
  const heroRef = useRef<HTMLElement>(null);
  const enableSensor = useHeroLight(heroRef, enabled);
  const [sensor, setSensor] = useState<"idle" | "enabled" | "unavailable">(
    "idle",
  );
  const prismRef = useRef<HTMLDivElement>(null);
  useMateriaSurface(prismRef, "#0066ff", enabled, 26);
  const contactRef = useSpringHover<HTMLAnchorElement>(enabled);
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
      ref={heroRef}
      id="hero"
      aria-label="Eneko Ruiz"
      className="materia-hero relative flex min-h-[100svh] flex-col overflow-hidden px-5 pt-28 md:px-10 md:pt-32"
    >
      <div className="hero-light" aria-hidden="true" />
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 border-b border-ink/15 pb-5">
        <p className="text-xs font-medium tracking-wide text-lead">
          {greeting}
        </p>
        <LiveStatus label={t.status} />
      </div>
      <div className="relative mx-auto grid w-full max-w-[1440px] flex-1 items-center gap-8 py-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-0 lg:py-16">
        <div className="relative z-10 min-w-0">
          <h1 className="m-0 text-[clamp(5.3rem,16.5vw,16rem)] font-black uppercase leading-[0.78] tracking-[-0.07em] text-ink">
            <KineticText
              text="Eneko"
              enabled={enabled}
              interactive
              delay={0.1}
            />
            <KineticText
              text="Ruiz."
              enabled={enabled}
              interactive
              delay={0.28}
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
          <video
            ref={portraitRef}
            src="/memoji.webm"
            autoPlay={enabled}
            loop={enabled}
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="hero-portrait absolute inset-x-4 bottom-20 mx-auto h-[65%] w-[calc(100%-2rem)] rounded-[24px] object-contain"
          />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between border-t border-ink/15 pt-4">
            <span className="font-mono text-[10px] tracking-[0.14em] text-lead">
              SOFTWARE / SYSTEMS
            </span>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-6 border-t border-ink/15 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <SignatureLink
            label={t.ctaWork}
            kind="work"
            onClick={(e) => scrollTo(e, "work")}
          />
          <a
            ref={contactRef}
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
                ? lang === "es"
                  ? "Inclinación activada"
                  : "Tilt enabled"
                : sensor === "unavailable"
                  ? lang === "es"
                    ? "Usa el gesto táctil"
                    : "Use touch instead"
                  : lang === "es"
                    ? "Activar inclinación"
                    : "Enable tilt"}
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
