'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const TECH_MESSAGES = [
  'Initialising Data Streams...',
  'Compiling MVC Logic...',
  'Mapping Semantic DOM...',
  'Bootstrapping Firebase SDK...',
  'Hydrating React Tree...',
  'Resolving Mongoose Refs...',
  'Validating Bcrypt Salts...',
  'Mounting ScrollTrigger...',
  'Parsing Atomic Transactions...',
  'Calibrating GSAP Timeline...',
  'Injecting WCAG 2.1 Layer...',
  'System Ready.',
];

export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIdx(i => (i + 1) % (TECH_MESSAGES.length - 1));
    }, 280); 
    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    let v = 0;
    const tick = () => {
      v += Math.random() * 4 + 1; // Más lento, más natural
      if (v >= 100) {
        setN(100);
        setMsgIdx(TECH_MESSAGES.length - 1);
        setTimeout(() => {
          const tl = gsap.timeline({ onComplete: onDone });
          tl.to(containerRef.current, { 
            opacity: 0, 
            duration: 0.6, 
            ease: 'power2.inOut' 
          });
        }, 300);
        return;
      }
      setN(Math.round(v));
      setTimeout(tick, 25 + Math.random() * 25);
    };
    setTimeout(tick, 50);
  }, [onDone]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-page text-ink overflow-hidden"
    >
      <div className="flex flex-col items-center gap-6">
        <div ref={numRef} className="font-black text-[clamp(4rem,10vw,10rem)] tracking-tight leading-none">
          {n}%
        </div>
        <div className="flex flex-col items-center gap-2">
          <p ref={textRef} className="font-mono text-[10px] tracking-[0.4em] uppercase text-lead font-bold animate-pulse">
            {TECH_MESSAGES[msgIdx]}
          </p>
          <div className="w-32 h-[1px] bg-black/5 dark:bg-white/5 relative overflow-hidden">
             <div 
               className="absolute inset-0 bg-brand origin-left transition-transform duration-150 ease-out"
               style={{ transform: `scaleX(${n/100})` }}
             />
          </div>
        </div>
      </div>
    </div>
  );
}
