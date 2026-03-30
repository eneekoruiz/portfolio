'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Github, ArrowUpRight, Database, Terminal,
  Cpu, ShieldCheck, Zap, Activity, Server,
  Layers, ChevronLeft, CheckCircle2, Radar
} from 'lucide-react';

import { TX } from '../../lib/translations';
import { PROJECTS_CONTENT, CODE_SNIPPETS } from '../../lib/projects-data';
import { LANG_COLORS } from '../../lib/constants';
import type { Lang } from '../../lib/types';
import { InfallibleCursor } from '../../components/ui/InfallibleCursor';
import { useGitHub } from '../../hooks/useGitHub';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── THEMES ─────────────────────────────────────────────
const THEMES: Record<string, any> = {
  'ana-peluquera': {
    helixA: '#ff2d78', helixB: '#ff9fcd', accent: '#ff2d78', label: 'FRONTEND / UX_ENGINE',
  },
  'who-are-ya-backend': {
    helixA: '#00ff41', helixB: '#00cc33', accent: '#00ff41', label: 'BACKEND / SYSTEM_CORE',
  },
  'rides24ofiziala': {
    helixA: '#f59e0b', helixB: '#fbbf24', accent: '#f59e0b', label: 'DISTRIBUTED / JAX-WS',
  },
  'spotshare-parking': {
    helixA: '#00f0ff', helixB: '#0ea5e9', accent: '#00f0ff', label: 'CLOUD / REAL_TIME',
  },
  'pke_web': {
    helixA: '#b026ff', helixB: '#d8b4fe', accent: '#b026ff', label: 'A11Y / UX_SEMANTIC',
  },
};

const DEFAULT_THEME = { helixA: '#888', helixB: '#aaa', accent: '#888', label: 'MODULE' };

// ─── 3D BACKGROUND COMPONENTS (Restaurados) ──────────────────────────────────
function DNAHelix({ accent, secondary, darkMode }: { accent: string; secondary: string; darkMode: boolean }) {
  const W = 120, H = 1200, steps = 80;
  const strandA: string[] = [];
  const strandB: string[] = [];
  const rungs: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 6;
    const y = (i / steps) * H;
    const xA = W / 2 + Math.sin(t) * (W * 0.38);
    const xB = W / 2 + Math.sin(t + Math.PI) * (W * 0.38);
    strandA.push(`${i === 0 ? 'M' : 'L'} ${xA.toFixed(2)} ${y.toFixed(2)}`);
    strandB.push(`${i === 0 ? 'M' : 'L'} ${xB.toFixed(2)} ${y.toFixed(2)}`);
    if (i % 4 === 0 && i > 0 && i < steps) {
      rungs.push({ x1: xA, y1: y, x2: xB, y2: y });
    }
  }

  return (
    <svg className="helix-svg w-full h-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <filter id="helix-glow" x="-50%" y="-5%" width="200%" height="110%">
          <feGaussianBlur stdDeviation={darkMode ? '3' : '1.5'} result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="strand-grad-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.1" />
          <stop offset="40%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="strand-grad-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={secondary} stopOpacity="0.05" />
          <stop offset="50%" stopColor={secondary} stopOpacity="0.5" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path className="helix-strand-a" d={strandA.join(' ')} fill="none" stroke="url(#strand-grad-a)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" filter="url(#helix-glow)" />
      <path className="helix-strand-b" d={strandB.join(' ')} fill="none" stroke="url(#strand-grad-b)" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
      {rungs.map((r, i) => (
        <g key={i}>
          <line className="helix-rung" x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke={accent} strokeWidth="0.35" opacity="0.25" strokeDasharray="1.5 1.5" />
          <circle cx={(r.x1 + r.x2) / 2} cy={r.y1} r="0.8" fill={i % 3 === 0 ? accent : secondary} opacity="0.35" />
        </g>
      ))}
    </svg>
  );
}

