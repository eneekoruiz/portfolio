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

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

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

  // 1. Mobile view detection
  const isMobile = useMobile();
  const reduced = usePreferredMotion();

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
        className="py-10 md:py-16 px-5 md:px-10 max-w-[1440px] mx-auto relative z-[60]"
      >
        <div className="projects-header mb-6 md:mb-10">
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
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-lead mb-1">
              {UI_COPY[lang].workHint} ↓
            </span>
          </div>
        </div>

        {/* 3D Kinetic Spatial Project Navigator */}
        {top3.length > 0 && (
          <div
            className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[11px] select-none"
            role="tablist"
            aria-label="Navegador de proyectos 3D"
          >
            <span className="text-[10px] uppercase tracking-widest text-lead/60 mr-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              NAV_3D:
            </span>
            {top3.map((p, i) => {
              const safeId = p.name.toLowerCase().replace(/[\s_]+/g, "-");
              const isSelected = expandedIdx === i;
              return (
                <button
                  key={p.n}
                  type="button"
                  onClick={(e) => {
                    triggerTectonicImpact(e.clientX, e.clientY, 0.95);
                    handleToggle(i);
                    const el = document.querySelector(
                      `[data-materia-surface="${safeId}"]`,
                    );
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }}
                  onPointerEnter={() =>
                    onHoverProject({ name: p.name, color: "#0066ff" })
                  }
                  onPointerLeave={() => onHoverProject(null)}
                  className={`group relative flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all duration-300 ${
                    isSelected
                      ? "border-brand bg-brand/10 text-ink shadow-[0_0_15px_rgba(0,102,255,0.25)]"
                      : "border-ink/10 bg-ink/[0.02] text-lead hover:border-ink/30 hover:text-ink hover:-translate-y-0.5"
                  }`}
                  style={{
                    perspective: "600px",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <span className="font-bold text-ink/70">0{i + 1}</span>
                  <span className="hidden sm:inline font-medium uppercase tracking-wider">
                    {PROJECT_NAV_NAMES[safeId] ?? p.name.replace(/[-_]/g, " ")}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-transform duration-300 ${
                      isSelected
                        ? "bg-brand scale-125"
                        : "bg-ink/20 group-hover:bg-brand"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}

        <div className="projects-list space-y-4 md:space-y-5">
          {top3.length === 0
            ? [0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="work-row-anim">
                  <SkeletonRow idx={i} />
                </div>
              ))
            : top3.map((p, i) => (
                <div key={p.n} className="work-row-anim">
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
