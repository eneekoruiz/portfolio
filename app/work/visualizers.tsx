"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { Database, Server, Radar, CheckCircle2, Layers } from "lucide-react";

const getAdaptivePixelRatio = () => {
  if (typeof window !== "undefined") {
    const LITE =
      !!window.__LITE ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (LITE) return 1.0;
  }
  return Math.min(window.devicePixelRatio || 1, 1.5);
};

// ── DNAHelix ──────────────────────────────────────────────────────────────────

export const DNAHelix = ({
  accent,
  secondary,
  darkMode,
  paused = false,
}: {
  accent: string;
  secondary: string;
  darkMode: boolean;
  paused?: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const rotationRef = useRef(0);
  const activeRef = useRef(false);
  const mouseRef = useRef({ x: -2000, y: -2000 });
  const colorsRef = useRef({ accent, secondary });
  const motionEnabledRef = useRef(true);
  const pausedRef = useRef(paused);
  
  // Use LITE check to decide structure dynamically
  const isLite = typeof window !== "undefined" && (!!window.__LITE || window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const steps = isLite ? 36 : 60;

  const strandPointsRef = useRef<[{x: number; y: number}[], {x: number; y: number}[]]>([
    Array.from({ length: 61 }, () => ({ x: 0, y: 0 })),
    Array.from({ length: 61 }, () => ({ x: 0, y: 0 })),
  ]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Shared spring physics keeps both strands mirrored instead of drifting apart.
  const physicsRef = useRef<{
    nodes: { x: number; y: number; vx: number; vy: number }[];
  }>({
    nodes: Array.from({ length: 61 }, () => ({ x: 0, y: 0, vx: 0, vy: 0 })),
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const initial =
      localStorage.getItem("portfolio-motion-enabled") !== "false";
    motionEnabledRef.current = initial;

    const handleMotionChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      motionEnabledRef.current = customEvent.detail.enabled;
    };

    window.addEventListener("portfolio-motion-changed", handleMotionChange);
    return () => {
      window.removeEventListener(
        "portfolio-motion-changed",
        handleMotionChange,
      );
    };
  }, []);

  useEffect(() => {
    gsap.to(colorsRef.current, {
      accent,
      secondary,
      duration: 0.8,
      ease: "power2.out",
    });
  }, [accent, secondary]);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let hoverIntensity = 0;

    const resize = () => {
      const dpr = getAdaptivePixelRatio();
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!activeRef.current || document.visibilityState !== "visible") {
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

      const baseSpeed = 0.012;

      // Calculate scroll velocity
      const currentScroll = scrollRef.current;
      const scrollVelocity = Math.abs(
        currentScroll -
          (canvas.dataset.lastScroll
             ? parseFloat(canvas.dataset.lastScroll)
             : currentScroll),
      );
      canvas.dataset.lastScroll = currentScroll.toString();

      // Get mouse position in local canvas space
      const rect = canvas.getBoundingClientRect();
      const mouseX = mouseRef.current.x - rect.left;
      const mouseY = mouseRef.current.y - rect.top;

      // Calculate closest distance to the helix in local space using squared distance
      let minDistanceSq = 99999999;
      const baseRotation = rotationRef.current;

      // Loop increment: larger step size on LITE to scan faster
      const stepInc = isLite ? 4 : 2;
      for (let i = 0; i <= steps; i += stepInc) {
        const progress = i / steps;
        const y = progress * h;
        const angle = progress * Math.PI * 4 + baseRotation;
        const r = Math.min(w * 0.15, 140);

        const x1 = w / 2 + Math.cos(angle) * r;
        const x2 = w / 2 + Math.cos(angle + Math.PI) * r;

        const d1Sq = (x1 - mouseX) ** 2 + (y - mouseY) ** 2;
        const d2Sq = (x2 - mouseX) ** 2 + (y - mouseY) ** 2;

        if (d1Sq < minDistanceSq) minDistanceSq = d1Sq;
        if (d2Sq < minDistanceSq) minDistanceSq = d2Sq;
      }
      const minDistance = Math.sqrt(minDistanceSq);

      // Smoothly interpolate hover speed boost
      const hoverRange = 220;
      let targetHover = 0;
      if (minDistance < hoverRange) {
        targetHover = (hoverRange - minDistance) / hoverRange;
      }

      hoverIntensity += (targetHover - hoverIntensity) * 0.08;

      if (motionEnabledRef.current && !pausedRef.current) {
        const hoverSpeedBoost = hoverIntensity * 0.048;
        rotationRef.current +=
          baseSpeed + scrollVelocity * 0.002 + hoverSpeedBoost;
      }

      const activeRotation = rotationRef.current;
      const accentColor = colorsRef.current.accent;
      const secondaryColor = colorsRef.current.secondary;

      const range = 220;
      const physics = physicsRef.current;
      const strandPoints = strandPointsRef.current;

      // Update Physics & Draw Strands
      for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        const y = progress * h;
        const angle = progress * Math.PI * 4 + activeRotation;
        const r = Math.min(w * 0.15, 140);
        const centerX = w / 2;
        const xOffset = Math.cos(angle) * r;

        // Shared attraction keeps the pair perfectly mirrored around center.
        const dx = mouseX - centerX;
        const dy = mouseY - y;
        const distSq = dx * dx + dy * dy;

        let targetX = 0;
        let targetY = 0;
        if (distSq < range * range) {
          const dist = Math.sqrt(distSq);
          const force = Math.pow((range - dist) / range, 1.8);
          targetX = dx * force * 0.2;
          targetY = dy * force * 0.35;
        }

        const node = physics.nodes[i];
        const stiffness = 0.06;
        const damping = 0.84;

        const ax = (targetX - node.x) * stiffness;
        const ay = (targetY - node.y) * stiffness;

        node.vx = (node.vx + ax) * damping;
        node.vy = (node.vy + ay) * damping;

        node.x += node.vx;
        node.y += node.vy;

        strandPoints[0][i].x = centerX + xOffset + node.x;
        strandPoints[0][i].y = y + node.y;
        strandPoints[1][i].x = centerX - xOffset - node.x;
        strandPoints[1][i].y = y + node.y;
      }

      for (let s = 0; s < 2; s++) {
        const pointsArray = strandPoints[s];
        
        // Draw Glow Line (Only in Dark Mode for that beautiful outer neon glow, skip heaviest layers in LITE mode)
        if (darkMode && !isLite) {
          ctx.beginPath();
          if (pointsArray.length > 0) {
            ctx.moveTo(pointsArray[0].x, pointsArray[0].y);
            for (let idx = 1; idx <= steps; idx++) {
              ctx.lineTo(pointsArray[idx].x, pointsArray[idx].y);
            }
          }

          // Subtle ambient glow (finer, premium blur aura)
          ctx.lineWidth = 6;
          ctx.strokeStyle = s === 0 ? accentColor : secondaryColor;
          ctx.globalAlpha = 0.32;
          ctx.stroke();
        }

        // Draw Main/Core Line (Thin, elegant, high-precision)
        ctx.beginPath();
        if (pointsArray.length > 0) {
          ctx.moveTo(pointsArray[0].x, pointsArray[0].y);
          for (let idx = 1; idx <= steps; idx++) {
            ctx.lineTo(pointsArray[idx].x, pointsArray[idx].y);
          }
        }

        ctx.lineWidth = 1.6;
        ctx.strokeStyle = s === 0 ? accentColor : secondaryColor;
        ctx.globalAlpha = 1.0;
        ctx.stroke();
      }

      // Draw Crossbars and Nodes using physical coordinates
      // Optimization: Increment by 3 or 4 if lightweight mode to draw fewer bars
      const crossbarStep = isLite ? 4 : 3;
      for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        const angle = progress * Math.PI * 4 + activeRotation;

        const pt1 = strandPoints[0][i];
        const pt2 = strandPoints[1][i];

        const z1 = Math.sin(angle);
        const z2 = Math.sin(angle + Math.PI);

        if (i % crossbarStep === 0) {
          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.strokeStyle = darkMode ? "#ffffff" : secondaryColor;
          ctx.globalAlpha = ((darkMode ? 0.16 : 0.08) * (z1 + z2 + 2)) / 2;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Highly refined Node rendering (Smaller, glossy and discrete)
        const size1 = 2.0 + (z1 + 1) * 2.2;
        
        // Node 1 Glow
        if (darkMode && !isLite) {
          ctx.globalAlpha = 0.22;
          ctx.beginPath();
          ctx.arc(pt1.x, pt1.y, size1 * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = accentColor;
          ctx.fill();
        } else if (!darkMode && !isLite) {
          ctx.globalAlpha = 0.08;
          ctx.beginPath();
          ctx.arc(pt1.x, pt1.y, size1 * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = accentColor;
          ctx.fill();
        }

        // Node 1 Core
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.arc(pt1.x, pt1.y, size1, 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? "#ffffff" : accentColor;
        ctx.fill();

        if (darkMode) {
          ctx.beginPath();
          ctx.arc(pt1.x, pt1.y, size1, 0, Math.PI * 2);
          ctx.lineWidth = 1.0;
          ctx.strokeStyle = accentColor;
          ctx.stroke();
        }

        // Node 2 Glow
        const size2 = 2.0 + (z2 + 1) * 2.2;
        if (darkMode && !isLite) {
          ctx.globalAlpha = 0.22;
          ctx.beginPath();
          ctx.arc(pt2.x, pt2.y, size2 * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = secondaryColor;
          ctx.fill();
        } else if (!darkMode && !isLite) {
          ctx.globalAlpha = 0.08;
          ctx.beginPath();
          ctx.arc(pt2.x, pt2.y, size2 * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = secondaryColor;
          ctx.fill();
        }

        // Node 2 Core
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.arc(pt2.x, pt2.y, size2, 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? "#ffffff" : secondaryColor;
        ctx.fill();

        if (darkMode) {
          ctx.beginPath();
          ctx.arc(pt2.x, pt2.y, size2, 0, Math.PI * 2);
          ctx.lineWidth = 1.0;
          ctx.strokeStyle = secondaryColor;
          ctx.stroke();
        }
      }

      frame = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !frame) frame = requestAnimationFrame(draw);
      },
      { threshold: 0.01 },
    );

    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full will-change-transform pointer-events-none"
      style={{ display: "block" }}
    />
  );
};

// ── TerrainMesh ───────────────────────────────────────────────────────────────

export const TerrainMesh = ({
  accent,
  darkMode,
}: {
  accent: string;
  darkMode: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(undefined);
  const tRef = useRef(0);
  const activeRef = useRef(false);
  
  const isLite = typeof window !== "undefined" && (!!window.__LITE || window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const rows = isLite ? 8 : 12;
  const cols = isLite ? 12 : 20;

  const pointsRef = useRef<{ x: number; y: number }[]>(
    Array.from({ length: (12 + 1) * (20 + 1) }, () => ({ x: 0, y: 0 })),
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const ratio = getAdaptivePixelRatio();
      canvas.width = Math.floor(canvas.offsetWidth * ratio);
      canvas.height = Math.floor(canvas.offsetHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      if (!activeRef.current || document.visibilityState !== "visible") {
        animRef.current = 0;
        return;
      }

      const W = canvas.offsetWidth,
        H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      tRef.current += 0.0035;

      const points = pointsRef.current;
      let pointIndex = 0;

      ctx.strokeStyle = accent;
      ctx.lineWidth = 0.4;
      ctx.globalAlpha = darkMode ? 0.08 : 0.04;

      // Draw Grid Lines (Spiderweb)
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const x = c * (W / cols);
          const wave =
            Math.sin(c * 0.3 + tRef.current * 2) * 15 +
            Math.sin(r * 0.5 + tRef.current * 1.5) * 10;
          const y = r * (H / rows) + wave;
          points[pointIndex].x = x;
          points[pointIndex].y = y;
          pointIndex++;
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
      const totalPoints = (rows + 1) * (cols + 1);
      ctx.globalAlpha = darkMode ? 0.15 : 0.08;
      for (let i = 0; i < totalPoints; i++) {
        if (i % 7 === 0) {
          const p = points[i];
          const pulse = (Math.sin(tRef.current * 3 + i) + 1) * 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.2 + pulse * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = accent;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !animRef.current) {
          animRef.current = requestAnimationFrame(draw);
        }
      },
      { threshold: 0.01 },
    );

    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [accent, darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80 will-change-transform"
      style={{ mixBlendMode: darkMode ? "screen" : "multiply" }}
    />
  );
};

// ── FloatingArtifact ──────────────────────────────────────────────────────────

export const FloatingArtifact = ({
  accent,
  idx,
}: {
  accent: string;
  idx: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context>(undefined);

  useEffect(() => {
    if (!ref.current) return;

    ctxRef.current = gsap.context(() => {
      gsap.to(ref.current, {
        y: `${-16 - idx * 4}`,
        x: `${Math.sin(idx) * 12}`,
        rotate: idx % 2 === 0 ? 360 : -360,
        duration: 3.6 + idx * 0.45,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        force3D: true,
      });
    });

    return () => ctxRef.current?.revert();
  }, [idx]);

  const shapes = [
    <div
      key="1"
      className="w-2 h-2 rounded-full"
      style={{ background: accent, opacity: 0.4 }}
    />,
    <div
      key="2"
      className="w-4 h-4 border rotate-45"
      style={{ borderColor: accent, opacity: 0.3 }}
    />,
    <div
      key="3"
      className="w-6 h-[1px]"
      style={{ background: accent, opacity: 0.2 }}
    />,
  ];

  return (
    <div
      ref={ref}
      className="absolute pointer-events-none will-change-transform"
      style={{
        top: `${20 + idx * 12}%`,
        left: idx % 2 === 0 ? "10%" : "85%",
        transform: "translate3d(0, 0, 0)",
      }}
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
        <div
          className="flex-1 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transition-transform hover:scale-[1.02]"
          style={{ background: accent }}
        >
          ACTIVE_01
        </div>
        <div
          className="w-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden"
          style={{ borderColor: `${accent}50`, color: accent }}
        >
          <span className="opacity-50">WAIT</span>
          <div
            className="absolute bottom-0 left-0 h-1 bg-current animate-pulse"
            style={{ width: "100%", animationDuration: "2s" }}
          />
        </div>
        <div
          className="flex-1 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transition-transform hover:scale-[1.02]"
          style={{ background: accent }}
        >
          ACTIVE_02
        </div>
      </div>
      <div
        className="h-10 rounded-xl flex items-center justify-center font-bold tracking-widest bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
        style={{ color: accent }}
      >
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
        <div className="flex items-center gap-2">
          <span style={{ color: accent }}>❯</span>
          <span className="opacity-70">GET /api/v1/players</span>
        </div>
        <div className="flex items-center gap-2 opacity-40">
          <span>[Router]</span>
          <span>Executing aggregation pipeline...</span>
        </div>
        <div
          className="flex items-center gap-2 font-bold"
          style={{ color: "#27c93f" }}
        >
          <span>✔</span>
          <span>200 OK (Latency: 12ms)</span>
        </div>
      </div>
    </div>
  );
};

export const DistributedNodes = ({ accent }: { accent: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<{ x: number; y: number; vx: number; vy: number }[]>(
    [],
  );

  useEffect(() => {
    nodesRef.current = Array.from({ length: 12 }).map(() => ({
      x: Math.random() * 300,
      y: Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, 300, 200);

      const nodes = nodesRef.current;

      // Update nodes positions directly (no React state updates to trigger re-renders!)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x = (n.x + n.vx + 300) % 300;
        n.y = (n.y + n.vy + 200) % 200;
      }

      // Draw connections using squared distance to avoid Math.sqrt in hot path
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = `${accent}30`;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 80 * 80) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [accent]);

  return (
    <div className="relative h-44 flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="w-full h-full"
      />
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
          <div className="text-[10px] font-mono opacity-40 uppercase tracking-widest text-ink">
            Contrast
          </div>
          <div
            className="text-xl font-bold font-mono"
            style={{ color: accent }}
          >
            21.0:1
          </div>
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
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at center, ${accent} 1px, transparent 1px)`,
          backgroundSize: "15px 15px",
        }}
      />
      <div
        className="absolute w-[200%] h-[200%] origin-center animate-spin"
        style={{
          background: `conic-gradient(from 0deg, transparent 70%, ${accent}40 100%)`,
          animationDuration: "3s",
          animationTimingFunction: "linear",
        }}
      />
      <div className="relative z-10 w-16 h-16 rounded-full bg-page/80 backdrop-blur-xl border border-black/10 dark:border-white/20 flex items-center justify-center shadow-xl">
        <Radar size={24} style={{ color: accent }} className="animate-pulse" />
      </div>
      <div
        className="absolute top-10 left-10 w-2 h-2 rounded-full animate-ping"
        style={{ background: accent }}
      />
      <div
        className="absolute bottom-12 right-16 w-2 h-2 rounded-full animate-ping"
        style={{ background: accent, animationDelay: "1s" }}
      />
    </div>
  );
};
