'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Server, Database, Activity, ShieldCheck, Terminal, Cpu, Zap, Layers } from 'lucide-react';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// ─── 1. SANDWICH ALGORITHM (Ana Peluquera) ───────────────────────────────────
export function SandwichDiagram({ accent }: { accent: string }) {
  const [step, setStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 72%',
        onEnter: () => {
          const tl = gsap.timeline();
          tl.from('.s-block-1', { x: -80, opacity: 0, duration: 0.9, ease: 'expo.out' })
            .from('.s-wait', { scale: 0, opacity: 0, duration: 0.65, ease: 'back.out(2)' }, '-=0.4')
            .from('.s-block-2', { x: 80, opacity: 0, duration: 0.9, ease: 'expo.out' }, '-=0.6')
            .from('.s-slot', { opacity: 0, y: 20, duration: 0.7, ease: 'expo.out' }, '-=0.3');
        },
      });
    });
    const t = setInterval(() => setStep(s => (s + 1) % 4), 1900);
    return () => { ctx.revert(); clearInterval(t); };
  }, []);

  const steps = ['Service starts', 'phase2Min detected', 'Slot freed atomically', 'Booking #2 confirmed'];

  return (
    <div ref={containerRef} className="w-full space-y-8">
      <div className="flex items-stretch gap-3 h-[88px]">
        <div className="s-block-1 flex-1 rounded-2xl flex items-center justify-center text-white font-black text-[9px] uppercase tracking-widest relative overflow-hidden"
          style={{ background: accent }}>
          <span className="relative z-10">⚡ ACTIVE 30m</span>
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent" />
        </div>
        <div className="s-wait w-[88px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-[8px] font-black uppercase tracking-wide relative"
          style={{ borderColor: `${accent}60`, color: accent, background: `${accent}08` }}>
          <span className="text-lg mb-0.5">⏳</span>
          <span>WAIT</span>
          <span className="text-[6px] opacity-45 mt-0.5">phase2Min</span>
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: accent }}>
            <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping opacity-70" />
          </div>
        </div>
        <div className="s-block-2 flex-1 rounded-2xl flex items-center justify-center text-white font-black text-[9px] uppercase tracking-widest"
          style={{ background: accent }}>
          ⚡ ACTIVE 30m
        </div>
      </div>
      <div className="s-slot flex items-center gap-3">
        <div className="w-[88px] shrink-0" />
        <div className="flex-1 h-11 rounded-xl border flex items-center justify-center font-black text-[9px] uppercase tracking-widest"
          style={{ borderColor: `${accent}45`, color: accent, background: `${accent}06` }}>
          ✨ FREE SLOT → Booking #2 In Parallel
        </div>
        <div className="w-[88px] shrink-0" />
      </div>
      <div className="flex items-center gap-1.5">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center gap-1.5 flex-1">
            <div className="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-500"
              style={{ background: step === i ? accent : `${accent}20`, transform: step === i ? 'scale(1.8)' : 'scale(1)' }} />
            <span className="text-[7px] font-mono opacity-35 hidden lg:block">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 2. MVC TERMINAL (Who Are Ya Backend) ────────────────────────────────────
export function MVCTerminal({ accent }: { accent: string }) {
  const [lines, setLines] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);

  const FLOW = [
    '$ curl https://api.who-are-ya.com/players?name=Messi',
    '',
    '→ [Client]      HTTP GET /players?name=Messi',
    '→ [Router]      app.get("/players", playersController.getPlayers)',
    '→ [Controller]  Parsing query: { name: "Messi" }',
    '→ [Mongoose]    Player.find(filter).populate("teamId")',
    '→ [MongoDB]     Atlas query executed in 3ms',
    '→ [Bcrypt]      Session token validated ✓',
    '→ [Response]    HTTP 200 OK',
    '',
    '  { "_id": "64f3a...", "name": "Lionel Messi" }',
  ];

  const run = useCallback(() => {
    if (running) return;
    setRunning(true);
    setLines([]);
    FLOW.forEach((line, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
        if (i === FLOW.length - 1) setTimeout(() => setRunning(false), 400);
      }, i * 80);
    });
  }, [running]);

  return (
    <div className="w-full rounded-[28px] overflow-hidden bg-[#0d0d0d] border border-white/8 shadow-2xl">
      <div className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <button onClick={run} disabled={running} className="text-[8px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full transition-all"
          style={{ background: accent, color: '#000' }}>{running ? 'RUNNING...' : '▶ SIMULATE'}</button>
      </div>
      <div ref={termRef} className="p-5 font-mono text-[10.5px] leading-[1.85] overflow-y-auto h-[270px]">
        {lines.length === 0 && <span className="text-white/18">Trace MVC Request...</span>}
        {lines.map((l, i) => <div key={i} style={{ color: l.includes('[MongoDB]') ? '#47a248' : '#ccc' }}>{l || '\u00A0'}</div>)}
        {running && <span className="text-white/35 animate-pulse">█</span>}
      </div>
    </div>
  );
}

