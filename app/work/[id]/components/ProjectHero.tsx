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

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Activity, MousePointer2, X, ExternalLink, MoveUp } from 'lucide-react';
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
  const [isInteracting, setIsInteracting] = useState(false);
  const [canInteract, setCanInteract] = useState(false);

  // ── CINEMATIC MULTI-STAGE ANIMATION ────────────────────────────────────
  useGSAP(() => {
    if (!heroRef.current || !bgImageRef.current || !titleRef.current || !screenRef.current) return;

    // 1. Cinematic Scroll Sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=160%', // Slightly longer for more control
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // 🚀 UX SHIELD: Definitive fix for iframe scroll stealing
          if (screenRef.current) {
            const isLocked = self.progress > 0.98;
            setCanInteract(isLocked);
            
            // We use a CSS variable or direct style to toggle the pointer events of the SHIELD
            screenRef.current.style.setProperty('--shield-opacity', isLocked ? '0' : '1');
            screenRef.current.style.setProperty('--shield-pointer', isLocked ? 'none' : 'all');
          }
        }
      },
    });

    tl
      // Phase 1: Title & Background Dissolve
      .to(contentRef.current, {
        y: -200,
        opacity: 0,
        scale: 0.75,
        filter: 'blur(30px)',
        ease: 'power2.in',
        duration: 1.2,
      }, 0)
      .to(bgImageRef.current, {
        scale: 3,
        opacity: 0.01,
        filter: 'blur(80px)',
        ease: 'power2.inOut',
        duration: 2,
      }, 0)

      // Phase 2: High-Performance 3D Entrance (Cinematic Zoom)
      .fromTo(screenRef.current,
        { 
          y: '80vh', 
          scale: 0.2, 
          rotateX: 45,
          rotateY: -15, // Subtle side tilt for depth
          z: -1000,
          borderRadius: '10rem',
          width: '40vw',
          opacity: 0,
          filter: 'blur(20px) brightness(0.5)',
        },
        { 
          y: '0vh', 
          scale: 1, 
          rotateX: 0,
          rotateY: 0,
          z: 0,
          borderRadius: '2.5rem',
          width: '90vw',
          height: '85vh',
          opacity: 1,
          filter: 'blur(0px) brightness(1)',
          ease: 'expo.inOut',
          duration: 3,
        },
        0.3
      )
      
      // Phase 3: Final Depth Adjustment
      .to(overlayRef.current, {
        opacity: 1,
        backgroundColor: 'rgba(0,0,0,0.92)',
        duration: 2,
      }, 0.8);

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
        rotateY: xPercent * 15,
        rotateX: -yPercent * 15,
        scale: 1.05,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
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
    // 4. Studio Mode Entrance Animation (One-time)
    if (isInteracting) {
      gsap.fromTo('.studio-bar', 
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.75)' }
      );
    }
  }, { scope: heroRef, dependencies: [isInteracting] });

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
          className="relative z-20 flex flex-col items-center justify-center text-center px-6 w-full pt-[20vh] md:pt-[24vh] will-change-transform"
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

        {/* ── PROJECT PREVIEW SCREEN ── */}
        <div
          ref={screenRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden bg-black flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform, opacity, filter',
          }}
        >
          {/* 🚀 INTERACTION SHIELD & CTA */}
          <div 
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-700 bg-black/0 group/shield"
            style={{ 
              opacity: isInteracting ? 0 : 'var(--shield-opacity, 1)',
              pointerEvents: isInteracting ? 'none' : 'all',
              backgroundColor: canInteract ? 'rgba(0,0,0,0.2)' : 'transparent',
              backdropFilter: canInteract ? 'blur(4px)' : 'none',
            }}
            onClick={() => {
              if (canInteract) {
                setIsInteracting(true);
                (window as any).__lenis?.stop();
              }
            }}
          >
            {canInteract && !isInteracting && (
              <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl group-hover/shield:scale-110 transition-transform cursor-pointer studio-pulse">
                   <MousePointer2 size={24} className="animate-pulse" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60 bg-black/40 px-4 py-2 rounded-lg border border-white/10">
                  Click to Interact with Live Site
                </span>
              </div>
            )}
          </div>

          {/* 🚀 STUDIO CONTROL BAR */}
          {isInteracting && (
            <div className="studio-bar absolute bottom-6 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-white/80">Studio Mode Active</span>
                </div>
                <button 
                  onClick={() => {
                    setIsInteracting(false);
                    (window as any).__lenis?.start();
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/90 group"
                >
                  <MoveUp size={14} className="group-hover:-translate-y-1 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Exit to Scroll</span>
                </button>
                {liveUrl && (
                  <a 
                    href={liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          )}

          {liveUrl ? (
            <iframe 
              ref={iframeRef}
              src={liveUrl} 
              title={iframeTitle}
              className="w-full h-full border-none transition-opacity duration-1000"
              loading="eager"
              style={{ 
                opacity: 0.95,
                background: '#050505',
              }}
              onLoad={(e) => {
                (e.target as HTMLIFrameElement).style.opacity = '1';
              }}
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
