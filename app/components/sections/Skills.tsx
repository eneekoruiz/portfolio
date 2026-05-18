'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Server, MonitorSmartphone, Cpu, Database, Code, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { LANG_COLORS, SKILLS } from '../../lib/constants';
import type { Tx } from '../../types';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── EL CARRUSEL 3D (COMPACTO) ──
function TextPillCylinder({ techs, cardColor, isDark }: { techs: string[], cardColor: string, isDark: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const angleRef = useRef(0); // Stable initial value for hydration (Error #418)
  const animRef = useRef<number>(undefined);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startAngle = useRef(0);
  
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
      
      // We always run the positioning loop even if isVisible is briefly false during first frame
      // to ensure they are never clumped in the center.
      items.forEach((el: HTMLDivElement, i: number) => {
        const theta = i * angleStep + a;
        const x = Math.sin(theta) * radius;
        const z = Math.cos(theta) * radius;
        
        const scale = 0.5 + ((z + radius) / (2 * radius)) * 0.5;
        const opacity = 0.25 + ((z + radius) / (2 * radius)) * 0.75;
        
        el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        el.style.opacity = String(opacity.toFixed(3));
        el.style.zIndex = String(Math.round(z + radius));
      });

      if (isVisible) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        // Stop loop if not visible, but keep requestAnimationFrame available for next check
        animRef.current = requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.01 } // Lower threshold for faster activation
    );

    if (containerRef.current) observer.observe(containerRef.current);

    const handleWheel = (e: WheelEvent) => {
      // Sensitivity factor
      angleRef.current += e.deltaY * 0.001;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      startX.current = e.clientX;
      startAngle.current = angleRef.current;
      setPaused(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - startX.current;
      // Map drag distance to angle
      angleRef.current = startAngle.current + dx * 0.01;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      setPaused(false);
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      startX.current = e.touches[0].clientX;
      startAngle.current = angleRef.current;
      setPaused(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - startX.current;
      angleRef.current = startAngle.current + dx * 0.01;
    };

    const el = containerRef.current?.parentElement;
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: true });
      el.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      el.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleMouseUp);
    }

    animate();
    return () => { 
      if (animRef.current) cancelAnimationFrame(animRef.current); 
      observer.disconnect();
      if (el) {
        el.removeEventListener('wheel', handleWheel);
        el.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        el.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleMouseUp);
      }
    };
  }, [paused, N, radius, angleStep]);

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-auto overflow-hidden rounded-[32px] pt-12 cursor-grab active:cursor-grabbing" 
      style={{ perspective: '1000px' }}
      aria-hidden="true"
    >
      <div ref={containerRef} className="relative" style={{ width: 0, height: 0, transformStyle: 'preserve-3d', transform: 'rotateX(-6deg)' }}>
        {techs.map((tech, i) => {
          // Restore individual tech colors from constants for maximum vibrancy
          const techColor = cardColor; 
          const initialTheta = i * angleStep + angleRef.current;
          const ix = Math.sin(initialTheta) * radius;
          const iz = Math.cos(initialTheta) * radius;

          return (
            <div
              key={tech}
              className="mini-cyl-item absolute pointer-events-auto cursor-default will-change-transform"
              style={{ 
                left: 0, 
                top: 0, 
                transformStyle: 'preserve-3d',
                transform: `translate(-50%, -50%) translate3d(${ix.toFixed(1)}px, 0, ${iz.toFixed(1)}px) scale(0.8)`,
                opacity: 0 // Start hidden but positioned to avoid flash-clump
              }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div 
                className="flex items-center gap-2.5 px-4 py-2 rounded-2xl border-2 transition-all hover:scale-110 backdrop-blur-md shadow-2xl"
                style={{ 
                  borderColor: `${techColor}B0`, // even more opaque border
                  background: isDark ? `${techColor}40` : `${techColor}25`, // higher opacity background
                  boxShadow: `0 10px 40px -10px ${techColor}60`
                }}
              >
                <span 
                  className="w-3.5 h-3.5 rounded-full shadow-lg shrink-0" 
                  style={{ background: techColor, boxShadow: `0 0 18px ${techColor}` }} 
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
const ICONS = [Server, MonitorSmartphone, Cpu, Database, Sparkles];

interface SkillsProps { t: Tx; }

export function Skills({ t }: SkillsProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = mounted && resolvedTheme === 'dark';
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    // Creamos un MatchMedia de GSAP para animaciones responsivas
    let mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      
      // 1. Animación del Título (Igual para todos)
      const titleChars = containerRef.current?.querySelectorAll('.title-char');
      if (titleChars) {
        gsap.fromTo(titleChars,
          { y: '100%', rotateX: -90, opacity: 0 },
          {
            y: 0, rotateX: 0, opacity: 1,
            duration: 1.2,
            stagger: 0.02,
            ease: 'expo.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
          }
        );
      }

      if (document.querySelector('.skills-header-label')) {
        gsap.fromTo('.skills-header-label',
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.58, ease: 'power3.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 75%', once: true } }
        );
      }

      // ── ESCRITORIO (Desktop / Tablet) >= 768px ──
      mm.add("(min-width: 768px)", () => {
        // La animación de la Semilla (Explosión desde el centro)
        if (document.querySelector('.skill-card-wrapper')) {
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
        }
      });

      // ── MÓVIL (Mobile) < 768px ──
      mm.add("(max-width: 767px)", () => {
        // En móvil hacemos una "Cascada Vertical" (Fade Up) muy elegante
        if (document.querySelector('.skill-card-wrapper')) {
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
        }
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
      <div className="skills-header text-center mb-12 space-y-4">
        <div className="skills-header-label inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 dark:bg-brand/20 border border-brand/20 dark:border-brand/30 opacity-0">
           <Code size={14} className="text-brand" />
           <span className="text-[10px] font-black tracking-[0.25em] uppercase text-brand">
             {t.skLb || 'TECH STACK'}
           </span>
        </div>
        <h2 className="font-black text-[clamp(2.2rem,6vw,4.5rem)] tracking-tighter leading-none text-ink perspective-1000">
          {(t.skH || 'Tecnologías que domino.').split(' ').map((word, wIdx, wordsArray) => (
            <span key={wIdx} className="inline-block whitespace-nowrap">
              {word.split('').map((c, cIdx) => (
                <span key={cIdx} className="title-char inline-block">{c}</span>
              ))}
              {wIdx < wordsArray.length - 1 && <span className="title-char inline-block">&nbsp;</span>}
            </span>
          ))}
        </h2>
      </div>

      {/* ── GRID DE TARJETAS (Vivid Mode) ── */}
      <div className="skill-cards-grid grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-20" role="list">
        {SKILLS.map((card, i) => {
          const Icon = ICONS[i] || Code;
          const vibrantColor = card.c; // Using 'c' from constants.ts (the brand color)
          const isLast = i === SKILLS.length - 1 && SKILLS.length % 2 !== 0;
          
          return (
            <div 
              key={card.g} 
              className={`skill-card-wrapper opacity-0 ${isLast ? 'md:col-span-2 flex justify-center' : ''}`} 
              role="listitem"
            >
                <div 
                  className={`relative h-[240px] p-8 rounded-[32px] border transition-all duration-500 overflow-hidden group backdrop-blur-[8px] shadow-2xl hover:-translate-y-2 border-beam ${isLast ? 'w-full md:w-[calc(50%-1rem)]' : 'w-full'}`}
                  style={{
                    background: isDark 
                      ? `linear-gradient(145deg, rgba(${card.rgb}, 0.12) 0%, rgba(${card.rgb}, 0.02) 100%)` 
                      : `linear-gradient(145deg, rgba(${card.rgb}, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)`,
                    borderColor: isDark 
                      ? `rgba(${card.rgb}, 0.25)` 
                      : `rgba(${card.rgb}, 0.18)`,
                    boxShadow: `0 20px 50px rgba(${card.rgb}, ${isDark ? '0.25' : '0.15'})`
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
                      <h3 
                        className="font-black text-2xl tracking-tight uppercase leading-none drop-shadow-sm"
                        style={{ color: isDark ? 'white' : vibrantColor }}
                      >
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
                <TextPillCylinder techs={Array.from(card.techs)} cardColor={vibrantColor} isDark={isDark} />

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