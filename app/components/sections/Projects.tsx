"use client";

/**
 * PROJECTS SECTION — Selected Works & GitHub Activity
 * ─────────────────────────────────────────────────────────────────────────────
 * Selected works run as a horizontal reel. Vertical scroll holds the stage only
 * for the first PINNED_CARDS cards, then the page moves on; the rest stay one
 * swipe, trackpad gesture or arrow away. Reduced motion gets native scroll-snap.
 */

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
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

/** Cards the vertical scroll walks through before releasing the page. */
const PINNED_CARDS = 3;
/** Vertical scroll spent per card while the stage is held, as a share of the viewport. */
const SCROLL_PER_CARD = 0.6;

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
  const runwayRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // 1. Mobile view detection
  const isMobile = useMobile();
  const reduced = usePreferredMotion();
  // The reel is driven by the visitor's own scroll, so only the OS reduced-motion preference opts out.
  const pinned = !reduced;
  const count = top3.length;
  const held = Math.min(PINNED_CARDS, count);
  const triggerRef = useRef<ScrollTrigger | null>(null);

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

  // The track is the horizontal scroller in every mode. While the stage is held,
  // vertical scroll writes its scrollLeft; once released it scrolls natively.
  // Counter and progress are written to the DOM: re-rendering every card per frame is wasteful.
  useEffect(() => {
    const runway = runwayRef.current;
    const track = trackRef.current;
    if (!runway || !track || count === 0) return;
    const cards = () => Array.from(track.children) as HTMLElement[];
    const step = () => {
      const [a, b] = cards();
      return b ? b.offsetLeft - a.offsetLeft : track.clientWidth;
    };
    let frame = 0;
    const show = () => {
      frame = 0;
      const max = track.scrollWidth - track.clientWidth;
      const index = Math.min(count - 1, Math.round(track.scrollLeft / step()));
      if (counterRef.current)
        counterRef.current.textContent = String(index + 1).padStart(2, "0");
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${max > 0 ? track.scrollLeft / max : 0})`;
      const atStart = String(track.scrollLeft < 4);
      const atEnd = String(track.scrollLeft > max - 4);
      if (track.dataset.atStart !== atStart) track.dataset.atStart = atStart;
      if (track.dataset.atEnd !== atEnd) track.dataset.atEnd = atEnd;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(show);
    };
    show();
    track.addEventListener("scroll", onScroll, { passive: true });
    const release = (free: boolean) => {
      if (track.dataset.free !== String(free)) track.dataset.free = String(free);
    };
    if (!pinned) {
      release(true);
      return () => {
        cancelAnimationFrame(frame);
        track.removeEventListener("scroll", onScroll);
      };
    }
    // Horizontal distance covered while held: up to the last pinned card.
    const distance = () => {
      const list = cards();
      const last = list[held - 1];
      if (!last) return 0;
      return Math.min(last.offsetLeft - list[0].offsetLeft, track.scrollWidth - track.clientWidth);
    };
    const setRunway = () =>
      runway.style.setProperty(
        "--reel-runway",
        `${Math.round((held - 1) * SCROLL_PER_CARD * innerHeight)}px`,
      );
    setRunway();
    release(false);
    let rewind: gsap.core.Tween | undefined;
    const trigger = (triggerRef.current = ScrollTrigger.create({
      trigger: runway,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onRefreshInit: setRunway,
      onUpdate: (self) => {
        // At the last held card the reel lets go: the rest scroll natively.
        if (self.progress > 0.999) {
          if (track.dataset.free !== "true") track.scrollLeft = distance();
          release(true);
          return;
        }
        if (track.dataset.free === "true") {
          release(false);
          // Coming back up after browsing the rest: glide back to the last held card.
          if (Math.abs(track.scrollLeft - self.progress * distance()) > 2)
            rewind = gsap.to(track, {
              scrollLeft: () => trigger.progress * distance(),
              duration: 0.35,
              ease: "power2.out",
            });
        }
        if (!rewind?.isActive()) track.scrollLeft = self.progress * distance();
      },
      onLeave: () => release(true),
      // Settle on a card, in the direction of travel, never between two.
      snap:
        held > 1
          ? {
              snapTo: 1 / (held - 1),
              directional: true,
              duration: { min: 0.18, max: 0.4 },
              delay: 0.04,
              ease: "power2.out",
            }
          : undefined,
    }));
    return () => {
      cancelAnimationFrame(frame);
      rewind?.kill();
      trigger.kill();
      triggerRef.current = null;
      track.removeEventListener("scroll", onScroll);
      runway.style.removeProperty("--reel-runway");
      delete track.dataset.free;
    };
  }, [pinned, count, held]);

  const page = (direction: 1 | -1) => (event: React.MouseEvent<HTMLButtonElement>) => {
    const track = trackRef.current;
    if (!track) return;
    triggerTectonicImpact(event.clientX, event.clientY, 0.6);
    const [a, b] = Array.from(track.children) as HTMLElement[];
    const step = b ? b.offsetLeft - a.offsetLeft : track.clientWidth;
    const target = Math.max(0, Math.min(count - 1, Math.round(track.scrollLeft / step) + direction));
    const slide = () => {
      track.dataset.free = "true";
      track.scrollTo({ left: target * step, behavior: motionEnabled ? "smooth" : "instant" });
    };
    const trigger = triggerRef.current;
    // Up to the last held card the page scroll owns the reel: move the page instead.
    if (trigger && held > 1 && scrollY <= trigger.end + 1 && (target < held || direction < 0)) {
      const y = trigger.start + (Math.min(target, held - 1) / (held - 1)) * (trigger.end - trigger.start);
      const then = target > held - 1 ? slide : undefined;
      if (window.__lenis && motionEnabled)
        window.__lenis.scrollTo(y, { duration: 0.6, onComplete: then });
      else {
        window.scrollTo({ top: y, behavior: "instant" });
        then?.();
      }
      return;
    }
    slide();
  };

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
        className="projects-reel-section relative z-[60] mx-auto max-w-[1440px] pt-10 md:pt-16"
      >
        <div className="projects-header px-5 md:px-10">
          <h2
            className="font-black text-[clamp(2.2rem,6vw,5.5rem)] tracking-tight leading-[0.95] text-ink perspective-1000"
            aria-label={t.woH}
          >
            <KineticText text={t.woH} enabled={motionEnabled && !reduced} />
          </h2>
        </div>

        <div ref={runwayRef} className="projects-reel-runway">
          <div className="projects-reel-stage">
            <div
              ref={trackRef}
              className="projects-list projects-reel"
              aria-label={t.woLb}
              tabIndex={-1}
            >
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
            <div className="projects-reel-footer">
              <div className="projects-reel-progress" aria-hidden="true">
                <div ref={progressRef} />
              </div>
              <span
                className="font-mono text-[11px] font-bold tabular-nums tracking-[0.18em] text-lead"
                aria-hidden="true"
              >
                <span ref={counterRef} className="text-ink">01</span>
                <span className="opacity-40"> / </span>
                {String(Math.max(count, 1)).padStart(2, "0")}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="projects-reel-arrow"
                  data-reel-prev
                  aria-label={UI_COPY[lang].reelPrev}
                  onClick={page(-1)}
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="projects-reel-arrow"
                  data-reel-next
                  aria-label={UI_COPY[lang].reelNext}
                  onClick={page(1)}
                >
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
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
            {offline ? "offline" : `${repos?.length || 0} repos`}
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
