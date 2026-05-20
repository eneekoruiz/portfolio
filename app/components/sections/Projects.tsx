"use client";

/**
 * PROJECTS SECTION — Selected Works & GitHub Activity
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders the expandable project accordion and GitHub activity list.
 * Includes scroll-based skew inertia and responsive layout handling.
 */

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import type { ProjectCard, RepoFull, Tx } from "../../types";

// Custom Hooks & Utilities
import { useMobile } from "../../hooks/useMobile";
import { useProjectsAnimations } from "../../hooks/useProjectsAnimations";
import {
  loadNavState,
  saveNavState,
  clearNavState,
} from "../../lib/navigationPersistence";

// Subcomponents
import { RepoRow } from "./projects/RepoRow";
import { PremiumWorkRow } from "./projects/PremiumWorkRow";
import { SkeletonRow } from "./projects/SkeletonRow";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

interface ProjectsProps {
  t: Tx;
  top3: ProjectCard[];
  repos: RepoFull[];
  load: boolean;
  offline: boolean;
  errorMsg: string;
  BranchMergeBtn: React.ComponentType<{ label: string; href: string }>;
  onHoverProject: (proj: { name: string; color: string } | null) => void;
  expandedIdx: number | null;
  onToggleProject: (idx: number | null) => void;
}

export function Projects({
  t,
  top3,
  repos,
  load,
  offline,
  errorMsg,
  BranchMergeBtn,
  onHoverProject,
  expandedIdx,
  onToggleProject,
}: ProjectsProps) {
  const [activeRepo, setActiveRepo] = useState<number | null>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // 1. Mobile view detection
  const isMobile = useMobile();

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

  // 3. Bind GSAP entrance reveals and inertial scrolling (Efecto Ola)
  useProjectsAnimations({ sectionRef, load, expandedIdx });

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
        aria-label="Proyectos"
        className="py-16 md:py-28 px-5 md:px-8 max-w-[1300px] mx-auto relative z-[60]"
      >
        <div className="projects-header mb-10 md:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-8 md:w-10 bg-ink opacity-12" />
            <p className="font-mono text-[8px] md:text-[9px] font-bold tracking-[0.32em] uppercase text-lead/50">
              {t.woLb || "PORTFOLIO DE INGENIERÍA"}
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <h2
              className="font-black text-[clamp(2.2rem,7vw,5.5rem)] tracking-tight leading-[0.95] text-ink uppercase italic perspective-1000"
              aria-label="Selected Works"
            >
              <span className="overflow-hidden inline-block py-2 pl-4 pr-12 -my-2 -ml-4 -mr-12">
                {"Selected".split("").map((c, i) => (
                  <span
                    key={i}
                    className="title-char inline-block will-change-transform pr-[0.1em]"
                  >
                    {c}
                  </span>
                ))}
              </span>
              <br />
              <span className="overflow-hidden inline-block py-2 pl-4 pr-12 -my-2 -ml-4 -mr-12">
                {"Works.".split("").map((c, i) => (
                  <span
                    key={i}
                    className="title-char inline-block will-change-transform pr-[0.1em]"
                  >
                    {c}
                  </span>
                ))}
              </span>
            </h2>
            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.22em] text-lead/30 mb-1">
              Click to expand ↓
            </span>
          </div>
        </div>

        <div className="projects-list border-t border-black/10 dark:border-white/10">
          {top3.length === 0
            ? [0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="work-row-anim">
                  <SkeletonRow idx={i} />
                </div>
              ))
            : top3.map((p, i) => (
                <div key={p.n} className="work-row-anim">
                  <PremiumWorkRow
                    proj={p}
                    idx={i}
                    isExpanded={expandedIdx === i}
                    onToggle={() => handleToggle(i)}
                    onHoverProject={onHoverProject}
                    skipAnimation={isReturning.current && expandedIdx === i}
                  />
                </div>
              ))}
        </div>
      </section>

      <section
        id="github"
        data-section="github"
        aria-label="Actividad de GitHub"
        className="border-t border-black/7 dark:border-white/10 py-12 md:py-22 px-5 md:px-8 max-w-[1200px] mx-auto relative z-10"
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
