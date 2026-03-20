'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WifiOff } from 'lucide-react'; // <-- Añadido el icono para el estado sin conexión
import { WorkRow } from '../ui/WorkRow';
import { LANG_COLORS } from '../../lib/constants';
import type { ProjectCard, RepoFull, Tx } from '../../lib/types';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/* ── Skeleton placeholder rows ── */
function SkeletonRow({ idx }: { idx: number }) {
  return (
    <div
      className="border-t border-black/7 dark:border-white/10 py-[1.6rem] px-2 flex items-center gap-5 animate-pulse"
      style={{ animationDelay: `${idx * .1}s` }}
    >
      <span className="w-7 h-3 rounded bg-black/8 dark:bg-white/8 shrink-0" />
      <div className="flex-1 space-y-2">
        <span className="block h-5 w-[40%] rounded bg-black/8 dark:bg-white/8" />
        <span className="block h-3 w-[25%] rounded bg-black/5 dark:bg-white/5" />
        <div className="flex gap-2">{[1,2,3].map(i => <span key={i} className="block h-4 w-14 rounded-full bg-black/5 dark:bg-white/5" />)}</div>
      </div>
      <span className="w-4 h-4 rounded bg-black/5 dark:bg-white/5 shrink-0" />
    </div>
  );
}

/* ── Offline banner ── */
function OfflineBanner({ lang }: { lang: string }) {
  const msgs: Record<string, string> = {
    es: 'Modo sin conexión · Mostrando proyectos locales en caché',
    en: 'Offline mode · Showing cached local projects',
    eu: 'Konexiorik gabe · Tokiko proiektuak erakusten',
    fr: 'Mode hors ligne · Affichage des projets en cache',
    default: 'Offline · Cached data',
  };
  const msg = msgs[lang] ?? msgs.default;

  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 mb-4 rounded-xl border border-amber-400/25 bg-amber-50/70 dark:bg-amber-400/5 text-amber-700 dark:text-amber-400 text-[12px] font-medium w-fit">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
      </svg>
      <span>{msg}</span>
    </div>
  );
}

