"use client";

import { useRef, useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { UI_COPY } from "../../../data/interface-translations";
import { TX } from "../../../data/translations";
import { PROJECTS_CONTENT } from "../../../data/projects";
import { ArrowUpRight, ArrowRight, Plus } from "lucide-react";
import { getTechColor } from "../../../lib/constants";
import type { ProjectCard, Lang } from "../../../types";
import { PROJ_THEMES, DEFAULT_THEME } from "../../../data/config";
import { saveNavState } from "../../../lib/navigationPersistence";
import { useMateriaSurface } from "../../../hooks/useMateriaSurface";
import { useSpringAccordion } from "../../../hooks/useSpringAccordion";
import { useSpringHover } from "../../../hooks/useSpringHover";
import { usePreferredMotion } from "../../../hooks/usePreferredMotion";
import { useProjectTension } from "../../../hooks/useProjectTension";
import { useUmbral } from "../../motion/UmbralProvider";
import { ProjectVisual } from "../../motion/ProjectVisual";

interface WorkRowProps {
  proj: ProjectCard;
  idx: number;
  isExpanded: boolean;
  onToggle: () => void;
  onHoverProject: (project: { name: string; color: string } | null) => void;
  menu?: boolean;
  skipAnimation?: boolean;
  motionEnabled: boolean;
  lang: Lang;
}

export function PremiumWorkRow({
  proj,
  idx,
  isExpanded,
  onToggle,
  onHoverProject,
  menu,
  skipAnimation,
  motionEnabled,
  lang,
}: WorkRowProps) {
  const router = useRouter();
  const navigate = useUmbral();
  const reduced = usePreferredMotion();
  const enabled = motionEnabled && !reduced && !menu;
  const rowRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefetched = useRef(false);
  const [lensStep, setLensStep] = useState(0);
  const safeId = proj.name.toLowerCase().replace(/[\s_]+/g, "-");
  const panelId = `panel-${safeId}`;
  const theme = PROJ_THEMES[safeId] ?? DEFAULT_THEME;
  const copy = UI_COPY[lang];
  const content = PROJECTS_CONTENT[safeId]?.[lang];
  const lens = [
    {
      label: copy.stages[0],
      title: content?.title ?? proj.name,
      body: content?.objective ?? proj.desc,
    },
    {
      label: copy.stages[1],
      title: content?.algorithmH ?? copy.stages[1],
      body: content?.algorithmP ?? proj.desc,
    },
    {
      label: copy.stages[2],
      title: content?.outcomeH ?? copy.stages[2],
      body: content?.outcomeP ?? proj.desc,
    },
  ];
  const actionRef = useSpringHover<HTMLAnchorElement>(enabled);
  useMateriaSurface(rowRef, theme.color, enabled);
  useProjectTension(rowRef, enabled, isExpanded, idx);
  useSpringAccordion(bodyRef, contentRef, isExpanded, enabled, skipAnimation);
  const prefetch = () => {
    if (theme.hasAudit && !prefetched.current) {
      prefetched.current = true;
      router.prefetch(`/work/${safeId}`);
    }
  };
  useEffect(() => {
    if (!theme.hasAudit || !rowRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || prefetched.current) return;
        prefetched.current = true;
        router.prefetch(`/work/${safeId}`);
        observer.disconnect();
      },
      { rootMargin: "240px" },
    );
    observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, [router, safeId, theme.hasAudit]);
  const handleNavigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !rowRef.current
    )
      return;
    event.preventDefault();
    saveNavState({ openIdx: idx, scrollY: window.scrollY });
    onHoverProject(null);
    navigate({
      source: rowRef.current,
      id: safeId,
      color: theme.color,
      url: `/work/${safeId}`,
    });
  };
  return (
    <div
      ref={rowRef}
      data-materia-surface={safeId}
      data-expanded={isExpanded}
      className="materia-surface work-surface group/work relative rounded-[20px] border border-ink/15 text-ink"
      style={{ "--surface-color": theme.color } as CSSProperties}
    >
      <div className="work-orbit-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <button
        id={`btn-${safeId}`}
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        className="work-surface-header relative z-10 grid w-full grid-cols-[1.5rem_1fr_2.5rem] items-center gap-3 px-4 py-7 text-start outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand rounded-[20px] md:grid-cols-[2rem_1.1fr_0.9fr_2.5rem] md:gap-5 md:px-8 md:py-10"
        data-cursor-plus={isExpanded ? undefined : "true"}
        data-cursor-minus={isExpanded ? "true" : undefined}
      >
        <span className="order-1 self-start pt-2 font-mono text-[11px] tabular-nums text-lead">
          {String(idx + 1).padStart(2, "0")}
        </span>
        <div className="order-2 min-w-0">
          <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-lead">
            <span>{TX[lang].projectTags[idx] ?? proj.tag}</span>
            <span>{proj.year}</span>
          </div>
          <h3
            data-project-title
            className="work-project-title text-balance break-words text-[clamp(1.65rem,4vw,4.2rem)] font-bold capitalize leading-[1.04] tracking-[-0.055em]"
          >
            {safeId === "ana-peluquera"
              ? "AG Beauty Salon"
              : proj.name.replace(/[-_]/g, " ")}
          </h3>
        </div>
        <div
          className="order-4 col-span-3 mt-3 min-w-0 md:order-3 md:col-span-1 md:mt-0"
          aria-hidden="true"
        >
          <ProjectVisual id={safeId} />
        </div>
        <span
          className="work-expand-icon order-3 flex h-10 w-10 items-center justify-center rounded-full border border-current md:order-4"
          style={{ color: theme.color }}
          aria-hidden="true"
        >
          <Plus size={18} strokeWidth={1.5} />
        </span>
      </button>
      <div
        ref={bodyRef}
        id={panelId}
        data-project-body
        role="region"
        aria-labelledby={`btn-${safeId}`}
        aria-hidden={!isExpanded}
        inert={!isExpanded}
        className="relative z-10 overflow-hidden"
        style={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
      >
        <div
          ref={contentRef}
          className="grid gap-4 px-4 pb-5 pt-2 md:grid-cols-[1fr_1.5fr] md:px-6 md:pb-6"
        >
          <div
            data-work-panel
            className="work-lifecycle flex flex-col justify-between gap-7 rounded-2xl border p-5 md:p-7"
          >
            <div>
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.14em] text-lead">
                {copy.lifecycle}
              </p>
              <ol className="work-lifecycle-track flex flex-col gap-5">
                {copy.stages.map((stage, i) => (
                  <li
                    key={stage}
                    className="relative flex items-start gap-4 text-xs leading-relaxed"
                  >
                    <span
                      className="relative z-10 mt-1 h-2 w-2 shrink-0 rounded-full"
                      style={{
                        background:
                          i < theme.progress ? theme.color : "var(--lead)",
                        opacity: i < theme.progress ? 1 : 0.3,
                      }}
                      aria-hidden="true"
                    />
                    <span
                      className={i < theme.progress ? "text-ink" : "text-lead"}
                    >
                      {stage}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <a
              ref={actionRef}
              href={
                theme.hasAudit
                  ? `/work/${safeId}`
                  : `https://github.com/eneekoruiz/${proj.name}`
              }
              onClick={theme.hasAudit ? handleNavigate : undefined}
              onFocus={prefetch}
              onPointerEnter={(event) => {
                prefetch();
                if (enabled && event.pointerType !== "touch")
                  onHoverProject({ name: proj.name, color: theme.color });
              }}
              onPointerLeave={() => onHoverProject(null)}
              onPointerCancel={() => onHoverProject(null)}
              target={theme.hasAudit ? undefined : "_blank"}
              rel={theme.hasAudit ? undefined : "noopener noreferrer"}
              className="materia-button work-project-action w-fit bg-ink text-page"
            >
              {theme.hasAudit ? copy.explore : copy.source}
              {theme.hasAudit ? (
                <ArrowRight size={16} aria-hidden="true" />
              ) : (
                <ArrowUpRight size={16} aria-hidden="true" />
              )}
            </a>
          </div>
          <div
            data-work-panel
            className="flex flex-col justify-between gap-7 rounded-2xl border border-ink/10 bg-page/80 p-5 md:p-7"
          >
            <div
              data-decision-lens
              className="rounded-xl border border-ink/10 bg-page/60 p-4 md:p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-lead">
                  {copy.lifecycle}
                </p>
                <span
                  className="font-mono text-[10px] tabular-nums text-lead"
                  aria-live="polite"
                >
                  {String(lensStep + 1).padStart(2, "0")} / 03
                </span>
              </div>
              <div
                role="tablist"
                aria-label={copy.lifecycle}
                className="relative grid grid-cols-3 border-b border-ink/10"
              >
                {lens.map((item, i) => (
                  <button
                    key={item.label}
                    id={`${panelId}-lens-tab-${i}`}
                    type="button"
                    role="tab"
                    aria-selected={lensStep === i}
                    aria-controls={`${panelId}-lens-panel`}
                    tabIndex={lensStep === i ? 0 : -1}
                    onClick={() => setLensStep(i)}
                    onKeyDown={(event) => {
                      const next =
                        event.key === "ArrowRight"
                          ? (i + 1) % lens.length
                          : event.key === "ArrowLeft"
                            ? (i - 1 + lens.length) % lens.length
                            : event.key === "Home"
                              ? 0
                              : event.key === "End"
                                ? lens.length - 1
                                : null;
                      if (next === null) return;
                      event.preventDefault();
                      setLensStep(next);
                      requestAnimationFrame(() =>
                        document
                          .getElementById(`${panelId}-lens-tab-${next}`)
                          ?.focus(),
                      );
                    }}
                    className="relative min-h-11 px-1 text-start font-mono text-[9px] uppercase tracking-[0.08em] text-lead transition-colors duration-300 hover:text-ink focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand md:px-2 md:text-[10px]"
                  >
                    {item.label}
                  </button>
                ))}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-[-1px] left-0 h-px w-1/3 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
                  style={{
                    background: theme.color,
                    transform: `translate3d(${lensStep * 100}%, 0, 0)`,
                  }}
                />
              </div>
              <div
                key={`${safeId}-${lang}-${lensStep}`}
                id={`${panelId}-lens-panel`}
                role="tabpanel"
                aria-labelledby={`${panelId}-lens-tab-${lensStep}`}
                data-lens-panel
                className="work-lens-panel pt-5"
              >
                <h4 className="mb-2 text-balance text-lg font-semibold tracking-[-0.03em] md:text-xl">
                  {lens[lensStep].title}
                </h4>
                <p className="max-w-xl text-sm leading-relaxed text-lead md:text-base">
                  {lens[lensStep].body}
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-[1fr_1fr] gap-5">
              <div>
                <dt className="mb-1 font-mono text-[10px] uppercase tracking-wider text-lead">
                  {copy.year}
                </dt>
                <dd className="text-sm font-semibold">{proj.year}</dd>
              </div>
              <div>
                <dt className="mb-1 font-mono text-[10px] uppercase tracking-wider text-lead">
                  {copy.size}
                </dt>
                <dd dir="ltr" className="text-sm font-semibold">
                  {proj.size === "Premium" ? "—" : proj.size}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="mb-3 font-mono text-[10px] uppercase tracking-wider text-lead">
                  {copy.technologies}
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {proj.langs.map((language) => (
                    <span
                      key={language}
                      className="flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1 text-[11px] font-medium"
                      style={{
                        background: `${getTechColor(language)}15`,
                        borderColor: `${getTechColor(language)}55`,
                      }}
                    >
                      <span
                        className="h-1 w-1 rounded-full"
                        style={{ background: getTechColor(language) }}
                      />
                      {language}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            {theme.hasAudit && (
              <a
                href={`https://github.com/eneekoruiz/${proj.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 w-fit items-center gap-3 text-xs font-semibold text-ink underline decoration-ink/25 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
              >
                {copy.source}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
