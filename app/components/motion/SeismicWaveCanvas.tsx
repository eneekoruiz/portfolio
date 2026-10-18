"use client";

import React, { useEffect, useRef } from "react";

interface SeismicWaveCanvasProps {
  stageRef: React.RefObject<HTMLElement | null>;
  charRefs: React.RefObject<(HTMLElement | null)[]>;
  onComplete?: () => void;
}

interface HarmonicWave {
  x: number;
  y: number;
  r: number;
  maxR: number;
  velocity: number;
  amplitude: number;
  life: number;
  dead: boolean;
  color: string;
  width: number;
  seed: number;
}

export function SeismicWaveCanvas({
  charRefs,
  onComplete,
}: SeismicWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const wavesRef = useRef<HarmonicWave[]>([]);
  const hasTriggeredInitial = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const spawnWave = (
      x: number,
      y: number,
      options?: {
        maxR?: number;
        velocity?: number;
        amplitude?: number;
        color?: string;
        width?: number;
      },
    ) => {
      const maxR = options?.maxR ?? Math.max(window.innerWidth, window.innerHeight) * 0.85;
      const velocity = options?.velocity ?? 18;
      const amplitude = options?.amplitude ?? 0.85;
      const color = options?.color ?? "rgba(0, 102, 255, 0.4)";
      const w = options?.width ?? 2.0;

      wavesRef.current.push({
        x,
        y,
        r: 8,
        maxR,
        velocity,
        amplitude,
        life: 1.0,
        dead: false,
        color,
        width: w,
        seed: Math.random() * 20,
      });

      if (wavesRef.current.length > 8) {
        wavesRef.current.shift();
      }
    };

    // ── RENDER LOOP (Fluid, 60fps, zero camera shake, purely optical) ──
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const waves = wavesRef.current;
      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        wave.r += wave.velocity;
        wave.velocity *= 0.982; // Organic hydro-damping
        wave.life = 1 - wave.r / wave.maxR;

        if (wave.life <= 0) {
          wave.dead = true;
          waves.splice(i, 1);
          continue;
        }

        const energy = Math.sin(wave.life * Math.PI) * wave.amplitude;
        if (energy <= 0.01) continue;

        ctx.save();

        // 1. Primary acoustic band
        ctx.beginPath();
        const steps = 48;
        for (let s = 0; s <= steps; s++) {
          const theta = (s / steps) * Math.PI * 2;
          const undulation = Math.sin(theta * 3 + wave.seed) * 0.04;
          const currentR = wave.r * (1 + undulation);
          const px = wave.x + Math.cos(theta) * currentR;
          const py = wave.y + Math.sin(theta) * (currentR * 0.92);
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        ctx.strokeStyle = `rgba(0, 102, 255, ${energy * 0.55})`;
        ctx.lineWidth = wave.width * 1.5;
        ctx.stroke();

        // 2. Specular caustic highlight (fine white hairline)
        ctx.strokeStyle = `rgba(255, 255, 255, ${energy * 0.75})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();

        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    // ── CLICK & TAP RIPPLE ──
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button") || target?.closest("a")) return;

      spawnWave(e.clientX, e.clientY, {
        maxR: 650,
        velocity: 24,
        amplitude: 0.95,
        width: 2.2,
      });

      // Harmonic second echo (+120ms)
      setTimeout(() => {
        spawnWave(e.clientX, e.clientY, {
          maxR: 420,
          velocity: 16,
          amplitude: 0.6,
          width: 1.4,
        });
      }, 120);
    };

    // ── TECTONIC SYSTEM EVENTS (from buttons, cards, etc.) ──
    const handleTectonicEvent = (e: Event) => {
      const ce = e as CustomEvent<{ x?: number; y?: number; intensity?: number }>;
      const x = ce.detail?.x ?? window.innerWidth / 2;
      const y = ce.detail?.y ?? window.innerHeight / 2;
      const intensity = ce.detail?.intensity ?? 1.0;

      spawnWave(x, y, {
        maxR: 700 * intensity,
        velocity: 22 * intensity,
        amplitude: 0.85 * intensity,
      });
    };

    // ── AMBIENT BREATHING WAVE (keeps page subtly alive) ──
    const ambientTimer = setInterval(() => {
      if (document.hidden) return;
      if (wavesRef.current.length >= 2) return;

      spawnWave(window.innerWidth * 0.5, window.innerHeight * 0.45, {
        maxR: Math.max(window.innerWidth, window.innerHeight) * 0.9,
        velocity: 14,
        amplitude: 0.45,
        width: 1.6,
      });
    }, 6000);

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("tectonic-impact", handleTectonicEvent);

    return () => {
      clearInterval(ambientTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("tectonic-impact", handleTectonicEvent);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // ── INITIAL ENTRANCE REVEAL OF CHARACTERS ──
  useEffect(() => {
    if (hasTriggeredInitial.current) return;
    hasTriggeredInitial.current = true;

    const timer = setTimeout(() => {
      const chars = charRefs.current ?? [];
      const validChars =
        chars.length > 0
          ? chars
          : Array.from(document.querySelectorAll<HTMLElement>("[data-kinetic-char]"));

      validChars.forEach((c) => {
        if (c) c.classList.add("revealed");
      });

      onComplete?.();
    }, 200);

    return () => clearTimeout(timer);
  }, [charRefs, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
