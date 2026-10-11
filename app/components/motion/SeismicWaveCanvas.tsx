"use client";

import React, { useEffect, useRef } from "react";

interface SeismicWaveCanvasProps {
  stageRef: React.RefObject<HTMLElement | null>;
  charRefs: React.RefObject<(HTMLElement | null)[]>;
  onComplete?: () => void;
}

// ── ONDA DE CHOQUE SÍSMICA REAL (Física de Refracción y Presión Tectónica) ──
// Sin colores de circo ni aros azules: onda de compresión física y refracción cáustica pura
class TrueSeismicShockfront {
  x: number;
  y: number;
  r: number;
  maxR: number;
  velocity: number;
  amplitude: number;
  life: number;
  dead: boolean;
  isMainRupture: boolean;

  constructor(
    x: number,
    y: number,
    maxR: number,
    amplitude = 1.0,
    velocity = 34,
    isMainRupture = false,
  ) {
    this.x = x;
    this.y = y;
    this.r = 6;
    this.maxR = maxR;
    this.amplitude = amplitude;
    this.velocity = velocity;
    this.isMainRupture = isMainRupture;
    this.life = 1.0;
    this.dead = false;
  }

  update() {
    this.r += this.velocity;
    // Desaceleración en medio litosférico
    this.velocity *= this.isMainRupture ? 0.982 : 0.96;
    this.life = 1 - this.r / this.maxR;
    if (this.life <= 0) this.dead = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.dead || this.life <= 0) return;

    // Envolvente de energía de choque
    const energy = Math.sin(this.life * Math.PI) * this.amplitude;
    if (energy <= 0.01) return;

    ctx.save();

    // 1. Surco de descompresión sísmica (sombra óptica de rarefacción tras el choque)
    const troughR = Math.max(2, this.r - (this.isMainRupture ? 14 : 5));
    ctx.beginPath();
    ctx.arc(this.x, this.y, troughR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 0, 0, ${energy * 0.32})`;
    ctx.lineWidth = this.isMainRupture ? 14 : 5;
    ctx.stroke();

    // 2. Frente de compresión cáustico (refracción de alta presión - luz blanca pura hiper-nítida)
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${energy * 0.95})`;
    ctx.lineWidth = this.isMainRupture ? 2.8 : 1.5;
    ctx.shadowColor = `rgba(255, 255, 255, 0.85)`;
    ctx.shadowBlur = this.isMainRupture ? 12 : 5;
    ctx.stroke();

    // 3. Ondas secundarias de dispersión geológica (Rayleigh / onda S transversal)
    if (this.isMainRupture && this.r > 35) {
      const secondaryR = this.r - 24;
      if (secondaryR > 0) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, secondaryR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${energy * 0.4})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      const tertiaryR = this.r - 48;
      if (tertiaryR > 0) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, tertiaryR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${energy * 0.2})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    // 4. Epicentro de detonación tectónica (destello focal en el origen del sismo)
    if (this.isMainRupture && this.r < 150) {
      const coreAlpha = (1 - this.r / 150) * this.amplitude * 0.45;
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 130);
      grad.addColorStop(0, `rgba(255, 255, 255, ${coreAlpha})`);
      grad.addColorStop(0.4, `rgba(255, 255, 255, ${coreAlpha * 0.15})`);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 130, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// ── MICRO-PULSO DE FRACTURA LOCAL EN CADA LETRA ──
class TectonicLetterPulse {
  x: number;
  y: number;
  r: number;
  maxR: number;
  life: number;
  dead: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.r = 3;
    this.maxR = 60;
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
    const energy = Math.sin(this.life * Math.PI) * 0.45;

