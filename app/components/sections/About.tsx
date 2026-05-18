'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NetworkParticles } from '../motion/Particles';
import { useMagnetic } from '../../hooks/useMagnetic';
import type { Tx } from '../../types';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

export function About({ t }: { t: Tx }) {
  return (
    <AboutContent t={t} />
  );
}

interface MetricCardProps {
  v: string;
  l: string;
  key?: string | number;
}

function MetricCard({ v, l }: MetricCardProps) {
  const ref = useMagnetic<HTMLDivElement>({ strength: 0.02, innerStrength: 0.05 });
  return (
    <div
      ref={ref}
      className="p-8 md:p-10 rounded-3xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl block will-change-transform border-beam"
    >
      <div className="font-black text-5xl md:text-6xl tracking-tighter text-ink dark:text-white mb-1">{v}</div>
      <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">{l}</p>
    </div>
  );
}

function AboutContent({ t }: { t: Tx }) {
  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // 1. Título con animación de caracteres
      const titleChars = sectionRef.current?.querySelectorAll('.title-char');
      if (titleChars) {
        gsap.fromTo(titleChars,
          { y: '100%', rotateX: -90, opacity: 0 },
          {
            y: 0, rotateX: 0, opacity: 1,
            duration: 1.2,
            stagger: 0.02,
            ease: 'expo.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }
          }
        );
      }

      // 2. Entrada de métricas
      if (document.querySelector('.about-reveal')) {
        gsap.from('.about-reveal', {
          y: 30, opacity: 0, stagger: 0.06, duration: 0.48, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }
        });
      }

      // 3. EFECTO TELÓN (MASKED REVEAL)
      if (textContainerRef.current && document.querySelector('.word-inner')) {
        gsap.fromTo('.word-inner',
          { y: '110%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 0.42,
            stagger: 0.015,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: textContainerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

    }, sectionRef);
    return () => ctx.revert();
  }, [t.mf]);

  // Función para crear la "máscara" palabra por palabra
  const renderMaskedWords = (text: string) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em] pb-[0.1em]">
        <span className="word-inner inline-block will-change-transform">
          {word}
        </span>
      </span>
    ));
  };

  return (
    <section ref={sectionRef} id="about" aria-label="Sobre mí" className="relative py-24 md:py-40 overflow-hidden z-[20] bg-page">
      <NetworkParticles />
      <div className="px-6 md:px-8 max-w-[1200px] mx-auto relative z-10">
        <div className="relative z-10">
          <div>
            <p className="about-reveal text-[11px] font-bold tracking-[0.2em] uppercase text-brand mb-4">{t.abLb}</p>
            <h2 className="font-black text-[clamp(2.5rem,6vw,4.5rem)] tracking-tight leading-none mb-8 md:mb-12 text-ink perspective-1000">
              {t.abH.split(' ').map((word, wIdx, wordsArray) => (
                <span key={wIdx} className="inline-block whitespace-nowrap">
                  {word.split('').map((c, cIdx) => (
                    <span key={cIdx} className="title-char inline-block">{c}</span>
                  ))}
                  {wIdx < wordsArray.length - 1 && <span className="title-char inline-block">&nbsp;</span>}
                </span>
              ))}
            </h2>
          </div>

          <hr className="about-reveal hidden md:block border-none h-px bg-black/10 dark:bg-white/10 mb-12 max-w-3xl" />

          <div ref={textContainerRef} className="max-w-4xl mb-0 md:mb-24">
            <p className="font-medium text-[clamp(1.2rem,2.5vw,1.8rem)] leading-[1.4] text-slate-800 dark:text-slate-200">
              {renderMaskedWords(t.mf)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 about-reveal">
            {t.metrics.map(([v, l]) => (
              <MetricCard key={l} v={v} l={l} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}