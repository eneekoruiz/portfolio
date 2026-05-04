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

  // ── PARALLAX + ZOOM ANIMATION ──────────────────────────────────────────
  useGSAP(() => {
    if (!heroRef.current || !bgImageRef.current || !titleRef.current) return;

    // 1. Scroll Parallax
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top', 
        scrub: 1.2,
        pin: true,
        pinSpacing: true,
      },
    });

    tl
      .to(bgImageRef.current, {
        scale: 1.6,
        y: 200,
        ease: 'none',
      }, 0)
      .to(titleRef.current, {
        yPercent: -180,
        opacity: 0,
        scale: 0.95,
        ease: 'none',
      }, 0)
      .to(screenRef.current, {
        yPercent: -20,
        scale: 1, // Keep scale at 1 for max clarity
        opacity: 0,
        rotateX: 10,
        z: -20,
        ease: 'none',
      }, 0)
      .to(overlayRef.current, {
        opacity: 0.95,
        ease: 'none',
      }, 0);

    // 2. Subtle Idle Floating
    gsap.to(screenRef.current, {
      y: '+=20',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // 3. Advanced Mouse Tilt & Glare
    const onMove = (e: MouseEvent) => {
      if (!screenRef.current || !glareRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;
      
      // Tilt physics (Rotate X depends on Y mouse, Rotate Y depends on X mouse)
      gsap.to(screenRef.current, {
        rotateY: xPercent * 15,
        rotateX: -yPercent * 15,
        duration: 1.5,
        ease: 'power3.out',
      });

      // Title Tilt (Subtler)
      gsap.to(titleRef.current, {
        rotateY: xPercent * 8,
        rotateX: -yPercent * 8,
        z: 150, // Pop out
        duration: 1.5,
        ease: 'power3.out',
      });

      // Dynamic Glare
      gsap.to(glareRef.current, {
        x: xPercent * 50,
        y: yPercent * 50,
        opacity: 0.6,
        duration: 1.5,
        ease: 'power3.out',
      });
    };

    // 4. Pointer-events management to prevent scroll hijacking
    const handleScrollStart = () => {
      if (iframeRef.current) iframeRef.current.style.pointerEvents = 'none';
    };
    const handleScrollEnd = () => {
      if (iframeRef.current) iframeRef.current.style.pointerEvents = 'auto';
    };

    ScrollTrigger.addEventListener('scrollStart', handleScrollStart);
    ScrollTrigger.addEventListener('scrollEnd', handleScrollEnd);

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      ScrollTrigger.removeEventListener('scrollStart', handleScrollStart);
      ScrollTrigger.removeEventListener('scrollEnd', handleScrollEnd);
    };

  }, { scope: heroRef });

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION (100vh con parallax + zoom) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div
        ref={heroRef}
        className="relative h-[100vh] w-full overflow-hidden flex flex-col items-center justify-center"
        style={{ backgroundColor: accentBg }}
      >
        {/* ── Fondo con zoom parallax ── */}
        <div
          ref={bgImageRef}
          className="absolute inset-0 will-change-transform"
          style={{
            background: `linear-gradient(135deg, ${accent}15 0%, ${accent}08 100%)`,
            transformOrigin: 'center center',
            backfaceVisibility: 'hidden',
          }}
        />

        {/* ── Overlay oscuro con fade parallax ── */}
        <div
          ref={overlayRef}
          className="absolute inset-0 opacity-0 will-change-opacity"
          style={{
            background: darkMode
              ? 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)'
              : 'radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
          }}
        />

        {/* ── Contenido del Hero (z-index superior) ── */}
        <div
          ref={contentRef}
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full h-full pt-[14vh] will-change-transform"
        >
          {/* Título con parallax y 3D Tilt */}
          <div className="relative group mb-12" style={{ perspective: '1000px' }}>
            <div
              ref={titleRef}
              className="relative flex flex-col items-center justify-center will-change-transform pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Número flotante (estilo original) */}
              <span 
                className="font-mono text-[clamp(1rem,2vw,1.5rem)] opacity-40 mb-2 tracking-[0.3em]"
                style={{ color: accent }}
              >
                PROJECT // {index.toString().padStart(2, '0')}
              </span>
              
              <h1
                className="font-black uppercase italic tracking-[-0.05em] leading-[0.85] text-center max-w-[1200px]"
                style={{
                  fontSize: 'clamp(2.5rem, 12vw, 10rem)',
                  color: accent,
                  // Sombra más nítida para mejor legibilidad
                  textShadow: darkMode 
                    ? `0 20px 80px ${accent}30, 0 2px 4px rgba(0,0,0,0.5)`
                    : `0 20px 80px ${accent}20`,
                }}
              >
                {title}
              </h1>
            </div>
            {/* Halo de luz mejorado */}
            <div 
              className="absolute inset-0 -z-10 blur-[120px] opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(circle at center, ${accent} 0%, transparent 75%)` }}
            />
          </div>

          {/* Subtitle */}
          <p
            className="text-xl md:text-2xl font-light tracking-tight max-w-2xl mb-12"
            style={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}
          >
            {subtitle}
          </p>

          {/* ── THE DEMO SCREEN ── */}
          <div 
            ref={screenRef}
            className="relative w-[calc(100%-3rem)] max-w-[1440px] h-[75vh] min-h-[500px] md:min-h-[720px] rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_80px_160px_-30px_rgba(0,0,0,0.7)] mb-28 animate-screen-entry bg-[#050505]"
            style={{ 
              transformStyle: 'preserve-3d', 
              perspective: '2000px',
              willChange: 'transform, opacity',
            }}
          >
            {liveUrl ? (
              <iframe 
                ref={iframeRef}
                src={liveUrl} 
                title={iframeTitle}
                className="w-full h-full border-none transition-opacity duration-500"
                loading="eager"
                style={{ 
                  imageRendering: '-webkit-optimize-contrast',
                  backgroundColor: '#050505'
                }}
              />
            ) : videoUrl ? (
              <video
                src={videoUrl}
                autoPlay muted loop playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-3xl">
                 <div className="flex flex-col items-center gap-6">
                   <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/5 border border-white/10">
                     <Activity size={32} className="text-brand animate-pulse" />
                   </div>
                   <p className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-30">Diagnostic System Offline</p>
                 </div>
              </div>
            )}
            
            {/* ── ADVANCED REFLECTIONS ── */}
            <div 
              ref={glareRef}
              className="absolute inset-0 pointer-events-none opacity-0 mix-blend-overlay"
              style={{ 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(255,255,255,0.1) 100%)',
                transform: 'translateZ(100px)',
              }}
            />

            {/* Glossy overlay + Ambient light */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-20" />
            <div 
              className="absolute -inset-20 pointer-events-none opacity-30 blur-[120px]"
              style={{ 
                background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
                transform: 'translateZ(-50px)'
              }}
            />
          </div>

          {/* Stack de lenguajes + label ── */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {langs.slice(0, 3).map(lang => (
              <div
                key={lang}
                className="font-mono text-[11px] uppercase tracking-[0.2em] px-4 py-2 rounded-full border backdrop-blur-md"
                style={{
                  borderColor: `${accent}40`,
                  backgroundColor: `${accent}08`,
                  color: accent,
                }}
              >
                {lang}
              </div>
            ))}
            <div
              className="font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border flex items-center gap-2"
              style={{
                borderColor: `${accent}30`,
                backgroundColor: `${accent}05`,
                color: accent,
              }}
            >
              <Activity size={10} className="animate-pulse" />
              {label}
            </div>
          </div>
        </div>

        {/* ── Scroll hint (aparece al principio) ── */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: accent }}
        >
          <div className="flex flex-col items-center gap-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.3em]">Scroll</p>
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 4v8M12 20v4" strokeLinecap="round" />
              <path d="M18 12L12 18L6 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
