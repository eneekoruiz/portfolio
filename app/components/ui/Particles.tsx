'use client';

import { useEffect, useRef } from 'react';

export function NetworkParticles() {
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = cvRef.current!;
    const ctx = cv.getContext('2d')!;
    let W = 0, H = 0, raf = 0;
    
    // x, y, velocidad x, velocidad y, radio
    type Pt = { x: number; y: number; vx: number; vy: number; r: number };
    const pts: Pt[] = [];
    
    // 🔥 AUMENTADO: De 80 a 140 para una red mucho más densa y visible
    const NUM_PTS = 140; 
    const mouse = { x: -999, y: -999 };

    const resize = () => {
      W = cv.width = cv.offsetWidth;
      H = cv.height = cv.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    const mm = (e: MouseEvent) => {
      const rect = cv.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const ml = () => { mouse.x = -999; mouse.y = -999; };
    
    cv.addEventListener('mousemove', mm);
    cv.addEventListener('mouseleave', ml);

    for (let i = 0; i < NUM_PTS; i++) {
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 1.5 + 1.2 // Puntos un poco más grandes
      });
    }

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      
      // 🔥 AUMENTADO: Se conectan desde un poco más lejos para hacer más "tela de araña"
      const maxDist = 160; 
      const mouseDist = 200; // El ratón atrae desde más lejos

      pts.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // Dibujar el punto
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 102, 255, 0.8)'; // Un poco más opacos
        ctx.fill();

        // Conectar con otros puntos
        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            // 🔥 AUMENTADO: Líneas un poco más visibles
            const alpha = (1 - dist / maxDist) * 0.45; 
            ctx.strokeStyle = `rgba(0, 102, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Conectar y repeler suavemente con el ratón
        if (mouse.x !== -999) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            const alpha = (1 - dist / mouseDist) * 0.6; // Conexión fuerte con el ratón
            ctx.strokeStyle = `rgba(0, 102, 255, ${alpha})`;
            ctx.stroke();

            // Atracción/Repulsión
            p.x += dx * 0.005;
            p.y += dy * 0.005;
          }
        }
      });
      
      raf = requestAnimationFrame(loop);
    };
    
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      cv.removeEventListener('mousemove', mm);
      cv.removeEventListener('mouseleave', ml);
    };
  }, []);

  return <canvas ref={cvRef} className="absolute inset-0 w-full h-full pointer-events-auto z-0 print:hidden" aria-hidden="true" />;
}