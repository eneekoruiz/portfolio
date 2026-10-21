"use client";

/**
 * PROJECTS SECTION — Selected Works & GitHub Activity
 * ─────────────────────────────────────────────────────────────────────────────
 * Selected works run as a horizontal reel: vertical scroll pins the section and
 * pans through every card, then resumes. Reduced motion gets native scroll-snap.
 */

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import type { ProjectCard, RepoFull, Tx, Lang } from "../../types";
import { KineticText } from "../motion/KineticText";
import { usePreferredMotion } from "../../hooks/usePreferredMotion";
import { UI_COPY } from "../../data/interface-translations";

// Custom Hooks & Utilities
import { useMobile } from "../../hooks/useMobile";
import { useProjectsAnimations } from "../../hooks/useProjectsAnimations";
import {
  loadNavState,
  saveNavState,
  clearNavState,
} from "../../lib/navigationPersistence";
import { triggerTectonicImpact } from "../../lib/tectonic";

// Subcomponents
import { RepoRow } from "./projects/RepoRow";
import { PremiumWorkRow } from "./projects/PremiumWorkRow";
import { SkeletonRow } from "./projects/SkeletonRow";

const PROJECT_NAV_NAMES: Record<string, string> = {
  "ana-peluquera": "AG Beauty",
  recordatorios: "Recordatorios",
  passwordmanager: "Password Vault",
  regla: "Ayudándonos",
  "who-are-ya-backend": "Who Are Ya?",
  rides24ofiziala: "Rides24",
  "spotshare-parking": "Spotshare",
  "pke-web": "PKE Web",
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Mobile URL-bar show/hide must not re-measure the pinned reel mid-scroll.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

interface ProjectsProps {
  t: Tx;
  lang: Lang;
  top3: ProjectCard[];
  repos: RepoFull[];
  load: boolean;
  offline: boolean;
  errorMsg: string;
  BranchMergeBtn: React.ComponentType<{ label: string; href: string }>;
  onHoverProject: (proj: { name: string; color: string } | null) => void;
  menu?: boolean;
  expandedIdx: number | null;
  onToggleProject: (idx: number | null) => void;
  motionEnabled: boolean;
}

export function Projects({
  t,
  lang,
  top3,
  repos,
  load,
  offline,
  errorMsg,
  BranchMergeBtn,
  onHoverProject,
  menu,
  expandedIdx,
  onToggleProject,
  motionEnabled,
}: ProjectsProps) {
  const [activeRepo, setActiveRepo] = useState<number | null>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // 1. Mobile view detection
  const isMobile = useMobile();
  const reduced = usePreferredMotion();
  // The reel is driven by the visitor's own scroll, so only the OS reduced-motion preference opts out.
  const pinned = !reduced;
  const count = top3.length;

  // 2. Navigation persistence handling on mount / return
  const isReturning = useRef(false);

  useEffect(() => {
    if (top3.length === 0) return;
    const saved = loadNavState();
    if (!saved) return;
    isReturning.current = true;
    onToggleProject(saved.openIdx);
  }, [top3.length, onToggleProject]);

  useEffect(() => {
    if (!isReturning.current) return;
    const raf = requestAnimationFrame(() => {
      isReturning.current = false;
    });
    return () => cancelAnimationFrame(raf);
  }, [expandedIdx]);

  // Counter and progress are written to the DOM: re-rendering every card per scroll frame is wasteful.
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || count === 0) return;
    const show = (progress: number) => {
      const index = Math.min(count - 1, Math.round(progress * (count - 1)));
      if (counterRef.current)
        counterRef.current.textContent = String(index + 1).padStart(2, "0");
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${progress})`;
    };
    if (!pinned) {
      let frame = 0;
      const onScroll = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const max = track.scrollWidth - track.clientWidth;
          show(max > 0 ? track.scrollLeft / max : 0);
        });
      };
      show(0);
      track.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        cancelAnimationFrame(frame);
        track.removeEventListener("scroll", onScroll);
      };
    }
    // CSS sticky holds the stage (compositor, no pin jump); the section height is the scroll runway.
    const distance = () =>
      Math.max(0, track.scrollWidth - track.parentElement!.clientWidth);
    const setRunway = () =>
      section.style.setProperty("--reel-distance", `${distance()}px`);
    setRunway();
    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          onRefreshInit: setRunway,
          // Never rest between two cards: settle on the nearest one.
          snap:
            count > 1
              ? {
                  // Exact card offsets: equal fractions drift off the cards when gaps exist.
                  snapTo: (value: number) => {
                    const max = distance() || 1;
                    const first = (track.firstElementChild as HTMLElement).offsetLeft;
                    const stops = Array.from(track.children, (el) =>
                      Math.min(1, ((el as HTMLElement).offsetLeft - first) / max),
                    );
                    return stops.reduce((best, stop) =>
                      Math.abs(stop - value) < Math.abs(best - value) ? stop : best,
                    );
                  },
                  duration: { min: 0.25, max: 0.6 },
                  delay: 0.06,
                  ease: "power2.inOut",
                }
              : undefined,
          onUpdate: (self) => show(self.progress),
        },
      });
    }, section);
    return () => {
      ctx.revert();
      section.style.removeProperty("--reel-distance");
    };
  }, [pinned, count]);

  // 3. Bind GSAP entrance reveals
  useProjectsAnimations({ sectionRef, load, expandedIdx, motionEnabled });

  const handleToggle = (idx: number) => {
    const next = expandedIdx === idx ? null : idx;
    if (next !== null) {
      saveNavState({ openIdx: next, scrollY: window.scrollY });
    } else {
      clearNavState();
    }
    onToggleProject(next);
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        aria-label={t.woLb}
        data-reel={pinned ? "pinned" : "snap"}
        className="projects-reel-section relative z-[60] mx-auto max-w-[1440px] px-5 py-10 md:px-10 md:py-16"
      >
        <div className="projects-reel-stage">
        <div className="projects-header mb-5 md:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-8 md:w-10 bg-ink opacity-12" />
            <p className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase text-lead">
              {t.woLb || "PORTFOLIO DE INGENIERÍA"}
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <h2
              className="font-black text-[clamp(2.2rem,7vw,7rem)] tracking-tight leading-[0.95] text-ink uppercase perspective-1000"
              aria-label={t.woH}
            >
              <KineticText text={t.woH} enabled={motionEnabled && !reduced} />
            </h2>
            <span className="mb-1 flex items-center gap-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-lead">
              <span className="tabular-nums" aria-hidden="true">
                <span ref={counterRef} className="text-brand">01</span>
                <span className="opacity-40"> / </span>
                {String(Math.max(count, 1)).padStart(2, "0")}
              </span>
              <span className="text-[10px]">{UI_COPY[lang].workHint} →</span>
            </span>
          </div>
        </div>



        <div className="projects-reel-viewport">
        <div ref={trackRef} className="projects-list projects-reel">
          {top3.length === 0
            ? [0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="work-row-anim projects-reel-item">
                  <SkeletonRow idx={i} />
                </div>
              ))
            : top3.map((p, i) => (
                <div key={p.n} className="work-row-anim projects-reel-item">
                  <PremiumWorkRow
                    lang={lang}
                    proj={p}
                    idx={i}
                    isExpanded={expandedIdx === i}
                    onToggle={() => handleToggle(i)}
                    onHoverProject={onHoverProject}
                    menu={menu}
                    skipAnimation={isReturning.current && expandedIdx === i}
                    motionEnabled={motionEnabled}
                  />
                </div>
              ))}
        </div>
        </div>
        <div className="projects-reel-progress" aria-hidden="true">
          <div ref={progressRef} />
        </div>
        </div>
      </section>

      <section
        id="github"
        data-section="github"
        aria-label={t.ghLb}
        className="border-t border-black/7 dark:border-white/10 py-8 md:py-14 px-5 md:px-8 max-w-[1200px] mx-auto relative z-10"
      >
        <div className="flex items-end justify-between pb-4 border-b border-black/7 dark:border-white/10 mb-1">
          <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-lead/60">
            {t.ghLb || "ACTIVIDAD"}
          </p>
          <span className="font-mono text-[9px] text-lead/40">
            {offline ? "offline" : `${repos?.length || 0}_repos`}
          </span>
        </div>

        <div className="min-h-[200px]">
          {offline && (
            <div className="my-6 px-5 py-6 rounded-2xl border border-red-500/15 dark:border-red-500/10 bg-gradient-to-br from-red-50/40 via-transparent to-transparent dark:from-red-950/15 dark:via-transparent backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl bg-red-500/10 dark:bg-red-500/5 border border-red-500/15 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-red-500 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-ink mb-1.5">
                    Error al conectar con GitHub API
                  </h3>
                  {errorMsg && (
                    <code className="block text-[11px] font-mono text-red-600 dark:text-red-400 bg-red-500/5 dark:bg-red-500/[0.07] rounded-lg px-3 py-2 mb-3 border border-red-500/10 break-all">
                      {errorMsg}
                    </code>
                  )}
                  <p className="text-[12px] leading-relaxed text-lead/60 mb-4">
                    Para ver mis últimos repositorios, visita mi perfil de
                    GitHub directamente.
                  </p>
                  <a
                    href="https://github.com/eneekoruiz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-page text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-transform shadow-md"
                  >
                    Ver perfil en GitHub
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          )}
          {load ? (
            <div className="py-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-b border-black/7 dark:border-white/10 py-5 flex items-center gap-5 animate-pulse"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <span className="w-5 h-3 rounded bg-black/8 dark:bg-white/8 shrink-0" />
                  <span className="h-4 flex-1 max-w-[220px] rounded bg-black/8 dark:bg-white/8" />
                </div>
              ))}
            </div>
          ) : !offline && repos.length > 0 ? (
            <div>
              {repos.slice(0, 10).map((r, i) => (
                <RepoRow
                  key={r.id}
                  r={r}
                  idx={i}
                  activeRepo={activeRepo}
                  setActiveRepo={setActiveRepo}
                  lineRef={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  isMobile={isMobile}
                  menu={menu}
                  actionLabel={UI_COPY[lang]?.source || "Ver código"}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex justify-center mt-10 md:mt-12">
          <BranchMergeBtn
            label={t.moreGh || "VER TODO EN GITHUB"}
            href="https://github.com/eneekoruiz"
          />
        </div>
      </section>
    </>
  );
}
