"use client";

import React, { useEffect, useRef } from "react";

interface SeismicWaveCanvasProps {
  stageRef: React.RefObject<HTMLElement | null>;
  charRefs: React.RefObject<(HTMLElement | null)[]>;
  onComplete?: () => void;
}

// ── Master Seismic Shockwave (Onda de choque cinematográfica con energía real) ──
class EpicSeismicShockwave {
  x: number;
  y: number;
  r: number;
  maxR: number;
  speed: number;
  life: number;
  intensity: number;
  dead: boolean;

  constructor(x: number, y: number, maxR: number, intensity = 1.0, speed = 26) {
    this.x = x;
    this.y = y;
    this.r = 12;
    this.maxR = maxR;
    this.intensity = intensity;
    this.speed = speed;
    this.life = 1.0;
    this.dead = false;
  }

  update() {
    this.r += this.speed;
    this.speed *= 0.982; // Desaceleración de onda expansiva
    this.life = 1 - this.r / this.maxR;
    if (this.life <= 0) this.dead = true;
  }

  draw(ctx: CanvasRenderingContext2D, time: number) {
    if (this.dead || this.life <= 0) return;

    const alpha = Math.sin(this.life * Math.PI) * this.intensity;
    if (alpha <= 0.01) return;

    // Banda de presión de aire / fluido expansivo:
    // Trazo ancho difuminado con separación cromática sutil y elegante
    const bands = [
      { rOffset: -18, color: `rgba(0, 210, 255, ${alpha * 0.7})`, width: 14, blur: 16 },  // Frente cian
      { rOffset: 0,   color: `rgba(0, 102, 255, ${alpha * 0.9})`, width: 22, blur: 24 },  // Masa principal azul
      { rOffset: 16,  color: `rgba(168, 85, 247, ${alpha * 0.5})`, width: 12, blur: 14 }, // Estela violeta
      { rOffset: -6,  color: `rgba(255, 255, 255, ${alpha * 0.85})`, width: 2.5, blur: 4 } // Cresta nítida de presión
    ];

    bands.forEach((band) => {
      const curR = this.r + band.rOffset;
      if (curR <= 4) return;

      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, curR, 0, Math.PI * 2);
      ctx.strokeStyle = band.color;
      ctx.lineWidth = band.width;
      ctx.shadowColor = band.color;
      ctx.shadowBlur = band.blur;
      ctx.stroke();
      ctx.restore();
    });

