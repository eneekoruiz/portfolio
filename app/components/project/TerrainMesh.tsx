'use client';
import { useRef, useEffect } from 'react';

export function TerrainMesh({ accent }: { accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      tRef.current += 0.004;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 0.4;
      for (let row = 0; row <= 10; row++) {
        ctx.beginPath();
        for (let col = 0; col <= 18; col++) {
          const x = col * (W / 18);
          const wave = Math.sin(col * 0.4 + tRef.current * 2.1) * 12 + Math.sin(col * 0.15 + row * 0.5 + tRef.current) * 8;
          const y = row * (H / 10) + wave;
          if (col === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.globalAlpha = 0.03;
        ctx.stroke();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animRef.current!); };
  }, [accent]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: 'screen' }} />;
}