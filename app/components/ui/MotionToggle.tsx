"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { useSound } from "../../hooks/useSound";
import { useTranslations } from "../../hooks/useTranslations";
import { useSpringHover } from "../../hooks/useSpringHover";

export function MotionToggle() {
  const { ui } = useTranslations();
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { playClick } = useSound();
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const button = useSpringHover<HTMLButtonElement>(enabled, 8);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      try {
        setEnabled(
          localStorage.getItem("portfolio-motion-enabled") !== "false",
        );
      } catch {}
    }
    return () => {
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    };
  }, []);

  const handleToggle = () => {
    const nextState = !enabled;
    setEnabled(nextState);
    playClick();

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("portfolio-motion-enabled", String(nextState));
      } catch {}
      window.dispatchEvent(
        new CustomEvent("portfolio-motion-changed", {
          detail: { enabled: nextState },
        }),
      );
    }

    setIsAnimating(true);
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="w-9 h-9 rounded-xl bg-white/60 dark:bg-white/[0.06] border border-black/5 dark:border-white/10 backdrop-blur-xl shrink-0"
      />
    );
  }

  return (
    <button
      ref={button}
      data-motion-toggle
      onClick={handleToggle}
      aria-pressed={!enabled}
      aria-label={enabled ? ui.motionPause : ui.motionResume}
      title={enabled ? ui.motionPause : ui.motionResume}
      className="group relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/60 dark:bg-white/[0.06] border border-black/5 dark:border-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-brand overflow-hidden"
    >
      {/* ── Background Glow Pulse ── */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-full transition-all duration-700 ${
          isAnimating ? "opacity-100 scale-150" : "opacity-0 scale-50"
        }`}
        style={{
          background: enabled
            ? "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(107,114,128,0.15) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Pause Icon (Visible when enabled) */}
        <Pause
          size={15}
          strokeWidth={2.5}
          className={`absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            enabled
              ? "opacity-100 translate-y-0 rotate-0 scale-100 text-emerald-500 dark:text-emerald-400"
              : "opacity-0 -translate-y-8 rotate-45 scale-50"
          }`}
          style={{
            filter: enabled
              ? "drop-shadow(0 0 6px rgba(16,185,129,0.5))"
              : "none",
          }}
        />

        {/* Play Icon (Visible when disabled) */}
        <Play
          size={15}
          strokeWidth={2.5}
          className={`absolute transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            enabled
              ? "opacity-0 translate-y-8 -rotate-45 scale-50"
              : "opacity-100 translate-y-0 rotate-0 scale-100 text-neutral-500 dark:text-neutral-400"
          }`}
        />
      </div>
    </button>
  );
}
