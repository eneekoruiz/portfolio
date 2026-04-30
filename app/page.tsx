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

// ── Lib ────────────────────────────────────────────────────────────────────
import { TX, LANG_LABELS } from './lib/translations';
import type { Lang } from './lib/types';

// ── Hooks ──────────────────────────────────────────────────────────────────
import { usePreferredMotion } from './hooks/usePreferredMotion';
import { useGreeting }        from './hooks/useGreeting';
import { useLenis }           from './hooks/useLenis';
import { useGitHub }          from './hooks/useGitHub';

// ── UI components ──────────────────────────────────────────────────────────
import { InfallibleCursor } from './components/ui/InfallibleCursor';
import { Preloader }        from './components/ui/Preloader';
import { LangDD }           from './components/ui/LangDD';
import { ThemeToggle }      from './components/ui/ThemeToggle';
import { CmdModal }         from './components/ui/CmdModal';
import { BranchMergeBtn }   from './components/ui/Buttons';
import { IdentitySplash }   from './components/ui/IdentitySplash';

// ── Section components ─────────────────────────────────────────────────────
import { Hero }       from './components/sections/Hero';
import { About }      from './components/sections/About';
import { Skills }     from './components/sections/Skills';
import { Projects }   from './components/sections/Projects';
import { Philosophy } from './components/sections/Philosophy';
import { Contact }    from './components/sections/Contact';
import { SiteFooter } from './components/sections/SiteFooter';

// Registrar plugins GSAP una sola vez en cliente
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// ── Constantes ─────────────────────────────────────────────────────────────
/** sessionStorage key compartida con Projects.tsx para restaurar scroll/acordeón */
const PROJECTS_NAV_KEY = 'projects_nav_state';
/** sessionStorage key que /work/[id] escribe para señalar retorno */
const RETURN_COLOR_KEY = 'returnColor';
/** id del overlay DOM creado por /work/[id] que sobrevive la navegación client-side */
const RETURN_OVERLAY_ID = 'return-overlay';

type Phase = 'checking' | 'loading' | 'splash' | 'ready';

