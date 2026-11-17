"use client";

import { useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { UI_COPY } from "../../../data/interface-translations";
import { PROJECTS_CONTENT } from "../../../data/projects";
import { PROJECT_PITCH } from "../../../data/project-pitch";
import type { ProjectCard, Lang } from "../../../types";
import { PROJ_THEMES, DEFAULT_THEME } from "../../../data/config";
import { saveNavState } from "../../../lib/navigationPersistence";
import { useMateriaSurface } from "../../../hooks/useMateriaSurface";
import { usePreferredMotion } from "../../../hooks/usePreferredMotion";
import { useProjectTension } from "../../../hooks/useProjectTension";
import { useUmbral } from "../../motion/UmbralProvider";
import { ProjectVisual } from "../../motion/ProjectVisual";
import { triggerTectonicImpact } from "../../../lib/tectonic";

interface WorkRowProps {
  proj: ProjectCard;
  idx: number;
  onHoverProject: (project: { name: string; color: string } | null) => void;
  menu?: boolean;
  motionEnabled: boolean;
  lang: Lang;
}

/**
 * One project, one glance: the preview, the name, one plain sentence, three
 * tools at most and one way in. "Details" folds the preview away and shows the
 * short story in its place, for visitors who want to read without leaving.
 * The whole card is the link; the visible button is its label.
 */
export function PremiumWorkRow({
  proj,
  idx,
  onHoverProject,
  menu,
  motionEnabled,
  lang,
}: WorkRowProps) {
  const router = useRouter();
  const navigate = useUmbral();
  const reduced = usePreferredMotion();
  const enabled = motionEnabled && !reduced && !menu;
  const rowRef = useRef<HTMLDivElement>(null);
  const prefetched = useRef(false);
  const [details, setDetails] = useState(false);
  const safeId = proj.name.toLowerCase().replace(/[\s_]+/g, "-");
  const theme = PROJ_THEMES[safeId] ?? DEFAULT_THEME;
  const copy = UI_COPY[lang];
  const content = PROJECTS_CONTENT[safeId]?.[lang] ?? PROJECTS_CONTENT[safeId]?.en;
  const title = content?.title ?? proj.name.replace(/[-_]/g, " ");
  const pitch = PROJECT_PITCH[safeId]?.[lang] ?? PROJECT_PITCH[safeId]?.en ?? proj.desc;
  const href = theme.hasAudit
    ? `/work/${safeId}`
    : `https://github.com/eneekoruiz/${proj.name}`;
  useMateriaSurface(rowRef, theme.color, enabled);
  useProjectTension(rowRef, enabled, details, idx);
  const panelId = `details-${safeId}`;
  const story = [
    { label: copy.stages[0], title: content?.subtitle, body: content?.objective ?? proj.desc },
    { label: copy.stages[1], title: content?.algorithmH, body: content?.algorithmP },
    { label: copy.stages[2], title: content?.outcomeH, body: content?.outcomeP },
  ].filter((part) => part.body);

  const prefetch = () => {
    // Hover/focus signals navigation intent even when decorative motion is off.
    if (theme.hasAudit && !menu && !prefetched.current) {
      prefetched.current = true;
      router.prefetch(`/work/${safeId}`);
    }
  };
  const open = (event: React.MouseEvent<HTMLAnchorElement>) => {
    triggerTectonicImpact(event.clientX, event.clientY, 1.2);
    if (
      !theme.hasAudit ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !rowRef.current
    )
      return;
    event.preventDefault();
    saveNavState({ openIdx: null, scrollY: window.scrollY });
    onHoverProject(null);
    navigate({
      source: rowRef.current,
      id: safeId,
      color: theme.color,
      url: href,
    });
  };

  return (
    <div
      ref={rowRef}
      data-materia-surface={safeId}
      data-preview-motion={enabled}
      data-details={details || undefined}
      className="materia-surface work-surface work-card group/work relative text-ink"
      style={{ "--surface-color": theme.color } as CSSProperties}
      onPointerEnter={() => {
        prefetch();
        onHoverProject({ name: proj.name, color: theme.color });
      }}
      onPointerLeave={() => onHoverProject(null)}
    >
      <div className="work-card-copy">
        <h3 data-project-title className="work-card-title">
          {title}
        </h3>
        <p className="work-card-pitch">{pitch}</p>
        <p className="work-card-tech" aria-label={copy.technologies}>
          {proj.langs.slice(0, 3).join(" · ")}
        </p>
        <div className="work-card-actions">
          <span className="work-card-action materia-button" aria-hidden="true">
            {theme.hasAudit ? copy.explore : copy.source}
            {theme.hasAudit ? (
              <ArrowRight size={16} aria-hidden="true" />
            ) : (
              <ArrowUpRight size={16} aria-hidden="true" />
            )}
          </span>
          {story.length > 0 && (
            <button
              type="button"
              aria-expanded={details}
              aria-controls={panelId}
              onClick={() => setDetails((open) => !open)}
              className="work-card-details materia-button"
            >
              {copy.details}
              <Plus size={14} strokeWidth={2} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <div className="work-card-visual">
        <div className="work-preview" aria-hidden="true">
          <div className="work-preview-object">
            <ProjectVisual id={safeId} presentation="studio" />
          </div>
        </div>
        <div
          id={panelId}
          role="region"
          aria-label={`${copy.details}: ${title}`}
          inert={!details}
          className="work-card-story"
        >
          {story.map((part) => (
            <section key={part.label}>
              <p className="work-card-story-label">{part.label}</p>
              {part.title && <h4>{part.title}</h4>}
              <p>{part.body}</p>
            </section>
          ))}
        </div>
      </div>
      {/* The card's single link covers it all; its name is the project. */}
      <a
        href={href}
        onClick={open}
        onFocus={() => {
          prefetch();
          onHoverProject({ name: proj.name, color: theme.color });
        }}
        onBlur={() => onHoverProject(null)}
        target={theme.hasAudit ? undefined : "_blank"}
        rel={theme.hasAudit ? undefined : "noopener noreferrer"}
        aria-label={`${theme.hasAudit ? copy.explore : copy.source}: ${title}`}
        className="work-card-link"
      />
    </div>
  );
}
