"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { DNAHelix3D } from "./DNAHelix3D";

interface CanvasSceneProps {
  accent: string;
  secondary: string;
  darkMode: boolean;
  paused?: boolean;
}

const getDeviceProfile = () => {
  if (typeof window === "undefined") {
    return { isMobile: false, lowPower: false };
  }

  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory || 4;
  const isMobile =
    window.matchMedia("(max-width: 768px), (hover: none), (pointer: coarse)")
      .matches;
  const lite = (window as Window).__LITE === true;
  const lowPower =
    lite || isMobile || cores <= 4 || memory <= 4 || window.devicePixelRatio > 1.75;

  return { isMobile, lowPower };
};

export const CanvasScene: React.FC<CanvasSceneProps> = ({
  accent,
  secondary,
  darkMode,
  paused = false,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const { isMobile, lowPower } = useMemo(() => getDeviceProfile(), []);

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
        dpr={isMobile ? [0.65, 0.9] : lowPower ? [0.75, 1] : [1, 1.35]}
        frameloop={active ? "always" : "demand"}
        performance={{ min: lowPower ? 0.3 : 0.5 }}
        gl={{
          antialias: !lowPower,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={darkMode ? 0.68 : 1.08} />
        <directionalLight
          position={[7, 9, 8]}
          intensity={darkMode ? 1.35 : 2.1}
        />
        <directionalLight
          position={[-6, -4, -7]}
          intensity={darkMode ? 0.35 : 0.75}
        />
        <DNAHelix3D
          accent={accent}
          secondary={secondary}
          darkMode={darkMode}
          paused={!active}
          lowPower={lowPower}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
};
