"use client";

import React, { useEffect, useRef } from "react";

interface SeismicWaveCanvasProps {
  stageRef: React.RefObject<HTMLElement | null>;
  charRefs: React.RefObject<(HTMLElement | null)[]>;
  onComplete?: () => void;
}

// ── TRAZADO DE FRENTE DE ONDA TECTÓNICO REAL (Anisotropía de Falla, Lóbulos y Ondulaciones) ──
// Nunca un círculo geométrico perfecto: reproduce la propagación no-lineal a través de roca y fallas
function drawTectonicWavefront(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseR: number,
  seed: number,
  roughness = 0.05,
  aspectRatioX = 1.18,
  aspectRatioY = 0.88,
  rotation = -0.05,
) {
  const steps = 84;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    // Lóbulos de radiación sísmica reales (patrón focal de plano de falla tectónica)
    const faultLobe = Math.sin(2 * theta + seed) * 0.085;
    const shearUndulation = Math.sin(3 * theta + seed * 1.6) * 0.045;
    const microJitter = Math.sin(11 * theta + seed * 2.7) * roughness;

    const r = baseR * (1 + faultLobe + shearUndulation + microJitter);

    // Proyección anisotrópica según la orientación de la falla geológica
    const lx = Math.cos(theta) * r * aspectRatioX;
    const ly = Math.sin(theta) * r * aspectRatioY;

    // Rotación del eje de la fractura litosférica
    const cosR = Math.cos(rotation);
    const sinR = Math.sin(rotation);
    const px = cx + (lx * cosR - ly * sinR);
    const py = cy + (lx * sinR + ly * cosR);

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
}

// ── TRAZADO DE MICRO-FRACTURA LOCAL EN CADA LETRA ──
function drawMicroFracture(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  baseR: number,
  seed: number,
) {
  const steps = 28;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    const microCrackle = Math.sin(4 * theta + seed) * 0.15 + Math.cos(7 * theta + seed * 1.5) * 0.09;
    const r = baseR * (1 + microCrackle);
    const px = cx + Math.cos(theta) * r * 1.12;
    const py = cy + Math.sin(theta) * r * 0.88;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

// ── FISURAS RADIALES DE FALLA SÍSMICA (Grietas instantáneas de alta velocidad) ──
class TectonicFissure {
  points: { x: number; y: number }[] = [];
  life = 1.0;
  dead = false;

  constructor(cx: number, cy: number, angle: number, length: number) {
    let curX = cx;
    let curY = cy;
    this.points.push({ x: curX, y: curY });
    const segments = 6;
    const segLen = length / segments;
    for (let i = 0; i < segments; i++) {
      const jitterAngle = angle + (Math.random() - 0.5) * 0.55;
      curX += Math.cos(jitterAngle) * (segLen * (0.8 + Math.random() * 0.4));
      curY += Math.sin(jitterAngle) * (segLen * (0.8 + Math.random() * 0.4));
      this.points.push({ x: curX, y: curY });
    }
  }

  update() {
    this.life -= 0.045;
    if (this.life <= 0) this.dead = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.dead || this.points.length < 2) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.strokeStyle = `rgba(0, 220, 255, ${this.life * 0.85})`;
    ctx.shadowColor = `rgba(0, 102, 255, 0.7)`;
    ctx.shadowBlur = 5;
    ctx.lineWidth = 1.3;
    ctx.stroke();
    ctx.restore();
  }
}

