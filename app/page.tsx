'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Search } from 'lucide-react';

// ── Lib ────────────────────────────────────────────────────────
import { TX, LANG_LABELS } from './lib/translations';
import type { Lang } from './lib/types';

// ── Hooks ──────────────────────────────────────────────────────
import { usePreferredMotion } from './hooks/usePreferredMotion';
import { useGreeting }        from './hooks/useGreeting';
import { useLenis }           from './hooks/useLenis';
import { useGitHub }          from './hooks/useGitHub';

// ── UI components ──────────────────────────────────────────────
import { InfallibleCursor } from './components/ui/InfallibleCursor';
import { Preloader }    from './components/ui/Preloader';
import { LangDD }       from './components/ui/LangDD';
import { ThemeToggle }  from './components/ui/ThemeToggle';
import { CmdModal }     from './components/ui/CmdModal';
import { BranchMergeBtn } from './components/ui/Buttons';

// ── Section components ─────────────────────────────────────────
import { Hero }        from './components/sections/Hero';
import { About }       from './components/sections/About';
import { Skills }      from './components/sections/Skills';
import { Projects }    from './components/sections/Projects';
import { Philosophy }  from './components/sections/Philosophy';
import { Contact }     from './components/sections/Contact';
import { SiteFooter }  from './components/sections/SiteFooter';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Home() {
  // ── Refs ────────────────────────────────────────────────────
  const main     = useRef<HTMLDivElement>(null);
  const navInner = useRef<HTMLDivElement>(null);
  const indRef   = useRef<HTMLDivElement>(null);
  const menuRefs    = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

  // ── State ───────────────────────────────────────────────────
  const [ready, setReady] = useState(false);
  const [lang,  setLang]  = useState<Lang>('es');
  const [menu,  setMenu]  = useState(false);
  const [cmd,   setCmd]   = useState(false);

  const t        = TX[lang];
  const reduced  = usePreferredMotion();
  const greeting = useGreeting(t.times, t.greetingFn);
  const { repos, top3, load, offline } = useGitHub();

  useLenis(ready, reduced);

  // ── Tab visibility ──────────────────────────────────────────
  useEffect(() => {
    const orig = document.title;
    const h = () => { document.title = document.hidden ? t.tabAway : t.tabBack; };
    document.addEventListener('visibilitychange', h);
    return () => { document.removeEventListener('visibilitychange', h); document.title = orig; };
  }, [t]);

  // ── CMD+F shortcut ──────────────────────────────────────────
  useEffect(() => {
    if (cmd) { document.body.style.overflow = 'hidden'; }
    else      { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [cmd]);

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

  // ── Theme-color per section (Ajustado al nuevo orden) ────────
  useEffect(() => {
    if (!ready) return;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) return;
    
    // Alternamos colores basados en el nuevo orden para que el notch/barra cambie suavemente
    const map = [
      { id:'hero',   c:'#f5f5f7' }, 
      { id:'skills', c:'#ffffff' }, 
      { id:'work',   c:'#f5f5f7' }, // Asumiendo que Projects usa el ID 'work'
      { id:'github', c:'#ffffff' }, // Si Github tiene su propio ID dentro de Projects
      { id:'about',  c:'#f5f5f7' }, 
      { id:'values', c:'#ffffff' }, // Philosophy usa id="values"
      { id:'contact',c:'#f5f5f7' },
    ];
    
    const ios = map.map(({ id, c }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) meta.content = c; }, { threshold: .4 });
      io.observe(el);
      return io;
    });
    return () => ios.forEach(io => io?.disconnect());
  }, [ready]);


  // ── Scroll reveal ───────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: .1 }
    );
    document.querySelectorAll('.sr').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [ready, t]);

  // ── Menu overlay GSAP animation ─────────────────────────────
  useEffect(() => {
    menuRefs.current.forEach((el, i) => {
      if (!el || reduced) return;
      gsap.to(el, { y: menu ? 0 : '112%', duration: .6, delay: menu ? i * .07 : 0, ease: 'power4.out' });
    });
  }, [menu, reduced]);

  // ── GSAP global animations ──────────────────────────────────
  useGSAP(() => {
    if (!ready || reduced) return;

    // Hero staggered text reveal
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.from('.n-el',   { opacity: 0, y: -14, duration: .45, stagger: .05 })
      .from('.h-ln',   { yPercent: 115, duration: 1.2, stagger: .08 }, '-=.35')
      .from('.h-fd',   { opacity: 0, y: 16, duration: .85, stagger: .06 }, '-=.65')
      .from('.memoji', { opacity: 0, x: 60, duration: 1.4, ease: 'power3.out' }, '-=1.2');

    // Hero parallax
    gsap.to('.h-txt',  { yPercent: -6,  ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.memoji', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });

    // Section headings entrance
    document.querySelectorAll<HTMLElement>('.sec-h').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: .75, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 83%', once: true },
      });
    });
  }, { scope: main, dependencies: [ready, reduced, t] });

  // ── Magnetic button helper ──────────────────────────────────
  const setMag = useCallback((el: HTMLElement | null) => {
    if (!el || reduced) return;
    const mv = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * .3, y: (e.clientY - (r.top + r.height / 2)) * .3, duration: .35, ease: 'power3.out' });
    };
    const lv = () => gsap.to(el, { x: 0, y: 0, duration: .55, ease: 'elastic.out(1,.4)' });
    el.addEventListener('mousemove', mv);
    el.addEventListener('mouseleave', lv);
  }, [reduced]);

  // ── Nav sliding indicator ───────────────────────────────────
  const onNavEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    if (!indRef.current || !navInner.current) return;
    const r  = el.getBoundingClientRect();
    const nr = navInner.current.getBoundingClientRect();
    gsap.to(indRef.current, { x: r.left - nr.left, width: r.width, height: r.height, duration: .38, ease: 'power3.out', opacity: 1 });
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
        opacity: 0.65, duration: .45, ease: 'power3.out',
      });
    } else {
      gsap.to(indRef.current, { opacity: 0, duration: .25 });
    }
  }, []);

  // ── Render ──────────────────────────────────────────────────
  return (
    <>
      {!ready && <Preloader onDone={() => setReady(true)} />}

      <InfallibleCursor />

      {cmd && <CmdModal lang={lang} setLang={setLang} onClose={() => setCmd(false)} t={t} />}

      {/* ── Full-screen menu overlay ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-hidden={!menu}
        className="fixed inset-0 z-[80] bg-white/97 dark:bg-[#0a0a0a]/97 backdrop-blur-[40px] transition-[clip-path] duration-[650ms] [transition-timing-function:cubic-bezier(.76,0,.24,1)]"
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
                className={`font-mono text-[11px] tracking-[.15em] border-none rounded-[7px] px-2.5 py-1 transition-all duration-200 ${lang === l ? 'bg-ink text-page' : 'bg-black/6 dark:bg-white/[0.06] text-lead hover:bg-black/10 dark:hover:bg-white/10'}`}
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

      {/* ── Page wrapper ── */}
      <div ref={main} className={`transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}>

        {/* ════ NAVBAR ════ */}
        <header className="fixed top-3 left-1/2 -translate-x-1/2 z-[50] w-[calc(100%-2rem)] max-w-[940px]" data-noprint>
          <div className="flex items-center justify-between gap-4 px-5 py-[.62rem] rounded-full bg-white/82 dark:bg-[#0a0a0a]/82 backdrop-blur-3xl border border-white/80 dark:border-white/10 shadow-glass dark:shadow-glass-dark">
            <a href="#hero" className="n-el font-black text-[1rem] tracking-[-0.8px] text-ink no-underline shrink-0" aria-label="Inicio">
              Eneko.
            </a>

            <nav ref={navInner} className="hidden md:flex items-center relative gap-1" aria-label="Navegación principal" onMouseLeave={onNavContainerLeave}>
              <div ref={indRef} className="nav-ind absolute top-0 left-0 h-9 w-20" />
              {t.menu.map((link, i) => (
                <a
                  key={link}
                  href={t.hrefs[i]}
                  className="n-el relative z-[1] text-[13px] font-semibold text-lead no-underline px-[14px] py-[7px] rounded-[12px] transition-colors duration-200"
                  onMouseEnter={onNavEnter}
                  onMouseLeave={onNavLeave}
                  aria-label={link}
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
                aria-label="Buscar (Cmd+F)"
                data-h
                className="flex items-center gap-1 px-[.7rem] py-[.38rem] rounded-[10px] border border-black/9 dark:border-white/10 bg-white/65 dark:bg-white/[0.06] backdrop-blur-[18px] text-[11px] font-bold text-lead tracking-[.05em] transition-all duration-200 hover:bg-white/90 dark:hover:bg-white/10"
              >
                <Search size={11} />
              </button>
              <button
                onClick={() => setMenu(true)}
                aria-label="Abrir menú"
                data-h
                className="md:hidden font-bold text-[12px] text-lead tracking-[.1em] bg-none border-none"
              >
                MENU
              </button>
            </div>
          </div>
        </header>

        {/* ════ SECTIONS en el orden solicitado ════ */}
        
        {/* 1. Mi presentación */}
        <Hero t={t} greeting={greeting} reduced={reduced} setMag={setMag} />
        
        {/* 2. Mis tecnologías */}
        <Skills t={t} />
        
        {/* 3 y 4. Mis trabajos y mi GitHub (Componente Projects engloba ambos con sus props) */}
        <Projects t={t} top3={top3} repos={repos} load={load} offline={offline} BranchMergeBtn={BranchMergeBtn} />
        
        {/* 5. Entiendo lo que necesitas */}
        <About t={t} />
        
        {/* 6. Más allá del código */}
        <Philosophy t={t} />
        
        {/* 7. Contáctame y Footer */}
        <Contact t={t} />
        <SiteFooter t={t} />

      </div>
    </>
  );
}