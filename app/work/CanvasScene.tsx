"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OpticalCompositor } from "./OpticalCompositor";

interface CanvasSceneProps {
  accent: string;
  secondary: string;
  darkMode: boolean;
  paused?: boolean;
}

const getDeviceProfile = () => {
  if (typeof window === "undefined") {
    return { isMobile: false, lowPower: false, maxDpr: 1 };
  }

  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory || 4;
  const isMobile = window.matchMedia(
    "(max-width: 768px), (hover: none), (pointer: coarse)",
  ).matches;
  const lite = (window as Window).__LITE === true;
  const lowPower = lite || isMobile || cores <= 4 || memory <= 4;
  const maxDpr = Math.min(window.devicePixelRatio || 1, 2);

  return { isMobile, lowPower, maxDpr };
};

function AdaptiveDprGovernor({
  active,
  lowPower,
  isMobile,
  maxDpr,
}: {
  active: boolean;
  lowPower: boolean;
  isMobile: boolean;
  maxDpr: number;
}) {
  const { setDpr } = useThree();
  const frameCount = useRef(0);
  const lastCheck = useRef(0);
  const currentDpr = useRef(
    isMobile ? 0.86 : lowPower ? 1 : Math.min(maxDpr, 1.35),
  );
  const bounds = isMobile
    ? { min: 0.65, max: 1 }
    : lowPower
      ? { min: 0.75, max: 1.15 }
      : { min: 0.9, max: Math.min(maxDpr, 1.5) };

  useEffect(() => {
    currentDpr.current = Math.min(
      bounds.max,
      Math.max(bounds.min, currentDpr.current),
    );
    setDpr(currentDpr.current);
  }, [bounds.max, bounds.min, setDpr]);

  useFrame((state) => {
    if (!active) return;
    frameCount.current += 1;
    const now = state.clock.elapsedTime;
    if (lastCheck.current === 0) {
      lastCheck.current = now;
      return;
    }

    const elapsed = now - lastCheck.current;
    if (elapsed < 2) return;

    const fps = frameCount.current / elapsed;
    frameCount.current = 0;
    lastCheck.current = now;

    if (fps < 48 && currentDpr.current > bounds.min) {
      currentDpr.current = Math.max(bounds.min, currentDpr.current - 0.12);
      setDpr(currentDpr.current);
    } else if (fps > 58 && currentDpr.current < bounds.max) {
      currentDpr.current = Math.min(bounds.max, currentDpr.current + 0.06);
      setDpr(currentDpr.current);
    }
  });

  return null;
}

export const CanvasScene: React.FC<CanvasSceneProps> = ({
  accent,
  secondary,
  darkMode,
  paused = false,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const { isMobile, lowPower, maxDpr } = useMemo(() => getDeviceProfile(), []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: lowPower ? "40px" : "120px", threshold: 0.01 },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [lowPower]);

  useEffect(() => {
    const updateVisibility = () => {
      setPageVisible(document.visibilityState === "visible");
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  const active = inView && pageVisible && !paused;
  const camera = isMobile
    ? { position: [0, 0.6, 19] as [number, number, number], fov: 48 }
    : { position: [0, 1.2, 16] as [number, number, number], fov: 42 };

  return (
    <div ref={hostRef} className="h-full w-full">
      <Canvas
        camera={camera}
        dpr={
          (isMobile
            ? [0.75, 1]
            : lowPower
              ? [0.85, 1.15]
              : [1, Math.min(maxDpr, 1.5)]) as [number, number]
        }
        frameloop={active ? "always" : "demand"}
        performance={{ min: lowPower ? 0.4 : 0.6 }}
        gl={{
          antialias: !lowPower,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
      >
        <AdaptiveDprGovernor
          active={active}
          lowPower={lowPower}
          isMobile={isMobile}
          maxDpr={maxDpr}
        />
        <OpticalCompositor
          accent={accent}
          secondary={secondary}
          darkMode={darkMode}
          active={active}
          lowPower={lowPower}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
};
