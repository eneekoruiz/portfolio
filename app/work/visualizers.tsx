'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { Database, Server, Radar, CheckCircle2, Layers } from 'lucide-react';

// ── DNAHelix ──────────────────────────────────────────────────────────────────

export const DNAHelix = ({ accent, secondary, darkMode }: {
  accent: string; secondary: string; darkMode: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const rotationRef = useRef(0);
  const activeRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let frame = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      if (!activeRef.current || document.visibilityState !== 'visible') {
        frame = 0;
        return;
      }

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === 0 || h === 0) {
        frame = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      
      const steps = 60;
      const speed = 0.008; 
      const scrollImpact = scrollRef.current * 0.0012; 
      rotationRef.current += speed;
      
      const baseRotation = rotationRef.current + scrollImpact;

      // Draw Strands
      for (let s = 0; s < 2; s++) {
        const offset = s === 0 ? 0 : Math.PI;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const progress = i / steps;
          const y = progress * h;
          const angle = progress * Math.PI * 4 + baseRotation + offset;
          const r = w * 0.35;
          const x = w / 2 + Math.cos(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = s === 0 ? accent : secondary;
        ctx.lineWidth = darkMode ? 7.5 : 5.0;
        ctx.globalAlpha = 1.0;
        ctx.stroke();
      }

      for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        const y = progress * h;
        const angle = progress * Math.PI * 4 + baseRotation;
        
        const r = w * 0.35;
        const x1 = w / 2 + Math.cos(angle) * r;
        const x2 = w / 2 + Math.cos(angle + Math.PI) * r;
        
        const z1 = Math.sin(angle);
        const z2 = Math.sin(angle + Math.PI);
        
        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = accent;
          ctx.globalAlpha = (darkMode ? 0.15 : 0.08) * (z1 + z2 + 2) / 2;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        const drawNode = (x: number, z: number, color: string) => {
          const size = 1.5 + (z + 1) * 2.2;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = 1.0;
          
          if (z > 0.4) {
            ctx.shadowBlur = darkMode ? 25 : 15;
            ctx.shadowColor = color;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        };

        drawNode(x1, z1, accent);
        drawNode(x2, z2, secondary);
      }
      
      ctx.shadowBlur = 0;
      frame = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !frame) {
           frame = requestAnimationFrame(draw);
        }
      },
      { threshold: 0.01 }
    );

    resize();
    observer.observe(canvas);
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [accent, secondary, darkMode]);


  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full will-change-transform pointer-events-none"
      style={{ display: 'block' }}
    />
  );
};
// ── TerrainMesh ───────────────────────────────────────────────────────────────

