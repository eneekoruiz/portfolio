"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export function DebugHUD() {
  const [active, setActive] = useState(false);
  const [fps, setFps] = useState(0);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "d" &&
        !["input", "textarea"].includes(
          (e.target as HTMLElement).tagName.toLowerCase(),
        )
      ) {
        setActive((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    if (!active) {
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    handleResize();

    let rafId: number;
    const updateFps = () => {
      frameCount.current++;
      const now = performance.now();
      if (now >= lastTime.current + 1000) {
        setFps(
          Math.round((frameCount.current * 1000) / (now - lastTime.current)),
        );
        frameCount.current = 0;
        lastTime.current = now;
      }
      rafId = requestAnimationFrame(updateFps);
    };
    rafId = requestAnimationFrame(updateFps);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
      <div className="relative group overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-4 font-mono text-[10px] text-brand/80 shadow-2xl transition-all duration-500 hover:bg-black/60">
        {/* Decorative scanline */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

        <div className="relative space-y-2.5">
          <div className="flex items-center justify-between gap-8 border-b border-white/5 pb-2">
            <span className="uppercase tracking-widest text-white/40">
              Masterclass Debug v1.0
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span className="text-brand uppercase">Online</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            <div className="flex flex-col">
              <span className="text-white/30 uppercase text-[8px]">
                Refresh Rate
              </span>
              <span className="text-[14px] font-bold text-white leading-none">
                {fps}{" "}
                <span className="text-[10px] font-normal opacity-50">Hz</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/30 uppercase text-[8px]">
                Cursor Vector
              </span>
              <span className="text-white leading-none tracking-tighter">
                X:{coords.x} Y:{coords.y}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/30 uppercase text-[8px]">
                Resolution
              </span>
              <span className="text-white leading-none uppercase">
                {viewport.w}x{viewport.h} px
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/30 uppercase text-[8px]">
                GSAP Inst
              </span>
              <span className="text-white leading-none uppercase">
                {gsap.globalTimeline.getChildren().length} active
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 opacity-50 flex items-center gap-2">
            <div className="h-1 bg-white/10 flex-1 overflow-hidden">
              <div
                className="h-full bg-brand transition-all duration-300"
                style={{ width: `${Math.min(100, (fps / 144) * 100)}%` }}
              />
            </div>
            <span className="text-[8px] uppercase">MEM_USAGE: OK</span>
          </div>
        </div>

        {/* HUD Border Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand/40" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-brand/40" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-brand/40" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-brand/40" />
      </div>
    </div>
  );
}
