"use client";

import React, { useEffect, useRef } from "react";

interface SeismicWaveCanvasProps {
  enabled: boolean;
  stageRef: React.RefObject<HTMLElement | null>;
  charRefs: React.RefObject<(HTMLElement | null)[]>;
  onComplete?: () => void;
}

class ChromaticLiquidWave {
  x: number;
  y: number;
  r: number;
  maxR: number;
  intensity: number;
  speed: number;
  chromaticOffset: number;
  isGrandFinale: boolean;
  life: number;
  noiseSeed: number;
  dead: boolean;

  constructor(
    x: number,
    y: number,
    maxR = 260,
    intensity = 1.0,
    speed = 12,
    chromaticOffset = 10,
    isGrandFinale = false,
  ) {
    this.x = x;
    this.y = y;
    this.r = 4;
    this.maxR = maxR;
    this.intensity = intensity;
    this.speed = speed;
    this.chromaticOffset = chromaticOffset;
    this.isGrandFinale = isGrandFinale;
    this.life = 1.0;
    this.noiseSeed = Math.random() * 20;
    this.dead = false;
  }

  update() {
    this.r += this.speed;
    this.speed *= this.isGrandFinale ? 0.985 : 0.96;
    this.life = 1 - this.r / this.maxR;
    if (this.life <= 0) this.dead = true;
  }