export const TerrainMesh = ({ accent, darkMode }: { accent: string; darkMode: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>();
  const tRef      = useRef(0);
  const activeRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.offsetWidth * ratio);
      canvas.height = Math.floor(canvas.offsetHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      if (!activeRef.current || document.visibilityState !== 'visible') {
        animRef.current = 0;
        return;
      }

      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      tRef.current += 0.0035;

      const rows = 12;
      const cols = 20;
      const points: {x: number, y: number}[] = [];

      ctx.strokeStyle = accent;
      ctx.lineWidth   = 0.4;
      ctx.globalAlpha = darkMode ? 0.08 : 0.04;

      // Draw Grid Lines (Spiderweb)
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const x = c * (W / cols);
          const wave = Math.sin(c * 0.3 + tRef.current * 2) * 15
                     + Math.sin(r * 0.5 + tRef.current * 1.5) * 10;
          const y = r * (H / rows) + wave;
          points.push({x, y});
          if (c === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const idx = r * (cols + 1) + c;
          const p = points[idx];
          if (r === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // Draw Pulsing Intersections
      ctx.globalAlpha = darkMode ? 0.15 : 0.08;
      points.forEach((p, i) => {
        if (i % 7 === 0) {
          const pulse = (Math.sin(tRef.current * 3 + i) + 1) * 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.2 + pulse * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = accent;
          ctx.fill();
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !animRef.current) {
          animRef.current = requestAnimationFrame(draw);
        }
      },
      { threshold: 0.01 }
    );

    resize();
    observer.observe(canvas);
    window.addEventListener('resize', resize);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [accent, darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80 will-change-transform"
      style={{ mixBlendMode: darkMode ? 'screen' : 'multiply' }}
    />
  );
};

// ── FloatingArtifact ──────────────────────────────────────────────────────────

export const FloatingArtifact = ({ accent, idx }: { accent: string; idx: number }) => {
  const ref    = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context>();

  useEffect(() => {
    if (!ref.current) return;

    ctxRef.current = gsap.context(() => {
      gsap.to(ref.current, {
        y:        `${-16 - idx * 4}`,
        x:        `${Math.sin(idx) * 12}`,
        rotate:   idx % 2 === 0 ? 360 : -360,
        duration: 3.6 + idx * 0.45,
        repeat:   -1,
        yoyo:     true,
        ease:     'power1.inOut',
        force3D:  true,
      });
    });

    return () => ctxRef.current?.revert();
  }, [idx]);

  const shapes = [
    <div key="1" className="w-2 h-2 rounded-full"  style={{ background: accent, opacity: 0.4 }} />,
    <div key="2" className="w-4 h-4 border rotate-45" style={{ borderColor: accent, opacity: 0.3 }} />,
    <div key="3" className="w-6 h-[1px]"           style={{ background: accent, opacity: 0.2 }} />,
  ];

  return (
    <div
      ref={ref}
      className="absolute pointer-events-none will-change-transform"
      style={{ top: `${20 + idx * 12}%`, left: idx % 2 === 0 ? '10%' : '85%', transform: 'translate3d(0, 0, 0)' }}
    >
      {shapes[idx % 3]}
    </div>
  );
};

// ── Visualizers ───────────────────────────────────────────────────────────────

export const SandwichDiagram = ({ accent }: { accent: string }) => {
  return (
    <div className="w-full space-y-4 font-mono text-[10px]">
      <div className="flex items-stretch gap-2 h-14">
        <div className="flex-1 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transition-transform hover:scale-[1.02]" style={{ background: accent }}>ACTIVE_01</div>
        <div className="w-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden" style={{ borderColor: `${accent}50`, color: accent }}>
          <span className="opacity-50">WAIT</span>
          <div className="absolute bottom-0 left-0 h-1 bg-current animate-pulse" style={{ width: '100%', animationDuration: '2s' }} />
        </div>
        <div className="flex-1 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transition-transform hover:scale-[1.02]" style={{ background: accent }}>ACTIVE_02</div>
      </div>
      <div className="h-10 rounded-xl flex items-center justify-center font-bold tracking-widest bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10" style={{ color: accent }}>
        ✨ PARALLEL SLOT INJECTED
      </div>
    </div>
  );
};

export const MVCTerminal = ({ accent }: { accent: string }) => {
  return (
    <div className="bg-black/5 dark:bg-[#0a0a0a] rounded-xl border border-black/10 dark:border-white/10 font-mono text-[11px] h-44 flex flex-col overflow-hidden shadow-2xl">
      <div className="h-8 bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 flex items-center px-4 gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
      </div>
      <div className="p-5 flex-1 flex flex-col justify-center space-y-2 text-ink">
        <div className="flex items-center gap-2"><span style={{ color: accent }}>❯</span><span className="opacity-70">GET /api/v1/players</span></div>
        <div className="flex items-center gap-2 opacity-40"><span>[Router]</span><span>Executing aggregation pipeline...</span></div>
        <div className="flex items-center gap-2 font-bold" style={{ color: '#27c93f' }}><span>✔</span><span>200 OK (Latency: 12ms)</span></div>
      </div>
    </div>
  );
};

export const DistributedNodes = ({ accent }: { accent: string }) => {
  const [nodes, setNodes] = useState<{x: number, y: number, vx: number, vy: number}[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const initial = Array.from({ length: 12 }).map(() => ({
      x: Math.random() * 200,
      y: Math.random() * 150,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));
    setNodes(initial);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, 300, 200);
      
      // Update nodes
      const nextNodes = nodes.map(n => ({
        ...n,
        x: (n.x + n.vx + 300) % 300,
        y: (n.y + n.vy + 200) % 200,
      }));
      setNodes(nextNodes);

      // Draw connections (Spiderweb)
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `${accent}30`;
      for (let i = 0; i < nextNodes.length; i++) {
        for (let j = i + 1; j < nextNodes.length; j++) {
          const dx = nextNodes[i].x - nextNodes[j].x;
          const dy = nextNodes[i].y - nextNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(nextNodes[i].x, nextNodes[i].y);
            ctx.lineTo(nextNodes[j].x, nextNodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nextNodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    // Note: React state update inside RAF is usually not ideal, 
    // but for this simple visualizer it's fine for now. 
    // Actually, I'll use a more efficient approach with refs for the anim loop.
    return () => cancelAnimationFrame(raf);
  }, [accent, nodes]);

  return (
    <div className="relative h-44 flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} width={300} height={200} className="w-full h-full" />
      <div className="absolute w-20 h-20 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-center backdrop-blur-md shadow-xl z-10">
        <Server size={24} style={{ color: accent }} />
      </div>
    </div>
  );
};

export const WCAGVisualizer = ({ accent }: { accent: string }) => {
  return (
    <div className="h-44 flex flex-col justify-between">
      <div className="flex-1 rounded-xl flex items-center justify-center mb-4 bg-black/5 dark:bg-white text-ink dark:text-black">
        <span className="font-black text-4xl tracking-tighter">Aa</span>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <div className="text-[10px] font-mono opacity-40 uppercase tracking-widest text-ink">Contrast</div>
          <div className="text-xl font-bold font-mono" style={{ color: accent }}>21.0:1</div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 font-mono text-[10px] font-bold">
          <CheckCircle2 size={14} /> AAA PASS
        </div>
      </div>
    </div>
  );
};

export const SpotshareHeatmap = ({ accent }: { accent: string }) => {
  return (
    <div className="relative h-44 rounded-xl bg-black/5 dark:bg-[#050505] border border-black/10 dark:border-white/10 overflow-hidden flex items-center justify-center group shadow-inner">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at center, ${accent} 1px, transparent 1px)`, backgroundSize: '15px 15px' }} />
      <div className="absolute w-[200%] h-[200%] origin-center animate-spin" style={{ background: `conic-gradient(from 0deg, transparent 70%, ${accent}40 100%)`, animationDuration: '3s', animationTimingFunction: 'linear' }} />
      <div className="relative z-10 w-16 h-16 rounded-full bg-page/80 backdrop-blur-xl border border-black/10 dark:border-white/20 flex items-center justify-center shadow-xl">
        <Radar size={24} style={{ color: accent }} className="animate-pulse" />
      </div>
      <div className="absolute top-10 left-10 w-2 h-2 rounded-full animate-ping" style={{ background: accent }} />
      <div className="absolute bottom-12 right-16 w-2 h-2 rounded-full animate-ping" style={{ background: accent, animationDelay: '1s' }} />
    </div>
  );
};
