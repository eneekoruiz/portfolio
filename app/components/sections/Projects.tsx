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
import { ChapterTitle } from "./ChapterTitle";
import { usePreferredMotion } from "../../hooks/usePreferredMotion";
import { UI_COPY } from "../../data/interface-translations";

// Custom Hooks & Utilities
import { useMobile } from "../../hooks/useMobile";
import { useProjectsAnimations } from "../../hooks/useProjectsAnimations";
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
  motionEnabled,
}: ProjectsProps) {
  const [activeRepo, setActiveRepo] = useState<number | null>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // 1. Mobile view detection
  const isMobile = useMobile();
  const reduced = usePreferredMotion();
  // The reel is driven by the visitor's own scroll, so only the OS reduced-motion preference opts out.
  const pinned = !reduced;
  const count = top3.length;
  const held = Math.min(PINNED_CARDS, count);
  const triggerRef = useRef<ScrollTrigger | null>(null);

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
      // While the reel holds the screen the top bar steps aside for the work.
      onToggle: (self) =>
        document.documentElement.toggleAttribute("data-reel-stage", self.isActive),
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
      document.documentElement.removeAttribute("data-reel-stage");
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
  useProjectsAnimations({ sectionRef, load, motionEnabled });

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        aria-labelledby="work-heading"
        data-reel={pinned ? "pinned" : "snap"}
        className="projects-reel-section relative z-[60] mx-auto max-w-[1440px]"
      >
        <div className="projects-header px-5 md:px-10">
          <ChapterTitle id="work-heading" title={t.woH} />
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
                        onHoverProject={onHoverProject}
                        menu={menu}
                        motionEnabled={motionEnabled}
                      />
                    </div>
                  ))}
            </div>
            <div className="projects-reel-footer">
              <div className="projects-reel-progress" aria-hidden="true">
                <div ref={progressRef} />
              </div>
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
        aria-labelledby="github-heading"
        className="chapter github-chapter relative z-10"
      >
        <header className="chapter-head github-head">
          <ChapterTitle id="github-heading" title="GitHub." />
          <span className="github-count">
            {offline ? "" : `${repos?.length || 0} repos`}
          </span>
        </header>

        <div>
          {offline && (
            <p className="github-offline">
              {errorMsg ? `${errorMsg}. ` : ""}
              <a
                href="https://github.com/eneekoruiz"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/eneekoruiz
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </p>
          )}
          {load ? (
            <div className="py-4">
              {[0, 1, 2, 3].map((i) => (
                // Static: the fetch waits until the chapter is near, and a pulse
                // kept the compositor busy off-screen for the whole visit.
                <div
                  key={i}
                  className="border-b border-black/7 dark:border-white/10 py-5 flex items-center gap-5"
                >
                  <span className="w-5 h-3 rounded bg-black/8 dark:bg-white/8 shrink-0" />
                  <span className="h-4 flex-1 max-w-[220px] rounded bg-black/8 dark:bg-white/8" />
                </div>
              ))}
            </div>
          ) : !offline && repos.length > 0 ? (
            <div>
              {repos.slice(0, 6).map((r, i) => (
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

        <div className="github-more">
          <BranchMergeBtn
            label={t.moreGh || "VER TODO EN GITHUB"}
            href="https://github.com/eneekoruiz"
          />
        </div>
      </section>
    </>
  );
}
