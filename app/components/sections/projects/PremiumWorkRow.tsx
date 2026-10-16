"use client";

import { useRef, useState, type CSSProperties } from "react";
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
import { useProjectStage } from "../../../hooks/useProjectStage";
import { useMotionPolicy } from "../../../hooks/useMotionEnabled";
import { triggerTectonicImpact } from "../../../lib/tectonic";

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
  const { allowed } = useMotionPolicy();
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
  useProjectStage(rowRef, allowed && !reduced && !menu && !isExpanded, lang);
  useSpringAccordion(bodyRef, contentRef, isExpanded, enabled, skipAnimation);
  const prefetch = () => {
    // Hover/focus signals navigation intent even when decorative motion is off.
    if (theme.hasAudit && !menu && !prefetched.current) {
      prefetched.current = true;
      router.prefetch(`/work/${safeId}`);
    }
  };
  const handleNavigate = (event: React.MouseEvent<HTMLElement>) => {
    triggerTectonicImpact(event.clientX, event.clientY, 1.2);
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
    saveNavState({ openIdx: isExpanded ? idx : null, scrollY: window.scrollY });
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
      data-preview-motion={enabled}
      className="materia-surface work-surface group/work relative text-ink"
      style={{ "--surface-color": theme.color } as CSSProperties}
      onPointerEnter={() => {
        prefetch();
        onHoverProject({ name: proj.name, color: theme.color });
      }}
      onPointerLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement))
          onHoverProject(null);
      }}
      onFocus={() => {
        prefetch();
        onHoverProject({ name: proj.name, color: theme.color });
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          onHoverProject(null);
      }}
    >
      <div className="work-surface-header relative z-10 flex flex-col gap-4 p-5 md:p-6 lg:p-7">
        {/* Top Metadata & Tech Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-3">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-lead">
            <span className="font-bold text-ink bg-ink/5 px-2 py-0.5 rounded border border-ink/10">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span className="font-semibold text-brand">
              {TX[lang].projectTags[idx] ?? proj.tag}
            </span>
            <span className="text-lead/40" aria-hidden="true">/</span>
            <span>{proj.year}</span>
          </div>

          <div
            className="flex flex-wrap items-center gap-2"
            aria-label={copy.technologies}
          >
            {proj.langs.map((language) => (
              <span
                key={language}
                className="inline-flex items-center gap-1.5 rounded-md border border-ink/15 bg-ink/[0.04] px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-lead transition-colors hover:text-ink hover:border-ink/30"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: getTechColor(language) }}
                  aria-hidden="true"
                />
                {language}
              </span>
            ))}
          </div>
        </div>

        {/* Content Body: Title + Description on left, Studio Preview on right */}
        <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr] md:items-center">
          <div className="min-w-0 flex flex-col justify-center">
            <h3
              data-project-title
              className="work-project-title text-balance break-words text-[clamp(2.4rem,4.4vw,4.2rem)] font-black capitalize leading-[0.98] tracking-[-0.05em] text-ink transition-all duration-300"
            >
              {content?.title ?? proj.name.replace(/[-_]/g, " ")}
            </h3>
            <p className="work-project-desc mt-3 max-w-xl text-sm leading-relaxed text-lead line-clamp-2 md:line-clamp-3 transition-all duration-300">
              {content?.objective ?? proj.desc}
            </p>
          </div>

          <a
            href={
              theme.hasAudit
                ? `/work/${safeId}`
                : `https://github.com/eneekoruiz/${proj.name}`
            }
            onClick={(e) => {
              if (theme.hasAudit) {
                handleNavigate(e);
              } else {
                triggerTectonicImpact(e.clientX, e.clientY, 1.0);
              }
            }}
            onFocus={prefetch}
            onPointerEnter={prefetch}
            target={theme.hasAudit ? undefined : "_blank"}
            rel={theme.hasAudit ? undefined : "noopener noreferrer"}
            aria-label={`${copy.preview}: ${content?.title ?? proj.name}`}
            className="work-preview min-w-0 rounded-xl text-left"
          >
            <div className="work-preview-object" aria-hidden="true">
              <ProjectVisual id={safeId} presentation="studio" />
            </div>
            <span className="work-preview-caption" aria-hidden="true">
              <span>{copy.preview}</span>
              <span className="work-preview-open">
                {theme.hasAudit ? copy.explore : copy.source}
                <ArrowUpRight size={13} aria-hidden="true" />
              </span>
            </span>
          </a>
        </div>

        {/* Action Command Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-3">
          <div className="flex flex-wrap items-center gap-3">
            <a
              ref={actionRef}
              href={
                theme.hasAudit
                  ? `/work/${safeId}`
                  : `https://github.com/eneekoruiz/${proj.name}`
              }
              onClick={(e) => {
                if (theme.hasAudit) {
                  handleNavigate(e);
                } else {
                  triggerTectonicImpact(e.clientX, e.clientY, 1.0);
                }
              }}
              onFocus={prefetch}
              onPointerEnter={prefetch}
              target={theme.hasAudit ? undefined : "_blank"}
              rel={theme.hasAudit ? undefined : "noopener noreferrer"}
              className="materia-button work-project-action bg-ink text-page !min-h-10 !py-2 !px-5"
            >
              {theme.hasAudit ? copy.explore : copy.source}
              {theme.hasAudit ? (
                <ArrowRight size={15} aria-hidden="true" />
              ) : (
                <ArrowUpRight size={15} aria-hidden="true" />
              )}
            </a>
            <button
              id={`btn-${safeId}`}
              type="button"
              onClick={(e) => {
                triggerTectonicImpact(e.clientX, e.clientY, 0.9);
                onToggle();
                if (!isExpanded && rowRef.current?.dataset.projectStage) {
                  requestAnimationFrame(() =>
                    bodyRef.current?.scrollIntoView({
                      block: "nearest",
                      behavior: "smooth",
                    }),
                  );
                }
              }}
              aria-expanded={isExpanded}
              aria-controls={panelId}
              className="materia-button border border-ink/15 text-ink hover:border-ink/30 !min-h-10 !py-2 !px-4 text-xs font-medium"
            >
              {copy.details}
              <Plus
                className="work-expand-icon transition-transform duration-300"
                size={14}
                strokeWidth={2}
                aria-hidden="true"
              />
            </button>
          </div>

          {theme.hasAudit && (
            <a
              href={`https://github.com/eneekoruiz/${proj.name}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.source}
              className="flex items-center gap-1.5 font-mono text-[11px] text-lead hover:text-ink transition-colors"
            >
              <span>GITHUB_SRC</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
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
        <div ref={contentRef} className="px-5 pb-5 md:px-7 md:pb-7">
          <div
            data-work-panel
            data-decision-lens
            className="border-t border-ink/10 pt-3"
          >
            <div
              role="tablist"
              aria-label={copy.lifecycle}
              className="relative flex flex-wrap gap-x-5 border-b border-ink/10"
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
                  className="min-h-11 border-b-2 px-1 font-mono text-[10px] uppercase tracking-[0.06em] text-lead hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
                  style={{
                    borderColor: lensStep === i ? theme.color : "transparent",
                    color: lensStep === i ? "var(--ink)" : undefined,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div
              key={`${safeId}-${lang}-${lensStep}`}
              id={`${panelId}-lens-panel`}
              role="tabpanel"
              aria-labelledby={`${panelId}-lens-tab-${lensStep}`}
              data-lens-panel
              className="work-lens-panel pt-4"
            >
              <h4 className="mb-2 text-balance text-base font-semibold tracking-[-0.02em]">
                {lens[lensStep].title}
              </h4>
              <p className="max-w-3xl text-sm leading-relaxed text-lead">
                {lens[lensStep].body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
