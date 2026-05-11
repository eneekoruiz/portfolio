'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Server, MonitorSmartphone, Cpu, Database, Code } from 'lucide-react';
import { useTheme } from 'next-themes';
import { LANG_COLORS, SKILLS } from '../../lib/constants';
import type { Tx } from '../../types';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── EL CARRUSEL 3D (COMPACTO) ──
function TextPillCylinder({ techs, cardColor }: { techs: string[], cardColor: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const angleRef = useRef(Math.random() * Math.PI); 
  const animRef = useRef<number>();
  
  const N = techs.length;
  const angleStep = (2 * Math.PI) / N;
  const radius = Math.max(100, N * 18); 

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll<HTMLDivElement>('.mini-cyl-item');
    if (!items) return;

    let isVisible = false;

    const animate = () => {
      if (!paused && isVisible) angleRef.current += 0.004; 
      const a = angleRef.current;
      
      if (isVisible) {
        items.forEach((el: HTMLDivElement, i: number) => {
          const theta = i * angleStep + a;
          const x = Math.sin(theta) * radius;
          const z = Math.cos(theta) * radius;
          
          const scale = 0.5 + ((z + radius) / (2 * radius)) * 0.5;
          const opacity = 0.25 + ((z + radius) / (2 * radius)) * 0.75;
          
          el.style.transform = `translate(-50%, -50%) translateX(${x.toFixed(1)}px) translateZ(${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
          el.style.opacity = String(opacity.toFixed(3));
          el.style.zIndex = String(Math.round(z + radius));
        });
      }
      animRef.current = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    animate();
    return () => { 
      if (animRef.current) cancelAnimationFrame(animRef.current); 
      observer.disconnect();
    };
  }, [paused, N, radius, angleStep]);

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[32px] pt-12" 
      style={{ perspective: '1000px' }}
      aria-hidden="true"
    >
      <div ref={containerRef} className="relative" style={{ width: 0, height: 0, transformStyle: 'preserve-3d', transform: 'rotateX(-6deg)' }}>
        {techs.map((tech) => {
          // Unified monochromatic approach: use cardColor for all pills in this category
          const techColor = cardColor; 

          return (
            <div
              key={tech}
              className="mini-cyl-item absolute pointer-events-auto cursor-default"
              style={{ left: 0, top: 0, transformStyle: 'preserve-3d' }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div 
                className="flex items-center gap-2.5 px-4 py-2 rounded-2xl border-2 transition-all hover:scale-110 bg-white/5 dark:bg-black/40 backdrop-blur-md shadow-xl"
                style={{ borderColor: `${techColor}30` }}
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full shadow-lg shrink-0" 
                  style={{ background: techColor, boxShadow: `0 0 8px ${techColor}80` }} 
                />
                <span className="text-[11px] font-black text-ink uppercase tracking-wider">
                  {tech}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── DATOS DE LAS TARJETAS ──
const ICONS = [Server, MonitorSmartphone, Cpu, Database];

interface SkillsProps { t: Tx; }

export function Skills({ t }: SkillsProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    // Creamos un MatchMedia de GSAP para animaciones responsivas
    let mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      
      // 1. Animación del Título (Igual para todos)
      gsap.fromTo('.skills-header',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.58, ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 75%', once: true } }
      );

      // ── ESCRITORIO (Desktop / Tablet) >= 768px ──
      mm.add("(min-width: 768px)", () => {
        // La animación de la Semilla (Explosión desde el centro)
        gsap.fromTo('.skill-card-wrapper',
          { 
            scale: 0.2, 
            opacity: 0, 
            x: (i: number) => (i % 2 === 0 ? 150 : -150),
            y: (i: number) => (i < 2 ? 150 : -150),
          },
          { 
            scale: 1, 
            opacity: 1, 
            x: 0, 
            y: 0, 
            duration: 0.72, 
            stagger: 0.05, 
            ease: 'back.out(1.2)', 
            scrollTrigger: { trigger: '.skill-cards-grid', start: 'top 80%', once: true } 
          }
        );
      });

      // ── MÓVIL (Mobile) < 768px ──
      mm.add("(max-width: 767px)", () => {
        // En móvil hacemos una "Cascada Vertical" (Fade Up) muy elegante
        // Es mucho más natural al hacer scroll en vertical y no sobrecarga el procesador
        gsap.fromTo('.skill-card-wrapper',
          { 
            scale: 0.9, 
            opacity: 0, 
            y: 60 
          },
          { 
            scale: 1, 
            opacity: 1, 
            y: 0, 
            duration: 0.46, 
            stagger: 0.08,
            ease: 'power3.out', 
            scrollTrigger: { trigger: '.skill-cards-grid', start: 'top 85%', once: true } 
          }
        );
      });

    });
    
    // Limpieza al desmontar
    return () => {
      ctx.revert();
      mm.revert();
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="skills" data-section="skills" aria-label="Habilidades" className="py-24 relative z-[20] border-t border-black/5 dark:border-white/10">
      <div className="px-8 max-w-[1200px] mx-auto">

      {/* HEADER COMPACTO CON MÁS COLOR */}
      <div className="skills-header text-center mb-12 space-y-4 opacity-0">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 dark:bg-brand/20 border border-brand/20 dark:border-brand/30">
           <Code size={14} className="text-brand" />
           <span className="text-[10px] font-black tracking-[0.25em] uppercase text-brand">
             {t.skLb || 'TECH STACK'}
           </span>
        </div>
        <h2 className="font-black text-[clamp(2.2rem,6vw,4.5rem)] tracking-tighter leading-none text-ink">
          {t.skH || 'Tecnologías que domino.'}
        </h2>
      </div>

      {/* ── GRID DE TARJETAS (Vivid Mode) ── */}
      <div className="skill-cards-grid grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-20" role="list">
        {SKILLS.map((card, i) => {
          const Icon = ICONS[i] || Code;
          const vibrantColor = card.c; // Using 'c' from constants.ts (the brand color)
          
          return (
            <div key={card.g} className="skill-card-wrapper opacity-0" role="listitem">
                <div 
                  className="relative h-[240px] p-8 rounded-[32px] border transition-all duration-500 overflow-hidden group backdrop-blur-[16px] bg-white/5 dark:bg-white/[0.01] shadow-2xl hover:shadow-[0_20px_50px_rgba(var(--card-color-rgb),0.15)] hover:-translate-y-2 skill-card-dynamic"
                  style={{
                    '--card-color': (card.g === 'Frontend' && isDark) ? '#fff' : vibrantColor,
                    '--card-color-rgb': card.rgb,
                  } as React.CSSProperties}
                >
                  {/* Título de la tarjeta con más presencia y COLOR */}
                  <div className="relative z-20 flex items-center gap-5">
                    <div className="w-16 h-14 rounded-2xl flex items-center justify-center border shadow-lg transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_10px_30px_rgba(var(--card-color-rgb),0.4)]"
                      style={{ 
                        background: vibrantColor, 
                        color: '#fff', 
                        borderColor: 'rgba(255,255,255,0.2)',
                        boxShadow: `0 8px 25px rgba(${card.rgb}, 0.3)`
                      }}>
                      <Icon size={28} />
                    </div>
                    <div>
                      <h3 className="font-black text-2xl tracking-tight uppercase leading-none skill-card-title drop-shadow-sm">
                        {t.skCats[i] || card.g}
                      </h3>
                    <div className="h-1.5 w-12 mt-2 rounded-full transition-all duration-500 group-hover:w-20" 
                      style={{ 
                        background: vibrantColor, 
                        boxShadow: `0 0 15px ${vibrantColor}` 
                      }} 
                    />
                  </div>
                </div>

                {/* CARRUSEL 3D DE PÍLDORAS — Enhanced with color boost */}
                <TextPillCylinder techs={Array.from(card.techs)} cardColor={vibrantColor} />

                {/* Brillo ambiental — Más intenso en el hover */}
                <div 
                  className="absolute -bottom-16 -right-16 w-64 h-64 blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none"
                  style={{ background: vibrantColor }}
                />
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}