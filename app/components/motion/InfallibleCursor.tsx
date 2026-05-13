'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * InfallibleCursor V2 — The Negative Space Inverter
 * • Único círculo de inversión de color (mix-blend-mode: difference).
 * • Suavizado orgánico (Lerp).
 * • Hover: Expansión suave tipo burbuja de enfoque.
 * • Shake: Pulsación rápida calibrada para localización.
 */
export function InfallibleCursor() {
  const [mounted, setMounted] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Estados de movimiento (usamos refs para evitar re-renders de React)
  const mx = useRef(-100); const my = useRef(-100); // Mouse real
  const cx = useRef(-100); const cy = useRef(-100); // Cursor animado (lag)
  
  // Estados de animación
  const scale = useRef(1); // Escala actual
  const targetScale = useRef(1); // Escala objetivo
  const opacity = useRef(0); // Opacidad para el fade-in inicial
  
  // Refs de control
  const isHover = useRef(false);
  const isMagnetic = useRef(false);
  const shakeTO = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    // Solo activar si hay un puntero preciso (ratón)
    if (!window.matchMedia('(pointer:fine)').matches) return;

    const el = cursorRef.current;
    if (!el) return;

    // Fade-in inicial sutil
    setTimeout(() => { opacity.current = 1; }, 100);

    const onMove = (e: MouseEvent) => {
      // Magnetic Stickiness Detection
      const target = e.target as HTMLElement;
      const magneticEl = target.closest('[data-magnetic]') as HTMLElement;
      
      if (magneticEl) {
        const rect = magneticEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Stick closer to center as mouse gets closer
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 100) {
          mx.current = centerX + dx * 0.25;
          my.current = centerY + dy * 0.25;
          isMagnetic.current = true;
        } else {
          mx.current = e.clientX;
          my.current = e.clientY;
          isMagnetic.current = false;
        }
      } else {
        mx.current = e.clientX;
        my.current = e.clientY;
        isMagnetic.current = false;
      }

      // Calcular velocidad nativa para el Shake
      const speed = Math.abs(e.movementX) + Math.abs(e.movementY);
      
      // CALIBRACIÓN SHAKE: Sensibilidad 90px de movimiento combinado
      if (speed > 90 && !isHover.current) {
        targetScale.current = 1.6; // Crece un poco
        // Añadimos una clase CSS efímera para la pulsación (ver abajo en el return)
        el.classList.add('cursor-shake-pulse'); 
        
        clearTimeout(shakeTO.current);
        shakeTO.current = setTimeout(() => { 
          targetScale.current = 1;
          el.classList.remove('cursor-shake-pulse');
        }, 500);
      }
    };

    // ── IFRAME TRACKING (Same-origin or with postMessage support) ────────
    const onMessage = (e: MessageEvent) => {
      if (!e.data) return;

      if (e.data.type === 'portfolio-cursor-move') {
        const iframes = document.querySelectorAll('iframe');
        let targetIframe: HTMLIFrameElement | null = null;
        
        for (let i = 0; i < iframes.length; i++) {
          if (iframes[i].contentWindow === e.source) {
            targetIframe = iframes[i] as HTMLIFrameElement;
            break;
          }
        }

        if (targetIframe) {
          const rect = targetIframe.getBoundingClientRect();
          mx.current = rect.left + e.data.x;
          my.current = rect.top + e.data.y;
        }
      } else if (e.data.type === 'portfolio-cursor-hover') {
        isHover.current = true;
        targetScale.current = 4;
      } else if (e.data.type === 'portfolio-cursor-leave') {
        isHover.current = false;
        targetScale.current = 1;
      }
    };

    // Listeners de Hover (usamos captura 'true' para delegación de eventos global)
    const onEnter = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('a,button,[data-h],input,select')) return;
      isHover.current = true;
      targetScale.current = 4; // Expansión grande (burbuja)
    };
    const onLeave = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('a,button,[data-h],input,select')) return;
      isHover.current = false;
      // Si estamos agitando, no bajamos la escala inmediatamente
      if (!el.classList.contains('cursor-shake-pulse')) {
        targetScale.current = 1;
      }
    };

    const animate = () => {
      if (document.visibilityState !== 'visible') {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Suavizado de posición (Lerp) - Factor 0.15 para lag premium
      cx.current += (mx.current - cx.current) * 0.15;
      cy.current += (my.current - cy.current) * 0.15;

      // Suavizado de escala - Factor 0.18 para expansión elástica
      scale.current += (targetScale.current - scale.current) * 0.18;

      if (el) {
        // Usamos translate3d y scale para forzar aceleración por hardware (GPU)
        // Restamos 10px (mitad del tamaño base de 20px) para centrarlo
        el.style.transform = `translate3d(${cx.current - 10}px, ${cy.current - 10}px, 0) scale(${scale.current})`;
        
        // Animamos la opacidad y el radio del borde según el hover
        el.style.opacity = String(opacity.current);
        el.style.backgroundColor = isHover.current ? 'rgba(255,255,255,0.03)' : 'white';
        el.style.borderWidth = isHover.current ? '0.5px' : '0px';
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    // Registro de eventos
    window.addEventListener('mousemove', onMove);
    window.addEventListener('message', onMessage);
    window.addEventListener('mouseenter', onEnter, true);
    window.addEventListener('mouseleave', onLeave, true);
    rafRef.current = requestAnimationFrame(animate);

    // Limpieza
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('message', onMessage);
      window.removeEventListener('mouseenter', onEnter, true);
      window.removeEventListener('mouseleave', onLeave, true);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(shakeTO.current);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* El Cursor — Refined for Visibility & Premium Feel */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        data-noprint // No sale al imprimir
        style={{
          // Layout fijo cubriendo toda la pantalla
          position: 'fixed', 
          top: 0, 
          left: 0,
          zIndex: 9999999, // Truly on top of everything
          pointerEvents: 'none', // No interfiere con los clics
          
          // Estética Base
          width: '20px', 
          height: '20px',
          borderRadius: '9999px', // Círculo perfecto
          backgroundColor: 'white',
          
          // Subtly visible border even on white backgrounds to prevent "invisible" feel
          border: '1px solid rgba(128,128,128,0.2)',
          
          // 🗝️ CLAVE: Inversión de color
          mixBlendMode: 'difference',
          
          // Optimizaciones
          opacity: 0, // Empieza invisible (fade-in)
          willChange: 'transform, scale', // Pista para la GPU
          
          // Transiciones suaves para propiedades que no son transform (hover)
          transition: 'opacity 0.3s ease, background-color 0.4s ease, border-width 0.3s ease, border-color 0.4s ease',
        }}
      />
    </>
  );
}