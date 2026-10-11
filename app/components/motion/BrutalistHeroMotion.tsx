"use client";

import { useEffect, useRef, useState } from "react";

interface BrutalistHeroMotionProps {
  enabled: boolean;
}

export function BrutalistHeroMotion({ enabled }: BrutalistHeroMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const el = containerRef.current;
    if (!el) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const relY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

      // Calculate tilt angles: max +/- 12 degrees
      const normX = (relX / rect.width - 0.5) * 2;
      const normY = (relY / rect.height - 0.5) * 2;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setCoords({ x: Math.round(relX), y: Math.round(relY) });
        setTilt({ x: -(normY * 12), y: normX * 12 });
      });
    };

    const handlePointerLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setTilt({ x: 0, y: 0 });
      });
    };

    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full flex-col justify-between overflow-hidden p-5 select-none bg-black/40 backdrop-blur-md"
      style={{
        perspective: "1000px",
      }}
      aria-hidden="true"
    >
      {/* Blueprint Grid & Scanline */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0, 102, 255, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 102, 255, 0.25) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Sweeping Laser Scanline */}
      {enabled && (
        <div
          className="pointer-events-none absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-60 animate-[scanline_4s_linear_infinite]"
          style={{
            boxShadow: "0 0 12px var(--brand), 0 0 24px var(--brand)",
          }}
        />
      )}

      {/* Top HUD Telemetry */}
      <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-lead/80">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-white font-bold">CORE_HUD // 01</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">60.0 FPS</span>
          <span className="text-brand font-semibold">ONLINE</span>
        </div>
      </div>

      {/* Central Kinetic Brutalist Reactor & Gyroscope */}
      <div
        className="relative my-auto flex items-center justify-center py-6 transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
          {/* Outer Graduation Dial Ring */}
          <svg
            className={`absolute inset-0 h-full w-full text-brand/30 ${
              enabled ? "animate-[spin_40s_linear_infinite]" : ""
            }`}
            viewBox="0 0 200 200"
          >
            <circle
              cx="100"
              cy="100"
              r="94"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
            <circle
              cx="100"
              cy="100"
              r="86"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="40 20 10 20"
            />
            {/* Cardinal Degree Markers */}
            <line x1="100" y1="4" x2="100" y2="12" stroke="var(--brand)" strokeWidth="2" />
            <line x1="100" y1="188" x2="100" y2="196" stroke="var(--brand)" strokeWidth="2" />
            <line x1="4" y1="100" x2="12" y2="100" stroke="var(--brand)" strokeWidth="2" />
            <line x1="188" y1="100" x2="196" y2="100" stroke="var(--brand)" strokeWidth="2" />
          </svg>

          {/* Middle Counter-Rotating Technical Ring */}
          <svg
            className={`absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] text-white/20 ${
              enabled ? "animate-[spin_25s_linear_infinite_reverse]" : ""
            }`}
            viewBox="0 0 160 160"
          >
            <polygon
              points="80,10 145,45 145,115 80,150 15,115 15,45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="var(--brand)"
              strokeWidth="0.75"
              strokeDasharray="4 8"
              opacity="0.6"
            />
          </svg>

          {/* Inner Brutalist Crosshair Reticle */}
          <div
            className={`absolute inset-8 rounded-full border border-brand/40 bg-brand/[0.04] backdrop-blur-[2px] ${
              enabled ? "animate-[pulse_3s_ease-in-out_infinite]" : ""
            }`}
          >
            {/* Center Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-brand/30" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-brand/30" />
          </div>

          {/* Core Architectural Monogram & Ticker */}
          <div
            className="relative z-20 flex flex-col items-center justify-center text-center"
            style={{ transform: "translateZ(30px)" }}
          >
            <span className="font-mono text-5xl sm:text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_24px_rgba(0,102,255,0.7)]">
              ER
            </span>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-brand font-bold">
              <span>SYS_ARCH</span>
              <span className="text-white/40">/</span>
              <span>2026</span>
            </div>
            <span className="mt-1 font-mono text-[8px] tracking-[0.15em] text-lead/80">
              UPV/EHU • 43°N
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Technical Readout & Interactive Coordinates */}
      <div className="relative z-10 flex items-end justify-between border-t border-ink/10 pt-3 font-mono text-[9px] tracking-[0.14em] text-lead">
        <div>
          <span className="text-lead/60 block">COORDINATES</span>
          <span className="text-white font-medium">43.3183° N, 1.9812° W</span>
        </div>
        <div className="text-right">
          <span className="text-lead/60 block">RETICLE_TRACK</span>
          <span className="text-brand font-medium">
            X:{String(coords.x).padStart(3, "0")} Y:{String(coords.y).padStart(3, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}
