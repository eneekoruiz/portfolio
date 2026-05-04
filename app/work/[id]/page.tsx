'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * WORK/[ID] PAGE — Detalle de proyecto con auditoría de ingeniería
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useState, useEffect, useMemo } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Github, ArrowUpRight, Database, Terminal,
  Cpu, ShieldCheck, Zap, Activity, Server,
  Layers, ChevronLeft, CheckCircle2, Radar,
} from 'lucide-react';

import { TX }              from '../../lib/translations';
import { PROJECTS_CONTENT, CODE_SNIPPETS } from '../../lib/projects-data';
import { LANG_COLORS }     from '../../lib/constants';
import type { Lang }       from '../../lib/types';
import { InfallibleCursor } from '../../components/ui/InfallibleCursor';
import { useMagnetic }     from '../../hooks/useMagnetic';
import { useTextScramble } from '../../hooks/useTextScramble';
import { ProjectHero }     from './components/ProjectHero';
import {
  createLiquidCurtain,
  animateLiquidCurtainIn,
  animateLiquidCurtainOut,
} from '../../components/ui/LiquidCurtain';

// ── DYNAMIC IMPORTS: Defer heavy components until after route transition ──
type DNAHelixProps = { accent: string; secondary: string; darkMode: boolean };
type TerrainMeshProps = { accent: string };
type FloatingArtifactProps = { accent: string; idx: number };
type AccentProps = { accent: string };

