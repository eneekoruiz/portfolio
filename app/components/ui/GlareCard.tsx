'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export function GlareCard({ children, accent, className = '', style }: { children: React.ReactNode; accent: string; className?: string; style?: React.CSSProperties; }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r || !glareRef.current) return;
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    glareRef.current.style.setProperty('--gx', `${x}%`);
    glareRef.current.style.setProperty('--gy', `${y}%`);
  };
  return (
    <div ref={cardRef} onMouseMove={onMove} className={`relative overflow-hidden rounded-[28px] border transition-all duration-300 hover:scale-[1.015] ${className}`} style={{ borderColor: `${accent}15`, ...style }}>
      <div ref={glareRef} className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ background: `radial-gradient(circle 200px at var(--gx,50%) var(--gy,50%), ${accent}12, transparent)` }} />
      {children}
    </div>
  );
}