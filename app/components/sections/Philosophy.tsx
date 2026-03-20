'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BinaryStreamBtn } from '../ui/Buttons';
import type { Tx, Val } from '../../lib/types';

// Registramos el plugin por si no está a nivel global en este archivo
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Solución al grid: Ahora cada par suma 3
const SPANS = [
  'md:col-span-2',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-1',
] as const;

/* ── Bento card with Senior Glare & Physics ── */
function BentoCard({ val: { icon: Icon, t: title, d }, span, accent, index }: {
  val: Val; span: string; accent: boolean; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 1. Animación de entrada al hacer scroll (Stagger effect)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power3.out', 
          delay: index * 0.1, // Cascada basada en el índice
          scrollTrigger: {
            trigger: el,
            start: 'top 85%', // Se activa cuando asoma por abajo
            once: true
          }
        }
      );
    });

    // 2. Efecto Spotlight (ahora en píxeles para que no se deforme)
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
    };

    // 3. Físicas orgánicas en el Hover
    const onEnter = () => gsap.to(el, { y: -4, scale: 1.01, duration: 0.4, ease: 'back.out(1.5)' });
    const onLeave = () => gsap.to(el, { y: 0, scale: 1, duration: 0.5, ease: 'power3.out' });

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    
    return () => {
      ctx.revert(); // Limpiamos animaciones al desmontar
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [index]);

  return (
    <div
      ref={ref}
      className={`
        ${span}
        relative overflow-hidden group rounded-[20px] p-7 flex flex-col gap-4
        transition-colors duration-500 will-change-transform
        focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none
        backdrop-blur-md shadow-sm hover:shadow-xl
        ${accent 
          ? 'bg-gradient-to-br from-brand/10 via-brand/5 to-transparent dark:from-brand/[0.12] dark:via-brand/[0.06] shadow-brand/5' 
          : 'bg-white/80 dark:bg-[#0A0A0A]/80 hover:dark:bg-[#111111]/90 shadow-black/5'
        }
      `}
      data-h
      tabIndex={0}
    >
      {/* Detalle Senior: Inner Ring (Biselado de cristal) */}
      <div className={`
        absolute inset-0 rounded-[20px] pointer-events-none ring-1 ring-inset
        ${accent 
          ? 'ring-brand/20 dark:ring-brand/30' 
          : 'ring-black/5 dark:ring-white/[0.06] group-hover:dark:ring-white/[0.12] transition-all duration-500'
        }
      `} />

      {/* Glare effect perfeccionado con radial-gradient en px */}
      <div
        className="bento-glare absolute -inset-px rounded-[20px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
        style={{
          background: `radial-gradient(450px circle at var(--mouse-x) var(--mouse-y), ${
            accent ? 'rgba(var(--brand-rgb), 0.12)' : 'rgba(255,255,255,0.06)'
          }, transparent 40%)`,
        }}
      />

      {/* Contenido (Mismos tamaños que pediste) */}
      <div className="flex items-start gap-4 relative z-10">
        <div className={`
          p-2.5 rounded-xl shrink-0 shadow-inner
          ${accent 
            ? 'bg-brand/15 border border-brand/20 dark:bg-brand/20 dark:border-brand/30 text-brand ring-1 ring-inset ring-brand/30' 
            : 'bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-black/5 dark:ring-white/10'
          }
        `}>
          <Icon
            size={18}
            aria-hidden="true"
          />
        </div>
        
        <div className="flex-1 min-w-0 pt-1">
          <h3 className={`font-bold text-base tracking-tight mb-2 ${accent ? 'text-brand dark:text-brand-light' : 'text-slate-900 dark:text-slate-100'}`}>
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {d}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Philosophy({ t }: { t: Tx }) {
  return (
    <section
      id="values"
      data-section="values"
      className="border-t border-black/5 dark:border-white/10 py-24 px-6 md:px-8 max-w-[1200px] mx-auto overflow-hidden"
    >
      <p className="sec-h text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-4">
        {t.valLb}
      </p>
      
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
        <h2 className="sec-h font-black text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none text-slate-900 dark:text-white max-w-2xl drop-shadow-sm">
          {t.valH}
        </h2>
        <div className="shrink-0 mb-1">
          <BinaryStreamBtn label={t.ctaCv} variant="dark" />
        </div>
      </div>

      {/* Grid Bento Mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {t.vals.map((val, i) => (
          <BentoCard
            key={val.t}
            val={val}
            span={SPANS[i] ?? 'md:col-span-1'}
            accent={i === 0 || i === 4} 
            index={i} // Pasamos el índice para la animación en cascada
          />
        ))}
      </div>
    </section>
  );
}