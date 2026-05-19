'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export function GlareCard({ children, accent, className = '', style }: { children: React.ReactNode; accent: string; className?: string; style?: React.CSSProperties; }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r || !glareRef.current) return;

    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    
    // 3D Tilt Calculation
    const xPercent = (x / r.width - 0.5) * 2; // -1 to 1
    const yPercent = (y / r.height - 0.5) * 2; // -1 to 1
    
    gsap.to(cardRef.current, {
      rotateY: xPercent * 15,
      rotateX: -yPercent * 15,
      scale: 1.05,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
      force3D: true
    });

    // Dynamic Glare (Optimized)
    if (glareRef.current) {
      const gx = (x / r.width) * 100;
      const gy = (y / r.height) * 100;
      glareRef.current.style.setProperty('--gx', `${gx}%`);
      glareRef.current.style.setProperty('--gy', `${gy}%`);
    }
  };

  const onLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      overwrite: 'auto',
      force3D: true
    });
  };

  return (
    <div 
      ref={cardRef} 
      onMouseMove={onMove} 
      onMouseLeave={onLeave}
      className={`relative overflow-hidden rounded-[28px] border transition-all duration-300 group ${className}`} 
      style={{ 
        borderColor: `${accent}25`, 
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        ...style 
      }}
    >
      <div 
        ref={glareRef} 
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100" 
        style={{ 
          background: `radial-gradient(circle 300px at var(--gx,50%) var(--gy,50%), ${accent}25, transparent 80%)`,
          transform: 'translateZ(50px)' 
        }} 
      />
      <div className="relative z-0" style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
}