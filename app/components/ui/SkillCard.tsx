'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import type { LucideIcon } from 'lucide-react';

interface SkillCardProps {
  g: string;
  I: LucideIcon;
  c: string;
  tint: string;
  border: string;
  techs: readonly string[];
  onEnter?: () => void;
}

export function SkillCard({ g, I: Icon, c, tint, border, techs, onEnter }: SkillCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // ── Físicas 3D Premium (Nivel Apple) ──
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!;
    const r  = el.getBoundingClientRect();
    gsap.to(el, { 
      rotateY: ((e.clientX - r.left) / r.width - .5) * 14, 
      rotateX: ((e.clientY - r.top) / r.height - .5) * -14, 
      duration: .4, ease: 'power3.out', transformPerspective: 800 
    });
  };

  const onLeave = () => {
    gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: .7, ease: 'power3.out' });
  };

  const doubled = [...techs, ...techs, ...techs];

  return (
    <div 
      ref={ref} 
      className={`group relative overflow-hidden bento-glow rounded-[28px] shadow-glass border ${border} bg-gradient-to-br ${tint} to-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-${border.split('-')[1]}/20`} 
      style={{ padding: '2rem', transformStyle: 'preserve-3d' }} 
      onMouseMove={onMove} 
      onMouseLeave={onLeave} 
      onMouseEnter={onEnter} 
    >
      {/* Brillo interno dinámico */}
      <div className="absolute -inset-1 z-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(circle at center, ${c}12 0%, transparent 80%)` }} />

      <div className="relative z-10">
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-2.5 rounded-[14px] shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-inner" style={{ background: `${c}15`, border: `1px solid ${c}30` }}>
            <Icon size={20} style={{ color: c, display: 'block' }} aria-hidden="true" />
          </div>
          <span className="font-black text-[17px] text-ink tracking-[-0.3px]">{g}</span>
        </div>
        
        <div className="overflow-hidden relative rounded-full">
          {/* Difuminados laterales para el efecto carrusel de los tags */}
          <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-r from-page to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-l from-page to-transparent" />
          
          <div className="mq gap-2 py-1">
            {doubled.map((tech, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-black/[0.04] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 text-lead whitespace-nowrap shrink-0 transition-colors duration-300 group-hover:border-black/15 dark:group-hover:border-white/15">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}