"use client";

import { useRef, useEffect, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowRight, Plus } from "lucide-react";
import { getTechColor } from "../../../lib/constants";
import type { ProjectCard, Lang } from "../../../types";
import { PROJ_THEMES, DEFAULT_THEME } from "../../../data/config";
import { saveNavState } from "../../../lib/navigationPersistence";
import { useMateriaSurface } from "../../../hooks/useMateriaSurface";
import { useSpringAccordion } from "../../../hooks/useSpringAccordion";
import { useSpringHover } from "../../../hooks/useSpringHover";
import { usePreferredMotion } from "../../../hooks/usePreferredMotion";
import { useUmbral } from "../../motion/UmbralProvider";

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

const COPY = {
  es: {
    lifecycle: "Del concepto a producción",
    stages: [
      "Arquitectura",
      "Desarrollo",
      "Despliegue",
      "Seguridad y auditoría",
    ],
    open: "Explorar proyecto",
    source: "Ver código",
    year: "Año",
    size: "Tamaño",
    stack: "Tecnologías",
  },
  en: {
    lifecycle: "From concept to production",
    stages: ["Architecture", "Development", "Deployment", "Security & audit"],
    open: "Explore project",
    source: "View source",
    year: "Year",
    size: "Size",
    stack: "Technologies",
  },
};

const SUMMARIES: Record<string, { title?: string; es: string; en: string }> = {
  "ana-peluquera": {
    title: "AG Beauty Salon",
    es: "Plataforma de reservas con disponibilidad inteligente y sincronización entre Firebase y Google Calendar.",
    en: "Booking platform with smart availability and synchronization between Firebase and Google Calendar.",
  },
  "who-are-ya-backend": {
    es: "Backend para un juego de fútbol con arquitectura MVC y una API escalable.",
    en: "Backend for a football game with MVC architecture and a scalable API.",
  },
  rides24ofiziala: {
    es: "Sistema distribuido de viajes compartidos con transacciones seguras.",
    en: "Distributed ride-sharing system with secure transactions.",
  },
  "spotshare-parking": {
    es: "Gestión de aparcamientos en la nube con controles de calidad mediante SonarCloud.",
    en: "Cloud parking management with quality checks through SonarCloud.",
  },
  "pke-web": {
    es: "Plataforma web semántica con especial atención a la accesibilidad.",
    en: "Semantic web platform with a focus on accessibility.",
  },
};

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
  const safeId = proj.name.toLowerCase().replace(/[\s_]+/g, "-");
  const panelId = `panel-${safeId}`;
  const theme = PROJ_THEMES[safeId] ?? DEFAULT_THEME;
  const copy = COPY[lang === "es" ? "es" : "en"];
  const summary = SUMMARIES[safeId];
  const actionRef = useSpringHover<HTMLAnchorElement>(enabled);
  useMateriaSurface(rowRef, theme.color, enabled);
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
      className="materia-surface work-surface relative rounded-[20px] border border-ink/15 text-ink"
      style={{ "--surface-color": theme.color } as CSSProperties}
    >
      <button
        id={`btn-${safeId}`}
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        className="work-surface-header relative z-10 grid w-full grid-cols-[1.5rem_1fr_2.5rem] items-center gap-3 px-4 py-7 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand rounded-[20px] md:grid-cols-[3rem_1fr_3rem] md:gap-5 md:px-8 md:py-10"
        data-cursor-plus={isExpanded ? undefined : "true"}
        data-cursor-minus={isExpanded ? "true" : undefined}
      >
        <span className="self-start pt-2 font-mono text-[11px] tabular-nums text-lead">
          {String(idx + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-lead">
            <span>{proj.tag}</span>
            <span>{proj.year}</span>
          </div>
          <h3
            data-project-title
            className="text-balance break-words text-[clamp(1.65rem,4vw,4.2rem)] font-bold capitalize leading-[1.04] tracking-[-0.055em]"
          >
            {summary?.title ?? proj.name.replace(/[-_]/g, " ")}
          </h3>
        </div>
        <span
          className="work-expand-icon flex h-10 w-10 items-center justify-center rounded-full border border-current"
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
          className="grid gap-8 px-5 pb-7 pt-2 md:grid-cols-[1fr_1.5fr] md:gap-12 md:px-8 md:pb-10"
        >
          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.14em] text-lead">
                {copy.lifecycle}
              </p>
              <ol className="grid grid-cols-2 gap-x-4 gap-y-4">
                {copy.stages.map((stage, i) => (
                  <li
                    key={stage}
                    className="flex items-start gap-2 text-xs leading-relaxed"
                  >
                    <span
                      className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
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
              onPointerEnter={prefetch}
              target={theme.hasAudit ? undefined : "_blank"}
              rel={theme.hasAudit ? undefined : "noopener noreferrer"}
              className="materia-button w-fit bg-ink text-page"
            >
              {theme.hasAudit ? copy.open : copy.source}
              {theme.hasAudit ? (
                <ArrowRight size={16} aria-hidden="true" />
              ) : (
                <ArrowUpRight size={16} aria-hidden="true" />
              )}
            </a>
          </div>
          <div className="flex flex-col justify-between gap-7 border-t border-ink/10 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <p className="max-w-xl text-sm leading-relaxed text-lead md:text-base">
              {summary?.[lang === "es" ? "es" : "en"] ?? proj.desc}
            </p>
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
                <dd className="text-sm font-semibold">{proj.size}</dd>
              </div>
              <div className="col-span-2">
                <dt className="mb-3 font-mono text-[10px] uppercase tracking-wider text-lead">
                  {copy.stack}
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {proj.langs.map((language) => (
                    <span
                      key={language}
                      className="flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1 text-[11px] font-medium"
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
          </div>
        </div>
      </div>
    </div>
  );
}
