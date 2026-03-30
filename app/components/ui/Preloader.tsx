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
    }, 320);
    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    let v = 0;
    const tick = () => {
      v += Math.random() * 5 + 1.5;
      if (v >= 100) {
        setN(100);
        setMsgIdx(TECH_MESSAGES.length - 1);
        setTimeout(() => {
          const tl = gsap.timeline({ onComplete: onDone });
          tl.to(textRef.current, { opacity: 0, y: 10, duration: 0.2, ease: 'power2.in' })
            .to(glowRef.current, { opacity: 1, scale: 3, duration: 0.35, ease: 'power2.out' }, '-=0.1')
            .to(numRef.current, { scale: 30, opacity: 0, duration: 0.8, ease: 'expo.inOut' }, '+=0.05');
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
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-brand rounded-full blur-[120px] opacity-0 pointer-events-none"
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div ref={numRef} className="relative z-10 flex flex-col items-center justify-center transform-gpu">
        <div
          className="font-black tracking-tighter tabular-nums"
          style={{ fontSize: 'clamp(8rem, 24vw, 20rem)', lineHeight: 0.8 }}
        >
          {n}
        </div>
      </div>
      <div className="absolute bottom-24 left-8 right-8 max-w-[500px] mx-auto">
        <div className="h-[1px] bg-ink/10 overflow-hidden rounded-full">
          <div
            className="h-full bg-brand origin-left transition-transform duration-100"
            style={{ transform: `scaleX(${n / 100})` }}
          />
        </div>
      </div>
      <p
        ref={textRef}
        className="absolute bottom-12 text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] uppercase text-lead/50 text-center px-4"
      >
        {TECH_MESSAGES[msgIdx]}
      </p>
    </div>
  );
}