// ── ONDA DE CHOQUE SÍSMICA REAL CON ABERRACIÓN CROMÁTICA TECTÓNICA ──
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
  seed: number;
  aspectRatioX: number;
  aspectRatioY: number;
  rotation: number;
  chromaticOffset: number;

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
    this.seed = Math.random() * 20;
    this.aspectRatioX = 1.16 + (Math.random() - 0.5) * 0.08;
    this.aspectRatioY = 0.88 + (Math.random() - 0.5) * 0.06;
    this.rotation = -0.05 + (Math.random() - 0.5) * 0.04;
    this.chromaticOffset = isMainRupture ? 9 : 5;
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

    // 1. Ribetes cromáticos ondulantes (refracción física con dispersión espectral)
    const ribbons = [
      // Surco de rarefacción / sombra de presión (base óptica)
      {
        color: `rgba(0, 0, 0, ${energy * 0.32})`,
        shadow: "transparent",
        shadowBlur: 0,
        rDelta: -this.chromaticOffset * 1.5,
        width: this.isMainRupture ? 14 : 5,
        roughness: 0.035,
        phaseOffset: 0,
      },
      // Banda Violeta / Aberración cromática externa
      {
        color: `rgba(168, 85, 247, ${energy * 0.8})`,
        shadow: `rgba(168, 85, 247, 0.65)`,
        shadowBlur: this.isMainRupture ? 16 : 7,
        rDelta: this.chromaticOffset,
        width: this.isMainRupture ? 3.2 : 1.8,
        roughness: 0.05,
        phaseOffset: 0.45,
      },
      // Onda P Azul Real / Tensión litosférica (#0066ff)
      {
        color: `rgba(0, 102, 255, ${energy * 0.95})`,
        shadow: `rgba(0, 102, 255, 0.8)`,
        shadowBlur: this.isMainRupture ? 20 : 9,
        rDelta: 0,
        width: this.isMainRupture ? 4.5 : 2.5,
        roughness: 0.055,
        phaseOffset: 0,
      },
      // Banda Cian Eléctrico / Ionización de alta energía
      {
        color: `rgba(0, 225, 255, ${energy * 0.9})`,
        shadow: `rgba(0, 225, 255, 0.75)`,
        shadowBlur: this.isMainRupture ? 18 : 8,
        rDelta: -this.chromaticOffset * 0.55,
        width: this.isMainRupture ? 3.4 : 1.8,
        roughness: 0.06,
        phaseOffset: -0.35,
      },
      // Cresta Cáustica Blanco Especular Puro (pico de compresión hiper-nítido)
      {
        color: `rgba(255, 255, 255, ${energy * 0.98})`,
        shadow: `rgba(255, 255, 255, 0.95)`,
        shadowBlur: this.isMainRupture ? 14 : 5,
        rDelta: -this.chromaticOffset * 0.2,
        width: this.isMainRupture ? 2.4 : 1.4,
        roughness: 0.065,
        phaseOffset: 0.1,
      },
    ];

    ribbons.forEach((ribbon) => {
      const rBase = this.r + ribbon.rDelta;
      if (rBase <= 1) return;

      drawTectonicWavefront(
        ctx,
        this.x,
        this.y,
        rBase,
        this.seed + ribbon.phaseOffset,
        ribbon.roughness,
        this.aspectRatioX,
        this.aspectRatioY,
        this.rotation,
      );

      ctx.strokeStyle = ribbon.color;
      ctx.lineWidth = ribbon.width;
      ctx.shadowColor = ribbon.shadow;
      ctx.shadowBlur = ribbon.shadowBlur;
      ctx.stroke();
    });

    // 2. Ondas secundarias de dispersión geológica (Rayleigh / onda S en cian brillante)
    if (this.isMainRupture && this.r > 35) {
      const secondaryR = this.r - 26;
      if (secondaryR > 0) {
        drawTectonicWavefront(
          ctx,
          this.x,
          this.y,
          secondaryR,
          this.seed + 1.3,
          0.045,
          this.aspectRatioX * 0.98,
          this.aspectRatioY * 1.02,
          this.rotation + 0.04,
        );
        ctx.strokeStyle = `rgba(0, 215, 255, ${energy * 0.55})`;
        ctx.shadowColor = `rgba(0, 215, 255, 0.5)`;
        ctx.shadowBlur = 8;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
      const tertiaryR = this.r - 52;
      if (tertiaryR > 0) {
        drawTectonicWavefront(
          ctx,
          this.x,
          this.y,
          tertiaryR,
          this.seed + 2.7,
          0.035,
          this.aspectRatioX * 1.02,
          this.aspectRatioY * 0.98,
          this.rotation - 0.03,
        );
        ctx.strokeStyle = `rgba(168, 85, 247, ${energy * 0.4})`;
        ctx.shadowColor = `rgba(168, 85, 247, 0.4)`;
        ctx.shadowBlur = 6;
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }
    }

    // 3. Epicentro de detonación tectónica (núcleo radiante cian/azul/violeta)
    if (this.isMainRupture && this.r < 160) {
      const coreAlpha = (1 - this.r / 160) * this.amplitude * 0.6;
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 140);
      grad.addColorStop(0, `rgba(0, 225, 255, ${coreAlpha * 0.9})`);
      grad.addColorStop(0.35, `rgba(0, 102, 255, ${coreAlpha * 0.55})`);
      grad.addColorStop(0.7, `rgba(168, 85, 247, ${coreAlpha * 0.25})`);
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      drawTectonicWavefront(ctx, this.x, this.y, 140, this.seed, 0.06);
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
  seed: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.r = 3;
    this.maxR = 60;
    this.life = 1.0;
    this.dead = false;
    this.seed = Math.random() * 15;
  }

  update() {
    this.r += 6;
    this.life = 1 - this.r / this.maxR;
    if (this.life <= 0) this.dead = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.dead || this.life <= 0) return;
    const energy = Math.sin(this.life * Math.PI) * 0.55;

    ctx.save();
    // 1. Halo cromático cian/azul eléctrico
    drawMicroFracture(ctx, this.x, this.y, this.r + 2, this.seed);
    ctx.strokeStyle = `rgba(0, 102, 255, ${energy * 0.75})`;
    ctx.shadowColor = `rgba(0, 220, 255, 0.85)`;
    ctx.shadowBlur = 8;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // 2. Frente de fractura cáustico blanco
    drawMicroFracture(ctx, this.x, this.y, this.r, this.seed);
    ctx.strokeStyle = `rgba(255, 255, 255, ${energy * 0.95})`;
    ctx.shadowColor = `rgba(255, 255, 255, 0.9)`;
    ctx.shadowBlur = 5;
    ctx.lineWidth = 1.4;
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
  const fissuresRef = useRef<TectonicFissure[]>([]);
  
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

      // Render fisuras radiales de falla litosférica
      const fissures = fissuresRef.current;
      for (let i = fissures.length - 1; i >= 0; i--) {
        const f = fissures[i];
        f.update();
        f.draw(ctx);
        if (f.dead) fissures.splice(i, 1);
      }

      // Render ondas de choque sísmicas mayores (anisotrópicas, no circulares)
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

    // Click interactivo: impacto sísmico con réplica y grietas
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button") || target?.closest("a")) return;

      // Dispara onda de compresión cáustica ondulante
      shockfrontsRef.current.push(
        new TrueSeismicShockfront(e.clientX, e.clientY, 650, 1.1, 28, false),
      );

      // Fisuras tectónicas instantáneas
      for (let f = 0; f < 5; f++) {
        const angle = (f / 5) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const length = 45 + Math.random() * 65;
        fissuresRef.current.push(
          new TectonicFissure(e.clientX, e.clientY, angle, length),
        );
      }

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
                  : window.innerWidth * 0.5;
              const cy =
                firstRect && lastRect
                  ? (firstRect.top + lastRect.bottom) / 2
                  : window.innerHeight * 0.5;

              const maxExtent = Math.max(window.innerWidth, window.innerHeight) * 1.35;

              // RUPTURA PRINCIPAL: Frente de choque cáustico colosal ondulante
              shockfrontsRef.current.push(
                new TrueSeismicShockfront(cx, cy, maxExtent, 1.8, 38, true),
              );

              // Fisuras de falla litosférica disparadas desde el epicentro
              for (let f = 0; f < 8; f++) {
                const angle = (f / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
                const length = 85 + Math.random() * 120;
                fissuresRef.current.push(
                  new TectonicFissure(cx, cy, angle, length),
                );
              }

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