    ctx.save();
    // Surco óptico sutil
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(1, this.r - 3), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 0, 0, ${energy * 0.25})`;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Frente de choque blanco cáustico
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${energy * 0.85})`;
    ctx.lineWidth = 1.4;
    ctx.shadowColor = `rgba(255, 255, 255, 0.7)`;
    ctx.shadowBlur = 4;
    ctx.stroke();
    ctx.restore();
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
  const shockfrontsRef = useRef<TrueSeismicShockfront[]>([]);
  const letterPulsesRef = useRef<TectonicLetterPulse[]>([]);
  
  // Parámetros de aceleración sísmica física
  const seismicImpulseX = useRef(0);
  const seismicImpulseY = useRef(0);
  const seismicDecay = useRef(0.85);

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

    let frameCount = 0;

    const render = () => {
      frameCount++;

      // ── SACUDIDA SÍSMICA REAL (Ondas P y S con aceleración física) ──
      const curX = seismicImpulseX.current;
      const curY = seismicImpulseY.current;
      const hasMotion = Math.abs(curX) > 0.08 || Math.abs(curY) > 0.08;

      if (hasMotion && stageRef.current) {
        // Oscilación armónica de alta frecuencia típica de un sismo geológico (frecuencia rápida)
        const jitterX = Math.sin(frameCount * 1.4) * curX + (Math.random() - 0.5) * (curX * 0.4);
        const jitterY = Math.cos(frameCount * 1.7) * curY + (Math.random() - 0.5) * (curY * 0.4);
        const rotJitter = Math.sin(frameCount * 1.2) * (curX * 0.03);

        stageRef.current.style.transform = `translate3d(${jitterX.toFixed(1)}px, ${jitterY.toFixed(1)}px, 0) rotate(${rotJitter.toFixed(2)}deg)`;

        // Amortiguamiento exponencial
        seismicImpulseX.current *= seismicDecay.current;
        seismicImpulseY.current *= seismicDecay.current;
      } else if (stageRef.current && stageRef.current.style.transform) {
        stageRef.current.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
        seismicImpulseX.current = 0;
        seismicImpulseY.current = 0;
      }

      // ── LIMPIEZA ABSOLUTA DE CANVAS (Cero acumulación ni manchas) ──
      ctx.clearRect(0, 0, width, height);

      // Render pulsos de fractura local por letra
      const pulses = letterPulsesRef.current;
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.update();
        p.draw(ctx);
        if (p.dead) pulses.splice(i, 1);
      }

      // Render ondas de choque sísmicas mayores
      const fronts = shockfrontsRef.current;
      for (let i = fronts.length - 1; i >= 0; i--) {
        const f = fronts[i];
        f.update();
        f.draw(ctx);
        if (f.dead) fronts.splice(i, 1);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    // Click interactivo: impacto sísmico con réplica
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button") || target?.closest("a")) return;

      // Dispara onda de compresión cáustica
      shockfrontsRef.current.push(
        new TrueSeismicShockfront(e.clientX, e.clientY, 650, 1.1, 28, false),
      );

      // Sacudida sísmica direccional instantánea
      seismicImpulseX.current = (Math.random() > 0.5 ? 1 : -1) * 14;
      seismicImpulseY.current = -12;
      seismicDecay.current = 0.86;
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", handlePointerDown);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // ── COREOGRAFÍA TECTÓNICA AUTOMÁTICA POR DEFECTO ──
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const launchTectonicSequence = () => {
      let chars = charRefs.current ?? [];
      if (!chars || chars.length < 10) {
        if (stageRef.current) {
          chars = Array.from(
            stageRef.current.querySelectorAll<HTMLElement>("[data-kinetic-char]"),
          );
        } else {
          chars = Array.from(
            document.querySelectorAll<HTMLElement>("[data-kinetic-char]"),
          );
        }
      }

      if (!chars || chars.length < 10) {
        timer = setTimeout(launchTectonicSequence, 40);
        return;
      }

      if (hasStartedRef.current) return;
      hasStartedRef.current = true;

      // 1. Ocultar inicialmente
      chars.forEach((c) => {
        if (c) c.classList.remove("revealed");
      });

      // 2. Failsafe absoluto de visibilidad: a los 1.6s siempre revelar todo
      setTimeout(() => {
        chars.forEach((c) => {
          if (c) c.classList.add("revealed");
        });
      }, 1600);

      // 3. Cadencia rítmica de sismos locales no-lineal:
      // E (0) -> z (8) -> k (3) -> R (5) -> o (4) -> n (1) -> i (7) -> e (2) -> u (6) -> . (9)
      const order = [0, 8, 3, 5, 4, 1, 7, 2, 6, 9];
      const cadence = 85;

      order.forEach((charIdx, i) => {
        setTimeout(() => {
          const el = chars[charIdx];
          if (!el) return;

          const rect = el.getBoundingClientRect();
          const posX = rect.left + rect.width / 2;
          const posY = rect.top + rect.height / 2;

          // Micro-pulso de fractura en las coordenadas de la letra
          letterPulsesRef.current.push(new TectonicLetterPulse(posX, posY));

          // Jolt sísmico local en el suelo
          seismicImpulseX.current = (Math.random() - 0.5) * 8;
          seismicImpulseY.current = (Math.random() - 0.5) * 6;
          seismicDecay.current = 0.88;

          // Emerge la letra con resorte
          el.classList.add("revealed");

          // ── 4. ¡EL GRAN TERREMOTO FINAL (RUPTURA DE FALLA TECTÓNICA)! ──
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

              const maxExtent = Math.max(window.innerWidth, window.innerHeight) * 1.35;

              // RUPTURA PRINCIPAL: Frente de choque cáustico colosal
              shockfrontsRef.current.push(
                new TrueSeismicShockfront(cx, cy, maxExtent, 1.8, 38, true),
              );

              // Réplica sísmica 1 (+110ms)
              setTimeout(() => {
                shockfrontsRef.current.push(
                  new TrueSeismicShockfront(cx, cy, maxExtent * 0.85, 1.2, 28, false),
                );
              }, 110);

              // Réplica sísmica 2 (+220ms)
              setTimeout(() => {
                shockfrontsRef.current.push(
                  new TrueSeismicShockfront(cx, cy, maxExtent * 0.65, 0.8, 22, false),
                );
              }, 220);

              // ¡SACUDIDA TECTÓNICA VIOLENTA REAL DEL ESCENARIO!
              // Jolt inicial asimétrico de gran desplazamiento (-26px vertical)
              seismicImpulseX.current = -18;
              seismicImpulseY.current = 24;
              seismicDecay.current = 0.89; // Amortiguamiento paulatino con temblores residuales

              // Destello de presión atmosférica
              if (flashRef.current) {
                flashRef.current.style.opacity = "0.28";
                setTimeout(() => {
                  if (flashRef.current) flashRef.current.style.opacity = "0";
                }, 140);
              }

              onComplete?.();
            }, 220);
          }
        }, 50 + i * cadence);
      });
    };

    launchTectonicSequence();

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        ref={flashRef}
        className="fixed inset-0 bg-white pointer-events-none z-40 opacity-0 transition-opacity duration-300"
        aria-hidden="true"
      />
    </>
  );
}
