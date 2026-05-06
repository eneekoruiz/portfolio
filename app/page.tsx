'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ROOT PAGE — Eneko Ruiz Portfolio
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * FLUJO DE CARGA (sin parpadeos):
 *   'checking' → null   (SSR guard)
 *   'loading'  → Preloader visible, contenido invisible
 *   'splash'   → IdentitySplash visible, contenido invisible
 *   'ready'    → GSAP orquesta la entrada desde useLayoutEffect (sync)
 *
 * FLUJO DE RETORNO desde /work/[id]:
 *   handleReturn (work page) baja el telón → router.push('/') →
 *   useLayoutEffect([ready]) scrollea ANTES del primer paint →
 *   useEffect([ready]) desvanece el telón → usuario ve la sección #work
 *
 * FIX FOUC: GSAP fija estados iniciales en useLayoutEffect (síncrono
 * antes del paint), eliminando el flash de contenido sin animar.
 *
 * FIX RETORNO SIN PARPADEO:
 *   - useLayoutEffect scrollea instantáneamente ANTES del primer paint
 *   - El overlay de retorno (creado en /work y sobreviviente de la nav
 *     client-side) se desvanece con GSAP en useEffect
 *   - Nunca se crea un overlay nuevo en page.tsx; se reutiliza el existente
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Search } from 'lucide-react';
import { animateLiquidCurtainOut } from './components/ui/LiquidCurtain';

// ── Lib ────────────────────────────────────────────────────────────────────
import { TX, LANG_LABELS } from './lib/translations';
import type { Lang } from './lib/types';

// ── Hooks ──────────────────────────────────────────────────────────────────
import { usePreferredMotion } from './hooks/usePreferredMotion';
import { useGreeting } from './hooks/useGreeting';
import { useGitHub } from './hooks/useGitHub';
import { useIntro } from './components/IntroProvider';
import { useMagnetic } from './hooks/useMagnetic';

// ── UI components ──────────────────────────────────────────────────────────
import { Preloader } from './components/ui/Preloader';
import { LangDD } from './components/ui/LangDD';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { CmdModal } from './components/ui/CmdModal';
import { BranchMergeBtn } from './components/ui/Buttons';
import { IdentitySplash } from './components/ui/IdentitySplash';

// ── Section components ─────────────────────────────────────────────────────
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Philosophy } from './components/sections/Philosophy';
import { Contact } from './components/sections/Contact';
import { SiteFooter } from './components/sections/SiteFooter';
import dynamic from 'next/dynamic';

// ── DYNAMIC VISUALIZERS (Consistencia con /work/[id]) ──
const DNAHelix = dynamic<{ accent: string; secondary: string; darkMode: boolean }>(
  () => import('./work/visualizers').then(m => m.DNAHelix), { ssr: false }
);
const TerrainMesh = dynamic<{ accent: string }>(
  () => import('./work/visualizers').then(m => m.TerrainMesh), { ssr: false }
);

// Registrar plugins GSAP una sola vez en cliente
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// ── Constantes ─────────────────────────────────────────────────────────────
/** sessionStorage key compartida con Projects.tsx para restaurar scroll/acordeón */
const PROJECTS_NAV_KEY = 'projects_nav_state';
/** id del overlay DOM creado por /work/[id] que sobrevive la navegación client-side */
const RETURN_OVERLAY_ID = 'return-overlay';

type Phase = 'checking' | 'loading' | 'splash' | 'ready';