const DNAHelix = dynamic<DNAHelixProps>(() => import('@/app/work/visualizers').then(m => m.DNAHelix), { ssr: false });
const TerrainMesh = dynamic<TerrainMeshProps>(() => import('@/app/work/visualizers').then(m => m.TerrainMesh), { ssr: false });
const FloatingArtifact = dynamic<FloatingArtifactProps>(() => import('@/app/work/visualizers').then(m => m.FloatingArtifact), { ssr: false });
const SandwichDiagram = dynamic<AccentProps>(() => import('@/app/work/visualizers').then(m => m.SandwichDiagram), { ssr: false });
const MVCTerminal = dynamic<AccentProps>(() => import('@/app/work/visualizers').then(m => m.MVCTerminal), { ssr: false });
const DistributedNodes = dynamic<AccentProps>(() => import('@/app/work/visualizers').then(m => m.DistributedNodes), { ssr: false });
const WCAGVisualizer = dynamic<AccentProps>(() => import('@/app/work/visualizers').then(m => m.WCAGVisualizer), { ssr: false });
const SpotshareHeatmap = dynamic<AccentProps>(() => import('@/app/work/visualizers').then(m => m.SpotshareHeatmap), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// ── Themes ────────────────────────────────────────────────────────────────────

const THEMES: Record<string, {
  helixA: string; helixB: string; accent: string; label: string;
}> = {
  'ana-peluquera':      { helixA: '#ff2d78', helixB: '#ff9fcd', accent: '#ff2d78', label: 'FRONTEND / UX_ENGINE' },
  'who-are-ya-backend': { helixA: '#00ff41', helixB: '#00cc33', accent: '#00ff41', label: 'BACKEND / SYSTEM_CORE' },
  'rides24ofiziala':    { helixA: '#f59e0b', helixB: '#fbbf24', accent: '#f59e0b', label: 'DISTRIBUTED / JAX-WS' },
  'spotshare-parking':  { helixA: '#00f0ff', helixB: '#0ea5e9', accent: '#00f0ff', label: 'CLOUD / REAL_TIME' },
  'pke_web':            { helixA: '#b026ff', helixB: '#d8b4fe', accent: '#b026ff', label: 'A11Y / UX_SEMANTIC' },
};

const DEFAULT_THEME = { helixA: '#888', helixB: '#aaa', accent: '#888', label: 'MODULE' };

const PROJECT_SUMMARIES: Record<string, { name: string; langs: string[] }> = {
  'ana-peluquera': { name: 'AG Beauty Salon', langs: ['React', 'Firebase', 'Node.js', 'Google Calendar API'] },
  'who-are-ya-backend': { name: 'Who Are Ya Backend', langs: ['Node.js', 'Express', 'MongoDB', 'JWT'] },
  'rides24ofiziala': { name: 'Rides24 Ofiziala', langs: ['Java', 'JAX-WS', 'ObjectDB', 'Swing'] },
  'spotshare-parking': { name: 'Spotshare Parking', langs: ['TypeScript', 'SonarCloud', 'NestJS', 'Docker'] },
  'pke_web': { name: 'PKE Web', langs: ['React', 'WCAG 2.1', 'Tailwind', 'A11y'] },
};

// ── GlareCard (Local Component) ───────────────────────────────────

function GlareCard({ children, accent, className = '', style }: {
  children: React.ReactNode; accent: string; className?: string; style?: React.CSSProperties;
}) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r || !glareRef.current) return;
    
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    
    const xPercent = (x / r.width - 0.5) * 2;
    const yPercent = (y / r.height - 0.5) * 2;
    
    gsap.to(cardRef.current, {
      rotateY: xPercent * 6,
      rotateX: -yPercent * 6,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    const gx = (x / r.width)  * 100;
    const gy = (y / r.height) * 100;
    glareRef.current.style.setProperty('--gx', `${gx}%`);
    glareRef.current.style.setProperty('--gy', `${gy}%`);
  };

  const onLeave = () => {
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 1,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative overflow-hidden rounded-3xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-2xl transition-all duration-500 hover:border-black/15 dark:hover:border-white/15 hover:shadow-2xl group ${className}`}
      style={{
        ...style,
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <div 
        ref={glareRef} 
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100" 
        style={{ 
          background: `radial-gradient(circle 300px at var(--gx,50%) var(--gy,50%), ${accent}20, transparent 80%)`,
          transform: 'translateZ(50px)' 
        }} 
      />
      <div className="relative z-0" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </div>
  );
}

// ── PÁGINA PRINCIPAL ──────────────────────────────────────────────────────────

export default function ProjectPage() {
  const { id }   = useParams();
  const router   = useRouter();
  const main     = useRef<HTMLDivElement>(null);

  const [lang]     = useState<Lang>('es');
  const [darkMode, setDarkMode] = useState(false);
  
  // 💎 KEY STATE: Defers heavy animation loading until after route transition completes
  const [isReadyToAnimate, setIsReadyToAnimate] = useState(false);

  const safeId  = id as string;
  const theme   = THEMES[safeId] ?? DEFAULT_THEME;
  const summary = PROJECT_SUMMARIES[safeId];

  const isBackend = safeId === 'who-are-ya-backend';
  const isJava    = safeId === 'rides24ofiziala';
  const isSpot    = safeId === 'spotshare-parking';
  const isA11y    = safeId === 'pke_web';

  const content = PROJECTS_CONTENT[safeId]?.[lang] ?? PROJECTS_CONTENT[safeId]?.['en'] ?? PROJECTS_CONTENT[safeId]?.['es'];
  const snippet = CODE_SNIPPETS[safeId];
  const liveUrl = isBackend ? 'https://who-are-ya-backend.onrender.com/login' : (isJava || isSpot || isA11y) ? null : 'https://ana-peluquera.lovable.app/';
  const videoUrl = isJava ? '/loginjsf.mp4' : null;

  // 🎯 Punto 6 — Magnetic buttons
  const closeMagRef = useMagnetic<HTMLButtonElement>({ strength: 0.3, innerStrength: 0.12 });
  const backMagRef  = useMagnetic<HTMLButtonElement>({ strength: 0.25, innerStrength: 0.1 });

  // 🎯 Punto 7 — Text scramble for project title
  const titleText = content?.title ?? summary?.name ?? safeId;
  const { text: scrambledTitle } = useTextScramble(titleText, {
    trigger: 'mount',
    charSpeed: 35,
    iterations: 4,
    delay: 200,
  });

  // Detect dark mode
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
                || window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  /**
   * 💎 FADE OUT TRANSITION LAYER + Trigger animation boot
   * Handles both SVG liquid curtains (Punto 8) and legacy div overlays.
   */
  useEffect(() => {
    // 🌊 Punto 8 — Liquid curtain reveal or fallback
    const overlay = document.getElementById('project-transition-layer');
    
    if (overlay) {
      let done = false;
      const reveal = () => {
        if (done) return;
        done = true;

        const isSVG = overlay.tagName.toLowerCase() === 'svg';

        if (isSVG) {
          animateLiquidCurtainOut(overlay as unknown as SVGSVGElement, {
            duration: 0.6,
            onComplete: () => setIsReadyToAnimate(true),
          });
        } else {
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              overlay.remove();
              setIsReadyToAnimate(true);
            },
          });
        }
      };

      // Ensure we reveal as soon as possible
      const raf = requestAnimationFrame(() => requestAnimationFrame(reveal));
      const fallback = setTimeout(reveal, 500); // Safety fallback
      
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(fallback);
      };
    } else {
      // No overlay found (direct link or fast navigation), enable effects immediately
      setIsReadyToAnimate(true);
    }
  }, []);

  // 💎 TRANSITION: Exit liquid curtain to prevent FOUC on home page
  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 🚀 AGGRESSIVE CLEANUP: Stop everything that could block navigation
    const lenis = (window as any).__lenis;
    lenis?.stop?.();
    
    // Kill any active GSAP tweens on the body or fixed elements
    gsap.killTweensOf(document.body);
    document.querySelectorAll('[id^="return-overlay"]').forEach(el => el.remove());

    const navigate = () => {
      sessionStorage.setItem('hasSeenIntro', 'true');
      lenis?.start?.();
      router.replace('/', { scroll: false });
      
      // 🚨 ABSOLUTE FALLBACK: If router doesn't respond in 800ms
      setTimeout(() => {
        if (window.location.pathname !== '/') {
           window.location.href = '/';
        }
      }, 800);
    };

    // 🌊 Punto 8 — SVG Liquid Curtain (replaces plain div overlay)
    const svg = createLiquidCurtain({
      color: theme.accent,
      direction: 'down',
      id: 'return-overlay',
    });
    document.body.appendChild(svg);

    animateLiquidCurtainIn(svg, {
      duration: 0.6,
      onMidway: navigate,
      onComplete: () => {
        setTimeout(() => svg.remove(), 200);
      },
    });

    // Safety fallback: force navigation if animation hangs
    setTimeout(() => {
      if (document.getElementById('return-overlay')) {
        navigate();
      }
    }, 1500);
  };

  // ── Section reveals (Static, only run once when content is ready) ──────────
  useGSAP(() => {
    if (!main.current || !content) return;

    const sections = gsap.utils.toArray<HTMLElement>('.reveal-sec');
    sections.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          ease: 'power2.out',
          scrollTrigger: { 
            trigger: el, 
            start: 'top 88%', 
            once: true,
            // Prevent interference with pinning
            fastScrollEnd: true,
          },
        }
      );
    });
  }, { scope: main, dependencies: [content] });

  // ── Helix Animation (Depends on isReadyToAnimate) ──────────────────────────
  useGSAP(() => {
    if (!main.current || !isReadyToAnimate) return;

    const helixTl = gsap.timeline({
      scrollTrigger: {
        trigger: main.current,
        start: 'top top', 
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    helixTl.to('.helix-group', { rotateY: 360, ease: 'none' }, 0);
  }, { scope: main, dependencies: [isReadyToAnimate] });

  // ── Loading states ───────────────────────────────────────────────────────
  if (!content || !summary) return notFound();

  // Calculate project index for numbering
  const projectIndex = Object.keys(PROJECT_SUMMARIES).indexOf(safeId) + 1;

  return (
    <div
      ref={main}
      className="relative min-h-[350vh] overflow-x-hidden selection:bg-brand/20 bg-page text-ink transition-colors duration-300"
    >
      <InfallibleCursor />

      {/* ── 3D BACKGROUND (DEFERRED LOADING) ── */}
      {isReadyToAnimate && (
        <>
          <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden" style={{ perspective: '900px' }}>
            <div
              className="helix-group will-change-transform"
              style={{
                width: 'clamp(180px, 30vw, 420px)', height: '210vh',
                opacity: darkMode ? 0.2 : 0.1,
                filter: `drop-shadow(0 0 30px ${theme.helixA}60)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <DNAHelix accent={theme.helixA} secondary={theme.helixB} darkMode={darkMode} />
            </div>
          </div>
          <div className="fixed inset-0 pointer-events-none z-0 opacity-60">
            <TerrainMesh accent={theme.helixA} />
          </div>
          <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
            {[1, 2, 3, 4, 5].map(i => (
              <FloatingArtifact key={i} accent={theme.accent} idx={i} />
            ))}
          </div>
        </>
      )}

      {/* ── HEADER ── */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] w-[calc(100%-3rem)] max-w-[1200px]">
        <div className="flex items-center justify-between px-6 py-3.5 rounded-2xl bg-white/80 dark:bg-black/50 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-glass">
          <button
            ref={backMagRef}
            onClick={handleReturn}
            className="flex items-center gap-2 font-medium text-xs tracking-wide opacity-70 hover:opacity-100 transition-opacity text-ink bg-transparent border-none cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ChevronLeft size={16} /> Todos los proyectos
            </span>
          </button>
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <Activity size={10} style={{ color: theme.accent }} className="animate-pulse" />
            {theme.label}
          </div>
        </div>
      </header>

      {/* ── FAKE 3D HERO (Full-viewport parallax + zoom) ── */}
      <ProjectHero
        projectId={safeId}
        title={scrambledTitle}
        subtitle={content?.subtitle ?? ''}
        accent={theme.accent}
        accentBg={theme.helixA}
        liveUrl={liveUrl ?? undefined}
        videoUrl={videoUrl ?? undefined}
        iframeTitle={`${safeId} Preview`}
        label={theme.label}
        langs={summary?.langs ?? []}
        darkMode={darkMode}
        index={projectIndex}
      />

      <main className="relative z-10 max-w-[1000px] mx-auto px-6 pt-40 pb-32 bg-page">

        {/* ── OBJECTIVE & STACK ── */}
        <section className="reveal-sec grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-16 mb-40 items-start">
          <div className="space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 border-b border-black/10 dark:border-white/10 pb-4 text-ink">
              El Desafío
            </h2>
            <p className="text-2xl md:text-3xl font-light leading-relaxed tracking-tight text-ink/90">
              {content?.objective}
            </p>
          </div>
          <GlareCard accent={theme.accent} className="p-8 group">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 mb-8 text-ink">Stack Tecnológico</h3>
            <div className="flex flex-col gap-4 text-ink">
              {summary.langs.map((l, i) => (
                <div key={l} className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: LANG_COLORS[l] ?? theme.accent }} />
                  <span className="font-medium text-lg tracking-tight">{l}</span>
                  <div className="flex-1 h-px bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors" />
                  <span className="font-mono text-[9px] opacity-30">0{i + 1}</span>
                </div>
              ))}
            </div>
          </GlareCard>
        </section>

        {/* ── ARCHITECTURE & VISUALIZER ── */}
        <section className="reveal-sec grid grid-cols-1 md:grid-cols-2 gap-16 mb-40 items-center">
          <div className="order-2 md:order-1">
            <GlareCard accent={theme.accent} className="p-10">
              {!isBackend && !isJava && !isA11y && !isSpot && <SandwichDiagram accent={theme.accent} />}
              {isBackend && <MVCTerminal accent={theme.accent} />}
              {isJava    && <DistributedNodes accent={theme.accent} />}
              {isA11y    && <WCAGVisualizer accent={theme.accent} />}
              {isSpot    && <SpotshareHeatmap accent={theme.accent} />}
            </GlareCard>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center border border-black/10 dark:border-white/10 shadow-lg"
              style={{ background: `${theme.accent}15` }}
            >
              {isBackend ? <Database size={20} style={{ color: theme.accent }} />
               : isJava  ? <Server   size={20} style={{ color: theme.accent }} />
               : isA11y  ? <Layers   size={20} style={{ color: theme.accent }} />
               :            <Zap     size={20} style={{ color: theme.accent }} />}
            </div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight leading-tight text-ink">
              {content?.algorithmH}
            </h2>
            <p className="text-lg opacity-60 leading-relaxed font-light text-ink">
              {content?.algorithmP}
            </p>
          </div>
        </section>

        {/* ── CODE ── */}
        {snippet && (
          <section className="reveal-sec mb-40">
            <div className="mb-10 space-y-4 max-w-2xl text-ink">
              <h2 className="text-3xl font-medium tracking-tight">{content?.supabaseH}</h2>
              <p className="text-lg opacity-60 font-light">{content?.supabaseP}</p>
            </div>
            <div className="rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-2xl relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="h-12 bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-6">
                <div className="flex items-center gap-3 text-ink">
                  <Terminal size={14} className="opacity-40" />
                  <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest">
                    {content?.codeSpotlight}
                  </span>
                </div>
                <ShieldCheck size={14} style={{ color: theme.accent }} className="opacity-50" />
              </div>
              <pre className="p-8 overflow-x-auto bg-black/[0.02] dark:bg-transparent">
                <code className="font-mono text-[13px] leading-loose" style={{ color: theme.accent }}>
                  {snippet}
                </code>
              </pre>
            </div>
          </section>
        )}

        {/* ── OUTCOME ── */}
        <section className="reveal-sec text-center pt-32 pb-16 border-t border-black/10 dark:border-white/5">
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40 mb-10 text-ink">
            Conclusión del Proyecto
          </p>
          <h2
            className="font-black uppercase italic tracking-tighter mb-10 text-ink"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 0.9, color: theme.accent }}
          >
            {content?.outcomeH}
          </h2>
          <p className="text-xl opacity-60 max-w-2xl mx-auto font-light leading-relaxed mb-20 text-ink">
            {content?.outcomeP}
          </p>
          <button
            ref={closeMagRef}
            onClick={handleReturn}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-ink text-page font-medium text-sm transition-transform hover:scale-105 active:scale-95 shadow-xl border-none cursor-pointer"
          >
            <span className="flex items-center gap-3">
              Cerrar caso de estudio <ArrowUpRight size={16} />
            </span>
          </button>
        </section>
      </main>
    </div>
  );
}
