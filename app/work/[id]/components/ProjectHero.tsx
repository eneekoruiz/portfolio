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

  const disableStudio = projectId === 'rides24ofiziala';

  // Iframe loading safety fallback
  useEffect(() => {
    if (!liveUrl || iframeLoaded) return;
    const timer = setTimeout(() => {
      setIframeLoaded(true);
    }, 6000); // 6s fallback for heavy sites
    return () => clearTimeout(timer);
  }, [liveUrl, iframeLoaded]);

  // ── CINEMATIC MULTI-STAGE ANIMATION ────────────────────────────────────
  useGSAP(() => {
    if (!isReady || !heroRef.current || !bgImageRef.current || !titleRef.current || !screenRef.current) return;

    // 1. Cinematic Scroll Sequence — INCREASED END for better pacing
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: disableStudio ? '+=120%' : '+=250%', // More space for a grander transition
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self: ScrollTrigger) => {
          const isLocked = self.progress > 0.88; // Trigger CTA earlier
          if (!disableStudio && canRef.current !== isLocked) {
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
        scale: disableStudio ? 1.4 : 2.2,
        opacity: disableStudio ? 0.3 : 0.1,
        force3D: true,
        ease: 'power2.inOut',
        duration: 2.5,
      }, 0);

    if (!disableStudio) {
      tl
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
    }

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
      tl.fromTo('.studio-bar', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
      );
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

        {!disableStudio && (
          <div
            ref={screenRef}
            className={`absolute left-1/2 top-1/2 z-30 pointer-events-auto transition-shadow duration-500 overflow-hidden bg-black flex items-center justify-center ${isInteracting ? 'shadow-none' : 'shadow-2xl border border-white/10'}`}
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform, width, height, border-radius',
              borderColor: isInteracting ? 'transparent' : 'rgba(255,255,255,0.1)',
              transform: 'scale(0.05)',
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
              <>
                {/* 🌌 Scanning Lines / CRT Effect */}
                <div className="absolute inset-0 z-[105] pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,210,0.06))] bg-[length:100%_2px,3px_100%] select-none" />

                {/* 🛠️ Main Control Bar */}
                <div className="studio-bar absolute top-4 md:top-8 left-4 md:left-8 right-4 md:right-8 z-[110] flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-black/60 backdrop-blur-3xl border border-white/10 shadow-2xl pointer-events-auto">
                    <div className="flex items-center gap-2 md:gap-3 pr-4 md:pr-6 border-r border-white/10">
                      <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-brand animate-pulse shadow-[0_0_10px_var(--brand)]" />
                      <span className="font-mono text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/90 truncate max-w-[120px] md:max-w-none">
                        {title} <span className="hidden xs:inline">{" // SYSTEM.ACTIVE"}</span>
                      </span>
                    </div>
                    
                    {/* Real-time Telemetry (Decorative) */}
                    <div className="hidden md:flex items-center gap-6 text-white/40 font-mono text-[8px] uppercase tracking-widest">
                      <div className="flex flex-col">
                        <span className="text-white/20">Latency</span>
                        <span className="text-brand">24ms</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/20">Security</span>
                        <span className="text-green-400">Hardened</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/20">Environment</span>
                        <span className="text-white/60">Vercel.Edge</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
                    {/* External Access */}
                    {liveUrl && (
                      <a 
                        href={liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-black/60 backdrop-blur-3xl border border-white/10 text-white/60 hover:text-white hover:bg-black/80 transition-all group"
                        title="Open External"
                      >
                        <ExternalLink size={16} className="md:w-[18px] md:h-[18px] group-hover:scale-110" />
                      </a>
                    )}
                    
                    {/* Close Session */}
                    <button 
                      onClick={() => setIsInteracting(false)}
                      className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all group"
                    >
                      <X size={16} className="md:w-[18px] md:h-[18px] font-bold" />
                      <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest hidden xs:block">Close Session</span>
                    </button>
                  </div>
                </div>

                {/* 📊 Bottom Telemetry & Controls */}
                <div className="studio-bar absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 z-[110] flex items-center justify-between pointer-events-none">
                  <div className="px-4 py-2 rounded-lg bg-black/60 backdrop-blur-3xl border border-white/10 font-mono text-[8px] text-white/40 uppercase tracking-widest pointer-events-auto">
                    Auth: <span className="text-brand">Developer_Privileges</span> {" // "} Root_Access: <span className="text-green-400">True</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-4 px-4 py-2 rounded-lg bg-black/60 backdrop-blur-3xl border border-white/10 font-mono text-[8px] text-white/40 uppercase tracking-widest pointer-events-auto">
                     <div className="flex items-center gap-2">
                       <div className="w-1 h-1 rounded-full bg-white/20" />
                       <span>Signal_Strength: 98%</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <div className="w-1 h-1 rounded-full bg-white/20" />
                       <span>Data_integrity: Verified</span>
                     </div>
                  </div>
                </div>
              </>
            )}

            {liveUrl ? (
              <>
                {!iframeLoaded && (
                  <div className="absolute inset-0 z-[101] flex flex-col items-center justify-center bg-black gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 border-2 border-white/5 border-t-brand rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border border-white/10 border-b-brand rounded-full animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <span className="font-mono text-[10px] font-black uppercase tracking-[0.5em] text-white animate-pulse">Initializing Studio</span>
                      <span className="font-mono text-[8px] uppercase tracking-widest text-white/20">Mounting remote environment...</span>
                    </div>
                  </div>
                )}
                <iframe 
                  ref={iframeRef}
                  src={liveUrl} 
                  onLoad={() => setIframeLoaded(true)}
                  title={iframeTitle}
                  className={`w-full h-full border-none transition-all duration-1000 ${iframeLoaded ? 'opacity-100' : 'opacity-0'} ${isInteracting ? 'scale-100' : 'scale-[1.05]'}`}
                  style={{ 
                    background: '#000',
                    filter: (canInteract && !isInteracting) ? 'blur(15px) brightness(0.4) saturate(0.5)' : 'none',
                  }}
                />
              </>
            ) : videoUrl ? (
               <div className="w-full h-full bg-black relative">
                  <video
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`w-full h-full object-cover transition-all duration-1000 ${isInteracting ? 'scale-100' : 'scale-[1.05]'}`}
                    style={{ 
                      filter: (canInteract && !isInteracting) ? 'blur(15px) brightness(0.4) saturate(0.5)' : 'none',
                    }}
                  />
                  {/* HUD Overlay for Video */}
                  {!isInteracting && (
                    <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                  )}
               </div>
            ) : (
               <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center gap-6 p-10 text-center">
                  <div className="relative">
                    <Activity size={48} className="text-white/20 animate-pulse" />
                    <div className="absolute inset-0 blur-2xl bg-white/5 animate-pulse" />
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.5em] text-white/60">
                      {projectId === 'rides24ofiziala' ? 'Estamos trabajando en la demo todavía' : 'Próximamente'}
                    </span>
                    <div className="w-12 h-px bg-white/10" />
                    <span className="font-mono text-[8px] uppercase tracking-widest text-white/20 max-w-xs leading-relaxed">
                      Este proyecto está siendo auditado para su despliegue final en el entorno de pruebas.
                    </span>
                  </div>
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
        )}

        {/* Scroll Hint */}
        {!disableStudio && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[40] opacity-20">
            <div className="flex flex-col items-center gap-3">
              <p className="font-mono text-[8px] uppercase tracking-[0.5em]">Deep Scroll to Enter</p>
              <div className="w-px h-12 bg-gradient-to-b from-current to-transparent" />
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONTENIDO POR DEBAJO (desliza sobre el hero) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* El contenido que viene después debe tener z-10 para aparecer encima */}
      {/* Esto se maneja en la página parent usando z-[10] */}
    </>
  );
}
