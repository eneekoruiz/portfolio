"use client";

import { useEffect, useRef } from "react";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";

const getAdaptivePixelRatio = () => {
  if (typeof window !== "undefined") {
    const LITE =
      !!window.__LITE ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (LITE) return 1.0;
  }
  return Math.min(window.devicePixelRatio || 1, 1.5);
};

export function NetworkParticles() {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    const cv = cvRef.current!;
    const ctx = cv.getContext("2d")!;
    let W = 0,
      H = 0,
      raf = 0;
    let paused = false;

    // Detect lightweight mode
    const LITE =
      typeof window !== "undefined" &&
      (!!window.__LITE ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // x, y, velocity x, velocity y, radius
    type Pt = { x: number; y: number; vx: number; vy: number; r: number };
    const pts: Pt[] = [];

    const NUM_PTS = LITE ? 55 : 130;
    const mouse = { x: -999, y: -999 };

    const resize = () => {
      const ratio = getAdaptivePixelRatio();
      W = cv.width = Math.floor(cv.offsetWidth * ratio);
      H = cv.height = Math.floor(cv.offsetHeight * ratio);
      cv.style.width = `${cv.offsetWidth}px`;
      cv.style.height = `${cv.offsetHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const mm = (e: MouseEvent) => {
      const rect = cv.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const touch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = cv.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    };

    const ml = () => {
      mouse.x = -999;
      mouse.y = -999;
    };

    // Delegate event listeners to the parent section to capture interaction over text/cards
    const container = cv.closest("section") || cv;
    container.addEventListener("mousemove", mm as EventListener);
    container.addEventListener("mouseleave", ml);
    container.addEventListener("touchstart", touch as EventListener, {
      passive: true,
    });
    container.addEventListener("touchmove", touch as EventListener, {
      passive: true,
    });
    container.addEventListener("touchend", ml);
    container.addEventListener("touchcancel", ml);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        paused = false;
        if (!raf && motionEnabled) raf = requestAnimationFrame(loop);
      } else {
        paused = true;
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    if (!motionEnabled) {
      ctx.clearRect(0, 0, W, H);
      return () => {
        ctx.clearRect(0, 0, W, H);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", handleVisibility);
        container.removeEventListener("mousemove", mm as EventListener);
        container.removeEventListener("mouseleave", ml);
        container.removeEventListener("touchstart", touch as EventListener);
        container.removeEventListener("touchmove", touch as EventListener);
        container.removeEventListener("touchend", ml);
        container.removeEventListener("touchcancel", ml);
      };
    }

    for (let i = 0; i < NUM_PTS; i++) {
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 1.5 + 1.2,
      });
    }

    const loop = () => {
      if (paused || document.visibilityState !== "visible") {
        raf = 0;
        return;
      }

      ctx.clearRect(0, 0, W, H);

      const maxDist = 160;
      const mouseDist = 220; // Ratón atrae desde más lejos
      const maxDistSq = maxDist * maxDist;
      const mouseDistSq = mouseDist * mouseDist;
      const len = pts.length;

      for (let i = 0; i < len; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // Dibujar el punto
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 102, 255, 0.8)";
        ctx.fill();

        // Conectar con otros puntos
        for (let j = i + 1; j < len; j++) {
          const p2 = pts[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / maxDist) * 0.45;
            ctx.strokeStyle = `rgba(0, 102, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Conectar y atraer/repeler suavemente con el ratón o dedo
        if (mouse.x !== -999) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseDistSq) {
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            const alpha = (1 - dist / mouseDist) * 0.65;
            ctx.strokeStyle = `rgba(0, 102, 255, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Mecánica táctil premium: atracción a distancia, fuerte repulsión de proximidad
            const force = (mouseDist - dist) / mouseDist;
            if (dist > 45) {
              // Atracción hacia el cursor (juntar las telas)
              p.x -= dx * 0.012 * force;
              p.y -= dy * 0.012 * force;
            } else {
              // Repulsión magnética cercana (efecto burbuja táctil)
              p.x += dx * 0.06 * force;
              p.y += dy * 0.06 * force;
            }
          }
        }
      }

      raf = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      container.removeEventListener("mousemove", mm as EventListener);
      container.removeEventListener("mouseleave", ml);
      container.removeEventListener("touchstart", touch as EventListener);
      container.removeEventListener("touchmove", touch as EventListener);
      container.removeEventListener("touchend", ml);
      container.removeEventListener("touchcancel", ml);
    };
  }, [motionEnabled]);

  return (
    <canvas
      ref={cvRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0 print:hidden"
      aria-hidden="true"
    />
  );
}