function TerrainMesh({ accent }: { accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      tRef.current += 0.004;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 0.4;
      for (let row = 0; row <= 10; row++) {
        ctx.beginPath();
        for (let col = 0; col <= 18; col++) {
          const x = col * (W / 18);
          const wave = Math.sin(col * 0.4 + tRef.current * 2.1) * 12 + Math.sin(col * 0.15 + row * 0.5 + tRef.current) * 8;
          const y = row * (H / 10) + wave;
          if (col === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.globalAlpha = 0.04;
        ctx.stroke();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [accent]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40" style={{ mixBlendMode: 'screen' }} />;
}

function FloatingArtifact({ accent, idx }: { accent: string; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: `${-20 - idx * 5}`,
      x: `${Math.sin(idx) * 15}`,
      rotate: idx % 2 === 0 ? 360 : -360,
      duration: 5 + idx,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, [idx]);
  const shapes = [
    <div key="1" className="w-2 h-2 rounded-full" style={{ background: accent, opacity: 0.4 }} />,
    <div key="2" className="w-4 h-4 border rotate-45" style={{ borderColor: accent, opacity: 0.3 }} />,
    <div key="3" className="w-6 h-[1px]" style={{ background: accent, opacity: 0.2 }} />,
  ];
  return <div ref={ref} className="absolute pointer-events-none" style={{ top: `${20 + idx * 12}%`, left: idx % 2 === 0 ? '10%' : '85%' }}>{shapes[idx % 3]}</div>;
}

// ─── VISUALIZERS (Adaptados a Light/Dark Mode) ───────────────────────────────
function SandwichDiagram({ accent }: { accent: string }) {
  return (
    <div className="w-full space-y-4 font-mono text-[10px]">
      <div className="flex items-stretch gap-2 h-14">
        <div className="flex-1 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transition-transform hover:scale-[1.02]" style={{ background: accent }}>ACTIVE_01</div>
        <div className="w-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden" style={{ borderColor: `${accent}50`, color: accent }}>
          <span className="opacity-50">WAIT</span>
          <div className="absolute bottom-0 left-0 h-1 bg-current animate-pulse" style={{ width: '100%', animationDuration: '2s' }} />
        </div>
        <div className="flex-1 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transition-transform hover:scale-[1.02]" style={{ background: accent }}>ACTIVE_02</div>
      </div>
      <div className="h-10 rounded-xl flex items-center justify-center font-bold tracking-widest bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10" style={{ color: accent }}>
        ✨ PARALLEL SLOT INJECTED
      </div>
    </div>
  );
}

function MVCTerminal({ accent }: { accent: string }) {
  return (
    <div className="bg-black/5 dark:bg-[#0a0a0a] rounded-xl border border-black/10 dark:border-white/10 font-mono text-[11px] h-44 flex flex-col overflow-hidden shadow-2xl">
      <div className="h-8 bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 flex items-center px-4 gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
      </div>
      <div className="p-5 flex-1 flex flex-col justify-center space-y-2 text-ink">
        <div className="flex items-center gap-2"><span style={{ color: accent }}>❯</span> <span className="opacity-70">GET /api/v1/players</span></div>
        <div className="flex items-center gap-2 opacity-40"><span>[Router]</span> <span>Executing aggregation pipeline...</span></div>
        <div className="flex items-center gap-2 font-bold" style={{ color: '#27c93f' }}><span>✔</span> <span>200 OK (Latency: 12ms)</span></div>
      </div>
    </div>
  );
}

function DistributedNodes({ accent }: { accent: string }) {
  return (
    <div className="relative h-44 flex items-center justify-center">
      <div className="absolute w-32 h-32 rounded-full border border-dashed animate-spin-slow" style={{ borderColor: `${accent}40` }} />
      <div className="absolute w-20 h-20 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10">
        <Server size={24} style={{ color: accent }} />
      </div>
      {[0, 120, 240].map((deg, i) => (
        <div key={i} className="absolute w-10 h-10 rounded-full bg-page border border-black/10 dark:border-white/10 flex items-center justify-center shadow-lg transition-all hover:scale-110"
             style={{ transform: `rotate(${deg}deg) translateY(-65px) rotate(-${deg}deg)` }}>
          <Database size={14} style={{ color: accent }} />
        </div>
      ))}
    </div>
  );
}

function WCAGVisualizer({ accent }: { accent: string }) {
  return (
    <div className="h-44 flex flex-col justify-between">
      <div className="flex-1 rounded-xl flex items-center justify-center mb-4 transition-all duration-700 bg-black/5 dark:bg-white text-ink dark:text-black">
        <span className="font-black text-4xl tracking-tighter">Aa</span>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <div className="text-[10px] font-mono opacity-40 uppercase tracking-widest text-ink">Contrast</div>
          <div className="text-xl font-bold font-mono" style={{ color: accent }}>21.0:1</div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 font-mono text-[10px] font-bold">
          <CheckCircle2 size={14} /> AAA PASS
        </div>
      </div>
    </div>
  );
}

function SpotshareHeatmap({ accent }: { accent: string }) {
  return (
    <div className="relative h-44 rounded-xl bg-black/5 dark:bg-[#050505] border border-black/10 dark:border-white/10 overflow-hidden flex items-center justify-center group shadow-inner">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at center, ${accent} 1px, transparent 1px)`, backgroundSize: '15px 15px' }} />
      <div className="absolute w-[200%] h-[200%] origin-center animate-spin" style={{ background: `conic-gradient(from 0deg, transparent 70%, ${accent}40 100%)`, animationDuration: '3s', animationTimingFunction: 'linear' }} />
      
      <div className="relative z-10 w-16 h-16 rounded-full bg-page/80 backdrop-blur-xl border border-black/10 dark:border-white/20 flex items-center justify-center shadow-xl">
        <Radar size={24} style={{ color: accent }} className="animate-pulse" />
      </div>
      <div className="absolute top-10 left-10 w-2 h-2 rounded-full animate-ping" style={{ background: accent }} />
      <div className="absolute bottom-12 right-16 w-2 h-2 rounded-full animate-ping" style={{ background: accent, animationDelay: '1s' }} />
    </div>
  );
}

// ─── PREMIUM GLARE CARD ───────────────────────
function GlareCard({ children, accent, className = '', style }: { children: React.ReactNode; accent: string; className?: string; style?: React.CSSProperties; }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r || !glareRef.current) return;
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    glareRef.current.style.setProperty('--gx', `${x}%`);
    glareRef.current.style.setProperty('--gy', `${y}%`);
  };

  return (
    <div 
      ref={cardRef} 
      onMouseMove={onMove} 
      className={`relative overflow-hidden rounded-3xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-2xl transition-all duration-500 hover:border-black/15 dark:hover:border-white/15 hover:shadow-2xl hover:-translate-y-1 ${className}`} 
      style={style}
    >
      <div 
        ref={glareRef} 
        className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
        style={{ background: `radial-gradient(circle 300px at var(--gx,50%) var(--gy,50%), ${accent}15, transparent)` }} 
      />
      <div className="relative z-20">{children}</div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ProjectPage() {
  const { id } = useParams();
  const main = useRef<HTMLDivElement>(null);
  const heroMonitorRef = useRef<HTMLDivElement>(null);
  const [lang] = useState<Lang>('es');
  const [darkMode, setDarkMode] = useState(false);
  const { top3 } = useGitHub(TX[lang]);

  const safeId = id as string;
  const theme = THEMES[safeId] || DEFAULT_THEME;
  
  const isBackend = safeId === 'who-are-ya-backend';
  const isJava    = safeId === 'rides24ofiziala';
  const isSpot    = safeId === 'spotshare-parking';
  const isA11y    = safeId === 'pke_web'; 

  const proj = useMemo(() => top3?.find(p => p.name.toLowerCase().replace(/[\s_]+/g, '-') === safeId) || null, [top3, safeId]);
  const content = PROJECTS_CONTENT[safeId]?.[lang] || PROJECTS_CONTENT[safeId]?.['en'] || PROJECTS_CONTENT[safeId]?.['es'];
  const snippet = CODE_SNIPPETS[safeId];
  
  const liveUrl = isBackend ? 'https://who-are-ya-backend.onrender.com/login' : isJava ? null : 'https://ana-peluquera.lovable.app/';

  useEffect(() => {
    // Escuchamos la clase dark global para el SVG de la hélice
    const isDark = document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  useGSAP(() => {
    if (!main.current || !proj) return;
    
    gsap.fromTo(heroMonitorRef.current, 
      { scale: 0.9, opacity: 0, y: 40 }, 
      { scale: 1, opacity: 1, y: 0, duration: 1.6, ease: 'power4.out', delay: 0.2 }
    );

    // Animación de rotación del túnel 3D al hacer scroll
    gsap.timeline({ scrollTrigger: { trigger: main.current, start: 'top top', end: 'bottom bottom', scrub: 2.5 } })
      .to('.helix-group', { rotateY: 360, ease: 'none' }, 0);

    gsap.utils.toArray<HTMLElement>('.reveal-sec').forEach(el => {
      gsap.fromTo(el, 
        { opacity: 0, y: 40 }, 
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
      );
    });
  }, { scope: main, dependencies: [safeId, proj] });

  if (!proj && top3 && top3.length > 0) return notFound();
  if (!proj) return (
    <div className="min-h-screen flex items-center justify-center bg-page text-ink">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: theme.accent, borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div ref={main} className="relative min-h-[350vh] overflow-x-hidden selection:bg-brand/20 bg-page text-ink transition-colors duration-300">
      <InfallibleCursor />
      
      {/* ── 3D BACKGROUND (Túnel ADN + Malla) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden" style={{ perspective: '900px' }}>
        <div className="helix-group will-change-transform" style={{ width: 'clamp(180px, 30vw, 420px)', height: '210vh', opacity: darkMode ? 0.2 : 0.1, filter: `drop-shadow(0 0 30px ${theme.helixA}60)`, transformStyle: 'preserve-3d' }}>
          <DNAHelix accent={theme.helixA} secondary={theme.helixB} darkMode={darkMode} />
        </div>
      </div>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-60"><TerrainMesh accent={theme.helixA} /></div>
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">{[1,2,3,4,5].map(i => <FloatingArtifact key={i} accent={theme.accent} idx={i} />)}</div>

      {/* ── HEADER ── */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-3rem)] max-w-[1200px]">
        <div className="flex items-center justify-between px-6 py-3.5 rounded-2xl bg-white/80 dark:bg-black/50 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-glass">
          <Link href="/#work" className="flex items-center gap-2 font-medium text-xs tracking-wide opacity-70 hover:opacity-100 transition-opacity text-ink">
            <ChevronLeft size={16} /> Todos los proyectos
          </Link>
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <Activity size={10} style={{ color: theme.accent }} className="animate-pulse" /> {theme.label}
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1000px] mx-auto px-6 pt-40 pb-32">
        
        {/* ── HERO (Títulos Brutalistas + Itálica) ── */}
        <section className="flex flex-col items-center text-center mb-32">
          <h1 className="font-black uppercase italic tracking-tighter leading-[0.85] mb-6 text-ink" style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', color: theme.accent }}>
            {content?.title || proj?.name}
          </h1>
          <p className="text-xl md:text-2xl font-light opacity-50 tracking-tight max-w-2xl mb-16 text-ink">
            {content?.subtitle}
          </p>

          <div ref={heroMonitorRef} className="w-full rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/40 backdrop-blur-xl relative group" style={{ height: 'clamp(300px, 60vw, 600px)', boxShadow: `0 40px 100px -20px ${theme.accent}30` }}>
            {/* Barra superior de macOS */}
            <div className="h-10 bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/5 flex items-center px-4 gap-2">
              <div className="flex gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity"><div className="w-3 h-3 rounded-full bg-[#ff5f56]" /><div className="w-3 h-3 rounded-full bg-[#ffbd2e]" /><div className="w-3 h-3 rounded-full bg-[#27c93f]" /></div>
              <div className="flex-1 text-center font-mono text-[10px] opacity-40 text-ink">{`${safeId}.exe`}</div>
            </div>
            <div className="h-[calc(100%-2.5rem)] relative bg-white dark:bg-[#050505]">
              {liveUrl ? (
                <iframe src={liveUrl} className="w-full h-full border-none opacity-90 group-hover:opacity-100 transition-opacity duration-700" title="Preview" loading="lazy" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-ink">
                  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-xl">
                    <Cpu size={32} style={{ color: theme.accent }} className="animate-pulse" />
                  </div>
                  <p className="font-mono text-xs opacity-40 uppercase tracking-widest">System Core Active</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── OBJETIVO & STACK ── */}
        <section className="reveal-sec grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-16 mb-40 items-start">
          <div className="space-y-6">
            <h2 className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 border-b border-black/10 dark:border-white/10 pb-4 text-ink">El Desafío</h2>
            <p className="text-2xl md:text-3xl font-light leading-relaxed tracking-tight text-ink/90">
              {content?.objective}
            </p>
          </div>
          <GlareCard accent={theme.accent} className="p-8 group">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 mb-8 text-ink">Stack Tecnológico</h3>
            <div className="flex flex-col gap-4 text-ink">
              {proj?.langs.map((l, i) => (
                <div key={l} className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: LANG_COLORS[l] ?? theme.accent }} />
                  <span className="font-medium text-lg tracking-tight">{l}</span>
                  <div className="flex-1 h-px bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors" />
                  <span className="font-mono text-[9px] opacity-30">0{i+1}</span>
                </div>
              ))}
            </div>
          </GlareCard>
        </section>

        {/* ── ARQUITECTURA & VISUALIZADOR ── */}
        <section className="reveal-sec grid grid-cols-1 md:grid-cols-2 gap-16 mb-40 items-center">
          <div className="order-2 md:order-1">
            <GlareCard accent={theme.accent} className="p-10">
              {!isBackend && !isJava && !isA11y && !isSpot && <SandwichDiagram accent={theme.accent} />}
              {isBackend && <MVCTerminal accent={theme.accent} />}
              {isJava && <DistributedNodes accent={theme.accent} />}
              {isA11y && <WCAGVisualizer accent={theme.accent} />}
              {isSpot && <SpotshareHeatmap accent={theme.accent} />}
            </GlareCard>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-black/10 dark:border-white/10 shadow-lg" style={{ background: `${theme.accent}15` }}>
              {isBackend ? <Database size={20} style={{ color: theme.accent }}/> : isJava ? <Server size={20} style={{ color: theme.accent }}/> : isA11y ? <Layers size={20} style={{ color: theme.accent }}/> : <Zap size={20} style={{ color: theme.accent }}/>}
            </div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight leading-tight text-ink">{content?.algorithmH}</h2>
            <p className="text-lg opacity-60 leading-relaxed font-light text-ink">{content?.algorithmP}</p>
          </div>
        </section>

        {/* ── CÓDIGO ── */}
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
                  <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest">{content?.codeSpotlight}</span>
                </div>
                <ShieldCheck size={14} style={{ color: theme.accent }} className="opacity-50" />
              </div>
              <pre className="p-8 overflow-x-auto bg-black/[0.02] dark:bg-transparent">
                <code className="font-mono text-[13px] leading-loose" style={{ color: theme.accent }}>{snippet}</code>
              </pre>
            </div>
          </section>
        )}

        {/* ── OUTCOME (Títulos Brutalistas + Itálica) ── */}
        <section className="reveal-sec text-center pt-32 pb-16 border-t border-black/10 dark:border-white/5">
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40 mb-10 text-ink">Conclusión del Proyecto</p>
          <h2 className="font-black uppercase italic tracking-tighter mb-10 text-ink" style={{ fontSize: 'clamp(3rem,8vw,6rem)', lineHeight: 0.9, color: theme.accent }}>
            {content?.outcomeH}
          </h2>
          <p className="text-xl opacity-60 max-w-2xl mx-auto font-light leading-relaxed mb-20 text-ink">
            {content?.outcomeP}
          </p>
          <Link href="/#work" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-ink text-page font-medium text-sm transition-transform hover:scale-105 active:scale-95 shadow-xl">
            Cerrar caso de estudio <ArrowUpRight size={16} />
          </Link>
        </section>
      </main>
    </div>
  );
}