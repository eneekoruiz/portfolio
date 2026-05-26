"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PREMIUM PRELOADER — Minimalist high-fidelity reveal
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ESTÉTICA:
 *   - Fondo negro puro con ruido orgánico (vía globals.css)
 *   - Tipografía masiva con tracking negativo y efecto "shimmer"
 *   - Progreso visual mediante una línea ultra-fina y resplandor radial
 *   - Transición de salida tipo "Cinematic Zoom & Fade"
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const motionEnabled = useMotionEnabled();
  const containerRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const barContainerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const exitFired = useRef(false);
  const exitDelayRef = useRef<number | null>(null);
  const counterTweenRef = useRef<gsap.core.Tween | null>(null);

  // Stable ref to onDone
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // ── Exit Animation (Cinematic & Premium Zoom) ──────────────────────────────
  const playExit = useCallback(() => {
    if (exitFired.current) return;
    exitFired.current = true;

    const tl = gsap.timeline({
      onComplete: () => onDoneRef.current(),
    });

    if (numRef.current) {
      tl.to(numRef.current, {
        scale: 60,
        opacity: 0,
        duration: 1.0,
        ease: "power4.inOut",
        force3D: true, // GPU acceleration to avoid pixelation
      });
    }

    const fadeTargets = [barContainerRef.current, spotlightRef.current].filter(
      Boolean,
    );
    if (fadeTargets.length > 0) {
      tl.to(
        fadeTargets,
        {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        0,
      );
    }

    if (lightRef.current) {
      tl.to(
        lightRef.current,
        {
          scale: 4,
          opacity: 0,
          duration: 1,
          ease: "power3.inOut",
        },
        0.2,
      );
    }

    if (containerRef.current) {
      tl.to(
        containerRef.current,
        {
          backgroundColor: "transparent",
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
        },
        0.6,
      );
    }
  }, []);

  // ── Spotlight Movement Animation ─────────────────────────────────────
  useEffect(() => {
    if (!spotlightRef.current) return;

    const tween = gsap.to(spotlightRef.current, {
      x: () => gsap.utils.random(-300, 300),
      y: () => gsap.utils.random(-300, 300),
      duration: () => gsap.utils.random(2, 4),
      ease: "sine.inOut",
      repeat: -1,
      repeatRefresh: true,
    });

    return () => {
      tween.kill();
    };
  }, []);

  // ── Counter Logic (High precision) ──────────────────────────────────────
  useEffect(() => {
    if (!motionEnabled) {
      setN(100);
      onDoneRef.current();
      return;
    }

    const duration = 1500; // 1.5 seconds
    const counter = { value: 0 };

    counterTweenRef.current = gsap.to(counter, {
      value: 100,
      duration: duration / 1000,
      ease: "power2.out",
      onUpdate: () => {
        setN(Math.round(counter.value));
      },
      onComplete: () => {
        setN(100);
        exitDelayRef.current = window.setTimeout(() => {
          exitDelayRef.current = null;
          playExit();
        }, 150);
      },
    });

    return () => {
      counterTweenRef.current?.kill();
      counterTweenRef.current = null;
      if (exitDelayRef.current !== null) {
        clearTimeout(exitDelayRef.current);
        exitDelayRef.current = null;
      }
    };
  }, [motionEnabled, playExit]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-page text-ink overflow-hidden"
      role="status"
      aria-live="polite"
      aria-busy={n < 100}
    >
      {/* ── Grid Background (Linear) ── */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--line) 1px, transparent 1px),
            linear-gradient(90deg, var(--line) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* ── Ambient Light (Follows progress) ── */}
      <div
        ref={lightRef}
        className="absolute pointer-events-none rounded-full opacity-20"
        aria-hidden="true"
        style={{
          width: "80vw",
          height: "80vw",
          background:
            "radial-gradient(circle, rgba(0,102,255,0.15) 0%, transparent 70%)",
          filter: "blur(120px)",
          transform: `scale(${1 + (n / 100) * 0.5})`,
        }}
      />

      {/* ── Moving Spotlight (Blue Flashlight) ── */}
      <div
        ref={spotlightRef}
        className="absolute pointer-events-none z-0"
        aria-hidden="true"
        style={{
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(0,163,255,0.1) 0%, transparent 75%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Main Counter (Perfectly Centered) ── */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div
          ref={numRef}
          className="font-black text-[clamp(7rem,22vw,16rem)] tracking-[-0.08em] leading-none select-none mix-blend-difference will-change-transform"
          style={{
            color: "var(--ink)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transformOrigin: "center center",
          }}
          aria-label={`${n} percent loaded`}
        >
          {n}
        </div>

        {/* ── Progress Bar (Positioned below center) ── */}
        <div
          ref={barContainerRef}
          className="absolute top-[120%] flex flex-col items-center gap-4 opacity-40"
          role="progressbar"
          aria-valuenow={n}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="w-64 h-[1px] bg-ink/10 relative overflow-hidden rounded-full">
            <div
              ref={barRef}
              className="absolute inset-0 bg-ink origin-left"
              style={{
                transform: `scaleX(${n / 100})`,
                transition: "transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
              }}
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] tracking-[0.6em] uppercase opacity-40 font-black">
              {n < 100 ? "Initializing Protocol" : "Signal Synchronized"}
            </span>
            <div
              className={`w-1.5 h-1.5 rounded-full bg-brand ${n < 100 ? "animate-pulse" : ""}`}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* ── Corner Indices (Premium Detail) ── */}
      <div className="absolute top-12 left-12 flex flex-col gap-2 opacity-15">
        <div className="w-10 h-[1px] bg-ink" />
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase font-bold">
          Terminal_Auth
        </span>
      </div>
      <div className="absolute bottom-12 right-12 flex flex-col items-end gap-2 opacity-15">
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase font-bold">
          Node_01 // 2026
        </span>
        <div className="w-10 h-[1px] bg-ink" />
      </div>
    </div>
  );
}
