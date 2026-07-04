"use client";

/**
 * CursorTrail — Awwwards-grade cursor particle trail
 * ──────────────────────────────────────────────────
 * Creates a canvas overlay that renders glowing particles
 * that follow the cursor with fade-out physics.
 *
 * This is the signature effect seen on the best creative portfolios:
 * - Each mouse move spawns a particle
 * - Particles have velocity, gravity, and alpha decay
 * - Uses mix-blend-mode: screen for premium light effect
 *
 * Only activates on fine-pointer devices (mouse).
 * Respects motionEnabled preference.
 */

import { useEffect, useRef, useState } from "react";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  hue: number;
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -999, y: -999 });
  const lastMouseRef = useRef({ x: -999, y: -999 });
  const motionEnabled = useMotionEnabled();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !motionEnabled) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Only spawn particles when moving fast enough
      if (speed > 2) {
        const count = Math.min(Math.floor(speed * 0.4), 4);
        for (let i = 0; i < count; i++) {
          particles.current.push({
            x: e.clientX + (Math.random() - 0.5) * 4,
            y: e.clientY + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 1.5 + dx * 0.06,
            vy: (Math.random() - 0.5) * 1.5 + dy * 0.06 - 0.4,
            alpha: 0.55 + Math.random() * 0.3,
            size: 1.5 + Math.random() * 2.5,
            hue: 210 + Math.random() * 40, // Blue range: 210–250
          });
        }

        // Keep particle count bounded
        if (particles.current.length > 120) {
          particles.current = particles.current.slice(-120);
        }
      }

      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      if (disposed) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.current = particles.current.filter((p) => p.alpha > 0.01);

      for (const p of particles.current) {
        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // Gravity
        p.vx *= 0.97; // Drag
        p.alpha *= 0.91; // Fade

        // Draw
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.globalCompositeOperation = "screen";

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 85%, 1)`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 60%, 0.5)`);
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [mounted, motionEnabled]);

  if (!mounted || !motionEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999998,
        pointerEvents: "none",
        opacity: 0.85,
      }}
      aria-hidden="true"
    />
  );
}
