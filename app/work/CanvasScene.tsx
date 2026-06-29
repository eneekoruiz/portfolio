"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { DNAHelix3D } from "./DNAHelix3D";

interface CanvasSceneProps {
  accent: string;
  secondary: string;
  darkMode: boolean;
  paused?: boolean;
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

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px", threshold: 0.01 },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, []);

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

  return (
    <div ref={hostRef} className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "demand"}
        performance={{ min: 0.5 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={darkMode ? 0.5 : 1} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={darkMode ? 1.5 : 2.5}
        />
        <directionalLight
          position={[-10, -10, -10]}
          intensity={darkMode ? 0.5 : 1}
        />
        <DNAHelix3D
          accent={accent}
          secondary={secondary}
          darkMode={darkMode}
          paused={!active}
        />
      </Canvas>
    </div>
  );
};
