'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface ProjectPreviewFollowerProps {
  activeProject: {
    name: string;
    color: string;
  } | null;
}

export function ProjectPreviewFollower({ activeProject }: ProjectPreviewFollowerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      if (isVisible && containerRef.current) {
        gsap.to(containerRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 1.0,
          ease: 'power3.out',
        });
        
        // Add a slight tilt based on velocity/direction
        if (innerRef.current) {
           const dx = e.movementX || 0;
           gsap.to(innerRef.current, {
             rotateZ: dx * 0.5,
             skewX: dx * 0.2,
             duration: 0.4,
             ease: 'power2.out'
           });
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [isVisible]);

  useEffect(() => {
    if (activeProject) {
      setIsVisible(true);
      gsap.to(containerRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.7)',
      });
    } else {
      gsap.to(containerRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setIsVisible(false),
      });
    }
  }, [activeProject]);

  if (!isVisible && !activeProject) return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 z-[30] pointer-events-none will-change-transform flex items-center justify-center"
      style={{ 
        width: '280px', 
        height: '180px', 
        marginLeft: '-140px', 
        marginTop: '-220px',
        opacity: 0,
        transform: 'scale(0.5)'
      }}
    >
      <div
        ref={innerRef}
        className="w-full h-full rounded-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.4)] border border-white/20 relative"
        style={{ 
          backgroundColor: activeProject?.color || '#000',
        }}
      >
        {/* Decorative elements to make it look "techy" */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)]" />
        <div className="absolute inset-0 mix-blend-overlay opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-white/20 animate-pulse mb-3 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/40 mb-1">
            Project Preview
          </span>
          <h4 className="font-black text-white text-lg uppercase italic tracking-tighter leading-tight">
            {activeProject?.name.replace(/-/g, ' ')}
          </h4>
        </div>

        {/* Floating geometric lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
           <line x1="0" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="1" />
           <line x1="100%" y1="0" x2="0" y2="100%" stroke="white" strokeWidth="1" />
           <circle cx="50%" cy="50%" r="40%" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>
    </div>
  );
}
