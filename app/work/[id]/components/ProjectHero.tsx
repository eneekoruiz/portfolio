'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PROJECT HERO — Fake 3D / Cinematic Parallax Effect
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ESTRUCTURA:
 *   - Hero ocupa 100vh con imagen de fondo (cover del proyecto)
 *   - Título + stack en primer plano
 *   - ScrollTrigger pinea el hero brevemente
 *
 * ANIMACIÓN:
 *   - Al scroll: imagen hace zoom lento (1.0 → 1.2)
 *   - Título hace parallax (sube más rápido que la imagen)
 *   - Efecto cinematic con scrub: 1.5
 *
 * TRANSICIÓN:
 *   - Contenido por debajo (z-10) desliza por encima del hero (z-0)
 *   - Ocultamiento suave del hero
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Activity } from 'lucide-react';
import type { Lang } from '../../../lib/types';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface ProjectHeroProps {
  projectId: string;
  title: string;
  subtitle: string;
  accent: string;
  accentBg: string;
  liveUrl?: string;
  videoUrl?: string;
  iframeTitle?: string;
  label: string;
  langs: string[];
  darkMode: boolean;
  index?: number;
}

export function ProjectHero({
  projectId,
  title,
  subtitle,
  accent,
  accentBg,
  liveUrl,
  videoUrl,
  iframeTitle = 'Preview',
  label,
  langs,
  darkMode,
  index = 1,
}: ProjectHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ── CINEMATIC MULTI-STAGE ANIMATION ────────────────────────────────────
  useGSAP(() => {
    if (!heroRef.current || !bgImageRef.current || !titleRef.current || !screenRef.current) return;

    // 1. Core Timeline with extended scroll distance
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=250%', // Enough distance for two distinct phases
        scrub: 1,
        pin: true,
        pinSpacing: true,
      },
    });

    tl
      // Phase 1: Title Focus -> Out
      .to(contentRef.current, {
        yPercent: -120,
        opacity: 0,
        scale: 0.9,
        ease: 'power2.inOut',
        duration: 1.2,
      }, 0)
      .to(bgImageRef.current, {
        scale: 1.8,
        opacity: 0.3,
        y: 100,
        ease: 'none',
        duration: 1.2,
      }, 0)

      // Phase 2: Screen Entrance & Expansion
      .fromTo(screenRef.current,
        { 
          y: '100vh', 
          scale: 0.7, 
          borderRadius: '4rem',
          width: '80vw',
          opacity: 0.5 
        },
        { 
          y: '0vh', 
          scale: 1, 
          borderRadius: '0rem',
          width: '100vw',
          height: '100vh',
          opacity: 1,
          ease: 'power3.out',
          duration: 2,
        },
        0.4 // Starts before title fully disappears for fluidity
      )
      
      // Overlay darkening as screen takes over
      .to(overlayRef.current, {
        opacity: 1,
        backgroundColor: '#000',
        duration: 1,
      }, 1);

    // 2. Idle floating for title while visible
    gsap.to(titleRef.current, {
      y: '+=10',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // 3. Mouse Interaction (only affects title when visible)
    const onMove = (e: MouseEvent) => {
      if (!titleRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;
      
      gsap.to(titleRef.current, {
        rotateY: xPercent * 10,
        rotateX: -yPercent * 10,
        duration: 1.2,
        ease: 'power2.out',
      });
      
      if (glareRef.current) {
        gsap.to(glareRef.current, {
          x: xPercent * 40,
          y: yPercent * 40,
          opacity: 0.4,
          duration: 1.5,
        });
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
    };

  }, { scope: heroRef });

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CINEMATIC HERO (Pinned Multi-Phase) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div
        ref={heroRef}
        className="relative h-[100vh] w-full overflow-hidden flex items-center justify-center bg-black"
        style={{ perspective: '2000px' }}
      >
        {/* ── Background Layer ── */}
        <div
          ref={bgImageRef}
          className="absolute inset-0 will-change-transform z-0"
          style={{
            background: `linear-gradient(135deg, ${accent}15 0%, ${accent}08 100%)`,
            transformOrigin: 'center center',
          }}
        />

        <div
          ref={overlayRef}
          className="absolute inset-0 opacity-0 z-[1] pointer-events-none"
        />

        {/* ── Phase 1 Content: Title focus ── */}
        <div
          ref={contentRef}
          className="relative z-20 flex flex-col items-center justify-center text-center px-6 w-full pt-[14vh] will-change-transform"
        >
          <div className="relative group mb-12" style={{ transformStyle: 'preserve-3d' }}>
            <div
              ref={titleRef}
              className="relative flex flex-col items-center justify-center will-change-transform pointer-events-none"
            >
              <span 
                className="font-mono text-[clamp(0.9rem,1.5vw,1.2rem)] opacity-40 mb-3 tracking-[0.4em]"
                style={{ color: accent }}
              >
                PROJECT // {index.toString().padStart(2, '0')}
              </span>
              
              <h1
                className="font-black uppercase italic tracking-[-0.05em] leading-[0.85] text-center max-w-[1200px]"
                style={{
                  fontSize: 'clamp(3rem, 14vw, 11rem)',
                  color: accent,
                  textShadow: `0 20px 80px ${accent}30`,
                }}
              >
                {title}
              </h1>
            </div>
          </div>

          <p
            className="text-xl md:text-2xl font-light tracking-tight max-w-2xl mb-12 opacity-50"
            style={{ color: darkMode ? '#fff' : '#000' }}
          >
            {subtitle}
          </p>

          <div className="flex items-center gap-6 flex-wrap justify-center opacity-40">
            {langs.slice(0, 3).map(lang => (
              <div
                key={lang}
                className="font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-full border"
                style={{ borderColor: `${accent}40`, color: accent }}
              >
                {lang}
              </div>
            ))}
          </div>
        </div>

        {/* ── Phase 2 Content: Full-Screen Screen ── */}
        <div 
          ref={screenRef}
          className="absolute z-[30] h-[90vh] overflow-hidden shadow-[0_100px_200px_-50px_rgba(0,0,0,0.8)] bg-[#050505] will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {liveUrl ? (
            <iframe 
              ref={iframeRef}
              src={liveUrl} 
              title={iframeTitle}
              className="w-full h-full border-none"
              loading="eager"
            />
          ) : videoUrl ? (
            <video src={videoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black/40">
               <Activity size={32} className="text-brand animate-pulse opacity-20" />
            </div>
          )}
          
          <div 
            ref={glareRef}
            className="absolute inset-0 pointer-events-none opacity-0 mix-blend-overlay"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)',
              transform: 'translateZ(100px)',
            }}
          />
        </div>

        {/* ── Scroll Hint ── */}
        <div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[40] opacity-30 hover:opacity-100 transition-opacity"
          style={{ color: accent }}
        >
          <div className="flex flex-col items-center gap-3">
            <p className="font-mono text-[8px] uppercase tracking-[0.5em]">Scroll to Expand</p>
            <div className="w-px h-12 bg-gradient-to-b from-current to-transparent" />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONTENIDO POR DEBAJO (desliza sobre el hero) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* El contenido que viene después debe tener z-10 para aparecer encima */}
      {/* Esto se maneja en la página parent usando z-[10] */}
    </>
  );
}