    // Epicentro luminoso en los primeros milisegundos
    if (this.r < 180) {
      const coreAlpha = (1 - this.r / 180) * this.intensity * 0.45;
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 160);
      grad.addColorStop(0, `rgba(0, 210, 255, ${coreAlpha})`);
      grad.addColorStop(0.4, `rgba(0, 102, 255, ${coreAlpha * 0.3})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 160, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ── Micro-pulso sutil en cada letra (Limpio, no llena la pantalla de círculos) ──
class LetterMicroPulse {
  x: number;
  y: number;
  r: number;
  maxR: number;
  life: number;
  dead: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.r = 4;
    this.maxR = 75; // Muy contenido y discreto
    this.life = 1.0;
    this.dead = false;
  }

  update() {
    this.r += 6;
    this.life = 1 - this.r / this.maxR;
    if (this.life <= 0) this.dead = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.dead || this.life <= 0) return;
    const alpha = Math.sin(this.life * Math.PI) * 0.4;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 102, 255, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

export function SeismicWaveCanvas({
  stageRef,
  charRefs,
  onComplete,
}: SeismicWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const bigWavesRef = useRef<EpicSeismicShockwave[]>([]);
  const microPulsesRef = useRef<LetterMicroPulse[]>([]);
  const shakeRef = useRef(0);
  const hasStartedRef = useRef(false);

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

      // 1. Sacudida sísmica física del escenario con decaimiento amortiguado
      if (shakeRef.current > 0.1 && stageRef.current) {
        const ox = (Math.random() - 0.5) * shakeRef.current * 1.6;
        const oy = (Math.random() - 0.5) * shakeRef.current * 1.6;
        stageRef.current.style.transform = `translate3d(${ox.toFixed(1)}px, ${oy.toFixed(1)}px, 0)`;
        shakeRef.current *= 0.87;
      } else if (stageRef.current && stageRef.current.style.transform) {
        stageRef.current.style.transform = "translate3d(0, 0, 0)";
        shakeRef.current = 0;
      }

      // 2. Limpieza TOTAL del lienzo (cero círculos fantasmas)
      ctx.clearRect(0, 0, width, height);

      // 3. Render de micro-pulsos sutiles
      const pulses = microPulsesRef.current;
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.update();
        p.draw(ctx);
        if (p.dead) pulses.splice(i, 1);
      }

      // 4. Render de grandes ondas sísmicas de alta potencia
      const bigWaves = bigWavesRef.current;
      for (let i = bigWaves.length - 1; i >= 0; i--) {
        const bw = bigWaves[i];
        bw.update();
        bw.draw(ctx, time);
        if (bw.dead) bigWaves.splice(i, 1);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    // Click interactivo: dispara una onda sísmica en la posición del puntero
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button") || target?.closest("a")) return;

      bigWavesRef.current.push(
        new EpicSeismicShockwave(e.clientX, e.clientY, 700, 1.0, 22),
      );
      shakeRef.current = Math.max(shakeRef.current, 12);
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", handlePointerDown);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [stageRef]);

  // SECUENCIA AUTOMÁTICA POR DEFECTO (Arranca de inmediato en cuanto se monta)
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const chars = charRefs.current ?? [];

    // Ocultar letras inicialmente
    chars.forEach((c) => {
      if (c) c.classList.remove("revealed");
    });

    // Orden desordenado y rítmico: E -> z -> k -> R -> o -> n -> i -> e -> u -> .
    const order = [0, 8, 3, 5, 4, 1, 7, 2, 6, 9];
    const cadence = 85;

    order.forEach((charIdx, i) => {
      setTimeout(() => {
        const el = chars[charIdx];
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const posX = rect.left + rect.width / 2;
        const posY = rect.top + rect.height / 2;

        // Micro-pulso sutil (limpio y fino, NO molesta ni llena de líneas)
        microPulsesRef.current.push(new LetterMicroPulse(posX, posY));
        shakeRef.current = Math.max(shakeRef.current, 4);

        // La letra emerge limpia con muelle
        el.classList.add("revealed");

        // Al completarse el nombre: ¡GRAN IMPACTO SÍSMICO CON MUCHA FUERZA!
        if (i === order.length - 1) {
          setTimeout(() => {
            const firstRect = chars[0]?.getBoundingClientRect();
            const lastRect = chars[9]?.getBoundingClientRect();
            const cx =
              firstRect && lastRect
                ? (firstRect.left + lastRect.right) / 2
                : window.innerWidth * 0.35;
            const cy =
              firstRect && lastRect
                ? (firstRect.top + lastRect.bottom) / 2
                : window.innerHeight * 0.45;

            const maxExtent = Math.max(window.innerWidth, window.innerHeight) * 1.25;

            // ¡Gran onda sísmica expansiva con fuerza real!
            bigWavesRef.current.push(
              new EpicSeismicShockwave(cx, cy, maxExtent, 1.5, 32),
            );
            setTimeout(() => {
              bigWavesRef.current.push(
                new EpicSeismicShockwave(cx, cy, maxExtent * 0.8, 1.0, 24),
              );
            }, 110);
            setTimeout(() => {
              bigWavesRef.current.push(
                new EpicSeismicShockwave(cx, cy, maxExtent * 0.6, 0.7, 18),
              );
            }, 220);

            // ¡HACE TEMBLAR TODO EL ESCENARIO CON FUERZA!
            shakeRef.current = 42;

            // Destello luminoso atmosférico de onda de choque
            if (flashRef.current) {
              flashRef.current.style.opacity = "0.22";
              setTimeout(() => {
                if (flashRef.current) flashRef.current.style.opacity = "0";
              }, 120);
            }

            onComplete?.();
          }, 240);
        }
      }, i * cadence);
    });
  }, [charRefs, onComplete]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        ref={flashRef}
        className="fixed inset-0 bg-cyan-200 pointer-events-none z-40 opacity-0 transition-opacity duration-300"
        aria-hidden="true"
      />
    </>
  );
}
