'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

import { LiveStatus } from '../ui/LiveStatus';
import { WorkScrollBtn, BinaryStreamBtn } from '../ui/Buttons';
import type { Tx } from '../../lib/types';

interface HeroProps {
  t: Tx;
  greeting: string;
  reduced: boolean;
  setMag: (el: HTMLElement | null) => void;
}

export function Hero({ t, greeting, reduced, setMag }: HeroProps) {
  const contactBtnRef = useRef<HTMLDivElement>(null);
  const leftBtnRef = useRef<HTMLDivElement>(null);
  const rightBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const btn = contactBtnRef.current;
    const hero = document.getElementById('hero');
    if (!btn || !hero) return;

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;

      const distX = e.clientX - btnX;
      const distY = e.clientY - btnY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      // --- LÓGICA DE ESCUDO (RELEASE) ---
      let isNearOtherBtn = false;
      const neighbors = [leftBtnRef.current, rightBtnRef.current];
      
      neighbors.forEach(neighbor => {
        if (!neighbor) return;
        const nRect = neighbor.getBoundingClientRect();
        const nX = nRect.left + nRect.width / 2;
        const nY = nRect.top + nRect.height / 2;
        const distToNeighbor = Math.sqrt(Math.pow(e.clientX - nX, 2) + Math.pow(e.clientY - nY, 2));
        
        // Si el ratón está a menos de 180px de Proyectos o CV, soltamos el imán
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
          overwrite: true // Evita conflictos con animaciones anteriores
        });
      } else {
        // Retorno elástico cuando se suelta o entra en zona de escudo
        gsap.to(btn, { 
          x: 0, 
          y: 0, 
          duration: 0.7, 
          ease: 'elastic.out(1, 0.4)',
          overwrite: true 
        });
      }
    };

    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    };

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);

    return () => {
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced]);

  return (
    <section id="hero" className="min-h-[100svh] flex flex-col overflow-hidden pt-[80px] relative snap-start">
      
      {/* Memoji + Pill */}
      <div className="memoji hidden lg:flex lg:flex-col items-center justify-start absolute right-0 top-0 w-1/2 h-full pb-20 z-0 pointer-events-none">
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
          
          <div className="mb-5">
            <p className="h-ln text-[clamp(1.1rem,2.2vw,1.65rem)] font-medium text-lead">{greeting}</p>
            <h1 className="h-ln font-black text-[clamp(4rem,11vw,11rem)] leading-[.87] tracking-[-4px] text-ink">Eneko</h1>
            <h1 className="h-ln font-black text-[clamp(4rem,11vw,11rem)] leading-[.87] tracking-[-4px] text-ink">Ruiz.</h1>
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
            <div className="relative group z-10" ref={contactBtnRef}>
              <div className="absolute inset-0 bg-brand rounded-full blur opacity-40 group-hover:opacity-60 animate-pulse pointer-events-none" />
              <a
                href="#contact"
                className="relative flex items-center justify-center gap-1.5 px-8 py-3.5 rounded-full bg-brand text-white font-bold text-[14px] no-underline transition-transform hover:scale-105"
              >
                <span>{t.ctaContact}</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
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

      {/* Scroll Hint */}
      <div className="h-fd border-t border-black/7 dark:border-white/10 py-4 px-8 text-[10px] font-bold tracking-widest uppercase text-lead/30 flex items-center gap-2 max-w-[1200px] mx-auto w-full">
        {t.scroll}
        <svg width="18" height="5" viewBox="0 0 18 5" fill="none"><path d="M0 2.5h16M12.5 1l4 1.5-4 1.5" stroke="currentColor" strokeWidth=".8" /></svg>
      </div>
    </section>
  );
}