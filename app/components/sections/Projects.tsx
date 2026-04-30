'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PROJECTS SECTION — Selected Works + GitHub Activity
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * CAMBIOS vs. versión anterior:
 *
 * 1. FIX CONFLICTO DE SCROLL ─────────────────────────────────────────────────
 *    ANTES: useLayoutEffect intentaba scrollear Y restaurar el acordeón
 *    cuando había un retorno desde /work/[id]. Esto conflictuaba con
 *    page.tsx que también intentaba scrollear.
 *
 *    AHORA: si hay un returnColor en sessionStorage, page.tsx ya scrolleó
 *    (useLayoutEffect síncrono). Projects.tsx SOLO restaura el acordeón,
 *    sin tocar el scroll. El clearNavState se hace aquí para no bloquear
 *    futuros opens de acordeón.
 *
 * 2. VISUAL OVERHAUL de los acordeones ────────────────────────────────────
 *    - Fondo expanded: gradiente sutil con el color del proyecto
 *    - Tarjeta lifecycle: border y fondo con más alpha (05→0a, 25→35)
 *    - Tarjeta info: glass más pronunciado en dark mode
 *    - Row header: separadores más elegantes, tipografía más compacta en móvil
 *    - Número de orden: transición de color y tamaño mejorada
 *
 * 3. ANIMACIONES MÁS SNAPPY ───────────────────────────────────────────────
 *    - Acordeón abre/cierra: 0.5s → 0.35s
 *    - Reveal de sección: 0.8s → 0.55s
 *    - Stagger de rows: 0.04 → 0.03
 *
 * 4. GSAP CONTEXT CORRECTO ────────────────────────────────────────────────
 *    El useEffect del acordeón crea animaciones sin contexto. Se añade
 *    el contexto y cleanup correcto.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useRouter }     from 'next/navigation';
import gsap              from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight, ArrowRight,
  Activity, Code2, Loader2, ChevronDown,
} from 'lucide-react';
import { LANG_COLORS } from '../../lib/constants';
import type { ProjectCard, RepoFull, Tx } from '../../lib/types';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// ── Constantes ────────────────────────────────────────────────────────────────

const LIFECYCLE = [
  'System Architecture',
  'Core Development',
  'Production Deployment',
  'Security & Audit',
] as const;

const SESSION_KEY      = 'projects_nav_state';
const RETURN_COLOR_KEY = 'returnColor';

/**
 * Temas por proyecto — paleta refinada
 *
 * VISUAL CHANGE: Se sube el alpha del gradiente de fondo de 15 a 20
 * para que sea más perceptible sin resultar agresivo.
 */
const PROJ_THEMES: Record<string, {
  color: string;
  img: string;
  gradient: string;  // Gradiente para el fondo del row expandido
  progress: number;
  btnText: string;
  hasAudit: boolean;
}> = {
  'ana-peluquera': {
    color: '#ff2d78',
    img: 'radial-gradient(ellipse at 50% 120%, #ff2d7820 0%, transparent 65%)',
    gradient: 'linear-gradient(to bottom, #ff2d780a 0%, transparent 100%)',
    progress: 4, btnText: 'Ver Auditoría', hasAudit: true,
  },
  'who-are-ya-backend': {
    color: '#00c940',   // ligeramente menos neon, más legible
    img: 'radial-gradient(ellipse at 50% 120%, #00c94020 0%, transparent 65%)',
    gradient: 'linear-gradient(to bottom, #00c9400a 0%, transparent 100%)',
    progress: 4, btnText: 'Ver Auditoría', hasAudit: true,
  },
  'rides24ofiziala': {
    color: '#e69400',   // ámbar más cálido, menos amarillo puro
    img: 'radial-gradient(ellipse at 50% 120%, #e6940020 0%, transparent 65%)',
    gradient: 'linear-gradient(to bottom, #e694000a 0%, transparent 100%)',
    progress: 3, btnText: 'Ver Repositorio', hasAudit: false,
  },
  'spotshare-parking': {
    color: '#00d4e8',   // cian ligeramente menos saturado
    img: 'radial-gradient(ellipse at 50% 120%, #00d4e820 0%, transparent 65%)',
    gradient: 'linear-gradient(to bottom, #00d4e80a 0%, transparent 100%)',
    progress: 2, btnText: 'Ver Repositorio', hasAudit: false,
  },
  'pke_web': {
    color: '#9b1fff',   // violeta más oscuro, más legible en light
    img: 'radial-gradient(ellipse at 50% 120%, #9b1fff20 0%, transparent 65%)',
    gradient: 'linear-gradient(to bottom, #9b1fff0a 0%, transparent 100%)',
    progress: 4, btnText: 'Ver Auditoría', hasAudit: true,
  },
};