export default function Home() {
  // ── Refs ────────────────────────────────────────────────────────────────
  const main          = useRef<HTMLDivElement>(null);
  const navInner      = useRef<HTMLDivElement>(null);
  const indRef        = useRef<HTMLDivElement>(null);
  const menuRefs      = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

  // ── Estado ──────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('checking');
  const [lang,  setLang]  = useState<Lang>('es');
  const [menu,  setMenu]  = useState(false);
  const [cmd,   setCmd]   = useState(false);

  const ready   = phase === 'ready';
  const t       = TX[lang];
  const reduced = usePreferredMotion();
  const greeting = useGreeting(t.times, t.greetingFn);
  const { repos, top3, load, offline } = useGitHub(t);

  useLenis(ready, reduced);

  // ── INICIO DEL FLUJO ──────────────────────────────────────────────────
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    // Si ya vio la intro (incluyendo retorno desde /work), salta directo
    setPhase(hasSeenIntro ? 'ready' : 'loading');
  }, []);

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
      { id: 'hero',    c: '#f5f5f7' },
      { id: 'skills',  c: '#ffffff' },
      { id: 'work',    c: '#f5f5f7' },
      { id: 'github',  c: '#ffffff' },
      { id: 'about',   c: '#f5f5f7' },
      { id: 'values',  c: '#ffffff' },
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

  // ── Animación menú overlay móvil ──────────────────────────────────────
  useEffect(() => {
    menuRefs.current.forEach((el, i) => {
      if (!el || reduced) return;
      gsap.to(el, {
        y: menu ? 0 : '112%',
        duration: 0.5,            // ← era 0.6, más snappy
        delay: menu ? i * 0.06 : 0, // ← era 0.07
        ease: 'power4.out',
      });
    });
  }, [menu, reduced]);

  // ────────────────────────────────────────────────────────────────────────
  // FIX RETORNO SIN PARPADEO — useLayoutEffect (SÍNCRONO antes del paint)
  // ────────────────────────────────────────────────────────────────────────
  /**
   * Este hook corre ANTES de que el navegador pinte el nuevo frame.
   * Si venimos de /work/[id]:
   *   1. El overlay (id='return-overlay') ya está en el DOM, creado por
   *      handleReturn antes de router.push('/') y sobreviviente de la
   *      navegación client-side (vive en document.body, fuera del root React).
   *   2. Leemos la posición guardada en sessionStorage y scrolleamos
   *      INSTANTÁNEAMENTE, mientras el overlay cubre todo.
   *   3. El resultado: el usuario nunca ve el Hero. El overlay cubre el scroll.
   *
   * Si NO venimos de retorno, this is a no-op.
   */
  useLayoutEffect(() => {
    if (!ready) return;

    const returnColor = sessionStorage.getItem(RETURN_COLOR_KEY);
    if (!returnColor) return;

    // Leer posición de scroll guardada por Projects.tsx al navegar a /work
    try {
      const raw = sessionStorage.getItem(PROJECTS_NAV_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      const targetY = saved?.scrollY ?? 0;

      // scrollTo con behavior:'instant' es síncrono → ocurre antes del paint
      window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
    } catch (_) {
      // Fallback: ir al top de #work
      document.getElementById('work')?.scrollIntoView();
    }
  }, [ready]);

  // ────────────────────────────────────────────────────────────────────────
  // FIX RETORNO — useEffect (async): desvanece el overlay de retorno
  // ────────────────────────────────────────────────────────────────────────
  /**
   * Corre DESPUÉS del paint. El scroll ya ocurrió (useLayoutEffect).
   * Ahora solo necesitamos desvanecer el overlay para revelar #work.
   *
   * Si el overlay no existe (ej. usuario navegó directamente por URL),
   * limpiamos sessionStorage sin hacer nada más.
   */
  useEffect(() => {
    if (!ready) return;

    const returnColor = sessionStorage.getItem(RETURN_COLOR_KEY);

    if (returnColor) {
      const overlay = document.getElementById(RETURN_OVERLAY_ID);

      if (overlay) {
        // El overlay está listo. Lo desvancemos con animación de persiana.
        gsap.to(overlay, {
          scaleY: 0,
          transformOrigin: 'bottom',
          duration: 0.6,
          ease: 'expo.inOut',
          onComplete: () => {
            overlay.remove();
            sessionStorage.removeItem(RETURN_COLOR_KEY);
          },
        });
      } else {
        // Overlay no encontrado (caso edge: full-reload manual).
        // Fallback: creamos uno opaco para cubrir el flash y lo quitamos rápido.
        const fallback = document.createElement('div');
        Object.assign(fallback.style, {
          position: 'fixed', inset: '0',
          backgroundColor: returnColor,
          zIndex: '99999',
          pointerEvents: 'none',
        });
        document.body.appendChild(fallback);

        gsap.to(fallback, {
          scaleY: 0,
          transformOrigin: 'bottom',
          duration: 0.5,
          ease: 'expo.inOut',
          delay: 0.05,
          onComplete: () => {
            fallback.remove();
            sessionStorage.removeItem(RETURN_COLOR_KEY);
          },
        });
      }
    } else if (window.location.hash) {
      // Navegación directa por URL con hash (sin retorno)
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    // Refrescar ScrollTrigger después de que el contenido sea visible
    const id = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(id);
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
    // Si hay overlay de retorno, no hace falta ocultar el hero
    if (sessionStorage.getItem(RETURN_COLOR_KEY)) return;

    gsap.set('.n-el',   { opacity: 0, y: -14 });
    gsap.set('.h-ln',   { yPercent: 115 });
    gsap.set('.h-fd',   { opacity: 0, y: 16 });
    gsap.set('.memoji', { opacity: 0, x: 60 });
  }, [ready, reduced]);

  // ── Animaciones GSAP principales ──────────────────────────────────────
  useGSAP(() => {
    if (reduced) return;

    // Parallax del hero (siempre activo)
    gsap.to('.h-txt', {
      yPercent: -6, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.memoji', {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    // Reveal de títulos de sección — DURACIÓN REDUCIDA (0.75→0.5)
    document.querySelectorAll<HTMLElement>('.sec-h').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },   // ← era y: 30
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',  // ← era 0.75
          scrollTrigger: { trigger: el, start: 'top 83%', once: true } }
      );
    });

    // Entrada orquestada del Hero — sólo en primera carga (sin retorno)
    if (ready && !sessionStorage.getItem(RETURN_COLOR_KEY)) {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl
        // Nav items — DURACIÓN REDUCIDA (0.45→0.3)
        .to('.n-el', { opacity: 1, y: 0, duration: 0.3, stagger: 0.04 })
        // Líneas de texto del hero — DURACIÓN REDUCIDA (1.2→0.8)
        .to('.h-ln', { yPercent: 0, duration: 0.8, stagger: 0.07 }, '-=0.25')
        // Subtítulo — DURACIÓN REDUCIDA (0.85→0.55)
        .to('.h-fd', { opacity: 1, y: 0, duration: 0.55, stagger: 0.05 }, '-=0.5')
        // Memoji — DURACIÓN REDUCIDA (1.4→0.9)
        .to('.memoji', { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }, '-=0.75');
    } else if (ready) {
      // En retorno: revelar nav sin animación (el usuario ya está en #work)
      gsap.set('.n-el', { opacity: 1, y: 0 });
    }
  }, { scope: main, dependencies: [ready, reduced] });

  // ── Indicador deslizante de la nav ─────────────────────────────────────
  const onNavEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    if (!indRef.current || !navInner.current) return;
    const r  = el.getBoundingClientRect();
    const nr = navInner.current.getBoundingClientRect();
    gsap.to(indRef.current, {
      x: r.left - nr.left, width: r.width, height: r.height,
      duration: 0.32, ease: 'power3.out', opacity: 1, // ← era 0.38
    });
    el.style.color = 'var(--ink)';
  }, []);

  const onNavLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = '';
  }, []);

  const onNavContainerLeave = useCallback(() => {
    const active = activeLinkRef.current;
    const nr = navInner.current?.getBoundingClientRect();
    if (active && nr && indRef.current) {
      const r = active.getBoundingClientRect();
      gsap.to(indRef.current, {
        x: r.left - nr.left, width: r.width, height: r.height,
        opacity: 0.65, duration: 0.38, ease: 'power3.out', // ← era 0.45
      });
    } else {
      gsap.to(indRef.current, { opacity: 0, duration: 0.2 }); // ← era 0.25
    }
  }, []);

  // Guard SSR
  if (phase === 'checking') return null;

  return (
    <>
      {/* ── PRELOADER ── */}
      {phase === 'loading' && (
        <Preloader onDone={() => setPhase('splash')} />
      )}

      {/* ── IDENTITY SPLASH ── */}
      {phase === 'splash' && (
        <IdentitySplash
          lang={lang}
          onComplete={() => {
            sessionStorage.setItem('hasSeenIntro', 'true');
            setPhase('ready');
          }}
        />
      )}

      <InfallibleCursor />

      {cmd && (
        <CmdModal lang={lang} setLang={setLang} onClose={() => setCmd(false)} t={t} />
      )}

      {/* ── MENÚ OVERLAY MÓVIL ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!menu}
        data-lenis-prevent="true"
        className="fixed inset-0 z-[80] bg-white/97 dark:bg-[#0a0a0a]/97 backdrop-blur-[40px] transition-[clip-path] duration-[600ms] [transition-timing-function:cubic-bezier(.76,0,.24,1)]"
        style={{ clipPath: menu ? 'inset(0)' : 'inset(100% 0 0 0)', pointerEvents: menu ? 'all' : 'none' }}
        data-noprint
      >
        <button
          onClick={() => setMenu(false)}
          className="absolute top-5 right-8 p-2 text-lead hover:text-ink transition-colors"
          aria-label="Cerrar menú"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
                className={`font-mono text-[11px] tracking-[.15em] border-none rounded-[7px] px-2.5 py-1 transition-all duration-200 ${
                  lang === l
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
          <span className="text-[10px] font-bold tracking-[.22em] uppercase text-lead/30">ENEKO RUIZ · 2026</span>
          <span className="text-[10px] font-bold tracking-[.22em] uppercase text-lead/20">DONOSTIA</span>
        </div>
      </div>

      {/* ── CONTENIDO PRINCIPAL ── */}
     <div
        ref={main}
        style={{
          // Durante loading: contraemos la altura para no afectar el layout
          height: phase === 'loading' ? 0 : undefined,
          overflow: phase === 'loading' ? 'hidden' : undefined,
          // Durante splash: invisible pero con layout correcto (GSAP puede medir)
          visibility: ready ? 'visible' : 'hidden',
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
              {t.menu.map((link, i) => (
                <a
                  key={link}
                  href={t.hrefs[i]}
                  className="n-el relative z-[1] text-[13px] font-semibold text-lead no-underline px-[14px] py-[7px]"
                  onMouseEnter={onNavEnter}
                  onMouseLeave={onNavLeave}
                >
                  {link}
                </a>
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
        <Hero       t={t} greeting={greeting} reduced={reduced} setMag={() => {}} />
        <Skills     t={t} />
        <Projects   t={t} top3={top3} repos={repos} load={load} offline={offline} BranchMergeBtn={BranchMergeBtn} />
        <About      t={t} />
        <Philosophy t={t} />
        <Contact    t={t} />
        <SiteFooter t={t} />
      </div>
    </>
  );
}
