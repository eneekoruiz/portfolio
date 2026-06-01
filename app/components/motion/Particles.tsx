"use client";

import { useEffect, useRef } from "react";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";

const getAdaptivePixelRatio = () =>
  Math.min(
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
    1.5,
  );

export function NetworkParticles() {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    const cv = cvRef.current!;
    const ctx = cv.getContext("2d", { alpha: true })!;

    let W = 0,
      H = 0,
      raf = 0;
    let paused = false;

    type Star = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
      glow: number;
    };

    let stars: Star[] = [];
    const mouse = { x: -999, y: -999 };
    let drawOffset = { x: 0, y: 0 };
    let performanceScale = 1.0;

    // Get live config from shared panel variables
    const getConfig = () => {
      const win = typeof window !== "undefined" ? (window as any) : null;
      return (
        win?.__PARTICLE_CONFIG || {
          density: 0.0012,
          maxLinks: 1,
          glowStrength: 1,
          maxDist: 120,
          parallax: 0.045,
        }
      );
    };

    let cfg = getConfig();

    const createStars = (count: number) => {
      const prev = stars;
      stars = new Array(count).fill(0).map((_, i) => {
        const p = prev[i];
        if (p) return p;
        const size = Math.pow(Math.random(), 1.6) * 2.4 + 0.28;
        const alpha = 0.08 + Math.pow(Math.random(), 0.9) * 0.9;
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          r: size,
          alpha: Math.min(1, alpha),
          glow:
            Math.random() > 0.86
              ? 8 + Math.random() * 22
              : Math.random() > 0.985
                ? 28 + Math.random() * 60
                : 0,
        };
      });
    };

    const resize = () => {
      const ratio = getAdaptivePixelRatio();
      W = Math.floor(cv.offsetWidth);
      H = Math.floor(cv.offsetHeight);
      cv.width = Math.floor(cv.offsetWidth * ratio);
      cv.height = Math.floor(cv.offsetHeight * ratio);
      cv.style.width = `${cv.offsetWidth}px`;
      cv.style.height = `${cv.offsetHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const area = Math.max(1, W * H);
      const baseCount = Math.round(area * cfg.density);
      const count = Math.max(
        40,
        Math.min(800, Math.round(baseCount * performanceScale)),
      );
      createStars(count);
    };

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

    const handleConfigUpdate = () => {
      cfg = getConfig();
      resize();
    };
    window.addEventListener("portfolio-config-update", handleConfigUpdate);

    if (!motionEnabled) {
      ctx.clearRect(0, 0, cv.width, cv.height);
      return () => {
        ctx.clearRect(0, 0, cv.width, cv.height);
        window.removeEventListener("resize", resize);
        window.removeEventListener(
          "portfolio-config-update",
          handleConfigUpdate,
        );
        document.removeEventListener("visibilitychange", handleVisibility);
        container.removeEventListener("mousemove", mm as EventListener);
        container.removeEventListener("mouseleave", ml);
        container.removeEventListener("touchstart", touch as EventListener);
        container.removeEventListener("touchmove", touch as EventListener);
        container.removeEventListener("touchend", ml);
        container.removeEventListener("touchcancel", ml);
      };
    }

    resize();
    window.addEventListener("resize", resize);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Performance tracking variables (FPS Guard)
    let frameCount = 0;
    let lastFpsCheckTime = performance.now();
    const fpsCheckInterval = 2000; // Check performance every 2 seconds

    const loop = () => {
      if (paused || document.visibilityState !== "visible") {
        raf = 0;
        return;
      }

      // FPS Guard Tracking
      frameCount++;
      const now = performance.now();
      if (now - lastFpsCheckTime > fpsCheckInterval) {
        const elapsed = now - lastFpsCheckTime;
        const fps = (frameCount * 1000) / elapsed;

        // If average frame rate falls below 48 FPS, degrade particle count gracefully
        if (fps < 48 && stars.length > 50 && performanceScale > 0.3) {
          performanceScale = Math.max(0.25, performanceScale * 0.8);
          const area = Math.max(1, W * H);
          const baseCount = Math.round(area * cfg.density);
          const newCount = Math.max(
            40,
            Math.min(800, Math.round(baseCount * performanceScale)),
          );

          stars = stars.slice(0, newCount);
          console.warn(
            `[FPS Guard] Frame rate dropped to ${fps.toFixed(1)} FPS. Reducing particle count to ${newCount} (scale: ${performanceScale.toFixed(2)}) to maintain 60 FPS.`,
          );
        }

        frameCount = 0;
        lastFpsCheckTime = now;
      }

      // Smooth parallax offset based on mouse position
      const cx = W / 2;
      const cy = H / 2;
      const targetOffsetX =
        mouse.x === -999 ? 0 : (mouse.x - cx) * cfg.parallax;
      const targetOffsetY =
        mouse.y === -999 ? 0 : (mouse.y - cy) * cfg.parallax;
      drawOffset.x = lerp(drawOffset.x, targetOffsetX, 0.06);
      drawOffset.y = lerp(drawOffset.y, targetOffsetY, 0.06);

      ctx.clearRect(0, 0, W, H);

      // Reset connection counters
      const connCounts = new Uint8Array(stars.length);

      // Draw lines (constellations) with ultra-thin strokes
      ctx.lineWidth = 0.45;
      const maxDist = cfg.maxDist;
      const maxDistSq = maxDist * maxDist;
      const maxLinks = cfg.maxLinks;
      const glowStrength = cfg.glowStrength;

      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          if (connCounts[i] >= maxLinks || connCounts[j] >= maxLinks) continue;
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dsq = dx * dx + dy * dy;
          if (dsq > maxDistSq) continue;
          const dist = Math.sqrt(dsq);
          const alpha = (1 - dist / maxDist) * 0.11;
          if (alpha <= 0) continue;
          ctx.beginPath();
          ctx.moveTo(
            a.x + drawOffset.x * (a.r + 0.5),
            a.y + drawOffset.y * (a.r + 0.5),
          );
          ctx.lineTo(
            b.x + drawOffset.x * (b.r + 0.5),
            b.y + drawOffset.y * (b.r + 0.5),
          );
          ctx.strokeStyle = `rgba(170,195,255,${Math.min(0.95, alpha)})`;
          ctx.stroke();
          connCounts[i]++;
          connCounts[j]++;
        }
      }

      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const p = stars[i];

        // Motion — slow organic float + tiny rotational noise
        p.x += p.vx + Math.sin(performance.now() / 10000 + i) * 0.02;
        p.y += p.vy + Math.cos(performance.now() / 10000 + i * 1.1) * 0.02;

        // Loop edges softly
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        const drawX = p.x + drawOffset.x * (p.r * 0.6);
        const drawY = p.y + drawOffset.y * (p.r * 0.6);

        // Brighter stars get a controlled glow using shadowBlur
        if (p.glow > 0 && glowStrength > 0) {
          ctx.save();
          ctx.shadowBlur = p.glow * glowStrength;
          ctx.shadowColor = `rgba(180,205,255,${Math.min(0.28, p.alpha * 0.9)})`;
        }

        // Draw core
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.arc(drawX, drawY, p.r, 0, Math.PI * 2);
        ctx.fill();

        if (p.glow > 0 && glowStrength > 0) ctx.restore();
      }

      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("portfolio-config-update", handleConfigUpdate);
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