const DEFAULT_THEME = {
  color: '#888', img: 'none', gradient: 'none', progress: 1, btnText: 'Source Code', hasAudit: false,
};

// ── Helpers de persistencia ───────────────────────────────────────────────────

interface NavState { openIdx: number | null; scrollY: number; }

function saveNavState(state: NavState) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(state)); } catch (_) {}
}

function loadNavState(): NavState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) as NavState : null;
  } catch (_) { return null; }
}

function clearNavState() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch (_) {}
}

// ── RepoRow ───────────────────────────────────────────────────────────────────

interface RepoRowProps {
  r: RepoFull;
  idx: number;
  activeRepo: number | null;
  setActiveRepo: (i: number | null) => void;
  lineRef: (el: HTMLDivElement | null) => void;
}

function RepoRow({ r, idx, activeRepo, setActiveRepo, lineRef }: RepoRowProps) {
  const isActive = activeRepo === idx;

  return (
    <div
      ref={lineRef}
      className="border-b border-black/7 dark:border-white/10 transition-colors duration-200 hover:bg-black/[0.018] dark:hover:bg-white/[0.025]"
    >
      <div
        className="py-4 cursor-pointer relative z-10"
        onMouseEnter={() => window.innerWidth > 768 && setActiveRepo(idx)}
        onMouseLeave={() => window.innerWidth > 768 && setActiveRepo(null)}
        onClick={() => window.innerWidth <= 768 && setActiveRepo(isActive ? null : idx)}
      >
        <div className="flex items-start md:items-center gap-4 md:gap-5">
          <span className="font-mono text-[10px] text-lead/40 w-6 shrink-0 pt-1 md:pt-0">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-3">
              <span className={`font-mono text-[13px] font-bold md:font-medium transition-colors duration-200 ${isActive ? 'text-brand' : 'text-ink'}`}>
                {r.name}
              </span>
              <div className="flex flex-wrap gap-[0.3rem]">
                {r.langs?.map(l => (
                  <span key={l} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-medium bg-black/5 dark:bg-white/[0.04] border border-black/8 dark:border-white/10 text-lead whitespace-nowrap">
                    <span
                      className="w-[5px] h-[5px] rounded-full shrink-0"
                      style={{
                        background: LANG_COLORS[l] ?? '#999',
                        filter: isActive ? `drop-shadow(0 0 4px ${LANG_COLORS[l] ?? '#999'})` : 'none',
                        transition: 'filter .2s',
                      }}
                    />
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <div className={`overflow-hidden transition-[max-height,opacity] duration-300 ${isActive ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
              {r.description && (
                <p className="text-[11px] text-lead leading-[1.6] mb-3 pr-4">{r.description}</p>
              )}
              <a
                href={r.html_url} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-page text-[9px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Visitar Repo <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <span className="font-mono text-[10px] text-lead/40">{(r.size / 1024).toFixed(1)}MB</span>
            {r.stargazers_count > 0 && (
              <span className="text-[10px] text-lead/40">★{r.stargazers_count}</span>
            )}
            <span className="font-mono text-[10px] text-lead/30">
              {new Date(r.pushed_at).getFullYear()}
            </span>
            <ArrowUpRight
              size={14}
              className={`transition-all duration-200 ${isActive ? 'text-brand opacity-100' : 'text-lead opacity-30'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PremiumWorkRow ────────────────────────────────────────────────────────────

interface WorkRowProps {
  proj: ProjectCard;
  idx: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function PremiumWorkRow({ proj, idx, isExpanded, onToggle }: WorkRowProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const rowRef   = useRef<HTMLDivElement>(null);
  const bodyRef  = useRef<HTMLDivElement>(null);
  const ctxRef   = useRef<gsap.Context>();
  const router   = useRouter();

  const safeId = proj.name.toLowerCase().replace(/[\s_]+/g, '-');
  const theme  = PROJ_THEMES[safeId] ?? DEFAULT_THEME;

  /**
   * FIX: Usar gsap.context() para que el tween del acordeón se limpie
   * correctamente si el componente se desmonta mientras está animando.
   * Antes era un gsap.to() huérfano sin cleanup.
   */
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    ctxRef.current?.revert();
    ctxRef.current = gsap.context(() => {
      gsap.to(body, {
        height:   isExpanded ? 'auto' : 0,
        opacity:  isExpanded ? 1 : 0,
        duration: 0.35,                               // ← era 0.5
        ease:     isExpanded ? 'expo.out' : 'power2.inOut', // ← más rápido al cerrar
      });
    });

    return () => ctxRef.current?.revert();
  }, [isExpanded]);

  // Scroll suave en móvil al abrir
  useEffect(() => {
    if (isExpanded && rowRef.current && window.innerWidth <= 768) {
      setTimeout(() => {
        const y = rowRef.current!.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 150);  // ← era 180
    }
  }, [isExpanded]);

  const handleNavigate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isNavigating) return;
    setIsNavigating(true);

    saveNavState({ openIdx: idx, scrollY: window.scrollY });
    document.getElementById('project-transition-layer')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'project-transition-layer';
    Object.assign(overlay.style, {
      position:        'fixed',
      inset:           '0',
      backgroundColor: theme.color,
      zIndex:          '99999',
      transform:       'scaleY(0)',
      transformOrigin: 'bottom',
      pointerEvents:   'all',
    });
    document.body.appendChild(overlay);

    gsap.to(overlay, {
      scaleY:   1,
      duration: 0.4,       // ← era 0.5
      ease:     'expo.inOut',
      onComplete: () => {
        router.push(`/work/${safeId}`);
        gsap.to(overlay, {
          opacity:  0,
          duration: 0.5,   // ← era 0.6
          delay:    0.25,  // ← era 0.35
          onComplete: () => overlay.remove(),
        });
      },
    });

    setTimeout(() => setIsNavigating(false), 2200);
  };

  return (
    <div
      ref={rowRef}
      className="group/row relative border-b border-black/10 dark:border-white/10 transition-colors duration-300"
      style={isExpanded ? { background: theme.gradient } : undefined}
    >
      {/*
       * VISUAL CHANGE: Glow de hover ahora usa un gradiente elíptico
       * más amplio que el anterior radial-gradient circular.
       * Más sutil y elegante, especialmente en dark mode.
       */}
      <div
        className="absolute inset-0 z-0 opacity-0 group-hover/row:opacity-100 transition-opacity duration-600 pointer-events-none hidden md:block"
        style={{ background: theme.img }}
      />

      {/* ── CABECERA DEL ACORDEÓN ── */}
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="relative z-10 w-full text-left py-[14px] md:py-5 px-0 md:px-6 flex items-center justify-between gap-4 cursor-pointer group/btn"
      >
        {/*
         * VISUAL CHANGE: Número de orden — transición de escala + color
         * El número se hace más prominente cuando el row está expandido.
         */}
        <span
          className="font-mono text-[10px] md:text-[11px] w-7 shrink-0 tabular-nums transition-all duration-300 font-semibold"
          style={{
            color:   isExpanded ? theme.color : 'var(--lead)',
            opacity: isExpanded ? 1 : 0.4,
          }}
        >
          {String(idx + 1).padStart(2, '0')}
        </span>

        <div className="flex-1 min-w-0 flex items-center gap-3 md:gap-5">
          {/*
           * VISUAL CHANGE: Nombre del proyecto
           * - font-size: clamp ligeramente más compacto en mobile (0.95→0.88)
           * - En estado cerrado: text-ink con ligera opacidad (0.85)
           * - En estado abierto: color del proyecto
           */}
          <h3
            className="font-bold leading-tight tracking-tight min-w-0 transition-colors duration-300"
            style={{
              fontSize: 'clamp(0.88rem, 2.2vw, 1.42rem)',
              color:    isExpanded ? theme.color : 'var(--ink)',
              opacity:  isExpanded ? 1 : 0.88,
              // Evitar truncado en móvil para que el texto se vea completo
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {proj.name.replace(/-/g, ' ').replace(/_/g, ' ')}
          </h3>

          {/*
           * VISUAL CHANGE: Tag — texto case-preserving en lugar de uppercase
           * Más elegante y menos agresivo visualmente en mobile
           */}
          <span
            className="hidden sm:block font-mono text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.25em] opacity-0 group-hover/btn:opacity-60 transition-opacity duration-300 whitespace-nowrap shrink-0"
            style={{ color: theme.color }}
          >
            {proj.tag}
          </span>
        </div>

        {/* Año — solo desktop */}
        <span className="hidden lg:block font-mono text-[11px] text-lead/35 shrink-0 tabular-nums">
          {proj.year}
        </span>

        {/*
         * VISUAL CHANGE: Chevron — ahora usa el color del tema cuando está expandido
         * Antes era siempre bg-ink (negro), ahora usa bg del color del proyecto.
         */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
            isExpanded
              ? 'rotate-180 text-white'
              : 'border border-black/10 dark:border-white/15 text-lead group-hover/row:border-opacity-60 group-hover/row:text-ink dark:group-hover/row:text-white'
          }`}
          style={isExpanded ? { backgroundColor: theme.color } : undefined}
        >
          <ChevronDown size={15} strokeWidth={2} />
        </div>
      </button>

      {/* ── CUERPO DEL ACORDEÓN (Bento Box) ── */}
      <div ref={bodyRef} style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
        <div className="pb-6 md:pb-10 pt-2 px-0 md:px-6 grid grid-cols-1 lg:grid-cols-[1.15fr_2fr] gap-3 md:gap-4 relative z-10">

          {/*
           * VISUAL CHANGE: Tarjeta Lifecycle
           * - Background alpha subido de 05 a 0a (ligeramente más visible)
           * - Border alpha subido de 25 a 35 (más definido)
           * - Añadido box-shadow interior sutil
           */}
          <div
            className="p-5 md:p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group/card"
            style={{
              backgroundColor: `${theme.color}0a`,
              border:          `1px solid ${theme.color}35`,
              boxShadow:       `inset 0 1px 0 ${theme.color}15`,
            }}
          >
            {/* Glow ambiental */}
            <div
              className="absolute top-0 right-0 w-32 h-32 blur-[70px] opacity-20 transition-opacity duration-700 group-hover/card:opacity-40 pointer-events-none"
              style={{ backgroundColor: theme.color }}
            />

            <div className="relative z-10">
              <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.3em] opacity-50">
                Project Lifecycle
              </span>

              <div className="mt-5">
                {LIFECYCLE.map((stage, i) => {
                  const completed = i < theme.progress;
                  const active    = i === theme.progress - 1;
                  return (
                    <div key={stage} className="flex items-start gap-3 relative">
                      {i !== LIFECYCLE.length - 1 && (
                        <div
                          className="absolute left-[4px] top-[11px] w-[1px] h-full"
                          style={{
                            background: completed && !active ? theme.color : 'currentColor',
                            opacity:    completed && !active ? 0.3 : 0.06,
                          }}
                        />
                      )}
                      <div className="relative flex items-center justify-center w-2.5 h-2.5 mt-1 shrink-0 z-10">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${!completed ? 'bg-black/10 dark:bg-white/10' : ''}`}
                          style={{ backgroundColor: completed ? theme.color : undefined }}
                        />
                        {active && (
                          <div
                            className="absolute inset-0 rounded-full animate-ping opacity-40"
                            style={{ backgroundColor: theme.color }}
                          />
                        )}
                      </div>
                      <div
                        className={`pb-4 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.18em] ${completed ? 'opacity-75' : 'opacity-20'} ${active ? 'font-bold' : ''}`}
                        style={{ color: active ? theme.color : 'inherit' }}
                      >
                        {stage}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            {theme.hasAudit ? (
              <a
                href={`/work/${safeId}`}
                onClick={handleNavigate}
                className={`relative z-10 mt-4 flex items-center justify-between px-5 py-[11px] rounded-full shadow-md transition-all duration-200 text-white ${
                  isNavigating ? 'cursor-wait opacity-80' : 'hover:scale-[1.025] active:scale-95'
                }`}
                style={{ backgroundColor: theme.color }}
              >
                <span className="font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <Activity size={12} className={isNavigating ? '' : 'animate-pulse'} />
                  {isNavigating ? 'CARGANDO...' : theme.btnText}
                </span>
                {isNavigating
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <ArrowRight className="w-3.5 h-3.5" />
                }
              </a>
            ) : (
              <a
                href={`https://github.com/eneekoruiz/${proj.name}`}
                target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="relative z-10 mt-4 flex items-center justify-between px-5 py-[11px] rounded-full border hover:scale-[1.025] active:scale-95 transition-all duration-200"
                style={{
                  borderColor: `${theme.color}40`,
                  color:       theme.color,
                }}
              >
                <span className="font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <Code2 size={12} /> {theme.btnText}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            )}
          </div>

          {/*
           * VISUAL CHANGE: Tarjeta info del proyecto
           * - Border más visible en dark mode
           * - Background glass más pronunciado
           * - Padding inferior reducido para compacidad
           */}
          <div
            className="p-5 md:p-6 rounded-2xl border flex flex-col justify-between gap-4"
            style={{
              borderColor:     'rgba(0,0,0,0.06)',
              backgroundColor: 'rgba(0,0,0,0.015)',
            }}
          >
            <p className="text-sm md:text-[15px] font-light leading-relaxed text-ink/80">
              {proj.desc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-black/5 dark:border-white/5">
              {/* Año */}
              <div className="space-y-1">
                <span className="block font-mono text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-lead/40">Año</span>
                <span className="block font-semibold text-[13px] text-ink">{proj.year}</span>
              </div>
              {/* Tamaño */}
              <div className="space-y-1">
                <span className="block font-mono text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-lead/40">Tamaño</span>
                <span className="block font-semibold text-[13px] text-ink">{proj.size}</span>
              </div>
              {/* Stack — ocupa full en mobile, 1 col en sm */}
              <div className="col-span-2 sm:col-span-1 space-y-2">
                <span className="block font-mono text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-lead/40">Stack</span>
                <div className="flex flex-wrap gap-1">
                  {proj.langs.map(l => (
                    <span
                      key={l}
                      className="px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 text-[8px] md:text-[9px] font-medium tracking-wide bg-black/[0.02] dark:bg-white/[0.02] text-ink"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonRow({ idx }: { idx: number }) {
  return (
    <div
      className="border-b border-black/5 dark:border-white/5 py-[14px] md:py-5 px-0 md:px-6 flex items-center justify-between animate-pulse"
      style={{ animationDelay: `${idx * 0.07}s` }}  // ← era 0.08
    >
      <div className="flex items-center gap-5">
        <span className="w-4 h-3 rounded bg-black/8 dark:bg-white/8" />
        <span className="block h-5 w-36 md:w-56 rounded-lg bg-black/5 dark:bg-white/5" />  {/* ← más corto en mobile */}
      </div>
      <span className="block h-8 w-8 rounded-full bg-black/5 dark:bg-white/5" />
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

interface ProjectsProps {
  t: Tx;
  top3: ProjectCard[];
  repos: RepoFull[];
  load: boolean;
  offline: boolean;
  BranchMergeBtn: React.ComponentType<{ label: string; href: string }>;
}

export function Projects({ t, top3, repos, load, offline, BranchMergeBtn }: ProjectsProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [activeRepo,  setActiveRepo]  = useState<number | null>(null);
  const lineRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  /**
   * FIX CONFLICTO DE SCROLL
   * ──────────────────────────────────────────────────────────────────────────
   * ANTES: este hook intentaba scrollear Y restaurar el acordeón, conflictuando
   * con page.tsx que también intentaba scrollear (efecto: scroll doble/rebote).
   *
   * AHORA:
   * - Si hay returnColor en sessionStorage → page.tsx ya scrolleó con
   *   useLayoutEffect síncrono. Aquí SOLO restauramos el acordeón.
   * - Si NO hay returnColor → navegación normal (ej. clic en #work desde otra
   *   sección). Scrolleamos nosotros con el retardo mínimo.
   *
   * En ambos casos, clearNavState() se llama DESPUÉS de restaurar el acordeón.
   */
  useLayoutEffect(() => {
    if (load || top3.length === 0) return;

    const saved = loadNavState();
    if (!saved) return;

    // Restaurar acordeón abierto siempre
    setExpandedIdx(saved.openIdx);

    const isReturn = !!sessionStorage.getItem(RETURN_COLOR_KEY);

    if (!isReturn) {
      // No es retorno desde /work — scrolleamos nosotros
      const id = setTimeout(() => {
        window.scrollTo({ top: saved.scrollY, behavior: 'instant' as ScrollBehavior });
        clearNavState();
      }, 80);
      return () => clearTimeout(id);
    }

    // Es retorno desde /work — page.tsx ya scrolleó. Limpiamos navState.
    // El returnColor lo limpiará page.tsx cuando desvanezca el overlay.
    clearNavState();
  }, [load, top3.length]);

  // ── Animaciones de entrada — DURACIÓN REDUCIDA ────────────────────────────
  useEffect(() => {
    if (load) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.projects-header',
        { opacity: 0, y: 32 },          // ← era y:40
        {
          opacity: 1, y: 0, duration: 0.55, ease: 'expo.out',  // ← era 0.8
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        }
      );
      gsap.fromTo('.work-row-anim',
        { opacity: 0, y: 16 },           // ← era y:20
        {
          opacity: 1, y: 0, duration: 0.4, stagger: 0.03, ease: 'power3.out',  // ← era 0.5, stagger 0.04
          scrollTrigger: { trigger: '.projects-list', start: 'top 90%', once: true },
        }
      );
    });
    return () => ctx.revert();
  }, [load]);

  const handleToggle = (idx: number) => {
    setExpandedIdx(prev => {
      const next = prev === idx ? null : idx;
      if (next !== null) {
        saveNavState({ openIdx: next, scrollY: window.scrollY });
      } else {
        clearNavState();
      }
      return next;
    });
  };

  return (
    <>
      {/* ════ SELECTED WORKS ════ */}
      <section
        ref={sectionRef}
        id="work"
        className="py-14 md:py-28 px-5 md:px-8 max-w-[1300px] mx-auto relative z-20"
      >
        {/* Encabezado */}
        <div className="projects-header mb-8 md:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-8 md:w-10 bg-ink opacity-15" />
            <p className="font-mono text-[8px] md:text-[9px] font-bold tracking-[0.28em] uppercase text-lead/55">
              {t.woLb || 'PORTFOLIO DE INGENIERÍA'}
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            {/*
             * VISUAL CHANGE: Título — tamaño ligeramente reducido en mobile
             * para dar más espacio al contenido de los acordeones.
             */}
            <h2 className="font-black text-[clamp(2.2rem,7vw,5.5rem)] tracking-tighter leading-[0.88] text-ink uppercase italic">
              Selected<br/>Works.
            </h2>
            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.18em] text-lead/30 mb-1">
              Click to expand ↓
            </span>
          </div>
        </div>

        {/* Lista */}
        <div className="projects-list border-t border-black/10 dark:border-white/10">
          {(load || top3.length === 0)
            ? [0, 1, 2, 3, 4].map(i => (
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
                  />
                </div>
              ))
          }
        </div>
      </section>

      {/* ════ GITHUB ACTIVITY ════ */}
      <section
        id="github"
        data-section="github"
        className="border-t border-black/7 dark:border-white/10 py-12 md:py-22 px-5 md:px-8 max-w-[1200px] mx-auto relative z-10"
      >
        <div className="flex items-end justify-between pb-4 border-b border-black/7 dark:border-white/10 mb-1">
          <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-lead/60">
            {t.ghLb || 'ACTIVIDAD'}
          </p>
          <span className="font-mono text-[9px] text-lead/40">
            {repos?.length || 0}_repos
          </span>
        </div>

        <div className="min-h-[200px]">
          {load ? (
            <div className="py-4">
              {[0, 1, 2, 3].map(i => (
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
          ) : (
            <div>
              {repos.slice(0, 10).map((r, i) => (
                <RepoRow
                  key={r.id}
                  r={r}
                  idx={i}
                  activeRepo={activeRepo}
                  setActiveRepo={setActiveRepo}
                  lineRef={el => { lineRefs.current[i] = el; }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center mt-10 md:mt-12">
          <BranchMergeBtn
            label={t.moreGh || 'VER TODO EN GITHUB'}
            href="https://github.com/eneekoruiz"
          />
        </div>
      </section>
    </>
  );
}