export default function Home() {
  // ── Refs ────────────────────────────────────────────────────────────────
  const main = useRef<HTMLDivElement>(null);
  const navInner = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLDivElement>(null);
  const menuRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

  // ── Estado ──────────────────────────────────────────────────────────────
  const { phase, setPhase, markSeen } = useIntro();
  const [lang, setLang] = useState<Lang>('es');
  const [menu, setMenu] = useState(false);
  const [cmd, setCmd] = useState(false);

  const ready = phase === 'ready';
  const t = TX[lang];
  const reduced = usePreferredMotion();
  const greeting = useGreeting(t.times, t.greetingFn);
  const { repos, top3, load, offline, errorMsg } = useGitHub(t);

  // ── Tab title dinámico ────────────────────────────────────────────────
  useEffect(() => {
    const orig = document.title;
    const h = () => {
      document.title = document.hidden ? t.tabAway : t.tabBack;
    };
    document.addEventListener('visibilitychange', h);
    return () => {
      document.removeEventListener('visibilitychange', h);
      document.title = orig;
    };
  }, [t]);

  // ── Global Transition Cleanup (Safety for return from project) ────────
  useEffect(() => {
    const cleanup = () => {
      document.querySelectorAll('[id^="return-overlay"]').forEach(el => {
        gsap.to(el, { opacity: 0, duration: 0.3, onComplete: () => el.remove() });
      });
      window.__lenis?.start?.();
    };
    cleanup();
    // Safety delay for slow navigations
    const timer = setTimeout(cleanup, 500);
    return () => clearTimeout(timer);
  }, []);

  // ── Bloquear scroll con modal/menú ───────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = cmd || menu ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cmd, menu]);

  // ── CMD+F → modal de búsqueda ─────────────────────────────────────────
  useEffect(() => {
    const h = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault(); e.stopPropagation();
        setCmd(c => !c);
        return;
      }
      if (e.key === 'Escape') { setCmd(false); setMenu(false); }
    };
    window.addEventListener('keydown', h, { capture: true });
    return () => window.removeEventListener('keydown', h, { capture: true });
  }, []);

  // ── Theme-color del navegador por sección ────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) return;
    const map = [
      { id: 'hero', c: '#f5f5f7' },
      { id: 'skills', c: '#ffffff' },
      { id: 'work', c: '#f5f5f7' },
      { id: 'github', c: '#ffffff' },
      { id: 'about', c: '#f5f5f7' },
      { id: 'values', c: '#ffffff' },
      { id: 'contact', c: '#f5f5f7' },
    ];
    const observers = map.map(({ id, c }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) meta.content = c; },
        { threshold: 0.4 }
      );
      io.observe(el);
      return io;
    });
    return () => observers.forEach(io => io?.disconnect());
  }, [ready]);

  // ── Scroll reveal genérico ────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const io = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.sr').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [ready, t]);

  // ── Fix #2: Nav active section indicator on scroll ──────────────────
  useEffect(() => {
    if (!ready) return;
    const sections = t.hrefs.map((h: string) => document.querySelector(h)).filter(Boolean) as HTMLElement[];
    const navLinks = navInner.current?.querySelectorAll<HTMLAnchorElement>('a');
    if (!sections.length || !navLinks?.length) return;

    const ctx = gsap.context(() => {
      function setActive(idx: number) {
        const link = navLinks![idx];
        if (!link || !indRef.current || !navInner.current) return;

        activeLinkRef.current = link;
        const r = link.getBoundingClientRect();
        const nr = navInner.current.getBoundingClientRect();
        gsap.to(indRef.current, {
          x: r.left - nr.left,
          width: r.width,
          height: r.height,
          opacity: 0.65,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }

      sections.forEach((sec, idx) => {
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActive(idx),
          onEnterBack: () => setActive(idx),
        });
      });

      // Initialize with the first section if we are at the top
      if (window.scrollY < 100) setActive(0);
    });

    return () => ctx.revert();
  }, [ready, t]);

  // ── Animación menú overlay móvil ──────────────────────────────────────
  useEffect(() => {
    menuRefs.current.forEach((el, i) => {
      if (!el || reduced) return;
      gsap.to(el, {
        y: menu ? 0 : '112%',
        duration: 0.34,
        delay: menu ? i * 0.04 : 0,
        ease: 'power4.out',
      });
    });
  }, [menu, reduced]);

  useLayoutEffect(() => {
    if (!ready) return;

    try {
      const raw = sessionStorage.getItem(PROJECTS_NAV_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      if (saved?.scrollY != null) {
        const lenis = (window as any).__lenis;
        // Freeze Lenis so it doesn't interfere with the programmatic scroll
        lenis?.stop?.();

        // Immediate scroll — runs before first paint (useLayoutEffect)
        window.scrollTo({ top: saved.scrollY, behavior: 'instant' as ScrollBehavior });
      }
    } catch (_) {
      // Ignore sessionStorage errors and continue with normal render.
    }
  }, [ready]);

  useEffect(() => {
    if (!ready) return;

    // FIX Punto 5: After Projects has opened the accordion in useLayoutEffect,
    // we now re-sync Lenis and refresh ScrollTrigger to match the new DOM height.
    const lenis = (window as any).__lenis;
    try {
      const raw = sessionStorage.getItem(PROJECTS_NAV_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      if (saved?.scrollY != null) {
        // Tell Lenis about the scroll position and restart it
        lenis?.scrollTo?.(saved.scrollY, { immediate: true, force: true });
        lenis?.start?.();
      }
    } catch (_) {
      // Ignore sessionStorage errors
    }
    ScrollTrigger.refresh();
  }, [ready]);

  useEffect(() => {
    if (!ready) return;

    if (window.location.hash) {
      // Navegación directa por URL con hash (sin retorno)
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    // Refrescar ScrollTrigger después de que el contenido sea visible
    const id = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(id);
  }, [ready]);

  /**
   * RETURN CURTAIN — sincronizado con scroll restaurado (Fase 1, Punto 1)
   * ──────────────────────────────────────────────────────────────────────
   * La cortina se desvanece DESPUÉS de que el DOM haya pintado
   * con el scroll ya restaurado y el acordeón abierto.
   * Al completarse, rearranca Lenis, limpia navState y refresca ST.
   */
  useEffect(() => {
    if (!ready) return;

    const overlay = document.getElementById(RETURN_OVERLAY_ID);
    if (!overlay) {
      // FIX CRÍTICO: Si no hay overlay (ej: navegación atrás del navegador directa),
      // asegurarnos de reiniciar Lenis de todas formas y limpiar el state.
      (window as any).__lenis?.start?.();
      try { sessionStorage.removeItem(PROJECTS_NAV_KEY); } catch (_) { }
      return;
    }

    let cancelled = false;

    const reveal = () => {
      if (cancelled) return;

      // Detect if the overlay is an SVG (liquid curtain) or a plain div (legacy)
      const isSVG = overlay.tagName.toLowerCase() === 'svg';

      if (isSVG) {
        // 🌊 Punto 8 — Liquid curtain reveal (SVG path morphing)
        animateLiquidCurtainOut(overlay as unknown as SVGSVGElement, {
          duration: 0.45,
          onComplete: () => {
            try { sessionStorage.removeItem(PROJECTS_NAV_KEY); } catch (_) { }
            (window as any).__lenis?.start?.();
            ScrollTrigger.refresh();
          },
        });
      } else {
        // Legacy div overlay — simple opacity fade
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.34,
          ease: 'power3.out',
          onComplete: () => {
            overlay.remove();
            try { sessionStorage.removeItem(PROJECTS_NAV_KEY); } catch (_) { }
            (window as any).__lenis?.start?.();
            ScrollTrigger.refresh();
          },
        });
      }
    };

    // Wait 3 rAFs so the accordion body has fully painted at the correct height
    // before the curtain starts fading out. This prevents any visible layout shift.
    const raf1 = requestAnimationFrame(() => {
      if (cancelled) return;
      const raf2 = requestAnimationFrame(() => {
        if (cancelled) return;
        const raf3 = requestAnimationFrame(reveal);
        overlay.setAttribute('data-raf3', String(raf3));
      });
      overlay.setAttribute('data-raf2', String(raf2));
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      const raf2 = Number(overlay.getAttribute('data-raf2'));
      if (raf2) cancelAnimationFrame(raf2);
      const raf3 = Number(overlay.getAttribute('data-raf3'));
      if (raf3) cancelAnimationFrame(raf3);
    };
  }, [ready]);

  // ────────────────────────────────────────────────────────────────────────
  // FIX FOUC — useLayoutEffect: fija estados iniciales antes del primer paint
  // ────────────────────────────────────────────────────────────────────────
  /**
   * Síncrono, corre antes del paint.
   * GSAP fija opacity:0, yPercent:115, etc. en los elementos animados
   * ANTES de que el navegador pinte, eliminando el flash de contenido sin animar.
   *
   * Si es un retorno desde /work, saltamos este fix porque el overlay
   * cubre todo y el hero nunca se ve.
   */
  useLayoutEffect(() => {
    if (!ready || reduced) return;

    gsap.set('.n-el', { opacity: 0, y: -14 });
    gsap.set('.h-ln', { yPercent: 115 });
    gsap.set('.h-fd', { opacity: 0, y: 16 });
    gsap.set('.memoji', { opacity: 0, x: 60 });
  }, [ready, reduced]);

  // ── Animaciones GSAP principales ──────────────────────────────────────
  useGSAP(() => {
    if (reduced) return;

    // Parallax del hero (siempre activo)
    gsap.to('.h-txt', {
      yPercent: -6, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.45 },
    });
    gsap.to('.memoji', {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.45 },
    });

    // Reveal de títulos de sección — DURACIÓN REDUCIDA (0.75→0.5)
    document.querySelectorAll<HTMLElement>('.sec-h').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },   // ← era y: 30
        {
          opacity: 1, y: 0, duration: 0.24, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 83%', once: true }
        }
      );
    });

    // Entrada orquestada del Hero — sólo en primera carga (sin retorno)
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl
      // Nav items — DURACIÓN REDUCIDA (0.45→0.3)
      .to('.n-el', { opacity: 1, y: 0, duration: 0.16, stagger: 0.02 })
      // Líneas de texto del hero — DURACIÓN REDUCIDA (1.2→0.8)
      .to('.h-ln', { yPercent: 0, duration: 0.38, stagger: 0.03 }, '-=0.12')
      // Subtítulo — DURACIÓN REDUCIDA (0.85→0.55)
      .to('.h-fd', { opacity: 1, y: 0, duration: 0.24, stagger: 0.025 }, '-=0.18')
      // Memoji — DURACIÓN REDUCIDA (1.4→0.9)
      .to('.memoji', { opacity: 1, x: 0, duration: 0.42, ease: 'power3.out' }, '-=0.3');
      // Helix rotation (home specific)
      gsap.to('.helix-group', {
        rotateY: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: main.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        }
      });
  }, { scope: main, dependencies: [ready, reduced] });

  // ── Liquid Nav Indicator ─────────────────────────────────────
  const onNavEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    if (!indRef.current || !navInner.current) return;
    const r = el.getBoundingClientRect();
    const nr = navInner.current.getBoundingClientRect();
    
    const targetX = r.left - nr.left;
    const currentX = gsap.getProperty(indRef.current, 'x') as number;
    const distance = Math.abs(targetX - currentX);
    const stretch = Math.min(1.4, 1 + distance / 200);

    const tl = gsap.timeline();
    tl.to(indRef.current, {
      x: targetX,
      width: r.width,
      scaleX: stretch,
      height: r.height,
      opacity: 1,
      duration: 0.35,
      ease: 'power3.out',
    }).to(indRef.current, {
      scaleX: 1,
      duration: 0.45,
      ease: 'elastic.out(1, 0.5)',
    }, '-=0.15');
  }, []);

  const onNavLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
  }, []);

  const onNavContainerLeave = useCallback(() => {
    const active = activeLinkRef.current;
    const nr = navInner.current?.getBoundingClientRect();
    if (active && nr && indRef.current) {
      const r = active.getBoundingClientRect();
      gsap.to(indRef.current, {
        x: r.left - nr.left, width: r.width, height: r.height,
        opacity: 0.65, duration: 0.24, ease: 'power3.out',
      });
    } else {
      gsap.to(indRef.current, { opacity: 0, duration: 0.12 });
    }
  }, []);

  // ── Callbacks de Intro ────────────────────────────────────────────────
  const onPreloaderDone = useCallback(() => setPhase('splash'), [setPhase]);
  const onSplashReveal = useCallback(() => {
    // onReveal es llamado mientras el IdentitySplash está saliendo.
    // Podría usarse para pre-cargar animaciones aquí si es necesario.
  }, []);
  const onSplashComplete = useCallback(() => {
    setPhase('ready');
    markSeen();
  }, [setPhase, markSeen]);

  function NavItem({ link, href, onEnter, onLeave }: {
    link: string; href: string; onEnter: (e: React.MouseEvent<HTMLAnchorElement>) => void; onLeave: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  }) {
    const ref = useMagnetic<HTMLAnchorElement>({ strength: 0.2 });

    return (
      <a
        ref={ref}
        href={href}
        className="n-el relative z-[1] text-[13px] font-semibold text-lead no-underline px-[14px] py-[7px] group transition-transform duration-200"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        aria-current={activeLinkRef.current === ref.current ? 'page' : undefined}
      >
        <span className="relative overflow-hidden block">
          <span className="block transition-transform duration-400 ease-expo group-hover:-translate-y-full">
            {link}
          </span>
          <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-400 ease-expo group-hover:translate-y-0 text-ink">
            {link}
          </span>
        </span>
      </a>
    );
  }

  // Guard SSR
  if (phase === 'checking') return null;

  return (
    <>
      {/* ── SPLASH SCREEN / LOADING (Sincronizados para fluidez) ── */}
      {(phase === 'loading' || phase === 'splash') && (
        <>
          <IdentitySplash
            lang={lang}
            onReveal={onSplashReveal}
            onComplete={onSplashComplete}
            active={phase === 'splash'}
          />
          {phase === 'loading' && <Preloader onDone={onPreloaderDone} />}
        </>
      )}



      {/* ── 3D BACKGROUND (DEFERRED) ── */}
      {ready && (
        <>
          <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden" style={{ perspective: '1200px' }}>
            <div
              className="helix-group will-change-transform"
              style={{
                width: 'clamp(200px, 40vw, 500px)', height: '240vh',
                opacity: 0.05,
                filter: 'blur(12px)',
                transformStyle: 'preserve-3d',
              }}
            >
              <DNAHelix accent="#000" secondary="#555" darkMode={false} />
            </div>
          </div>
          <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]">
            <TerrainMesh accent="currentColor" />
          </div>
        </>
      )}

      {cmd && (
        <CmdModal lang={lang} setLang={setLang} onClose={() => setCmd(false)} t={t} />
      )}

      {/* ── MENÚ OVERLAY MÓVIL ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        aria-hidden={!menu}
        data-lenis-prevent="true"
        className="fixed inset-0 z-[80] bg-white/97 dark:bg-[#0a0a0a]/97 backdrop-blur-[40px] transition-[clip-path] duration-[600ms] [transition-timing-function:cubic-bezier(.76,0,.24,1)]"
        style={{ clipPath: menu ? 'inset(0)' : 'inset(100% 0 0 0)', pointerEvents: menu ? 'all' : 'none' }}
        data-noprint
      >
        <h2 id="mobile-menu-title" className="sr-only">Menú de Navegación</h2>
        <button
          onClick={() => setMenu(false)}
          className="absolute top-5 right-8 p-2 text-lead hover:text-ink transition-colors"
          aria-label="Cerrar menú"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="h-full flex flex-col justify-center px-14">
          {t.menu.map((link, i) => (
            <div key={link} className="overflow-hidden leading-[1.05]">
              <a
                ref={el => { menuRefs.current[i] = el; }}
                href={t.hrefs[i]}
                className="font-black text-[clamp(2.5rem,8vw,6.5rem)] tracking-[-3px] text-ink no-underline block transition-colors duration-200 hover:text-brand"
                style={{ transform: 'translateY(112%)' }}
                onClick={() => setMenu(false)}
                aria-label={link}
              >
                {link}
              </a>
            </div>
          ))}
          <div className="flex gap-2 flex-wrap mt-10">
            {(Object.keys(LANG_LABELS) as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                data-h
                aria-label={`Idioma ${l}`}
                className={`font-mono text-[11px] tracking-[.15em] border-none rounded-[7px] px-2.5 py-1 transition-all duration-200 ${lang === l
                    ? 'bg-ink text-page'
                    : 'bg-black/6 dark:bg-white/[0.06] text-lead hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-14 right-14 flex justify-between">
          <span className="text-[10px] font-bold tracking-[.22em] uppercase text-lead/30">ENEKO RUIZ · {new Date().getFullYear()}</span>
          <span className="text-[10px] font-bold tracking-[.22em] uppercase text-lead/20">DONOSTIA</span>
        </div>
      </div>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div
        ref={main}
        style={{
          // FIX Punto 3: Ocultar ESTRICTAMENTE el contenido durante TODAS las fases pre-ready
          // (loading + splash) para evitar el parpadeo / bleed-through visual
          visibility: ready ? 'visible' : 'hidden',
          opacity:    ready ? 1 : 0,
          height:     ready ? 'auto' : 0,
          overflow:   ready ? 'visible' : 'hidden',
          // Evitar interacciones hasta que termine el splash
          pointerEvents: ready ? 'auto' : 'none',
        }}
      >
        {/* ── HEADER FLOTANTE ── */}
        <header
          className="fixed top-3 left-1/2 -translate-x-1/2 z-[50] w-[calc(100%-2rem)] max-w-[940px]"
          data-noprint
        >
          <div className="flex items-center justify-between gap-4 px-5 py-[.62rem] rounded-full bg-white/82 dark:bg-[#0a0a0a]/82 backdrop-blur-3xl border border-white/80 dark:border-white/10 shadow-glass">
            <a href="#hero" className="n-el font-black text-[1rem] tracking-[-0.8px] text-ink no-underline shrink-0">
              Eneko.
            </a>

            <nav
              ref={navInner}
              className="hidden md:flex items-center relative gap-1"
              onMouseLeave={onNavContainerLeave}
            >
              <div
                ref={indRef}
                className="nav-ind absolute top-0 left-0 h-9 bg-black/5 dark:bg-white/10 rounded-xl opacity-0"
              />
              {t.menu.map((link: string, i: number) => (
                <NavItem 
                  key={link} 
                  link={link} 
                  href={t.hrefs[i]} 
                  onEnter={onNavEnter} 
                  onLeave={onNavLeave} 
                />
              ))}
            </nav>

            <div className="n-el flex items-center gap-2 shrink-0">
              <LangDD lang={lang} setLang={setLang} />
              <ThemeToggle />
              <button
                onClick={() => setCmd(true)}
                aria-label="Abrir búsqueda"
                className="p-2 border border-black/10 dark:border-white/10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <Search size={14} />
              </button>
              <button
                onClick={() => setMenu(true)}
                aria-label="Abrir menú"
                data-h
                className="md:hidden font-bold text-[12px] text-lead tracking-[.1em] bg-none border-none p-2"
              >
                MENU
              </button>
            </div>
          </div>
        </header>

        {/* ════ SECCIONES ════ */}
        <Hero
          t={t}
          greeting={greeting}
          reduced={reduced}
          setMag={() => { }}
          phase={phase}
        />
        <Skills t={t} />
        <Projects t={t} top3={top3} repos={repos} load={load} offline={offline} errorMsg={errorMsg} BranchMergeBtn={BranchMergeBtn} />
        <About t={t} />
        <Philosophy t={t} />
        <Contact t={t} />
        <SiteFooter t={t} />
      </div>
    </>
  );
}
