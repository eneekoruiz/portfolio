'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NetworkParticles } from '../ui/Particles'; 
import type { Tx } from '../../lib/types';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export function About({ t }: { t: Tx }) {
  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Entrada de títulos y métricas
      gsap.from('.about-reveal', {
        y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }
      });

      // 2. EFECTO TELÓN (MASKED REVEAL) - La nueva manera
      if (textContainerRef.current) {
        gsap.fromTo('.word-inner',
          { y: '110%', opacity: 0 }, // Empieza escondido hacia abajo
          { 
            y: '0%', 
            opacity: 1,
            duration: 0.5, 
            stagger: 0.02, // Velocidad de la cascada
            ease: 'power3.out',
            scrollTrigger: {
              trigger: textContainerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse' 
            }
          }
        );
      }

    }, sectionRef);
    return () => ctx.revert();
  }, [t.mf]);

  // Función para crear la "máscara" palabra por palabra
  const renderMaskedWords = (text: string) => {
    return text.split(' ').map((word, i) => (
      // Span exterior: crea el "límite" invisible (overflow-hidden)
      <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em] pb-[0.1em]">
        {/* Span interior: es el que realmente se mueve */}
        <span className="word-inner inline-block will-change-transform">
          {word}
        </span>
      </span>
    ));
  };

  return (
    // 📱 DIETA: Padding optimizado para móvil
    <section ref={sectionRef} id="about" className="relative py-24 px-6 md:py-40 md:px-8 max-w-[1200px] mx-auto overflow-hidden">
      
      <NetworkParticles />

      <div className="relative z-10">
        <div className="about-reveal">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-brand mb-4">{t.abLb}</p>
          <h2 className="font-black text-[clamp(2.5rem,6vw,4.5rem)] tracking-tight leading-none mb-8 md:mb-12 text-ink dark:text-white">
            {t.abH}
          </h2>
        </div>
        
        {/* 📱 DIETA: Línea oculta en móvil */}
        <hr className="about-reveal hidden md:block border-none h-px bg-black/10 dark:bg-white/10 mb-12 max-w-3xl" />

        {/* 📱 DIETA: Margen inferior reducido en móvil si no hay tarjetas debajo */}
        <div ref={textContainerRef} className="max-w-4xl mb-0 md:mb-24">
          <p className="font-medium text-[clamp(1.2rem,2.5vw,1.8rem)] leading-[1.4] text-slate-800 dark:text-slate-200">
            {/* Llamamos a la nueva función de palabras */}
            {renderMaskedWords(t.mf)}
          </p>
        </div>

        {/* 🚀 LA CLAVE MÓVIL: hidden por defecto, grid en md */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 about-reveal">
          {t.metrics.map(([v, l]) => (
            <div 
              key={l} 
              className="p-8 md:p-10 rounded-3xl border border-black/5 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl block"
            >
              <div className="font-black text-5xl md:text-6xl tracking-tighter text-ink dark:text-white mb-1">{v}</div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}