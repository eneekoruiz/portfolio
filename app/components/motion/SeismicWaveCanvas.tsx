"use client";

import React, { useEffect, useRef } from "react";

interface SeismicWaveCanvasProps {
  stageRef: React.RefObject<HTMLElement | null>;
  charRefs: React.RefObject<(HTMLElement | null)[]>;
  onComplete?: () => void;
}

// ── TRAZADO DE FRENTE DE ONDA TECTÓNICO REAL (Anisotropía de Falla, Lóbulos y Ondulaciones) ──
// Optimizado para GPU con 36 vértices por anillo (cero sobrecarga CPU)
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
  const steps = 36;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    const faultLobe = Math.sin(2 * theta + seed) * 0.085;
    const shearUndulation = Math.sin(3 * theta + seed * 1.6) * 0.045;
    const microJitter = Math.sin(7 * theta + seed * 2.7) * roughness;

    const r = baseR * (1 + faultLobe + shearUndulation + microJitter);

    const lx = Math.cos(theta) * r * aspectRatioX;
    const ly = Math.sin(theta) * r * aspectRatioY;

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
  const steps = 16;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    const microCrackle = Math.sin(4 * theta + seed) * 0.12;
    const r = baseR * (1 + microCrackle);
    const px = cx + Math.cos(theta) * r * 1.1;
    const py = cy + Math.sin(theta) * r * 0.9;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

// ── FISURAS RADIALES DE FALLA SÍSMICA CON BIFURCACIONES Y PROPAGACIÓN PROGRESIVA ──
interface FissureSegment {
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  branch?: { p1: { x: number; y: number }; p2: { x: number; y: number } }[];
  intensity: number;
}

class TectonicFissure {
  segments: FissureSegment[] = [];
  life = 1.0;
  progress = 0.0;
  propagationSpeed = 0.16; // Propagación hipersónica realista (~6-8 frames)
  dead = false;

  constructor(cx: number, cy: number, angle: number, length: number) {
    let curX = cx;
    let curY = cy;
    const count = 8 + Math.floor(Math.random() * 5);
    const segLen = length / count;

    for (let i = 0; i < count; i++) {
      const jitter = angle + (Math.random() - 0.5) * 0.65;
      const nextX = curX + Math.cos(jitter) * (segLen * (0.8 + Math.random() * 0.5));
      const nextY = curY + Math.sin(jitter) * (segLen * (0.8 + Math.random() * 0.5));
      const intensity = 1 - (i / count) * 0.55;

      const seg: FissureSegment = {
        p1: { x: curX, y: curY },
        p2: { x: nextX, y: nextY },
        intensity,
      };

      // Bifurcación dendrítica: ~40% probabilidad de ramificación secundaria
      if (i > 1 && i < count - 1 && Math.random() < 0.42) {
        const branchAngle = jitter + (Math.random() > 0.5 ? 1 : -1) * (0.42 + Math.random() * 0.45);
        let bCurX = nextX;
        let bCurY = nextY;
        const bCount = 2 + Math.floor(Math.random() * 3);
        const bLen = segLen * 0.65;
        seg.branch = [];
        for (let b = 0; b < bCount; b++) {
          const bJitter = branchAngle + (Math.random() - 0.5) * 0.45;
          const bNextX = bCurX + Math.cos(bJitter) * bLen;
          const bNextY = bCurY + Math.sin(bJitter) * bLen;
          seg.branch.push({
            p1: { x: bCurX, y: bCurY },
            p2: { x: bNextX, y: bNextY },
          });
          bCurX = bNextX;
          bCurY = bNextY;
        }
      }

      this.segments.push(seg);
      curX = nextX;
      curY = nextY;
    }
  }

