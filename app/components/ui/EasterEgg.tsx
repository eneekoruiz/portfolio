'use client';

import { useEffect } from 'react';

/** DevTools console easter egg — fires once on client mount */
export function EasterEgg() {
  useEffect(() => {
    const styles = {
      title:  'color:#0066ff;font-size:17px;font-weight:900;font-family:monospace;padding:4px 0;line-height:1.8',
      body:   'color:#34c759;font-size:13px;font-family:monospace;line-height:1.6',
      accent: 'color:#ff9500;font-size:12px;font-family:monospace',
      reset:  'color:#888;font-size:11px;font-family:monospace',
    };
    console.log('%c KAIXO! 👋', styles.title);
    console.log('%c Veo que te gusta mirar bajo el capó.', styles.body);
    console.log('%c Si buscas a alguien obsesionado con el detalle:\n%c → eneekoruiz@gmail.com\n%c → github.com/eneekoruiz', styles.body, styles.accent, styles.accent);
    console.log('%c Construido con Next.js 14 · TypeScript · GSAP · Tailwind · Canvas2D', styles.reset);
  }, []);

  return null;
}
