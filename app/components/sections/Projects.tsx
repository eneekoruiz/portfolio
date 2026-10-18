"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ArrowRight, ExternalLink } from "lucide-react";
import type { ProjectCard, RepoFull, Tx, Lang } from "../../types";
import { KineticText } from "../motion/KineticText";
import { usePreferredMotion } from "../../hooks/usePreferredMotion";
import { UI_COPY } from "../../data/interface-translations";
import { useMobile } from "../../hooks/useMobile";
import { ProjectVisual } from "../motion/ProjectVisual";
import { useUmbral } from "../motion/UmbralProvider";
import { getTechColor } from "../../lib/constants";
import { PROJECTS_CONTENT } from "../../data/projects";
import { PROJ_THEMES, DEFAULT_THEME } from "../../data/config";
import { RepoRow } from "./projects/RepoRow";
import { SkeletonRow } from "./projects/SkeletonRow";
import { useRouter } from "next/navigation";

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
  motionEnabled,
}: ProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeRepo, setActiveRepo] = useState<number | null>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isMobile = useMobile();
  const reduced = usePreferredMotion();
  const router = useRouter();
  const navigateUmbral = useUmbral();

  // ── GSAP HORIZONTAL SCROLL PIN (DESKTOP) ──
  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;

    if (!section || !pin || !track || isMobile || reduced || !motionEnabled) {
      return;
    }

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        return track.scrollWidth - window.innerWidth + 96;
      };

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollAmount() * 1.2}`,
          pin: true,
          scrub: 0.65,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
            const count = top3.length;
            if (count > 0) {
              const currentIdx = Math.min(
                count - 1,
                Math.floor(self.progress * count),
              );
              setActiveIndex(currentIdx);
            }
          },
        },
      });

      return () => {
        tween.kill();
      };
    }, section);

    return () => ctx.revert();
  }, [top3.length, isMobile, reduced, motionEnabled]);

  const handleNavigate = (
    e: React.MouseEvent<HTMLElement>,
    safeId: string,
    color: string,
  ) => {
    const url = `/work/${safeId}`;
    try {
      navigateUmbral({
        source: e.currentTarget,
        id: safeId,
        color,
        url,
      });
    } catch {
      router.push(url);
    }
  };

  return (
    <>
      {/* ── SELECTED WORKS HORIZONTAL PINNED SECTION ── */}
      <section
        ref={sectionRef}
        id="work"
        aria-label={t.woLb}
        className={`relative z-[40] w-full bg-page transition-colors duration-300 ${
          isMobile ? "py-12 px-5" : ""
        }`}
      >
        <div
          ref={pinRef}
          className={`${
            isMobile
              ? "w-full"
              : "h-screen w-full flex flex-col justify-between overflow-hidden px-6 md:px-14 py-8 md:py-12"
          }`}
        >
          {/* Header */}
          <div className="projects-header mb-4 md:mb-6 shrink-0">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                <p className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase text-lead">
                  {t.woLb || "PORTFOLIO DE INGENIERÍA"}
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-lead bg-ink/5 dark:bg-white/5 px-3 py-1 rounded-full border border-ink/10">
                <span className="text-brand">
                  0{activeIndex + 1}
                </span>
                <span className="opacity-40">/</span>
                <span>0{top3.length}</span>
              </div>
            </div>
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-black text-[clamp(2rem,5.5vw,4.5rem)] tracking-tight leading-[0.95] text-ink uppercase">
                <KineticText text={t.woH} enabled={motionEnabled && !reduced} />
              </h2>
              <span className="hidden md:inline-block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-lead/60 pb-1">
                [ SCROLL VERTICAL → HORIZONTAL REEL ]
              </span>
            </div>
          </div>

          {/* Horizontal Reel Track */}
          <div
            ref={trackRef}
            className={`${
              isMobile
                ? "flex gap-5 overflow-x-auto snap-x snap-mandatory py-4 scrollbar-none -mx-5 px-5"
                : "flex gap-8 md:gap-10 items-stretch h-[65vh] max-h-[640px] my-auto will-change-transform"
            }`}
          >
            {top3.length === 0
              ? [0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-[85vw] max-w-[540px] md:w-[60vw] md:max-w-[740px] shrink-0 h-full"
                  >
                    <SkeletonRow idx={i} />
                  </div>
                ))
              : top3.map((p, i) => {
                  const safeId = p.name.toLowerCase().replace(/[\s_]+/g, "-");
                  const theme = PROJ_THEMES[safeId] ?? DEFAULT_THEME;
                  const content = PROJECTS_CONTENT[safeId]?.[lang];
                  const title = content?.title ?? p.name;
                  const objective = content?.objective ?? p.desc;
                  const role = content?.role ?? "Engineering";

                  return (
                    <article
                      key={p.n}
                      className={`group relative flex flex-col justify-between rounded-3xl p-6 md:p-8 border border-ink/10 dark:border-white/10 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl shadow-glass transition-all duration-300 hover:border-brand/40 ${
                        isMobile
                          ? "w-[85vw] max-w-[420px] shrink-0 snap-center"
                          : "w-[85vw] max-w-[540px] md:w-[58vw] md:max-w-[760px] shrink-0 h-full"
                      }`}
                      onPointerEnter={() =>
                        onHoverProject({ name: p.name, color: theme.color })
                      }
                      onPointerLeave={() => onHoverProject(null)}
                    >
                      {/* Top Bar inside card */}
                      <div>
                        <div className="flex items-center justify-between gap-3 pb-3 border-b border-ink/5 dark:border-white/5">
                          <span className="font-mono text-xs font-bold text-brand tracking-widest uppercase">
                            0{i + 1} // {role}
                          </span>
                          <span className="font-mono text-[10px] text-lead/60 uppercase tracking-wider">
                            CASE STUDY
                          </span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-black tracking-tight text-ink mt-3">
                          {title}
                        </h3>
                        <p className="text-xs md:text-sm leading-relaxed text-lead mt-2 line-clamp-2 md:line-clamp-3">
                          {objective}
                        </p>
                      </div>

                      {/* Visual Centerpiece */}
                      <div className="relative my-4 flex-1 min-h-[160px] md:min-h-[220px] rounded-2xl overflow-hidden border border-ink/5 dark:border-white/5 bg-zinc-100 dark:bg-zinc-900/60 flex items-center justify-center p-3">
                        <ProjectVisual id={safeId} priority={i < 2} />
                      </div>

                      {/* Bottom Details & Actions */}
                      <div className="pt-3 border-t border-ink/5 dark:border-white/5 flex flex-col gap-3">
                        {/* Tech Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {(p.langs ?? []).slice(0, 5).map((tech: string) => (
                            <span
                              key={tech}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-medium border border-ink/10 dark:border-white/10 bg-ink/[0.02] dark:bg-white/[0.02] text-ink/80"
                            >
                              <span
                                className="h-1.5 w-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: getTechColor(tech) }}
                              />
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between gap-3 pt-1">
                          <button
                            type="button"
                            onClick={(e) => handleNavigate(e, safeId, theme.color)}
                            className="materia-button bg-brand text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-98 transition-all shadow-[0_4px_16px_rgba(0,102,255,0.25)]"
                          >
                            <span>{UI_COPY[lang].details || "Detalles"}</span>
                            <ArrowRight size={14} />
                          </button>

                          <a
                            href={`https://github.com/eneekoruiz/${safeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="materia-button border border-ink/15 dark:border-white/15 text-ink text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-ink/5 dark:hover:bg-white/5 transition-all"
                            aria-label={`Ver repositorio de ${title}`}
                          >
                            <span className="font-mono text-[11px]">GitHub</span>
                            <ArrowUpRight size={13} />
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
          </div>

          {/* Bottom Progress Bar Track (Desktop) */}
          {!isMobile && (
            <div className="w-full mt-4 shrink-0">
              <div className="h-[2px] w-full bg-ink/10 dark:bg-white/10 relative overflow-hidden rounded-full">
                <div
                  ref={progressRef}
                  className="absolute inset-0 bg-brand origin-left transition-transform duration-75"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── GITHUB ACTIVITY SECTION ── */}
      <section
        id="github"
        data-section="github"
        aria-label={t.ghLb}
        className="border-t border-black/7 dark:border-white/10 py-12 md:py-16 px-5 md:px-8 max-w-[1200px] mx-auto relative z-10"
      >
        <div className="flex items-end justify-between pb-4 border-b border-black/7 dark:border-white/10 mb-4">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-lead/60">
            {t.ghLb || "ACTIVIDAD OPEN SOURCE"}
          </p>
          <span className="font-mono text-[10px] text-lead/40">
            {offline ? "offline" : `${repos?.length || 0}_repos`}
          </span>
        </div>

        <div className="min-h-[200px]">
          {offline && (
            <div className="my-6 px-5 py-6 rounded-2xl border border-red-500/15 dark:border-red-500/10 bg-gradient-to-br from-red-50/40 via-transparent to-transparent dark:from-red-950/15 dark:via-transparent backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl bg-red-500/10 dark:bg-red-500/5 border border-red-500/15 flex items-center justify-center">
                  <ExternalLink size={16} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-900 dark:text-red-300">
                    Modo Offline
                  </h3>
                  <p className="text-xs text-red-700/80 dark:text-red-400/80 mt-1">
                    Mostrando snapshot local de actividad de repositorios GitHub.
                  </p>
                </div>
              </div>
            </div>
          )}

          {load ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-ink/5 dark:bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {repos?.slice(0, 6).map((repo, i) => (
                <RepoRow
                  key={repo.id}
                  r={repo}
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
          )}
        </div>
      </section>
    </>
  );
}
