"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";

interface ProjectPreviewFollowerProps {
  activeProject: {
    name: string;
    color: string;
  } | null;
}

export function ProjectPreviewFollower({
  activeProject,
}: ProjectPreviewFollowerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const motionEnabled = useMotionEnabled();
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!motionEnabled) return;

    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const moveX = gsap.quickTo(container, "x", {
      duration: 1,
      ease: "power3.out",
      overwrite: "auto",
    });
    const moveY = gsap.quickTo(container, "y", {
      duration: 1,
      ease: "power3.out",
      overwrite: "auto",
    });
    const tiltZ = gsap.quickTo(inner, "rotateZ", {
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
    const skewX = gsap.quickTo(inner, "skewX", {
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (isVisible) {
        moveX(e.clientX);
        moveY(e.clientY);

        // Add a slight tilt based on velocity/direction
        const dx = e.movementX || 0;
        tiltZ(dx * 0.5);
        skewX(dx * 0.2);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [isVisible, motionEnabled]);

  useEffect(() => {
    if (activeProject) {
      setIsVisible(true);
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
        });
      }
    } else {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          scale: 0.5,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => setIsVisible(false),
        });
      } else {
        setIsVisible(false);
      }
    }
  }, [activeProject]);

  if (!motionEnabled) return null;

  if (!isVisible && !activeProject) return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 z-[30] pointer-events-none will-change-transform flex items-center justify-center"
      style={{
        width: "280px",
        height: "180px",
        marginLeft: "-140px",
        marginTop: "-220px",
        opacity: 0,
        transform: "scale(0.5)",
      }}
    >
      <div
        ref={innerRef}
        className="w-full h-full rounded-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.4)] border border-white/20 relative"
        style={{
          backgroundColor: activeProject?.color || "#000",
        }}
      >
        {/* Decorative elements to make it look "techy" */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)]" />

        {/* Actual Video Preview */}
        {activeProject && (
          <video
            src={`/projects/${activeProject.name}.webm`}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
          />
        )}

        <div className="absolute inset-0 mix-blend-overlay opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-10 h-10 rounded-full border border-white/20 mb-3 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border border-white/40 animate-ping" />
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
          <span className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/50 mb-1">
            ENK_DATA_STREAM
          </span>
          <h4 className="font-black text-white text-base uppercase tracking-tighter leading-tight drop-shadow-lg">
            {activeProject?.name.replace(/-/g, " ")}
          </h4>
          <div className="mt-4 flex gap-1.5 items-center">
            <div
              className="w-1 h-1 bg-white/40 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="w-1 h-1 bg-white/40 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="w-1 h-1 bg-white/40 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        </div>

        {/* Digital HUD Elements */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <div className="w-8 h-[1px] bg-white/30" />
          <div className="w-4 h-[1px] bg-white/30" />
        </div>
        <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1">
          <div className="w-4 h-[1px] bg-white/30" />
          <div className="w-8 h-[1px] bg-white/30" />
        </div>

        {/* Floating geometric lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <line
            x1="0"
            y1="0"
            x2="100%"
            y2="100%"
            stroke="white"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
          <line
            x1="100%"
            y1="0"
            x2="0"
            y2="100%"
            stroke="white"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
          <circle
            cx="50%"
            cy="50%"
            r="35%"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            strokeDasharray="10 5"
            className="animate-spin-slow"
          />
        </svg>
      </div>
    </div>
  );
}