// ─── 3. DISTRIBUTED NODES (Rides24) ──────────────────────────────────────────
export function DistributedNodes({ accent }: { accent: string }) {
  const [active, setActive] = useState<number | null>(null);
  const nodes = [
    { id: 0, label: 'Node A', x: 20, y: 45 },
    { id: 1, label: 'Node B', x: 50, y: 18 },
    { id: 2, label: 'Node C', x: 80, y: 45 },
    { id: 3, label: 'Node D', x: 32, y: 80 },
    { id: 4, label: 'Node E', x: 68, y: 80 },
  ];

  const simulate = (id: number) => {
    setActive(id);
    setTimeout(() => setActive(null), 2000);
  };

  return (
    <div className="relative h-52 rounded-2xl border border-white/8 bg-black/40 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {nodes.map((a, ai) => nodes.slice(ai + 1).map((b, bi) => (
          <line key={`${ai}-${bi}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={`${accent}18`} strokeWidth="0.5" />
        )))}
      </svg>
      {nodes.map(n => (
        <button key={n.id} onClick={() => simulate(n.id)} className="absolute -translate-x-1/2 -translate-y-1/2 group"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}>
          <div className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all"
            style={{ borderColor: active === n.id ? accent : `${accent}35`, background: active === n.id ? `${accent}22` : 'transparent' }}>
            <Server size={15} style={{ color: accent }} />
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── 4. WCAG CONTRAST VISUALIZER (PKE Web) ───────────────────────────────────
export function WCAGVisualizer({ accent }: { accent: string }) {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#1d1d1f');

  const luminance = (hex: string): number => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const sRGB = [r, g, b].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const contrast = useMemo(() => {
    const L1 = luminance(bgColor), L2 = luminance(fgColor);
    const lighter = Math.max(L1, L2), darker = Math.min(L1, L2);
    return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
  }, [bgColor, fgColor]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden border border-white/8" style={{ background: bgColor }}>
        <div className="p-8"><p className="text-4xl font-black" style={{ color: fgColor }}>A11Y Matters.</p></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[8px] font-mono uppercase opacity-40">Background</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
        </div>
        <div className="space-y-1">
          <label className="text-[8px] font-mono uppercase opacity-40">Foreground</label>
          <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" />
        </div>
      </div>
      <div className="rounded-xl p-4 text-center border border-white/8">
        <div className="text-3xl font-black" style={{ color: accent }}>{contrast}:1</div>
        <div className="text-[8px] font-mono opacity-35">CONTRAST RATIO</div>
      </div>
    </div>
  );
}

// ─── 5. SPOTSHARE HEATMAP (Spotshare Parking) ────────────────────────────────
export function SpotshareHeatmap({ accent }: { accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  const spotsRef = useRef<Array<{ x: number; y: number; heat: number; active: boolean }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    spotsRef.current = Array.from({ length: 18 }, () => ({
      x: Math.random() * W, y: Math.random() * H, heat: Math.random() * 0.5, active: false,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      spotsRef.current.forEach(s => {
        s.heat = Math.max(0.1, s.heat * 0.99);
        const r = 30 + s.heat * 40;
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
        grad.addColorStop(0, `${accent}${Math.floor(s.heat * 50).toString(16).padStart(2, '0')}`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI * 2); ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current!);
  }, [accent]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden bg-[#080c12]" style={{ height: '200px' }}>
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="absolute top-3 right-3 font-mono text-[8px] px-2 py-1 rounded-full border border-white/10 bg-black/50">LIVE_MONITOR</div>
      </div>
    </div>
  );
}