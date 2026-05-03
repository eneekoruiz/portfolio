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
  'Warming JAX-WS Endpoints...',
  'System Ready.',
];

export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIdx(i => (i + 1) % (TECH_MESSAGES.length - 1));
    }, 280);
    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    let v = 0;
    const tick = () => {
      v += Math.random() * 4 + 1.5;
      if (v >= 100) {
        setN(100);
        setMsgIdx(TECH_MESSAGES.length - 1);
        setTimeout(() => {
          const tl = gsap.timeline({ onComplete: onDone });
          tl.to(textRef.current, { opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' })
            .to(glowRef.current, { opacity: 1, scale: 3, duration: 0.35, ease: 'power2.out' }, '-=0.1')
            .to(numRef.current, { scale: 30, opacity: 0, duration: 0.8, ease: 'expo.inOut' }, '+=0.05')
            .to(containerRef.current, { opacity: 0, duration: 0.2 }, '-=0.2');
        }, 200);
        return;
      }
      setN(Math.round(v));
      setTimeout(tick, 18 + Math.random() * 12);
    };
    setTimeout(tick, 30);
  }, [onDone]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-page text-ink overflow-hidden"
    >
      {/* El Grid que pedías */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
           style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div ref={glowRef} className="absolute w-24 h-24 bg-brand rounded-full blur-[80px] opacity-0" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div ref={numRef} className="font-black text-[clamp(4rem,10vw,10rem)] tracking-tight leading-none origin-center">
          {n}%
        </div>
        <div className="flex flex-col items-center gap-2">
          <p ref={textRef} className="font-mono text-[10px] tracking-[0.4em] uppercase text-lead font-bold">
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
