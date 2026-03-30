'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ArrowUpRight, ArrowRight, Activity, Code2 } from 'lucide-react';
import { LANG_COLORS } from '../../lib/constants';
import type { ProjectCard, RepoFull, Tx } from '../../lib/types';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// ─── FASES DEL CICLO DE VIDA DE INGENIERÍA ───
const LIFECYCLE = ['System Architecture', 'Core Development', 'Production Deployment', 'Security & Audit'];

// ─── MAPA DE ESTADOS (PROGRESS 1 a 4) ───
const PROJ_THEMES: Record<string, { color: string, img: string, progress: number, btnText: string, hasAudit: boolean }> = {
  'ana-peluquera': { 
    color: '#ff2d78', img: 'radial-gradient(circle at 50% 100%, #ff2d7815 0%, transparent 60%)',
    progress: 4, btnText: 'Ver Auditoría', hasAudit: true 
  },
  'who-are-ya-backend': { 
    color: '#00ff41', img: 'radial-gradient(circle at 50% 100%, #00ff4115 0%, transparent 60%)',
    progress: 4, btnText: 'Ver Auditoría', hasAudit: true 
  },
  'rides24ofiziala': { 
    color: '#f59e0b', img: 'radial-gradient(circle at 50% 100%, #f59e0b15 0%, transparent 60%)',
    progress: 3, btnText: 'Ver Repositorio', hasAudit: false // En fase de despliegue
  },
  'spotshare-parking': { 
    color: '#00f0ff', img: 'radial-gradient(circle at 50% 100%, #00f0ff15 0%, transparent 60%)',
    progress: 2, btnText: 'Ver Repositorio', hasAudit: false // En desarrollo temprano
  },
  'pke_web': { 
    color: '#b026ff', img: 'radial-gradient(circle at 50% 100%, #b026ff15 0%, transparent 60%)',
    progress: 4, btnText: 'Ver Auditoría', hasAudit: true // Auditoría lista
  },
};

