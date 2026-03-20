'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NetworkParticles } from '../ui/Particles'; 
import type { Tx } from '../../lib/types';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export function About({ t }: { t: Tx }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Usamos fromTo para garantizar que el estado final siempre sea opacity: 1
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-reveal', 
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      data-section="about"
      // print:py-10 y print:block arreglan el espaciado al generar el PDF
      className="relative py-28 px-6 md:px-8 max-w-[1200px] mx-auto overflow-hidden bg-white/50 dark:bg-transparent print:py-10 print:bg-white print:text-black"
    >
      {/* Las partículas (se ocultan solas en el PDF gracias a print:hidden en el componente) */}
      <NetworkParticles />

      <div className="relative z-10 pointer-events-none print:pointer-events-auto">
        
        <div className="about-reveal print:opacity-100 print:transform-none">
          <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-brand mb-4 print:text-black">
            {t.abLb}
          </p>
          <h2 className="font-black text-[clamp(2.5rem,6vw,4.5rem)] tracking-[-2px] leading-[0.95] text-ink mb-8 max-w-4xl print:text-black">
            {t.abH}
          </h2>
        </div>
        
        <hr className="about-reveal border-none h-px bg-black/10 dark:bg-white/10 mb-10 max-w-3xl print:bg-black/20 print:opacity-100 print:transform-none" />

        <div className="about-reveal max-w-3xl mb-16 print:opacity-100 print:transform-none">
          <p className="font-medium text-[clamp(1.1rem,2.2vw,1.6rem)] tracking-[-0.4px] leading-[1.5] text-slate-700 dark:text-slate-300 print:text-black">
            {t.mf}
          </p>
        </div>

        {/* METRICAS - Adaptadas para no romperse en PDF (print:grid-cols-3, print:break-inside-avoid) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pointer-events-auto print:grid-cols-3 print:gap-4">
          {t.metrics.map(([v, l]) => (
            <div
              key={l}
              className="about-reveal group relative p-8 md:p-10 rounded-[24px] border border-black/10 dark:border-white/10 bg-white/90 dark:bg-white/[0.03] backdrop-blur-md shadow-sm hover:border-brand/40 transition-all duration-300 print:opacity-100 print:transform-none print:break-inside-avoid print:shadow-none print:border-black/20 print:bg-transparent"
            >
              <div className="font-black text-4xl md:text-5xl lg:text-6xl tracking-tighter text-ink mb-2 print:text-black">
                {v}
              </div>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 print:text-black/70">
                {l}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}