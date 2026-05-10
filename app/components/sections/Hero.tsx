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

      // --- LÓGICA DE LINTERNA (SPOTLIGHT) & 3D PARALLAX ────────────────────────────
      if (textContainerRef.current) {
        const tRect = textContainerRef.current.getBoundingClientRect();
        const x = e.clientX - tRect.left;
        const y = e.clientY - tRect.top;
        
        // Spotlight
        // Spotlight - Using raw style set for absolute performance
        textContainerRef.current.style.setProperty('--mx', `${x}px`);
        textContainerRef.current.style.setProperty('--my', `${y}px`);

        // 3D Parallax Tilt for the title
        const xPercent = (x / tRect.width - 0.5) * 2;
        const yPercent = (y / tRect.height - 0.5) * 2;
        gsap.to(textContainerRef.current, {
          rotateY: xPercent * 4, // Slightly subtler
          rotateX: -yPercent * 4,
          duration: 0.8,
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
          rotateX: 0,
          rotateY: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.3)'
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
  }, [tilt, isMobile, reduced]);

  return (
    <section id="hero" aria-label="Hero" className="min-h-[100svh] flex flex-col overflow-hidden pt-[80px] relative snap-start">
      
      {/* Memoji + Pill */}
      <div className="memoji hidden lg:flex lg:flex-col items-center justify-start absolute right-0 top-0 w-1/2 h-full pb-20 z-0 pointer-events-none" aria-hidden="true">
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
              {/* Texto Base (Ahora más visible: opacity-60) */}
              <div className="h-ln opacity-60 dark:opacity-50 pointer-events-none">
                <h1 className="font-black text-[clamp(4rem,11vw,11rem)] leading-[.87] tracking-[-4px] text-lead">Eneko</h1>
                <h1 className="font-black text-[clamp(4rem,11vw,11rem)] leading-[.87] tracking-[-4px] text-lead">Ruiz.</h1>
              </div>
              
              {/* Texto Iluminado por la linterna */}
              <div 
                className="absolute top-0 left-0 h-ln pointer-events-none w-full h-full drop-shadow-[0_0_20px_rgba(var(--brand-rgb),0.4)]"
                aria-hidden="true"
                style={{
                  backgroundImage: `radial-gradient(circle ${isMobile ? '180px' : '320px'} at var(--mx, -500px) var(--my, -500px), #ffffff 0%, var(--brand) 45%, transparent 75%)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitTextFillColor: 'transparent',
                  filter: 'brightness(1.15) contrast(1.1)',
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
            
            {/* BOTÓN IZQUIERDO (CON ESCUDO) */}
            <div ref={leftBtnRef} className="flex">
              <WorkScrollBtn label={t.ctaWork} />
            </div>
            
            {/* BOTÓN CONTACTAR (MAGNÉTICO) */}
            <div ref={contactBtnRef} className="relative group z-10 flex">
              <div className="absolute inset-0 bg-ink rounded-full blur-xl opacity-20 group-hover:opacity-40 animate-pulse pointer-events-none transition-opacity duration-500" />
              <a
                href="#contact"
                aria-label={t.ctaContact}
                className="relative flex items-center justify-center gap-2 px-[1.85rem] py-[.85rem] rounded-full bg-ink text-white font-bold text-[14px] tracking-[-0.2px] no-underline transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] shadow-[0_8px_28px_rgba(0,0,0,0.2)]"
              >
                <span>{t.ctaContact}</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            {/* BOTÓN DERECHO (CON ESCUDO) */}
            <div ref={rightBtnRef} className="flex">
              <BinaryStreamBtn label={t.ctaCv} variant="light" />
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