// ─── FILA ORIGINAL DE GITHUB (RESTAURADA) ───
function RepoRow({ r, idx, hovR, setHovR, lineRef }: { r: RepoFull; idx: number; hovR: number | null; setHovR: (i: number | null) => void; lineRef: (el: HTMLDivElement | null) => void; }) {
  return (
    <div ref={lineRef} className="border-b border-black/7 dark:border-white/10 transition-colors duration-200 hover:bg-black/[0.018] dark:hover:bg-white/[0.02]" onMouseEnter={() => setHovR(idx)} onMouseLeave={() => setHovR(null)}>
      <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="no-underline block py-4 relative z-10">
        <div className="flex items-center gap-5">
          <span className="font-mono text-[10px] text-lead/40 w-6 shrink-0">{String(idx + 1).padStart(2, '0')}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
              <span className={`font-mono text-[13px] font-medium transition-colors duration-200 ${hovR === idx ? 'text-brand' : 'text-ink'}`}>{r.name}</span>
              <div className="flex flex-wrap gap-[0.3rem]">
                {r.langs?.map(l => (
                  <span key={l} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/5 dark:bg-white/[0.03] border border-black/8 dark:border-white/10 text-lead whitespace-nowrap">
                    <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: LANG_COLORS[l] ?? '#999', filter: hovR === idx ? `drop-shadow(0 0 4px ${LANG_COLORS[l] ?? '#999'})` : 'none', transition: 'filter .2s' }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <div className={`overflow-hidden transition-[max-height,opacity] duration-300 ${hovR === idx ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}`}>
              {r.description && <p className="text-[11px] text-lead mt-2 leading-[1.5]">{r.description}</p>}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4 shrink-0">
            <span className="hidden sm:block font-mono text-[10px] text-lead/40">{(r.size / 1024).toFixed(1)}MB</span>
            {r.stargazers_count > 0 && <span className="text-[10px] text-lead/40">★{r.stargazers_count}</span>}
            <span className="font-mono text-[10px] text-lead/30">{new Date(r.pushed_at).getFullYear()}</span>
            <ArrowUpRight size={14} className={`transition-all duration-200 ${hovR === idx ? 'text-brand opacity-100' : 'text-lead opacity-30'}`} />
          </div>
        </div>
      </a>
    </div>
  );
}

// ─── FILA ACORDEÓN BENTO BOX ───
function PremiumWorkRow({ proj, idx, isExpanded, onToggle }: { proj: ProjectCard; idx: number; isExpanded: boolean; onToggle: () => void; }) {
  const [isHovered, setIsHovered] = useState(false);
  const safeId = proj.name.toLowerCase().replace(/[\s_]+/g, '-');
  
  const theme = PROJ_THEMES[safeId] || { color: '#888', img: 'none', progress: 1, btnText: 'Source Code', hasAudit: false };

  return (
    <div 
      className={`group/row relative border-b border-black/10 dark:border-white/10 transition-colors duration-400 ${isExpanded ? 'bg-black/[0.02] dark:bg-white/[0.02]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 z-0 opacity-0 group-hover/row:opacity-100 transition-opacity duration-400 pointer-events-none" style={{ background: theme.img }} />
      
      {/* ── CABECERA DEL ACORDEÓN ── */}
      <div onClick={onToggle} className="relative z-10 py-10 px-4 md:px-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6 md:gap-10">
          <span className={`font-mono text-xs tracking-widest transition-colors duration-300 ${isExpanded ? 'opacity-100' : 'opacity-30'}`} style={{ color: isExpanded ? theme.color : 'inherit' }}>
            0{idx + 1}
          </span>
          <div className="py-2"> 
            <h3 
              className={`font-black text-[clamp(1.8rem,4.5vw,4rem)] leading-[0.95] tracking-tighter uppercase transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isHovered && !isExpanded ? 'translate-x-4' : ''}`}
              style={{ color: isHovered || isExpanded ? theme.color : 'inherit' }}
            >
              {proj.name.replace(/-/g, ' ')}
            </h3>
          </div>
        </div>

        <div className={`flex items-center gap-8 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isHovered && !isExpanded ? '-translate-x-4' : ''}`}>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] font-bold opacity-60 group-hover/row:opacity-100 hidden md:block" style={{ color: theme.color }}>
            {proj.tag}
          </span>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-400 ${isExpanded ? 'rotate-90 bg-ink text-page shadow-xl' : 'border border-black/15 dark:border-white/15 group-hover/row:scale-110'}`}>
            <ArrowRight size={18} strokeWidth={isExpanded ? 2.5 : 1.5} />
          </div>
        </div>
      </div>

      {/* ── INTERIOR BENTO BOX ── */}
      <div 
        className="grid transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-10 px-4 md:px-8"
        style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr', opacity: isExpanded ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <div className="pb-12 pt-2 grid grid-cols-1 lg:grid-cols-[1.2fr_2fr] gap-4">
            
            {/* ── TARJETA: PROJECT LIFECYCLE ── */}
            <div className="p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden group/card shadow-sm" style={{ backgroundColor: `${theme.color}03`, border: `1px solid ${theme.color}20` }}>
              <div className="absolute top-0 right-0 w-48 h-48 blur-[70px] opacity-30 transition-opacity duration-700 group-hover/card:opacity-60" style={{ backgroundColor: theme.color }} />
              
              <div className="relative z-10">
                <span className="font-mono text-[9px] uppercase tracking-[0.4em] opacity-40">Project Lifecycle</span>
                
                {/* TIMELINE DE INGENIERÍA */}
                <div className="mt-8">
                  {LIFECYCLE.map((stage, i) => {
                    const isCompleted = i < theme.progress;
                    const isActive = i === theme.progress - 1;
                    
                    return (
                      <div key={stage} className="flex items-start gap-4 relative">
                        {/* Línea conectora */}
                        {i !== LIFECYCLE.length - 1 && (
                          <div className="absolute left-[5px] top-[14px] w-[1px] h-full" 
                               style={{ 
                                 background: isCompleted && !isActive ? theme.color : 'currentColor', 
                                 opacity: isCompleted && !isActive ? 0.4 : 0.05 
                               }} 
                          />
                        )}
                        
                        {/* Punto */}
                        <div className="relative flex items-center justify-center w-3 h-3 mt-1 shrink-0 z-10">
                          <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? '' : 'bg-black/10 dark:bg-white/10'}`} 
                               style={{ backgroundColor: isCompleted ? theme.color : undefined }} />
                          {isActive && <div className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ backgroundColor: theme.color }} />}
                        </div>
                        
                        {/* Texto */}
                        <div className={`pb-6 font-mono text-[9px] uppercase tracking-[0.25em] ${isCompleted ? 'opacity-90' : 'opacity-30'} ${isActive ? 'font-bold' : ''}`}
                             style={{ color: isActive ? theme.color : 'inherit' }}>
                          {stage}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* LÓGICA DE BOTONES */}
              {theme.hasAudit ? (
                <Link 
                  href={`/work/${safeId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 mt-6 flex items-center justify-between px-6 py-4 rounded-full bg-ink text-page hover:scale-105 active:scale-95 transition-transform shadow-xl"
                >
                  <span className="font-bold text-[11px] uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className="animate-pulse" /> {theme.btnText}
                  </span>
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <a 
                  href={`https://github.com/eneekoruiz/${proj.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 mt-6 flex items-center justify-between px-6 py-4 rounded-full border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 hover:scale-105 active:scale-95 transition-transform"
                >
                  <span className="font-bold text-[11px] uppercase tracking-widest flex items-center gap-2">
                    <Code2 size={14} /> {theme.btnText}
                  </span>
                  <ArrowUpRight size={16} className="opacity-50" />
                </a>
              )}
            </div>

            {/* ── TARJETA: INFORMACIÓN ── */}
            <div className="p-8 md:p-10 rounded-3xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col justify-between gap-10">
              <p className="text-xl md:text-2xl font-light leading-[1.6] opacity-90 max-w-2xl">
                {proj.desc}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-black/5 dark:border-white/5">
                <div className="space-y-2">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.4em] opacity-40">Año</span>
                  <span className="block font-medium text-lg">{proj.year}</span>
                </div>
                <div className="space-y-2">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.4em] opacity-40">Tamaño</span>
                  <span className="block font-medium text-lg">{proj.size}</span>
                </div>
                <div className="col-span-2 sm:col-span-2 space-y-3">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.4em] opacity-40">Stack Principal</span>
                  <div className="flex flex-wrap gap-2">
                    {proj.langs.map(l => (
                      <span key={l} className="px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-[10px] font-medium tracking-wide bg-black/[0.03] dark:bg-white/[0.03]">
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
    </div>
  );
}

// ─── ESQUELETOS ───
function SkeletonProjRow({ idx }: { idx: number }) {
  return (
    <div className="border-b border-black/5 dark:border-white/5 py-12 px-8 flex items-center justify-between animate-pulse" style={{ animationDelay: `${idx * 0.1}s` }}>
      <div className="flex items-center gap-12">
        <span className="w-4 h-4 rounded bg-black/10 dark:bg-white/10" />
        <span className="block h-10 w-64 rounded-xl bg-black/5 dark:bg-white/5" />
      </div>
      <span className="block h-10 w-10 rounded-full bg-black/5 dark:bg-white/5" />
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ───
interface ProjectsProps { t: Tx; top3: ProjectCard[]; repos: RepoFull[]; load: boolean; offline: boolean; BranchMergeBtn: React.ComponentType<{ label: string; href: string }>; }

export function Projects({ t, top3, repos, load, offline, BranchMergeBtn }: ProjectsProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [hovR, setHovR] = useState<number | null>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (load) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.projects-header', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true } });
      gsap.fromTo('.work-row-anim', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out', scrollTrigger: { trigger: '.projects-list', start: 'top 90%', once: true } });
    });
    return () => ctx.revert();
  }, [load]);

  return (
    <>
      <section ref={sectionRef} id="work" className="py-32 px-4 md:px-8 max-w-[1300px] mx-auto relative z-20">
        <div className="projects-header mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-12 bg-ink opacity-20" />
            <p className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-lead/60">{t.woLb || 'PORTFOLIO DE INGENIERÍA'}</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="font-black text-[clamp(3.5rem,7vw,6.5rem)] tracking-tighter leading-[0.85] text-ink uppercase italic">Selected<br/>Works.</h2>
            <div className="flex flex-col md:items-end gap-2 opacity-40">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] hidden md:block">Click to expand ↓</span>
            </div>
          </div>
        </div>

        <div className="projects-list border-t border-black/10 dark:border-white/10">
          {(load || top3.length === 0)
            ? [0, 1, 2, 3, 4].map(i => <div key={i} className="work-row-anim"><SkeletonProjRow idx={i} /></div>)
            : top3.map((p, i) => (
                <div key={p.n} className="work-row-anim">
                  <PremiumWorkRow proj={p} idx={i} isExpanded={expandedIdx === i} onToggle={() => setExpandedIdx(prev => prev === i ? null : i)} />
                </div>
              ))
          }
        </div>
      </section>

      <section id="github" data-section="github" className="border-t border-black/7 dark:border-white/10 py-24 px-8 max-w-[1200px] mx-auto relative z-10">
        <div className="flex items-end justify-between pb-5 border-b border-black/7 dark:border-white/10 mb-1">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-lead/60">{t.ghLb || 'ACTIVIDAD'}</p>
          <span className="font-mono text-[10px] text-lead/40">{repos?.length || 0}_repos</span>
        </div>
        <div className="min-h-[200px]">
          {load ? (
            <div className="py-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="border-b border-black/7 dark:border-white/10 py-5 flex items-center gap-5 animate-pulse" style={{ animationDelay: `${i * 0.07}s` }}>
                  <span className="w-5 h-3 rounded bg-black/8 dark:bg-white/8 shrink-0" />
                  <span className="h-4 flex-1 max-w-[220px] rounded bg-black/8 dark:bg-white/8" />
                </div>
              ))}
            </div>
          ) : (
            <div>
              {repos.slice(0, 10).map((r, i) => (
                <RepoRow key={r.id} r={r} idx={i} hovR={hovR} setHovR={setHovR} lineRef={el => { lineRefs.current[i] = el; }} />
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center mt-12">
          <BranchMergeBtn label={t.moreGh || 'VER TODO EN GITHUB'} href="https://github.com/eneekoruiz" />
        </div>
      </section>
    </>
  );
}