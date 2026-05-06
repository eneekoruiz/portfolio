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
  isReady?: boolean;
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
  isReady = true,
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
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [canInteract, setCanInteract] = useState(false);
  const interRef = useRef(false);
  const canRef   = useRef(false);

  // Sync refs with state for use in event listeners
  useEffect(() => { interRef.current = isInteracting; }, [isInteracting]);
  useEffect(() => { canRef.current   = canInteract;   }, [canInteract]);

  // ── CINEMATIC MULTI-STAGE ANIMATION ────────────────────────────────────
  useGSAP(() => {
    if (!isReady || !heroRef.current || !bgImageRef.current || !titleRef.current || !screenRef.current) return;

    // 1. Cinematic Scroll Sequence — INCREASED END for better pacing
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=250%', // More space for a grander transition
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const isLocked = self.progress > 0.88; // Trigger CTA earlier
          if (canRef.current !== isLocked) {
            canRef.current = isLocked;
            setCanInteract(isLocked);
          }
          
          if (screenRef.current && !interRef.current) {
            screenRef.current.style.setProperty('--shield-opacity', isLocked ? '0.4' : '1');
            screenRef.current.style.setProperty('--shield-pointer', isLocked ? 'all' : 'none');
          }
        }
      },
    });

    tl
      // Phase 1: Background & Content Fade
      .to(contentRef.current, {
        y: -120,
        opacity: 0,
        scale: 0.9,
        force3D: true,
        ease: 'power2.in',
        duration: 1.2,
      }, 0)
      .to(bgImageRef.current, {
        scale: 2.2,
        opacity: 0.1,
        force3D: true,
        ease: 'power2.inOut',
        duration: 2.5,
      }, 0)

      // Phase 2: Screen reveals with a "Window" effect
      .fromTo(screenRef.current,
        { 
          scale: 0.05, 
          opacity: 0,
          z: -1500,
          filter: 'blur(30px)',
          borderRadius: '50rem',
        },
        { 
          scale: 1, 
          opacity: 1,
          z: 0,
          filter: 'blur(0px)',
          borderRadius: '2.5rem',
          xPercent: -50,
          yPercent: -50,
          left: '50%',
          top: '50%',
          // RESPONSIVE DIMENSIONS - Use relative units for better mobile behavior
          width: '94vw', 
          maxWidth: window.innerWidth < 768 ? '100%' : '1400px',
          height: window.innerWidth < 768 ? '65dvh' : '82dvh',
          force3D: true,
          ease: 'expo.inOut',
          duration: 2.2, 
        },
        0.5
      )
      
      // Phase 3: Darkening for focus
      .to(overlayRef.current, {
        opacity: 1,
        backgroundColor: 'rgba(0,0,0,0.94)',
        duration: 1.8,
      }, 0.8);

    // 2. Idle floating
    gsap.to(titleRef.current, {
      y: '+=12',
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      force3D: true,
    });

    // 3. Mouse Interaction (Optimized)
    const onMove = (e: MouseEvent) => {
      if (!titleRef.current || interRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const mx = (clientX / innerWidth - 0.5) * 2;
      const my = (clientY / innerHeight - 0.5) * 2;
      
      gsap.to(titleRef.current, {
        rotateY: mx * 10,
        rotateX: -my * 10,
        scale: 1.01,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      
      if (glareRef.current) {
        gsap.to(glareRef.current, {
          x: mx * 20,
          y: my * 20,
          opacity: 0.2,
          duration: 1,
        });
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, { scope: heroRef, dependencies: [isReady] });

  // ── 🚀 STUDIO MODE TRANSITION (Fullscreen Takeover) ────────────────
  useGSAP(() => {
    if (!screenRef.current) return;

    if (isInteracting) {
      const tl = gsap.timeline();
      tl.to(screenRef.current, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        x: 0,
        y: 0,
        translateX: 0,
        translateY: 0,
        borderRadius: 0,
        zIndex: 999,
        duration: 0.8,
        ease: 'expo.inOut',
      })
      .fromTo('.studio-bar', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
        '-=0.3'
      );
    } else {
      gsap.to(screenRef.current, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        width: window.innerWidth < 768 ? '94vw' : '92vw',
        height: window.innerWidth < 768 ? '65dvh' : '82dvh',
        borderRadius: '2.5rem',
        zIndex: 30,
        duration: 0.7,
        ease: 'expo.out',
      });
    }
  }, [isInteracting]);

  // ── 🚀 STUDIO MODE SIDE EFFECTS (Scroll Lock & ESC Key) ────────────────
  useEffect(() => {
    if (isInteracting) {
      // 1. Strict Scroll Lock & UI Cleanups
      document.body.style.overflow = 'hidden';
      document.body.classList.add('studio-active');
      window.__lenis?.stop();

      // 2. ESC Key Listener
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsInteracting(false);
      };
      window.addEventListener('keydown', handleEsc);
      
      return () => {
        document.body.style.overflow = '';
        document.body.classList.remove('studio-active');
        window.__lenis?.start();
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isInteracting]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CINEMATIC HERO (Pinned Multi-Phase) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div
        ref={heroRef}
        className="relative h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-transparent"
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
                  fontSize: 'clamp(3.5rem, 15vw, 12rem)',
                  color: accent,
                  textShadow: `0 30px 100px ${accent}40`,
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

        {/* ── PROJECT PREVIEW SCREEN (STUDIO) ── */}
        <div
          ref={screenRef}
          className={`absolute left-1/2 top-1/2 z-30 pointer-events-auto transition-shadow duration-500 overflow-hidden bg-black flex items-center justify-center ${isInteracting ? 'shadow-none' : 'shadow-2xl border border-white/10'}`}
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform, width, height, border-radius',
            borderColor: isInteracting ? 'transparent' : 'rgba(255,255,255,0.1)',
            transform: 'translate(-50%, -50%) scale(0.05)',
            opacity: 0,
          }}
        >
          {/* Interaction Shield */}
          <div 
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-700 group/shield cursor-pointer"
            style={{ 
              opacity: isInteracting ? 0 : 1,
              pointerEvents: isInteracting ? 'none' : 'all',
              backgroundColor: canInteract ? 'rgba(0,0,0,0.6)' : 'transparent',
              backdropFilter: canInteract ? 'blur(15px)' : 'none',
            }}
            onClick={() => canInteract && setIsInteracting(true)}
          >
            {canInteract && !isInteracting && (
              <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in slide-in-from-bottom-8 duration-1000">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-2xl border border-white/30 flex items-center justify-center text-white shadow-[0_0_50px_rgba(255,255,255,0.2)] group-hover/shield:scale-110 transition-transform studio-pulse">
                   <MousePointer2 size={32} className="animate-pulse" />
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="font-mono text-[12px] font-black uppercase tracking-[0.4em] text-white">
                    Enter Studio
                  </span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">Click to Interact</span>
                </div>
              </div>
            )}
          </div>

          {/* Studio HUD */}
          {isInteracting && (
            <div className="studio-bar absolute top-4 md:top-8 left-4 md:left-8 right-4 md:right-8 z-[110] flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl pointer-events-auto">
                <div className="flex items-center gap-2 md:gap-3 pr-4 md:pr-6 border-r border-white/10">
                  <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-brand animate-pulse shadow-[0_0_10px_var(--brand)]" />
                  <span className="font-mono text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/90 truncate max-w-[100px] md:max-w-none">
                    {title} <span className="hidden xs:inline">// LIVE</span>
                  </span>
                </div>
                <div className="flex items-center gap-4 md:gap-6 text-white/40 font-mono text-[8px] md:text-[9px] uppercase tracking-widest">
                   <span className="hidden sm:block">Status: Stable</span>
                   <span className="hidden lg:block">Viewport: Fullscreen</span>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
                {liveUrl && (
                  <a 
                    href={liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-black/40 backdrop-blur-3xl border border-white/10 text-white/60 hover:text-white hover:bg-black/60 transition-all"
                  >
                    <ExternalLink size={16} className="md:w-[18px] md:h-[18px]" />
                  </a>
                )}
                <button 
                  onClick={() => setIsInteracting(false)}
                  className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-brand text-white shadow-[0_0_30px_rgba(0,163,255,0.3)] hover:scale-105 active:scale-95 transition-all group"
                >
                  <X size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest hidden xs:block">Close Studio</span>
                </button>
              </div>
            </div>
          )}

          {liveUrl ? (
            <>
              {!iframeLoaded && (
                <div className="absolute inset-0 z-[101] flex flex-col items-center justify-center bg-black gap-4">
                  <div className="w-10 h-10 border-2 border-white/10 border-t-brand rounded-full animate-spin" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">Booting Environment...</span>
                </div>
              )}
              <iframe 
                ref={iframeRef}
                src={liveUrl} 
                onLoad={() => setIframeLoaded(true)}
                title={iframeTitle}
                className={`w-full h-full border-none transition-opacity duration-1000 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  background: '#000',
                  filter: (canInteract && !isInteracting) ? 'blur(10px) brightness(0.5)' : 'none',
                }}
              />
            </>
          ) : (
             <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                <Activity size={48} className="text-white/10 animate-pulse" />
             </div>
          )}
          
          <div 
            ref={glareRef}
            className="absolute inset-0 pointer-events-none opacity-0 mix-blend-overlay"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)',
            }}
          />
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[40] opacity-20">
          <div className="flex flex-col items-center gap-3">
            <p className="font-mono text-[8px] uppercase tracking-[0.5em]">Deep Scroll to Enter</p>
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
