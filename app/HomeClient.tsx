'use client';

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import dynamic from 'next/dynamic';

// ── Data & Types ────────────────────────────────────────────────────────────
import { TX } from './data/translations';
import type { Lang, ProjectCard, RepoFull } from './types';

// ── Hooks ──────────────────────────────────────────────────────────────────
import { usePreferredMotion } from './hooks/usePreferredMotion';
import { useGreeting } from './hooks/useGreeting';
import { useIntro } from './components/IntroProvider';
import { useDeviceTilt } from './hooks/useDeviceTilt';
import { useTheme } from 'next-themes';
import { useTranslations } from './hooks/useTranslations';
import { useSectionObserver } from './hooks/useSectionObserver';
import { useScrollReveal } from './hooks/useScrollReveal';

// ── UI & Navigation ────────────────────────────────────────────────────────
import { Preloader } from './components/ui/Preloader';
import { CmdModal } from './components/ui/CmdModal';
import { BranchMergeBtn } from './components/ui/Buttons';
import { Navbar } from './components/navigation/Navbar';
import { MobileMenu } from './components/navigation/MobileMenu';
import { ProjectPreviewFollower } from './components/motion/ProjectPreviewFollower';

// ── Motion & Sections ──────────────────────────────────────────────────────
import { IdentitySplash } from './components/motion/IdentitySplash';
import { animateLiquidCurtainOut } from './components/motion/LiquidCurtain';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Philosophy } from './components/sections/Philosophy';
import { Contact } from './components/sections/Contact';
import { SiteFooter } from './components/sections/SiteFooter';
import { memo } from 'react';

// ── Memoized Sections for performance ──
const MemoHero = memo(Hero);
const MemoAbout = memo(About);
const MemoSkills = memo(Skills);
const MemoProjects = memo(Projects);
const MemoPhilosophy = memo(Philosophy);
const MemoContact = memo(Contact);
const MemoFooter = memo(SiteFooter);

// ── Dynamic Visualizers ──
const DNAHelix = dynamic<{ accent: string; secondary: string; darkMode: boolean }>(
  () => import('./work/visualizers').then(m => m.DNAHelix), { ssr: false }
);
const TerrainMesh = dynamic<{ accent: string; darkMode: boolean }>(
  () => import('./work/visualizers').then(m => m.TerrainMesh), { ssr: false }
);

// Registrar plugins GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const PROJECTS_NAV_KEY = 'projects_nav_state';
const RETURN_OVERLAY_ID = 'return-overlay';

interface HomeClientProps {
  initialGitHubData: {
    repos: RepoFull[];
    top3: ProjectCard[];
    load: boolean;
    offline: boolean;
    errorMsg: string;
  };
}

