'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Orbit, Zap } from 'lucide-react';
import Link from 'next/link';

/**
 * The Lab - Quantum Vortex
 * Experimento interactivo de partículas en espiral (Galactic Math)
 */
export function TheLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [attract, setAttract] = useState(true);
  const [speedMult, setSpeedMult] = useState(1);
  const animationRef = useRef<number>(0);
  
  // Referencias mutables para el render loop (evitar re-renders de React)
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const configRef = useRef({ attract: true, speed: 1 });

  // Sincronizar estado de UI con referencias mutables
  useEffect(() => {
    configRef.current = { attract, speed: speedMult };
  }, [attract, speedMult]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimización
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', resize);

    // --- LÓGICA DE PARTÍCULAS ---
    const NUM_PARTICLES = 2500;
    const particles: Array<{
      angle: number;
      radius: number;
      baseRadius: number;
      size: number;
      color: string;
      speed: number;
      arm: number;
    }> = [];

    const colors = ['#0066ff', '#06B6D4', '#ffffff', '#0033aa'];

    // Crear la galaxia en espiral
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const armIndex = i % 3; // 3 brazos en la espiral
      const armAngle = (Math.PI * 2 / 3) * armIndex;
      const distance = Math.random() * (Math.max(w, h) * 0.6); // Distancia del centro
      
      particles.push({
        angle: armAngle + (distance * 0.005) + (Math.random() * 0.5 - 0.25),
        baseRadius: distance,
        radius: distance,
        size: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: (0.001 + Math.random() * 0.002) * (100 / (distance + 10)), // Más rápido en el centro
        arm: armIndex
      });
    }

    const mouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const mouseLeave = () => { mouseRef.current.active = false; };
    
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseleave', mouseLeave);

    // --- BUCLE DE RENDERIZADO (144fps target) ---
    const render = () => {
      // Efecto estela (trail)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const { x: mx, y: my, active } = mouseRef.current;
      const { attract: isAttracting, speed } = configRef.current;

      for (let i = 0; i < NUM_PARTICLES; i++) {
        const p = particles[i];
        
        // Rotación natural
        p.angle += p.speed * speed;
        
        // Coordenadas actuales
        let px = cx + Math.cos(p.angle) * p.radius;
        let py = cy + Math.sin(p.angle) * p.radius;

        // Gravedad del ratón
        if (active) {
          const dx = px - mx;
          const dy = py - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 250) { // Radio de influencia
            const force = (250 - dist) / 250;
            if (isAttracting) {
              // Atraer al ratón (comprime el radio temporalmente)
              p.radius -= force * 3;
            } else {
              // Repeler (expande el radio)
              p.radius += force * 5;
            }
          } else {
            // Volver a su órbita original suavemente
            p.radius += (p.baseRadius - p.radius) * 0.05;
          }
        } else {
          p.radius += (p.baseRadius - p.radius) * 0.05;
        }

        // Recalcular posición final tras aplicar fuerzas
        px = cx + Math.cos(p.angle) * p.radius;
        py = cy + Math.sin(p.angle) * p.radius;

        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseleave', mouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-black overflow-hidden selection:bg-brand selection:text-white">
      {/* El Canvas que ocupa todo */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 cursor-crosshair"
      />

      {/* Interfaz Superior (Glassmorphism) */}
      <header className="absolute top-6 left-6 right-6 flex items-center justify-between z-10 pointer-events-none">
        <div className="bg-white/5 border border-white/10 backdrop-blur-md px-6 py-3 rounded-2xl pointer-events-auto">
          <h1 className="font-mono text-white text-[16px] font-bold tracking-widest flex items-center gap-2">
            <Orbit size={16} className="text-brand" />
            QUANTUM VORTEX
          </h1>
          <p className="font-mono text-lead text-[10px] tracking-[0.2em] mt-1">
            KINETIC EXPERIMENT 01
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl font-mono text-[11px] font-bold text-white transition-all backdrop-blur-md pointer-events-auto"
        >
          <X size={14} />
          VOLVER AL PORTFOLIO
        </Link>
      </header>

      {/* Controles Inferiores (Glassmorphism) */}
      <footer className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white/5 border border-white/10 backdrop-blur-md p-2 rounded-[20px] flex items-center gap-2">
          
          <button
            onClick={() => setAttract(!attract)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-[11px] font-bold transition-all ${
              attract 
                ? 'bg-brand/20 text-brand border border-brand/30' 
                : 'bg-white/5 text-lead hover:text-white border border-transparent hover:border-white/10'
            }`}
          >
            <Zap size={14} className={attract ? 'animate-pulse' : ''} />
            MODO: {attract ? 'ATRAER' : 'REPELER'}
          </button>

          <div className="h-8 w-px bg-white/10 mx-2" />

          <div className="flex items-center gap-3 px-4">
            <span className="font-mono text-[10px] text-lead">VELOCIDAD</span>
            <input 
              type="range" 
              min="0.1" 
              max="3" 
              step="0.1" 
              value={speedMult}
              onChange={(e) => setSpeedMult(parseFloat(e.target.value))}
              className="w-24 accent-brand cursor-pointer"
            />
          </div>

        </div>
      </footer>
    </main>
  );
}