'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Server, MonitorSmartphone, Cpu, Database, Code } from 'lucide-react';
import { LANG_COLORS } from '../../lib/constants';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── EL CARRUSEL 3D (COMPACTO) ──
function TextPillCylinder({ techs, cardColor }: { techs: string[], cardColor: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const angleRef = useRef(Math.random() * Math.PI); 
  const animRef = useRef<number>();
  
  const N = techs.length;
  const angleStep = (2 * Math.PI) / N;
  // Radio ajustado para tarjetas más bajitas
  const radius = Math.max(90, N * 16); 

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll<HTMLDivElement>('.mini-cyl-item');
    if (!items) return;

    const animate = () => {
      if (!paused) angleRef.current += 0.004; 
      const a = angleRef.current;
      
      items.forEach((el, i) => {
        const theta = i * angleStep + a;
        const x = Math.sin(theta) * radius;
        const z = Math.cos(theta) * radius;
        
        const scale = 0.5 + ((z + radius) / (2 * radius)) * 0.5;
        const opacity = 0.2 + ((z + radius) / (2 * radius)) * 0.8;
        
        el.style.transform = `translate(-50%, -50%) translateX(${x.toFixed(1)}px) translateZ(${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        el.style.opacity = String(opacity.toFixed(3));
        el.style.zIndex = String(Math.round(z + radius));
      });
      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [paused, N, radius, angleStep]);

  return (
    // pt-10 para bajarlo un poco respecto al título de la tarjeta
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[28px] pt-10" 
      style={{ perspective: '800px' }}
    >
      {/* rotateX(-5deg) para que no necesite tanta altura vertical */}
      <div ref={containerRef} className="relative" style={{ width: 0, height: 0, transformStyle: 'preserve-3d', transform: 'rotateX(-5deg)' }}>
        {techs.map((tech) => {
          const techColor = LANG_COLORS[tech] || cardColor;

          return (
            <div
              key={tech}
              className="mini-cyl-item absolute will-change-transform pointer-events-auto cursor-default"
              style={{ left: 0, top: 0, transformStyle: 'preserve-3d' }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Píldora ligeramente más pequeña para el nuevo tamaño */}
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all hover:scale-110 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md shadow-md"
                style={{ borderColor: `${techColor}30` }}
              >
                <span 
                  className="w-2 h-2 rounded-full shadow-sm" 
                  style={{ background: techColor, boxShadow: `0 0 6px ${techColor}80` }} 
                />
                <span className="text-[10px] font-black text-ink uppercase tracking-wider">
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
const SKILL_CARDS = [
  { h: 'Backend',    ts: ['Python', 'Java', 'C/C++', 'Node.js', 'Express', 'Spring', 'Rust'],    color: '#0066cc' },
  { h: 'Frontend',   ts: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'React', 'Next.js'],       color: '#34a853' },
  { h: 'Sistemas',   ts: ['Linux', 'Docker', 'Git', 'Bash', 'SSH', 'CI/CD'],                      color: '#ff9500' },
  { h: 'DB & Cloud', ts: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Prisma', 'Firebase'],        color: '#af52de' },
];

const ICONS = [Server, MonitorSmartphone, Cpu, Database];

interface SkillsProps { t: any; }

export function Skills({ t }: SkillsProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    // Creamos un MatchMedia de GSAP para animaciones responsivas
    let mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      
      // 1. Animación del Título (Igual para todos)
      gsap.fromTo('.skills-header',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 75%', once: true } }
      );

      // ── ESCRITORIO (Desktop / Tablet) >= 768px ──
      mm.add("(min-width: 768px)", () => {
        // La animación de la Semilla (Explosión desde el centro)
        gsap.fromTo('.skill-card-wrapper',
          { 
            scale: 0.2, 
            opacity: 0, 
            x: (i) => (i % 2 === 0 ? 150 : -150),
            y: (i) => (i < 2 ? 150 : -150),
          },
          { 
            scale: 1, 
            opacity: 1, 
            x: 0, 
            y: 0, 
            duration: 1.2, 
            stagger: 0.1, 
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
            duration: 0.8, 
            stagger: 0.15, // Aparecen una tras otra
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
    // Reducido de py-24 a py-12
    <section ref={containerRef} id="skills" data-section="skills" className="py-12 px-8 max-w-[1200px] mx-auto relative z-10 border-t border-black/5 dark:border-white/5">

      {/* HEADER COMPACTO */}
      <div className="skills-header text-center mb-10 space-y-3 opacity-0">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
           <Code size={12} className="opacity-50" />
           <span className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-70">
             {t.skLb || 'TECH STACK'}
           </span>
        </div>
        <h2 className="font-black text-[clamp(2rem,5vw,4rem)] tracking-tighter leading-none text-ink">
          {t.skH || 'Tecnologías que domino.'}
        </h2>
      </div>

      {/* ── GRID DE TARJETAS (Efecto Semilla) ── */}
      <div className="skill-cards-grid grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-20">
        {SKILL_CARDS.map((card, i) => {
          const Icon = ICONS[i];
          return (
            <div key={card.h} className="skill-card-wrapper opacity-0">
              {/* TARJETA CHATA: h-[200px] y p-6 */}
              <div 
                className="relative h-[200px] p-6 rounded-[28px] border shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden group backdrop-blur-xl"
                style={{
                  backgroundColor: `${card.color}0A`, 
                  borderColor: `${card.color}25`,     
                }}
              >
                {/* Título de la tarjeta */}
                <div className="relative z-20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm transition-transform duration-500 group-hover:scale-110"
                    style={{ background: `${card.color}15`, color: card.color, borderColor: `${card.color}30` }}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-black text-xl tracking-tight text-ink uppercase">{card.h}</h3>
                </div>

                {/* CARRUSEL 3D DE PÍLDORAS */}
                <TextPillCylinder techs={card.ts} cardColor={card.color} />

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}