  draw(ctx: CanvasRenderingContext2D, time: number) {
    if (this.dead || this.life <= 0) return;

    const alpha = Math.sin(this.life * Math.PI) * this.intensity;
    if (alpha <= 0.01) return;

    const ribbons = [
      {
        color: `rgba(0, 210, 255, ${alpha * 0.85})`,
        shadow: `rgba(0, 210, 255, 0.6)`,
        rDelta: -this.chromaticOffset,
        width: this.isGrandFinale ? 4.0 : 2.5,
      },
      {
        color: `rgba(0, 102, 255, ${alpha * 0.95})`,
        shadow: `rgba(0, 102, 255, 0.7)`,
        rDelta: 0,
        width: this.isGrandFinale ? 5.0 : 3.2,
      },
      {
        color: `rgba(168, 85, 247, ${alpha * 0.75})`,
        shadow: `rgba(168, 85, 247, 0.5)`,
        rDelta: this.chromaticOffset,
        width: this.isGrandFinale ? 3.5 : 2.2,
      },
      {
        color: `rgba(255, 255, 255, ${alpha * 0.95})`,
        shadow: `rgba(255, 255, 255, 0.8)`,
        rDelta: -this.chromaticOffset * 0.4,
        width: this.isGrandFinale ? 2.0 : 1.4,
      },
    ];

    const segments = this.isGrandFinale ? 140 : 80;

    ribbons.forEach((ribbon) => {
      const rBase = this.r + ribbon.rDelta;
      if (rBase <= 1) return;

      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const n1 =
          Math.sin(angle * 5 + time * 3.5 + this.noiseSeed) *
          (this.isGrandFinale ? 7 : 3.5);
        const n2 =
          Math.cos(angle * 11 - time * 2) * (this.isGrandFinale ? 3.5 : 1.8);
        const waveDeform = (n1 + n2) * (this.life * 0.9);

        const rCur = rBase + waveDeform;
        const px = this.x + Math.cos(angle) * rCur;
        const py = this.y + Math.sin(angle) * rCur;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      ctx.strokeStyle = ribbon.color;
      ctx.lineWidth = ribbon.width;
      ctx.shadowColor = ribbon.shadow;
      ctx.shadowBlur = ribbon.width * 3.5;
      ctx.stroke();
    });

    if (this.r < (this.isGrandFinale ? 140 : 60)) {
      const maxCore = this.isGrandFinale ? 140 : 60;
      const coreAlpha = (1 - this.r / maxCore) * this.intensity * 0.6;
      const grad = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        maxCore * 0.8,
      );
      grad.addColorStop(0, `rgba(0, 210, 255, ${coreAlpha})`);
      grad.addColorStop(0.4, `rgba(0, 102, 255, ${coreAlpha * 0.4})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, maxCore * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function SeismicWaveCanvas({
  enabled,
  stageRef,
  charRefs,
  onComplete,
}: SeismicWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const wavesRef = useRef<ChromaticLiquidWave[]>([]);
  const shakeRef = useRef(0);
  const sequenceStartedRef = useRef(false);

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

    let time = 0;

    const render = () => {
      time += 0.016;

      // Screen shake decay
      if (shakeRef.current > 0.1 && stageRef.current) {
        const ox = (Math.random() - 0.5) * shakeRef.current * 1.5;
        const oy = (Math.random() - 0.5) * shakeRef.current * 1.5;
        const rot = (Math.random() - 0.5) * shakeRef.current * 0.04;
        stageRef.current.style.transform = `translate3d(${ox.toFixed(1)}px, ${oy.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
        shakeRef.current *= 0.88;
      } else if (stageRef.current && stageRef.current.style.transform) {
        stageRef.current.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
        shakeRef.current = 0;
      }

      // Soft motion blur trail
      ctx.fillStyle = "rgba(7, 8, 12, 0.22)";
      ctx.fillRect(0, 0, width, height);

      // Draw active waves
      const waves = wavesRef.current;
      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        wave.update();
        wave.draw(ctx, time);
        if (wave.dead) {
          waves.splice(i, 1);
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    // Click-to-detonate interaction
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button") || target?.closest("a")) return;

      wavesRef.current.push(
        new ChromaticLiquidWave(e.clientX, e.clientY, 380, 1.1, 15, 12, false),
      );
      shakeRef.current = Math.max(shakeRef.current, 10);

      // Letter bounce physics
      const chars = charRefs.current ?? [];
      chars.forEach((c) => {
        if (!c) return;
        const rect = c.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (dist < 280) {
          const power = Math.pow(1 - dist / 280, 1.8);
          c.style.transform = `scale(${1 + power * 0.12}) translateY(${-power * 10}px)`;
          setTimeout(() => {
            c.style.transform = "scale(1) translateY(0)";
          }, 160);
        }
      });
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", handlePointerDown);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [stageRef, charRefs]);

  // Launch Choreographed Non-Linear Sequence on mount/enabled
  useEffect(() => {
    if (!enabled || sequenceStartedRef.current) return;
    sequenceStartedRef.current = true;

    const chars = charRefs.current ?? [];
    if (chars.length === 0) return;

    // Reset chars initial state
    chars.forEach((c) => {
      if (c) {
        c.style.opacity = "0";
        c.style.transform = "translateY(30px) scale(0.9)";
        c.style.filter = "blur(10px)";
      }
    });

    // Non-linear order: [0, 8, 3, 5, 4, 1, 7, 2, 6, 9]
    // 0:E, 8:z, 3:k, 5:R, 4:o, 1:n, 7:i, 2:e, 6:u, 9:.
    const order = [0, 8, 3, 5, 4, 1, 7, 2, 6, 9];
    const interval = 95;

    order.forEach((charIdx, i) => {
      setTimeout(() => {
        const el = chars[charIdx];
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        wavesRef.current.push(
          new ChromaticLiquidWave(cx, cy, 260, 0.95, 12, 9, false),
        );
        shakeRef.current = Math.max(shakeRef.current, 5);

        // Reveal letter
        el.style.opacity = "1";
        el.style.transform = "translateY(0) scale(1)";
        el.style.filter = "blur(0px)";

        // Last letter completes -> Grand finale!
        if (i === order.length - 1) {
          setTimeout(() => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight * 0.46;

            // Grand finale shockwave (triple concentric)
            wavesRef.current.push(
              new ChromaticLiquidWave(
                cx,
                cy,
                Math.max(window.innerWidth, window.innerHeight) * 1.05,
                1.4,
                24,
                22,
                true,
              ),
            );
            setTimeout(() => {
              wavesRef.current.push(
                new ChromaticLiquidWave(
                  cx,
                  cy,
                  Math.max(window.innerWidth, window.innerHeight) * 0.85,
                  1.0,
                  18,
                  16,
                  true,
                ),
              );
            }, 90);
            setTimeout(() => {
              wavesRef.current.push(
                new ChromaticLiquidWave(
                  cx,
                  cy,
                  Math.max(window.innerWidth, window.innerHeight) * 0.65,
                  0.7,
                  14,
                  12,
                  true,
                ),
              );
            }, 180);

            // Shakes everything!
            shakeRef.current = 34;

            // Bounce reaction
            chars.forEach((c, idx) => {
              if (!c) return;
              setTimeout(() => {
                c.style.transform = "scale(1.08) translateY(-4px)";
                setTimeout(() => {
                  c.style.transform = "scale(1) translateY(0)";
                }, 190);
              }, idx * 12);
            });

            onComplete?.();
          }, 280);
        }
      }, i * interval);
    });
  }, [enabled, charRefs, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