export default function HomeClient({ initialGitHubData }: HomeClientProps) {
  // ── Refs ────────────────────────────────────────────────────────────────
  const main = useRef<HTMLDivElement>(null);
  const navInner = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLDivElement>(null);
  const menuRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeLinkRef = useRef<HTMLAnchorElement | null>(null);

  // ── Estado ──────────────────────────────────────────────────────────────
  const { phase, setPhase, markSeen } = useIntro();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { lang, setLang, t } = useTranslations();
  const tilt = useDeviceTilt();
  const [menu, setMenu] = useState(false);
  const [cmd, setCmd] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<{ name: string; color: string } | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isPhilosophyVisible, setIsPhilosophyVisible] = useState(false);

  const isDark = mounted && theme === 'dark';
  const ready = phase === 'ready';
  const reduced = usePreferredMotion();
  const isLite = mounted && (window as any).__LITE;

  // ── Scroll Visibility for DNAHelix ──
  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => {
      const aboutSection = document.getElementById('about');
      const valuesSection = document.getElementById('values'); // Was 'philosophy', updated to match ID
      
      const vh = window.innerHeight;

      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        // Hide if ANY part of the about section is visible
        setIsAboutVisible(rect.top < vh && rect.bottom > 0);
      }
      
      if (valuesSection) {
        const rect = valuesSection.getBoundingClientRect();
        // Hide if ANY part of the values section is visible
        setIsPhilosophyVisible(rect.top < vh && rect.bottom > 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);
  const greeting = useGreeting(t.times, t.greetingFn);
  const { repos, top3, load, offline, errorMsg } = initialGitHubData;

  // ── Custom Hooks ────────────────────────────────────────────────────────
  useSectionObserver(ready, t, navInner, indRef, activeLinkRef);
  useScrollReveal(ready);

  // ── Effects ─────────────────────────────────────────────────────────────
  
  // Tab title dinámico
  useEffect(() => {
    const orig = document.title;
    const h = () => { document.title = document.hidden ? t.tabAway : t.tabBack; };
    document.addEventListener('visibilitychange', h);
    return () => {
      document.removeEventListener('visibilitychange', h);
      document.title = orig;
    };
  }, [t]);

  // Global Transition Cleanup
  useEffect(() => {
    const cleanup = () => {
      document.querySelectorAll('[id^="return-overlay"]').forEach(el => {
        gsap.to(el, { opacity: 0, duration: 0.3, onComplete: () => el.remove() });
      });
      window.__lenis?.start?.();
    };
    cleanup();
    setMounted(true);
    const timer = setTimeout(cleanup, 500);
    return () => clearTimeout(timer);
  }, []);

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = cmd || menu ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cmd, menu]);

  // CMD+F & Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
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

  // Mobile menu items animation
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

  // Scroll restoration / Return transition
  useLayoutEffect(() => {
    if (!ready) return;
    try {
      const saved = JSON.parse(sessionStorage.getItem(PROJECTS_NAV_KEY) || '{}');
      if (saved.scrollY != null) {
        window.__lenis?.stop?.();
        window.scrollTo({ top: saved.scrollY, behavior: 'instant' as ScrollBehavior });
      }
    } catch (_) {}
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const lenis = window.__lenis;
    try {
      const saved = JSON.parse(sessionStorage.getItem(PROJECTS_NAV_KEY) || '{}');
      if (saved.scrollY != null) {
        lenis?.scrollTo?.(saved.scrollY, { immediate: true, force: true });
        lenis?.start?.();
      }
    } catch (_) {}
    ScrollTrigger.refresh();
  }, [ready]);

  // Find the color of the currently expanded project
  const expandedProjectColor = expandedIdx !== null && top3[expandedIdx] 
    ? (top3[expandedIdx].name.toLowerCase().replace(/[\s_]+/g, '-') === 'ana-peluquera' ? '#ff2d78' :
       top3[expandedIdx].name.toLowerCase().replace(/[\s_]+/g, '-') === 'who-are-ya-backend' ? '#00c940' :
       top3[expandedIdx].name.toLowerCase().replace(/[\s_]+/g, '-') === 'rides24ofiziala' ? '#e69400' :
       top3[expandedIdx].name.toLowerCase().replace(/[\s_]+/g, '-') === 'spotshare-parking' ? '#00d4e8' :
       top3[expandedIdx].name.toLowerCase().replace(/[\s_]+/g, '-') === 'pke_web' ? '#9b1fff' : null)
    : null;

  // ── DNA Color Sync ──
  const [dnaColors, setDnaColors] = useState({ 
    accent: isDark ? '#FFFFFF' : '#000', 
    secondary: isDark ? '#A1A1AA' : '#555' 
  });

  useEffect(() => {
    const targetAccent = hoveredProject?.color || expandedProjectColor || (isDark ? '#FFFFFF' : '#000');
    // Increased alpha for more intensity (CC = 80%, AA = 66%)
    const targetSecondary = hoveredProject 
      ? `${hoveredProject.color}CC` 
      : (expandedProjectColor ? `${expandedProjectColor}AA` : (isDark ? '#A1A1AA' : '#555'));

    gsap.to(dnaColors, {
      accent: targetAccent,
      secondary: targetSecondary,
      duration: 1.2,
      ease: 'sine.inOut',
      onUpdate: () => setDnaColors({ ...dnaColors })
    });
  }, [hoveredProject, expandedProjectColor, isDark]);

  useEffect(() => {
    if (!ready) return;
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    const id = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(id);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const overlay = document.getElementById(RETURN_OVERLAY_ID);
    if (!overlay) {
      window.__lenis?.start?.();
      try { sessionStorage.removeItem(PROJECTS_NAV_KEY); } catch (_) { }
      return;
    }

    let cancelled = false;
    const reveal = () => {
      if (cancelled) return;
      const isSVG = overlay.tagName.toLowerCase() === 'svg';
      if (isSVG) {
        animateLiquidCurtainOut(overlay as unknown as SVGSVGElement, {
          duration: 0.45,
          onComplete: () => {
            try { sessionStorage.removeItem(PROJECTS_NAV_KEY); } catch (_) { }
            window.__lenis?.start?.();
            ScrollTrigger.refresh();
          },
        });
      } else {
        gsap.to(overlay, {
          opacity: 0, duration: 0.34, ease: 'power3.out',
          onComplete: () => {
            overlay.remove();
            try { sessionStorage.removeItem(PROJECTS_NAV_KEY); } catch (_) { }
            window.__lenis?.start?.();
            ScrollTrigger.refresh();
          },
        });
      }
    };

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
      const r2 = Number(overlay.getAttribute('data-raf2')); if (r2) cancelAnimationFrame(r2);
      const r3 = Number(overlay.getAttribute('data-raf3')); if (r3) cancelAnimationFrame(r3);
    };
  }, [ready]);

  // ── GSAP Animations ─────────────────────────────────────────────────────
  useGSAP(() => {
    if (reduced) return;

    // Parallax hero
    gsap.to('.h-txt', {
      yPercent: -6, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.45 },
    });
    gsap.to('.memoji', {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.45 },
    });

    // Section headings reveal
    document.querySelectorAll<HTMLElement>('.sec-h').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.24, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 83%', once: true }
        }
      );
    });

    // Intro timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl
      .to('.n-el', { opacity: 1, y: 0, duration: 0.16, stagger: 0.02 })
      .to('.h-ln', { yPercent: 0, duration: 0.38, stagger: 0.03 }, '-=0.12')
      .to('.h-fd', { opacity: 1, y: 0, duration: 0.24, stagger: 0.025 }, '-=0.18')
      .to('.memoji', { opacity: 1, x: 0, duration: 0.42, ease: 'power3.out' }, '-=0.3');

    // DNA Helix rotation
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

  useLayoutEffect(() => {
    if (!ready || reduced) return;
    gsap.set('.n-el', { opacity: 0, y: -14 });
    gsap.set('.h-ln', { yPercent: 115 });
    gsap.set('.h-fd', { opacity: 0, y: 16 });
    gsap.set('.memoji', { opacity: 0, x: 60 });
  }, [ready, reduced]);

  // ── Nav Handlers ────────────────────────────────────────────────────────
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
      x: targetX, width: r.width, scaleX: stretch, height: r.height,
      opacity: 1, duration: 0.35, ease: 'power3.out',
    }).to(indRef.current, {
      scaleX: 1, duration: 0.45, ease: 'elastic.out(1, 0.5)',
    }, '-=0.15');
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

  // ── Phase Handlers ──────────────────────────────────────────────────────
  const onPreloaderDone = useCallback(() => setPhase('splash'), [setPhase]);
  const onSplashComplete = useCallback(() => {
    setPhase('ready');
    markSeen();
  }, [setPhase, markSeen]);

  if (phase === 'checking') return null;

  return (
    <>
      {(phase === 'loading' || phase === 'splash') && (
        <>
          <IdentitySplash
            lang={lang}
            onComplete={onSplashComplete}
            onReveal={() => {}}
            active={phase === 'splash'}
          />
          {phase === 'loading' && <Preloader onDone={onPreloaderDone} />}
        </>
      )}

      {ready && !isLite && !reduced && (
        <>
          {/* Enhanced DNA Helix Visibility */}
          <div 
            className="fixed inset-0 pointer-events-none z-[30] flex items-center justify-center overflow-hidden transition-all duration-400" 
            style={{ 
              perspective: '1200px',
              opacity: (isAboutVisible || isPhilosophyVisible) ? 0 : 1,
              visibility: (isAboutVisible || isPhilosophyVisible) ? 'hidden' : 'visible'
            }}
            aria-hidden="true"
          >
            <div
              className="helix-group will-change-transform"
              style={{
                width: '100vw', height: '240vh',
                opacity: (hoveredProject || expandedIdx !== null) ? 0.95 : (isDark ? 0.65 : 0.35),
                transformStyle: 'preserve-3d',
                transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)' // Smoother CSS transition
              }}
              ref={(el) => {
                if (el) {
                  el.style.transform = `rotateY(${tilt.x * 12}deg) rotateX(${-tilt.y * 12}deg)`;
                }
              }}
            >
              <DNAHelix 
                accent={dnaColors.accent} 
                secondary={dnaColors.secondary} 
                darkMode={isDark} 
              />
            </div>
          </div>
          <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]" aria-hidden="true">
            <TerrainMesh accent={isDark ? '#00A3FF' : 'currentColor'} darkMode={isDark} />
          </div>
        </>
      )}

      {cmd && (
        <CmdModal lang={lang} setLang={setLang} onClose={() => setCmd(false)} t={t} />
      )}

      <MobileMenu 
        menu={menu} 
        setMenu={setMenu} 
        lang={lang} 
        setLang={setLang} 
        t={t} 
        menuRefs={menuRefs} 
      />

      <main
        ref={main}
        id="main-content"
        className="relative"
        style={{
          visibility: ready ? 'visible' : 'hidden',
          opacity:    ready ? 1 : 0,
          height:     ready ? 'auto' : 0,
          overflow:   ready ? 'visible' : 'hidden',
          pointerEvents: ready ? 'auto' : 'none',
        }}
      >
        <Navbar 
          t={t} 
          lang={lang} 
          setLang={setLang} 
          setCmd={setCmd} 
          setMenu={setMenu} 
          navInnerRef={navInner} 
          indRef={indRef} 
          onNavEnter={onNavEnter} 
          onNavContainerLeave={onNavContainerLeave} 
        />

        <MemoHero t={t} greeting={greeting} reduced={reduced} setMag={() => { }} phase={phase} />
        <MemoSkills t={t} />
        <MemoProjects 
          t={t} 
          top3={top3} 
          repos={repos} 
          load={load} 
          offline={offline} 
          errorMsg={errorMsg} 
          BranchMergeBtn={BranchMergeBtn} 
          onHoverProject={setHoveredProject}
          expandedIdx={expandedIdx}
          onToggleProject={setExpandedIdx}
        />
        <MemoAbout t={t} />
        <MemoPhilosophy t={t} />
        <MemoContact t={t} />
        <MemoFooter t={t} />
        <ProjectPreviewFollower activeProject={hoveredProject} />
      </main>
    </>
  );
}