  update() {
    if (this.progress < 1.0) {
      this.progress = Math.min(1.0, this.progress + this.propagationSpeed);
    } else {
      this.life -= 0.022; // Persistencia geológica orgánica
      if (this.life <= 0) this.dead = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.dead || this.segments.length === 0) return;
    const maxIndex = Math.floor(this.progress * this.segments.length);
    if (maxIndex === 0) return;

    ctx.save();

    // 1. Aura electromagnética cian/violeta (trazo ancho semi-transparente acelerado por GPU)
    ctx.strokeStyle = `rgba(0, 200, 255, ${this.life * 0.55})`;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i < maxIndex; i++) {
      const seg = this.segments[i];
      ctx.moveTo(seg.p1.x, seg.p1.y);
      ctx.lineTo(seg.p2.x, seg.p2.y);
      if (seg.branch && this.progress > (i / this.segments.length) + 0.1) {
        for (const b of seg.branch) {
          ctx.moveTo(b.p1.x, b.p1.y);
          ctx.lineTo(b.p2.x, b.p2.y);
        }
      }
    }
    ctx.stroke();

    // 2. Vena central hiper-fina blanco especular (falla litosférica pura)
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.life * 0.95})`;
    ctx.lineWidth = 0.6; // Aguja afilada
    ctx.beginPath();
    for (let i = 0; i < maxIndex; i++) {
      const seg = this.segments[i];
      ctx.moveTo(seg.p1.x, seg.p1.y);
      ctx.lineTo(seg.p2.x, seg.p2.y);
    }
    ctx.stroke();

    ctx.restore();
  }
}

// ── PALETAS Y TIPOS DE ONDA ARMÓNICA SÍSMICA (Como en la captura de resonancia multicapa) ──
export type HarmonicPaletteType = "multi" | "cyan" | "violet" | "blue" | "slate" | "white";

// ── ONDA DE CHOQUE SÍSMICA REAL CON RÉPLICAS ARMÓNICAS PROGRESIVAS ──
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
  paletteType: HarmonicPaletteType;

  // Sistema de réplicas armónicas progresivas que se desprenden al viajar
  isMaster: boolean;
  harmonicsLeft: number;
  totalHarmonics: number;
  shedInterval: number;
  lastShedR: number;

  constructor(
    x: number,
    y: number,
    maxR: number,
    amplitude = 1.0,
    velocity = 34,
    isMainRupture = false,
    isMaster = false,
    harmonicsCount = 0,
    paletteType: HarmonicPaletteType = "multi",
  ) {
    this.x = x;
    this.y = y;
    this.r = 6;
    this.maxR = maxR;
    this.amplitude = amplitude;
    this.velocity = velocity;
    this.isMainRupture = isMainRupture;
    this.isMaster = isMaster;
    this.harmonicsLeft = harmonicsCount;
    this.totalHarmonics = harmonicsCount;
    this.shedInterval = 44 + Math.random() * 16;
    this.lastShedR = this.r;
    this.paletteType = paletteType;
    this.life = 1.0;
    this.dead = false;
    this.seed = Math.random() * 25;
    this.aspectRatioX = 1.15 + (Math.random() - 0.5) * 0.12;
    this.aspectRatioY = 0.88 + (Math.random() - 0.5) * 0.1;
    this.rotation = -0.05 + (Math.random() - 0.5) * 0.08;
    this.chromaticOffset = isMainRupture ? 9 : 5;
  }

  update(onSpawnHarmonic?: (child: TrueSeismicShockfront) => void) {
    this.r += this.velocity;
    // Desaceleración gradual en la litosfera
    this.velocity *= this.isMainRupture ? 0.984 : 0.966;
    this.life = 1 - this.r / this.maxR;
    if (this.life <= 0) this.dead = true;

    // Desprendimiento armónico progresivo de réplicas secundarias
    if (
      this.isMaster &&
      this.harmonicsLeft > 0 &&
      this.r - this.lastShedR >= this.shedInterval &&
      onSpawnHarmonic
    ) {
      this.lastShedR = this.r;
      const paletteSequence: HarmonicPaletteType[] = [
        "cyan",
        "violet",
        "blue",
        "slate",
        "white",
        "cyan",
        "violet",
      ];
      const cycleIndex = (this.totalHarmonics - this.harmonicsLeft) % paletteSequence.length;
      const childPalette = paletteSequence[cycleIndex];
      this.harmonicsLeft--;

      // Spawn réplica armónica concéntrica detrás del frente principal
      const child = new TrueSeismicShockfront(
        this.x,
        this.y,
        this.maxR * (0.86 + Math.random() * 0.18),
        this.amplitude * (0.82 + Math.random() * 0.15),
        this.velocity * (0.86 + Math.random() * 0.12),
        false,
        false, // Las réplicas secundarias no generan más réplicas
        0,
        childPalette,
      );
      child.r = Math.max(6, this.r - 14);
      child.seed = this.seed + (this.totalHarmonics - this.harmonicsLeft) * 3.7;
      child.aspectRatioX = this.aspectRatioX + (Math.random() - 0.5) * 0.06;
      child.aspectRatioY = this.aspectRatioY + (Math.random() - 0.5) * 0.06;
      child.rotation = this.rotation + (Math.random() - 0.5) * 0.08;
      onSpawnHarmonic(child);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.dead || this.life <= 0) return;

    // Envolvente de energía de choque
    const energy = Math.sin(this.life * Math.PI) * this.amplitude;
    if (energy <= 0.01) return;

    ctx.save();

    // ── DISTRIBUCIÓN DE CINTAS POR PALETA (Identidad multicapa de la captura acelerada por GPU) ──
    interface RibbonConfig {
      color: string;
      rDelta: number;
      width: number;
      roughness: number;
      phaseOffset: number;
    }

    let ribbons: RibbonConfig[] = [];

    if (this.paletteType === "cyan") {
      // Anillo cian puro ionizado con halo y cresta blanca
      ribbons = [
        {
          color: `rgba(0, 225, 255, ${energy * 0.28})`,
          rDelta: 0,
          width: 5.5,
          roughness: 0.065,
          phaseOffset: 0.2,
        },
        {
          color: `rgba(0, 225, 255, ${energy * 0.95})`,
          rDelta: 0,
          width: 2.2,
          roughness: 0.065,
          phaseOffset: 0.2,
        },
        {
          color: `rgba(255, 255, 255, ${energy * 0.92})`,
          rDelta: -1,
          width: 1.0,
          roughness: 0.07,
          phaseOffset: 0.05,
        },
      ];
    } else if (this.paletteType === "violet") {
      // Anillo violeta / púrpura electromagnético con halo
      ribbons = [
        {
          color: `rgba(168, 85, 247, ${energy * 0.28})`,
          rDelta: 0,
          width: 5.5,
          roughness: 0.06,
          phaseOffset: -0.3,
        },
        {
          color: `rgba(168, 85, 247, ${energy * 0.92})`,
          rDelta: 0,
          width: 2.4,
          roughness: 0.06,
          phaseOffset: -0.3,
        },
        {
          color: `rgba(216, 180, 254, ${energy * 0.88})`,
          rDelta: -1,
          width: 1.0,
          roughness: 0.065,
          phaseOffset: 0.1,
        },
      ];
    } else if (this.paletteType === "blue") {
      // Anillo azul real tectónico (#0066ff) con halo
      ribbons = [
        {
          color: `rgba(0, 102, 255, ${energy * 0.3})`,
          rDelta: 0,
          width: 6.0,
          roughness: 0.06,
          phaseOffset: 0.4,
        },
        {
          color: `rgba(0, 102, 255, ${energy * 0.96})`,
          rDelta: 0,
          width: 2.6,
          roughness: 0.06,
          phaseOffset: 0.4,
        },
        {
          color: `rgba(147, 197, 253, ${energy * 0.88})`,
          rDelta: -1,
          width: 1.1,
          roughness: 0.068,
          phaseOffset: 0,
        },
      ];
    } else if (this.paletteType === "slate") {
      // Línea de falla litosférica oscura / grafito
      ribbons = [
        {
          color: `rgba(71, 85, 105, ${energy * 0.65})`,
          rDelta: 0,
          width: 2.0,
          roughness: 0.08,
          phaseOffset: 0.5,
        },
        {
          color: `rgba(148, 163, 184, ${energy * 0.5})`,
          rDelta: 1.5,
          width: 1.0,
          roughness: 0.075,
          phaseOffset: -0.2,
        },
      ];
    } else if (this.paletteType === "white") {
      // Cresta cáustica especular pura
      ribbons = [
        {
          color: `rgba(0, 225, 255, ${energy * 0.28})`,
          rDelta: 1.5,
          width: 4.5,
          roughness: 0.06,
          phaseOffset: 0.3,
        },
        {
          color: `rgba(255, 255, 255, ${energy * 0.98})`,
          rDelta: 0,
          width: 1.6,
          roughness: 0.07,
          phaseOffset: 0,
        },
      ];
    } else {
      // "multi": Aberración espectral completa (onda principal de ruptura)
      ribbons = [
        {
          color: `rgba(0, 0, 0, ${energy * 0.3})`,
          rDelta: -this.chromaticOffset * 1.5,
          width: this.isMainRupture ? 8 : 4,
          roughness: 0.035,
          phaseOffset: 0,
        },
        {
          color: `rgba(168, 85, 247, ${energy * 0.85})`,
          rDelta: this.chromaticOffset,
          width: this.isMainRupture ? 2.8 : 1.6,
          roughness: 0.052,
          phaseOffset: 0.45,
        },
        {
          color: `rgba(0, 102, 255, ${energy * 0.96})`,
          rDelta: 0,
          width: this.isMainRupture ? 3.8 : 2.2,
          roughness: 0.058,
          phaseOffset: 0,
        },
        {
          color: `rgba(0, 225, 255, ${energy * 0.92})`,
          rDelta: -this.chromaticOffset * 0.55,
          width: this.isMainRupture ? 2.8 : 1.6,
          roughness: 0.062,
          phaseOffset: -0.35,
        },
        {
          color: `rgba(255, 255, 255, ${energy * 0.98})`,
          rDelta: -this.chromaticOffset * 0.2,
          width: this.isMainRupture ? 2.0 : 1.2,
          roughness: 0.068,
          phaseOffset: 0.1,
        },
      ];
    }

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
      ctx.stroke();
    });

    // Epicentro de detonación tectónica (núcleo radiante)
    if (this.isMainRupture && this.r < 120) {
      const coreAlpha = (1 - this.r / 120) * this.amplitude * 0.5;
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 100);
      grad.addColorStop(0, `rgba(0, 225, 255, ${coreAlpha * 0.9})`);
      grad.addColorStop(0.4, `rgba(0, 102, 255, ${coreAlpha * 0.5})`);
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      drawTectonicWavefront(ctx, this.x, this.y, 100, this.seed, 0.06);
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
    this.maxR = 50;
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
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // 2. Frente de fractura cáustico blanco
    drawMicroFracture(ctx, this.x, this.y, this.r, this.seed);
    ctx.strokeStyle = `rgba(255, 255, 255, ${energy * 0.95})`;
    ctx.lineWidth = 1.2;
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

      // Stage remains rock-solid and stable, letting the optical wave pass cleanly across the viewport
      if (stageRef.current && stageRef.current.style.transform) {
        stageRef.current.style.transform = "";
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

      // Render ondas de choque sísmicas mayores (anisotrópicas, con desprendimiento armónico)
      const fronts = shockfrontsRef.current;
      const spawnedHarmonics: TrueSeismicShockfront[] = [];
      for (let i = fronts.length - 1; i >= 0; i--) {
        const f = fronts[i];
        f.update((child) => spawnedHarmonics.push(child));
        f.draw(ctx);
        if (f.dead) fronts.splice(i, 1);
      }
      if (spawnedHarmonics.length > 0) {
        fronts.push(...spawnedHarmonics);
      }
      if (fronts.length > 5) {
        fronts.splice(0, fronts.length - 5);
      }
      if (fissures.length > 6) {
        fissures.splice(0, fissures.length - 6);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    const lastUserActionTime = { current: Date.now() };

    // ── BUCLE AMBIENTAL ARMÓNICO EN REPOSO (Ligero, elegante y con cero consumo) ──
    const ambientInterval = setInterval(() => {
      if (document.hidden) return;
      if (Date.now() - lastUserActionTime.current < 3200) return;
      if (shockfrontsRef.current.length >= 3) return;

      const cx = window.innerWidth * 0.5;
      const cy = window.innerHeight * 0.48;
      const maxExtent = Math.max(window.innerWidth, window.innerHeight) * 1.05;

      shockfrontsRef.current.push(
        new TrueSeismicShockfront(
          cx,
          cy,
          maxExtent,
          0.65,
          24,
          false,
          true, // isMaster
          2,    // 2 réplicas armónicas suaves
          "cyan",
        ),
      );
    }, 5200);

    // Click interactivo: impacto sísmico con ráfaga armónica multicapa y grietas
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("button") || target?.closest("a")) return;
      lastUserActionTime.current = Date.now();

      // 1. Onda P primaria maestra: 6 réplicas armónicas concéntricas desprendidas
      shockfrontsRef.current.push(
        new TrueSeismicShockfront(
          e.clientX,
          e.clientY,
          850,
          1.4,
          36,
          true, // isMainRupture
          true, // isMaster
          6,    // 6 réplicas armónicas progresivas
          "multi",
        ),
      );

      // 2. Ruptura de fallas radiales con bifurcación dendrítica
      for (let f = 0; f < 6; f++) {
        const angle = (f / 6) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const length = 60 + Math.random() * 80;
        fissuresRef.current.push(
          new TectonicFissure(e.clientX, e.clientY, angle, length),
        );
      }

      // 3. Onda S secundaria (cizalla transversal retrasada +135ms) con 3 réplicas
      setTimeout(() => {
        shockfrontsRef.current.push(
          new TrueSeismicShockfront(
            e.clientX,
            e.clientY,
            580,
            1.05,
            24,
            false,
            true,
            3,
            "violet",
          ),
        );
      }, 135);

      // 4. Sacudida sísmica direccional instantánea
      seismicImpulseX.current = (Math.random() > 0.5 ? 1 : -1) * 16;
      seismicImpulseY.current = -14;
      seismicDecay.current = 0.88;
    };

    // Escuchar eventos globales de impacto tectónico desde cualquier componente
    const handleTectonicEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ x?: number; y?: number; intensity?: number }>;
      const x = customEvent.detail?.x ?? window.innerWidth / 2;
      const y = customEvent.detail?.y ?? window.innerHeight / 2;
      const intensity = customEvent.detail?.intensity ?? 1.0;
      lastUserActionTime.current = Date.now();

      // 1. Onda P primaria maestra
      shockfrontsRef.current.push(
        new TrueSeismicShockfront(
          x,
          y,
          720 * intensity,
          1.45 * intensity,
          36,
          true,
          true,
          5,
          "multi",
        ),
      );

      // 2. Fisuras dendríticas
      for (let f = 0; f < 6; f++) {
        const angle = (f / 6) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
        const length = (55 + Math.random() * 70) * intensity;
        fissuresRef.current.push(new TectonicFissure(x, y, angle, length));
      }

      // 3. Onda S secundaria
      setTimeout(() => {
        shockfrontsRef.current.push(
          new TrueSeismicShockfront(
            x,
            y,
            480 * intensity,
            1.0 * intensity,
            22,
            false,
            true,
            3,
            "cyan",
          ),
        );
      }, 130);

      seismicImpulseX.current = (Math.random() > 0.5 ? 1 : -1) * (14 * intensity);
      seismicImpulseY.current = -11 * intensity;
      seismicDecay.current = 0.87;
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("tectonic-impact", handleTectonicEvent);

    return () => {
      clearInterval(ambientInterval);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("tectonic-impact", handleTectonicEvent);
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

              // RUPTURA PRINCIPAL: Frente de choque cáustico colosal ondulante con réplicas armónicas
              shockfrontsRef.current.push(
                new TrueSeismicShockfront(cx, cy, maxExtent, 1.8, 38, true, true, 6, "multi"),
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
