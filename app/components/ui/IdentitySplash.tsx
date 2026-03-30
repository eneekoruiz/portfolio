'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Lang } from '../../lib/types';

const WELCOME_TEXT: Record<Lang, string> = {
  es: 'Bienvenido', en: 'Welcome', eu: 'Ongi etorri', fr: 'Bienvenue', it: 'Benvenuto',
  de: 'Willkommen', pt: 'Bem-vindo', ca: 'Benvingut', gl: 'Benvido', ja: 'ようこそ'
};

export function IdentitySplash({ onComplete, lang }: { onComplete: () => void; lang: Lang }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const word = WELCOME_TEXT[lang] || 'Welcome';

  useEffect(() => {
    if (!textRef.current || !lineRef.current || !containerRef.current) return;

    // 🚀 LA MAGIA: gsap.context() envuelve la animación para que React no la duplique
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete });
      const chars = textRef.current?.querySelectorAll('.char');

      if (!chars) return;

      // Ya no usamos gsap.set() aquí. Lo hemos movido a las clases de Tailwind abajo.

      // 2. Animación fluida
      tl.to(lineRef.current, { 
        scaleX: 1, 
        duration: 0.6, 
        ease: 'expo.inOut' 
      })
      .to(chars, {
        yPercent: -110, // Sube las letras a su posición normal (0)
        opacity: 1,
        stagger: 0.03,
        duration: 0.8,
        ease: 'power3.out'
      }, "-=0.2")
      .to(lineRef.current, { 
        scaleX: 0, 
        duration: 0.5, 
        ease: 'expo.inOut' 
      }, "-=0.6")
      
      // 3. Pausa de lectura
      .to({}, { duration: 0.6 })
      
      // 4. Salida suave de las letras hacia arriba
      .to(chars, {
        yPercent: -220, // Sigue subiendo para desaparecer
        opacity: 0,
        stagger: 0.02,
        duration: 0.5,
        ease: 'power3.in'
      })
      
      // 5. Fade out del fondo
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut'
      }, "-=0.3");
    }, containerRef);

    // 🧹 LA LIMPIEZA: Si React ejecuta esto dos veces, borramos la primera
    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-page text-ink flex flex-col items-center justify-center will-change-[opacity]"
    >
      <div className="flex flex-col items-center">
        {/* Contenedor con overflow-hidden para hacer la "máscara" */}
        <div className="overflow-hidden pb-2 mb-4">
          <div ref={textRef} className="flex">
            {word.split('').map((char, i) => (
              <span
                key={i}
                // 👇 CLAVE: opacity-0 y translate-y-[110%] para que nazcan ocultas. Cero parpadeos.
                className="char opacity-0 translate-y-[110%] font-black text-[clamp(3.5rem,8vw,7rem)] tracking-[-0.03em] leading-none inline-block will-change-transform"
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        </div>

        {/* Línea animada inferior */}
        <div className="flex items-center gap-4">
          <div className="h-[2px] w-12 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
             {/* 👇 CLAVE: scale-x-0 para que la línea nazca invisible */}
             <div ref={lineRef} className="h-full w-full bg-brand origin-center will-change-transform scale-x-0" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-lead font-bold">
            Eneko Ruiz
          </span>
        </div>
      </div>
    </div>
  );
}