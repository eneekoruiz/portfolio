'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, ChevronDown, Plus } from 'lucide-react';
import gsap from 'gsap';
import Link from 'next/link';
import { LANG_COLORS } from '../../lib/constants';
import type { ProjectCard } from '../../lib/types';

// ── Web Audio click sutil ───────────────────────────
function playClick() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < ch.length; i++) {
      ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / ch.length, 5) * 0.05;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
  } catch (_) {}
}

// ── 💎 RESÚMENES ACTUALIZADOS (Los 5 proyectos) ──────────────────────
const SUMMARIES: Record<string, { impact: string; challenge: string }> = {
  'ana-peluquera': {
    impact: '+30% facturación via Sandwich Algorithm — slots paralelos con sincronización atómica Google Calendar.',
    challenge: 'Consistencia bidireccional NoSQL ↔ Calendar con garantía de cero colisiones en O(n).',
  },
  'who-are-ya-backend': {
    impact: 'API REST + panel SSR en producción (Render + MongoDB Atlas) con autenticación Bcrypt completa.',
    challenge: 'Arquitectura MVC con travesía relacional NoSQL profunda via Mongoose .populate() en 3 colecciones.',
  },
  'rides24ofiziala': {
    impact: 'Sistema distribuido JAX-WS con reservas concurrentes y persistencia ObjectDB. 0 race conditions.',
    challenge: 'Reserva thread-safe de asientos en nodos distribuidos — Atomic Transactions garantizan integridad.',
  },
  'spotshare-parking': {
    impact: 'Rating "A" en SonarCloud. Arquitectura elástica en la nube para gestión de parking masivo.',
    challenge: 'Implementación de Optimistic Locking para evitar colisiones en reservas simultáneas cloud.',
  },
  'pke_web': {
    impact: '100% Lighthouse A11Y Score. Plataforma universalmente accesible bajo estándares internacionales.',
    challenge: 'Arquitectura de Focus Trapping y roles ARIA dinámicos para cumplimiento estricto WCAG 2.1 AA.',
  },
};

export function WorkRow({ proj, idx }: { proj: ProjectCard; idx: number }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const rowRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const accordRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const xTo = useRef<gsap.QuickToFunc>();
  const yTo = useRef<gsap.QuickToFunc>();
  const rotateTo = useRef<gsap.QuickToFunc>();

  const slug = proj.name.toLowerCase().replace(/[\s_]+/g, '-');
  const summary = SUMMARIES[slug] || { impact: proj.desc, challenge: proj.challenge };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!followerRef.current) return;
    xTo.current = gsap.quickTo(followerRef.current, 'x', { duration: 0.55, ease: 'power3' });
    yTo.current = gsap.quickTo(followerRef.current, 'y', { duration: 0.55, ease: 'power3' });
    rotateTo.current = gsap.quickTo(followerRef.current, 'rotate', { duration: 0.4, ease: 'power2' });
  }, [mounted]);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    setOpen(prev => {
      const next = !prev;
      if (accordRef.current && innerRef.current) {
        const h = innerRef.current.scrollHeight;
        gsap.to(accordRef.current, {
          height: next ? h : 0,
          duration: 0.7,
          ease: next ? 'expo.out' : 'expo.inOut',
        });
        if (next) {
          gsap.fromTo(`.accordion-col-${idx}`,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out', delay: 0.1 }
          );
        }
      }
      return next;
    });
  }, [idx]);

  const onMove = (e: React.MouseEvent) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    xTo.current?.(e.clientX);
    yTo.current?.(e.clientY);
    const box = e.currentTarget.getBoundingClientRect();
    rotateTo.current?.((e.clientX - box.left - box.width / 2) * 0.02);
  };

  const onEnter = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    gsap.to(followerRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: 'expo.out' });
    gsap.to(titleRef.current, { x: 16, duration: 0.4, ease: 'power2.out' });
    videoRef.current?.play().catch(() => {});
  };

  const onLeave = () => {
    gsap.to(followerRef.current, { scale: 0, opacity: 0, duration: 0.35 });
    gsap.to(titleRef.current, { x: 0, duration: 0.4, ease: 'power2.out' });
    videoRef.current?.pause();
  };

  return (
    <>
      <div
        ref={rowRef}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="group relative border-b border-black/10 dark:border-white/10 transition-colors duration-500 hover:bg-black/[0.015] dark:hover:bg-white/[0.015]"
      >
        {/* ── CLOSED ROW ── */}
        <div 
          className="flex items-center gap-8 px-6 py-12 relative z-10 cursor-pointer select-none"
          onClick={toggle}
        >
          <span className="font-mono text-[11px] text-lead/30 w-8 shrink-0">0{proj.n}</span>

          <div className="flex-1 min-w-0">
            <span
              ref={titleRef}
              className="block font-black text-[clamp(2rem,5vw,4.5rem)] tracking-tighter uppercase leading-[0.85] will-change-transform text-ink transition-colors group-hover:text-brand"
            >
              {proj.name.replace(/-/g, ' ')}
            </span>
            <div className="flex items-center gap-4 mt-4 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em]">{proj.tag}</span>
              <span className="w-1 h-1 rounded-full bg-lead/30" />
              <span className="text-[11px] font-mono tracking-tighter">{proj.year}</span>
            </div>
          </div>

          <div className={`w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center transition-all duration-500 ${open ? 'bg-ink text-page rotate-45' : 'bg-transparent text-ink group-hover:border-brand group-hover:text-brand'}`}>
            <Plus size={20} />
          </div>
        </div>

        {/* ── ACCORDION (CONTENIDO TÉCNICO) ── */}
        <div ref={accordRef} style={{ height: 0, overflow: 'hidden' }} className="will-change-[height]">
          <div ref={innerRef} className="px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start pt-6 border-t border-black/5 dark:border-white/5 mx-6">
            
            {/* Impact */}
            <div className={`accordion-col-${idx} lg:col-span-4 space-y-4`}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40">Impact & Scale</h4>
              <p className="text-[15px] font-medium leading-relaxed opacity-80 max-w-sm">
                {summary.impact}
              </p>
            </div>

            {/* Stack Visual */}
            <div className={`accordion-col-${idx} lg:col-span-4 space-y-4`}>
              <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {proj.langs.map(lang => (
                  <div key={lang} className="px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: LANG_COLORS[lang] ?? '#999' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{lang}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenge + CTA */}
            <div className={`accordion-col-${idx} lg:col-span-4 flex flex-col lg:items-end space-y-8`}>
              <div className="lg:text-right space-y-2">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40">Core Challenge</h4>
                <p className="text-sm font-semibold italic opacity-90 leading-relaxed max-w-xs">
                  {summary.challenge}
                </p>
              </div>
              
              <Link
                href={`/work/${slug}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-ink text-page dark:bg-white dark:text-black font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
              >
                Auditoría de Ingeniería <ArrowUpRight size={14} className="opacity-70" />
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── VIDEO FOLLOWER ── */}
      {mounted && createPortal(
        <div
          ref={followerRef}
          className="fixed top-0 left-0 z-[150] pointer-events-none opacity-0 scale-0 origin-center -translate-x-1/2 -translate-y-1/2 will-change-transform"
        >
          <div className="w-[420px] aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-page/50 backdrop-blur-2xl">
            <video
              ref={videoRef}
              src={proj.video || `/${slug}.mp4`}
              muted loop playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}