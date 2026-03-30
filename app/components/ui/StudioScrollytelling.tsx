'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
  line: { color: 'rgba(var(--brand-rgb), 0.3)', width: 2, curvature: 120 },
  data: { color: 'rgba(var(--brand-rgb), 0.05)', charSize: 10, deconstructTargets: ['.hero-title span', '.sec-h'] },
  tunnel: { scaleStart: 1.1, blurStart: 8, perspective: 1500 }
};

interface StudioScrollytellingProps {
  children: React.ReactNode;
  mainRef: React.RefObject<HTMLDivElement>;
}

export function StudioScrollytelling({ children, mainRef }: StudioScrollytellingProps) {
  const scrollyRef = useRef<HTMLDivElement>(null);
  const lineSvgRef = useRef<SVGSVGElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);
  const matrixContainerRef = useRef<HTMLDivElement>(null);
  
  // 🚀 Escudo contra errores de Hidratación de Next.js
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    if (!mainRef || !mainRef.current || !mounted) return;
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

    const container = mainRef.current;
    const sections = gsap.utils.toArray<HTMLElement>('section', container);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        }
      });

      if (lineSvgRef.current && linePathRef.current) {
        gsap.set(lineSvgRef.current, { height: container.scrollHeight });
        gsap.set(linePathRef.current, { strokeDasharray: container.scrollHeight });
        gsap.set(linePathRef.current, { strokeDashoffset: container.scrollHeight });
        tl.to(linePathRef.current, { strokeDashoffset: 0, ease: 'none' });
      }

      CONFIG.data.deconstructTargets.forEach(target => {
        const els = gsap.utils.toArray<HTMLElement>(target, container);
        if (els.length > 0) {
          gsap.fromTo(els, { opacity: 1, y: 0 }, {
            opacity: 0, y: -40, stagger: 0.05, ease: 'power2.in',
            scrollTrigger: { trigger: els[0], start: 'top 30%', end: 'top top', scrub: 1 }
          });
        }
      });

      sections.forEach((sec, i) => {
        if (i === 0) return;
        const nextSec = sections[i + 1];

        tl.to(sec, { 
          scale: CONFIG.tunnel.scaleStart, opacity: 0,
          webkitFilter: `blur(${CONFIG.tunnel.blurStart}px)`,
          ease: 'power2.in',
          scrollTrigger: { trigger: sec, start: 'center center', end: 'bottom center', scrub: 1, pin: true, pinSpacing: false }
        }, "-=0.5");

        if (nextSec) {
          gsap.fromTo(nextSec, { 
            scale: 0.9, opacity: 0, z: -200, 
            webkitFilter: `blur(5px)` 
          }, { 
            scale: 1, opacity: 1, z: 0,
            webkitFilter: `blur(0px)`,
            ease: 'expo.out',
            scrollTrigger: { trigger: sec, start: 'center center', end: 'bottom center', scrub: 1 }
          });
        }
      });
    });

    return () => { mm.revert(); };
  }, { scope: scrollyRef, dependencies: [mounted] });

  return (
    <div ref={scrollyRef} className="relative z-0" style={{ perspective: CONFIG.tunnel.perspective }}>
      <div 
        ref={matrixContainerRef} 
        className="fixed inset-0 grid matrix-grid pointer-events-none opacity-0 in" 
        style={{ gridTemplateColumns: `repeat(20, 1fr)`, animationDelay: '1.2s' }} 
      />

      {/* 🚀 SVG Protegido: Solo se renderiza en cliente y SIN puntos suspensivos en el path */}
      {mounted && (
        <svg 
          ref={lineSvgRef} 
          className="absolute top-0 left-0 w-full z-10 pointer-events-none overflow-visible opacity-in" 
          data-noprint
          viewBox={`0 0 ${window.innerWidth} ${mainRef.current?.scrollHeight || window.innerHeight}`}
        >
          <path 
            ref={linePathRef}
            d={`M10 0 C ${CONFIG.line.curvature} ${window.innerHeight / 2} ${-CONFIG.line.curvature} ${window.innerHeight} 10 ${window.innerHeight + 500}`} 
            stroke={CONFIG.line.color} 
            strokeWidth={CONFIG.line.width} 
            fill="none" 
            strokeLinecap="round"
            className="will-change-transform"
          />
        </svg>
      )}

      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}