/* ── Single repo row ── */
function RepoRow({ r, idx, hovR, setHovR, lineRef }: {
  r: RepoFull; idx: number; hovR: number | null;
  setHovR: (i: number | null) => void;
  lineRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={lineRef}
      className="border-b border-black/7 dark:border-white/10 transition-colors duration-200 hover:bg-black/[.018] dark:hover:bg-white/[0.02]"
      onMouseEnter={() => setHovR(idx)}
      onMouseLeave={() => setHovR(null)}
    >
      <a href={r.html_url} target="_blank" rel="noopener noreferrer"
        aria-label={`Ver ${r.name} en GitHub`} className="no-underline block py-3">
        <div className="flex items-center gap-5">
          <span className="font-mono text-[10px] text-lead/40 w-6 shrink-0">{String(idx + 1).padStart(2, '0')}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
              <span className={`font-mono text-[13px] font-medium transition-colors duration-200 ${hovR === idx ? 'text-brand' : 'text-ink'}`}>
                {r.name}
              </span>
              <div className="flex flex-wrap gap-[.3rem]">
                {r.langs?.map(l => (
                  <span key={l} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/5 dark:bg-white/[0.03] border border-black/8 dark:border-white/10 text-lead whitespace-nowrap">
                    <span className="w-[6px] h-[6px] rounded-full shrink-0"
                      style={{ background: LANG_COLORS[l] ?? '#999',
                        filter: hovR === idx ? `drop-shadow(0 0 4px ${LANG_COLORS[l] ?? '#999'})` : 'none',
                        transition: 'filter .2s' }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <div className={`overflow-hidden transition-[max-height,opacity] duration-300 ${hovR === idx ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}`}>
              {r.description && <p className="text-[11px] text-lead mt-1 leading-[1.5]">{r.description}</p>}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4 shrink-0">
            <span className="hidden sm:block font-mono text-[10px] text-lead/40">{(r.size / 1024).toFixed(1)}MB</span>
            {r.stargazers_count > 0 && <span className="text-[10px] text-lead/40">★{r.stargazers_count}</span>}
            <span className="font-mono text-[10px] text-lead/30">{new Date(r.pushed_at).getFullYear()}</span>
            <svg className={`transition-all duration-200 ${hovR === idx ? 'text-brand opacity-100' : 'text-lead opacity-30'}`}
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
}

interface ProjectsProps {
  t: Tx;
  top3: ProjectCard[];
  repos: RepoFull[];
  load: boolean;
  offline: boolean;
  BranchMergeBtn: React.ComponentType<{ label: string; href: string }>;
}

export function Projects({ t, top3, repos, load, offline, BranchMergeBtn }: ProjectsProps) {
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovR, setHovR] = useState<number | null>(null);

  useEffect(() => {
    if (load) return;
    const ctx = gsap.context(() => {
      lineRefs.current.forEach((el, i) => {
        if (!el) return;
        // Fade + slide in; start at 95% so ALL repos including the last animate
        gsap.fromTo(el,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: .45, ease: 'power3.out', delay: i * .035,
            scrollTrigger: { trigger: el, start: 'top 95%', once: true },
          }
        );
      });
    });
    return () => ctx.revert();
  }, [load, repos]);

  return (
    <>
      {/* ════ SELECTED WORKS ════ */}
      <section id="work" data-section="work" className="border-t border-black/7 dark:border-white/10 py-24 px-8 max-w-[1200px] mx-auto relative bg-white/40 dark:bg-transparent">
        <p className="sec-h text-[10px] font-bold tracking-[.22em] uppercase text-lead/60 mb-5">{t.woLb}</p>
        <h2 className="sec-h font-black text-[clamp(2.4rem,5vw,4.8rem)] tracking-[-2.5px] leading-[.91] text-ink mb-10">{t.woH}</h2>
        {offline && !load && <OfflineBanner lang={t.menu[0] ? 'es' : 'en'} />}
        <div className="border-b border-black/7 dark:border-white/10">
          {(load || top3.length === 0)
            ? [0,1,2].map(i => <SkeletonRow key={i} idx={i} />)
            : top3.map((p, i) => <WorkRow key={p.n} proj={p} idx={i} />)}
        </div>
      </section>

      {/* ════ GITHUB ACTIVITY (AQUÍ ESTÁ EL CAMBIO) ════ */}
      <section id="github" data-section="github" className="border-t border-black/7 dark:border-white/10 py-24 px-8 max-w-[1200px] mx-auto relative">
        <div className="flex items-end justify-between pb-5 border-b border-black/7 dark:border-white/10 mb-1">
          <p className="text-[10px] font-bold tracking-[.22em] uppercase text-lead/60">{t.ghLb}</p>
          {/* Mostramos 0_repos si no ha cargado nada para evitar el salto vacío */}
          <span className="font-mono text-[10px] text-lead/40">
            {repos?.length || 0}_repos
          </span>
        </div>

        {/* Lógica de Estados (Cargando / Sin Conexión / Lista) */}
        <div className="min-h-[200px]">
          {load ? (
            <div className="py-4">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="border-b border-black/7 dark:border-white/10 py-4 flex items-center gap-5 animate-pulse" style={{ animationDelay: `${i * .07}s` }}>
                  <span className="w-5 h-3 rounded bg-black/8 dark:bg-white/8 shrink-0" />
                  <span className="h-3 flex-1 max-w-[220px] rounded bg-black/8 dark:bg-white/8" />
                  <div className="ml-auto flex gap-2">{[1,2].map(j => <span key={j} className="h-4 w-12 rounded-full bg-black/5 dark:bg-white/5" />)}</div>
                </div>
              ))}
            </div>
          ) : offline || !repos || repos.length === 0 ? (
            // 🌟 ESTADO VACÍO PREMIUM
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center mt-6 bg-black/[0.02] dark:bg-white/[0.02] rounded-[24px] border border-dashed border-black/10 dark:border-white/10">
              <div className="p-4 bg-black/5 dark:bg-white/5 rounded-full mb-4 text-lead/50 dark:text-lead/60">
                <WifiOff size={24} />
              </div>
              <h4 className="text-[15px] font-bold text-ink mb-2">
                Conexión no disponible
              </h4>
              <p className="text-[13px] text-lead max-w-[340px] leading-[1.6]">
                Parece que estás sin conexión a internet o la API de GitHub no responde. Conéctate para ver mis repositorios en vivo.
              </p>
            </div>
          ) : (
            // ✅ ESTADO CON DATOS
            <div>
              {repos.map((r, i) => (
                <RepoRow key={r.id} r={r} idx={i} hovR={hovR} setHovR={setHovR}
                  lineRef={el => { lineRefs.current[i] = el; }} />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center mt-10">
          <BranchMergeBtn label={t.moreGh} href="https://github.com/eneekoruiz" />
        </div>
      </section>
    </>
  );
}