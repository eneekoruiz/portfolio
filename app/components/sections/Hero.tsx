'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useDeviceTilt } from '../../hooks/useDeviceTilt';


import { LiveStatus } from '../ui/LiveStatus';
import { WorkScrollBtn, BinaryStreamBtn } from '../ui/Buttons';
import type { Tx } from '../../types';

interface HeroProps {
  t: Tx;
  greeting: string;
  reduced: boolean;
  setMag: (el: HTMLElement | null) => void;
  phase: string;
}

export function Hero({ t, greeting, reduced, setMag, phase }: HeroProps) {
  const contactBtnRef = useRef<HTMLDivElement>(null);
  const leftBtnRef = useRef<HTMLDivElement>(null);
  const rightBtnRef = useRef<HTMLDivElement>(null);

  const textContainerRef = useRef<HTMLDivElement>(null);
  const memojiRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const tilt = useDeviceTilt();
  const hasRequestedPermission = useRef(false);
  const touchStartPos = useRef({ x: 0, y: 0 });

  // ── Solicitar permiso de giroscopio (iOS 13+) ──────────────────────

  useEffect(() => {
    if (reduced) return;
    
    // Detectar si es dispositivo móvil
    const checkMobile = () => {
      const isTouchDevice = () => {
        return (
          (typeof window !== 'undefined' && ('ontouchstart' in window)) ||
          (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)
        );
      };
      setIsMobile(isTouchDevice());
    };

    checkMobile();

    const btn = contactBtnRef.current;
    const hero = document.getElementById('hero');
    if (!btn || !hero) return;

    // ── MODO DESKTOP: Mouse ────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      if (isMobile || reduced) return; 
      
      const rect = btn.getBoundingClientRect();
      const currentX = (gsap.getProperty(btn, 'x') as number) || 0;
      const currentY = (gsap.getProperty(btn, 'y') as number) || 0;

      const btnX = (rect.left - currentX) + rect.width / 2;
      const btnY = (rect.top - currentY) + rect.height / 2;

      const distX = e.clientX - btnX;
      const distY = e.clientY - btnY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      // --- LÓGICA DE ESCUDO (RELEASE) ---
      let isNearOtherBtn = false;
      const neighbors = [leftBtnRef.current, rightBtnRef.current];
      
      neighbors.forEach(neighbor => {
        if (!neighbor) return;
        const nRect = neighbor.getBoundingClientRect();
        const nCurrentX = (gsap.getProperty(neighbor, 'x') as number) || 0;
        const nCurrentY = (gsap.getProperty(neighbor, 'y') as number) || 0;
        const nX = (nRect.left - nCurrentX) + nRect.width / 2;
        const nY = (nRect.top - nCurrentY) + nRect.height / 2;
        const distToNeighbor = Math.sqrt(Math.pow(e.clientX - nX, 2) + Math.pow(e.clientY - nY, 2));
        
        if (distToNeighbor < 180) isNearOtherBtn = true;
      });

      const magnetRange = 450;

      if (distance < magnetRange && !isNearOtherBtn) {
        const force = (magnetRange - distance) / magnetRange;
        gsap.to(btn, {
          x: distX * 0.6 * force,
          y: distY * 0.6 * force,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: true
        });
      } else {
        gsap.to(btn, { 
          x: 0, 
          y: 0, 
          duration: 0.7, 
          ease: 'elastic.out(1, 0.4)',
          overwrite: true 
        });
      }

      // --- LÓGICA DE LINTERNA (SPOTLIGHT) & SNAPPING ────────────────────────────
      if (textContainerRef.current) {
        const tRect = textContainerRef.current.getBoundingClientRect();
        
        // Find if we should snap to any button
        let snapX: number | null = null;
        let snapY: number | null = null;
        const snapRange = 160;
        const ctas = [leftBtnRef.current, contactBtnRef.current, rightBtnRef.current];
        
        ctas.forEach(cta => {
          if (!cta) return;
          const cRect = cta.getBoundingClientRect();
          const cx = cRect.left + cRect.width / 2;
          const cy = cRect.top + cRect.height / 2;
          const distToCta = Math.sqrt(Math.pow(e.clientX - cx, 2) + Math.pow(e.clientY - cy, 2));
          
          if (distToCta < snapRange) {
            snapX = cx - tRect.left;
            snapY = cy - tRect.top;
          }
        });

        const targetX = snapX !== null ? snapX : (e.clientX - tRect.left);
        const targetY = snapY !== null ? snapY : (e.clientY - tRect.top);
        const targetSize = snapX !== null ? (isMobile ? '350px' : '650px') : (isMobile ? '220px' : '400px');
        
        // Spotlight Smooth Follow
        gsap.to(textContainerRef.current, {
          '--mx': `${targetX}px`,
          '--my': `${targetY}px`,
          '--msize': targetSize,
          duration: snapX !== null ? 0.4 : 0.1,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        // 3D Parallax Tilt
        const xPercent = ((e.clientX - tRect.left) / tRect.width - 0.5) * 2;
        const yPercent = ((e.clientY - tRect.top) / tRect.height - 0.5) * 2;
        gsap.to(textContainerRef.current, {
          rotateY: xPercent * 4,
          rotateX: -yPercent * 4,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }

      if (memojiRef.current) {
        const mRect = memojiRef.current.getBoundingClientRect();
        const mx = e.clientX - mRect.left;
        const my = e.clientY - mRect.top;
        const mxPercent = (mx / mRect.width - 0.5) * 2;
        const myPercent = (my / mRect.height - 0.5) * 2;

        gsap.to(memojiRef.current, {
          x: mxPercent * 15,
          y: myPercent * 10,
          rotateY: mxPercent * 5,
          rotateX: -myPercent * 3,
          duration: 1.2,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    const setupTouchFallback = () => {
      // Disabled: replaced by autonomous animation on mobile to prevent scroll collapse
      return () => {};
    };

    const onLeave = () => {
      if (isMobile) return;
      gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
      
      if (textContainerRef.current) {
        gsap.to(textContainerRef.current, {
          '--mx': `-500px`,
          '--my': `-500px`,
          '--msize': `0px`,
          rotateX: 0,
          rotateY: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.3)'
        });
      }

      if (memojiRef.current) {
        gsap.to(memojiRef.current, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 1.5,
          ease: 'power2.out'
        });
      }
    };

    // Setup según dispositivo
    if (!isMobile) {
      hero.addEventListener('mousemove', onMove);
      hero.addEventListener('mouseleave', onLeave);
    } else {
      setupTouchFallback();
    }

    // ── Animación inicial: barrido de la linterna ───────────────────
    if (phase === 'ready' && textContainerRef.current && !isMobile && !reduced) {
      const tl = gsap.timeline({
        onComplete: () => {
          // Asegurarse de que el hover tome el control total después de la animación
          gsap.set(textContainerRef.current, { clearProps: 'all' });
        }
      });

      tl.fromTo(textContainerRef.current,
        { '--mx': '-200px', '--my': '100px', rotateX: 5, rotateY: -10 },
        { 
          '--mx': '1200px', 
          '--my': '150px', 
          rotateX: 0,
          rotateY: 0,
          duration: 2.2, 
          ease: 'power3.inOut', 
          delay: 0.4
        }
      );
    }

    // ── MODO MÓVIL: Animación Autónoma ───────────────────────────
    let mobileAnim: gsap.core.Timeline | null = null;
    if (isMobile && textContainerRef.current && !reduced) {
      const tRect = textContainerRef.current.getBoundingClientRect();
      mobileAnim = gsap.timeline({ repeat: -1, yoyo: true });
      mobileAnim.to(textContainerRef.current, {
        '--mx': `${tRect.width * 0.8}px`,
        '--my': `${tRect.height * 0.2}px`,
        rotateX: 2,
        rotateY: -3,
        duration: 4,
        ease: 'sine.inOut'
      }).to(textContainerRef.current, {
        '--mx': `${tRect.width * 0.2}px`,
        '--my': `${tRect.height * 0.8}px`,
        rotateX: -2,
        rotateY: 3,
        duration: 4,
        ease: 'sine.inOut'
      });
    }

    const touchCleanup = setupTouchFallback();
    return () => {
      if (!isMobile) {
        hero.removeEventListener('mousemove', onMove);
        hero.removeEventListener('mouseleave', onLeave);
      }
      mobileAnim?.kill();
      touchCleanup();
    };
  }, [reduced, isMobile, phase]);

  // ── MODO MÓVIL: Giroscopio (vía hook) ────────────────────────
  useEffect(() => {
    // Only apply tilt to parallax if NOT mobile or if mobile-tilt is preferred
    // For now, we disable tilt-to-spotlight on mobile to prevent scroll issues
    if (!isMobile || !textContainerRef.current || reduced) return;
    
    // We only use tilt for a VERY subtle parallax, not the light source
    gsap.to(textContainerRef.current, {
      rotateY: tilt.x * 5, 
      rotateX: -tilt.y * 5,
      duration: 1.2, 
      ease: 'power2.out',
      overwrite: 'auto'
    });

    if (memojiRef.current) {
      gsap.to(memojiRef.current, {
        rotateY: tilt.x * 8,
        rotateX: -tilt.y * 4,
        x: tilt.x * 10,
        y: tilt.y * 5,
        duration: 1.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  }, [tilt, isMobile, reduced]);

  return (
    <section id="hero" aria-label="Hero" className="min-h-[100svh] flex flex-col overflow-hidden pt-[80px] relative snap-start">
      
      {/* Memoji + Pill */}
      <div ref={memojiRef} className="memoji hidden lg:flex lg:flex-col items-center justify-start absolute right-0 top-0 w-1/2 h-full pb-20 z-0 pointer-events-none" aria-hidden="true">
        <div className="flex flex-col items-center w-full max-w-[500px] mt-[110px] h-full">
          <div className="mb-6 z-10 pointer-events-auto h-fd shrink-0">
            <LiveStatus label={t.status} />
          </div>
          <video 
            src="/memoji.webm" 
            autoPlay loop muted playsInline 
            className="w-full flex-1 min-h-0 object-contain object-top overflow-hidden" 
          />
        </div>
      </div>

      {/* Hero Content */}
      <div className="h-txt flex-1 flex flex-col justify-center max-w-[1200px] mx-auto w-full px-8 py-8 relative z-[1]">
        <div className="max-w-full lg:max-w-[54%]">
          
          <div className="mb-5 overflow-hidden pb-2" ref={textContainerRef}>
            <p className="h-ln text-[clamp(1.1rem,2.2vw,1.65rem)] font-medium text-lead mb-1">{greeting}</p>
            
            <div className="relative">
              {/* Texto Base — Enhanced visibility to avoid "broken" look */}
              <div className="h-ln opacity-[0.8] dark:opacity-[0.6] pointer-events-none transition-opacity duration-500">
                <h1 className="font-black text-[clamp(4rem,11vw,11rem)] leading-[.87] tracking-[-4px] text-lead">Eneko</h1>
                <h1 className="font-black text-[clamp(4rem,11vw,11rem)] leading-[.87] tracking-[-4px] text-lead">Ruiz.</h1>
              </div>
              
              {/* Texto Iluminado por la linterna — Refined gradient for smoother transition */}
              <div 
                className="absolute top-0 left-0 h-ln pointer-events-none w-full h-full select-none"
                aria-hidden="true"
                style={{
                  backgroundImage: `radial-gradient(circle var(--msize, ${isMobile ? '220px' : '400px'}) at var(--mx, -1000px) var(--my, -1000px), #ffffff 0%, var(--brand) 30%, transparent 70%)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <h1 className="font-black text-[clamp(4rem,11vw,11rem)] leading-[.87] tracking-[-4px]">Eneko</h1>
                <h1 className="font-black text-[clamp(4rem,11vw,11rem)] leading-[.87] tracking-[-4px]">Ruiz.</h1>
              </div>
            </div>
          </div>

          <p className="h-fd text-[clamp(1rem,2vw,1.4rem)] font-bold text-lead mb-2">{t.role}</p>
          <p className="h-fd text-[14px] text-lead max-w-[380px] mb-8">{t.tagline}</p>

          {/* CTAs */}
          <div className="h-fd flex flex-wrap items-center gap-3 mt-4">
            
            {/* BOTÓN IZQUIERDO (CON ESCUDO) - SECONDARY ACTION (WHITE/BLACK) */}
            <div ref={leftBtnRef} className="flex">
              <WorkScrollBtn label={t.ctaWork} />
            </div>
            
            {/* BOTÓN CONTACTAR (MAGNÉTICO) - PRIMARY ACTION (BLUE) */}
            <div ref={contactBtnRef} className="relative group z-10 flex">
              <div className="absolute inset-0 bg-brand rounded-full blur-xl opacity-20 group-hover:opacity-40 animate-pulse pointer-events-none transition-opacity duration-500" />
              <a
                href="#contact"
                aria-label={t.ctaContact}
                className="relative flex items-center justify-center gap-2 px-[1.85rem] py-[.85rem] rounded-full bg-brand text-white font-bold text-[14px] tracking-[-0.2px] no-underline transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_12px_40px_rgba(0,102,255,0.3)] shadow-[0_8px_28px_rgba(0,102,255,0.2)]"
              >
                <span>{t.ctaContact}</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            {/* BOTÓN DERECHO (CON ESCUDO) - SECONDARY ACTION (WHITE/BLACK) */}
            <div ref={rightBtnRef} className="flex">
              <BinaryStreamBtn label={t.ctaCv} variant="dark" />
            </div>
            
          </div>
        </div>
      </div>

      {/* Scroll Hint (CON CLASE no-print AÑADIDA) */}
      <div className="h-fd border-t border-black/7 dark:border-white/10 py-4 px-8 text-[10px] font-bold tracking-widest uppercase text-lead/30 flex items-center gap-2 max-w-[1200px] mx-auto w-full no-print">
        <div className="animate-bounce flex items-center gap-2">
          {t.scroll}
          <svg width="18" height="5" viewBox="0 0 18 5" fill="none"><path d="M0 2.5h16M12.5 1l4 1.5-4 1.5" stroke="currentColor" strokeWidth=".8" /></svg>
        </div>
      </div>
    </section>
  );
}