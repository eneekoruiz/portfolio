"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { LiveStatus } from "../ui/LiveStatus";
import { KineticText } from "../motion/KineticText";
import { FloatingNodes } from "../motion/FloatingNodes";
import { useMateriaSurface } from "../../hooks/useMateriaSurface";
import { useSpringHover } from "../../hooks/useSpringHover";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { useHeroLight } from "../../hooks/useHeroLight";
import { SignatureLink } from "../ui/SignatureLink";
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
  const motion = useMotionEnabled();
  const enabled = motion && !reduced && phase === "ready";
  const portraitRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = portraitRef.current;
    if (!video) return;
    let visible = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const update = () => {
      if (enabled && visible && document.visibilityState === "visible") {
        if (!video.getAttribute("src")) {
          if (!timer)
            timer = setTimeout(() => {
              timer = undefined;
              if (
                !enabled ||
                !visible ||
                document.visibilityState !== "visible"
              )
                return;
              video.src = "/memoji.webm";
              video.load();
              void video.play().catch(() => {});
            }, 800);
        } else void video.play().catch(() => {});
      } else {
        clearTimeout(timer);
        timer = undefined;
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(video);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      clearTimeout(timer);
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
  const contactRef = useSpringHover<HTMLAnchorElement>(enabled, 6);
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
      <FloatingNodes />
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
            className="m-0 text-[clamp(4.8rem,13vw,14rem)] font-black uppercase leading-[0.75] tracking-[-0.07em] text-ink"
          >
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
              className="mt-[0.08em] text-brand block"
            />
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
          className="materia-surface hero-prism hero-identity-plate relative hidden min-h-[280px] lg:min-h-[300px] max-h-[440px] self-stretch rounded-[26px] border border-ink/15 md:block overflow-hidden"
          data-materia-surface="hero"
        >
          <div className="absolute inset-x-5 top-5 z-10 flex items-center justify-between text-[10px] font-mono tracking-[0.18em] text-lead">
            <span>ER — 01</span>
            <span aria-hidden="true">↗</span>
          </div>
          <div className="hero-portrait-frame absolute inset-x-4 top-1/2 mx-auto">
            <video
              ref={portraitRef}
              poster="/memoji-poster.webp"
              autoPlay={false}
              loop={enabled}
              muted
              playsInline
              preload="none"
              aria-hidden="true"
              className="hero-portrait block h-full w-full object-cover"
            />
          </div>
          <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between border-t border-ink/15 pt-4">
            <span className="font-mono text-[10px] tracking-[0.14em] text-lead">
              DONOSTIA / SOFTWARE
            </span>
          </div>
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
