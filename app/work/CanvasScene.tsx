"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
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
  paused,
}) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={darkMode ? 0.2 : 0.8} />
      <pointLight position={[10, 10, 10]} intensity={darkMode ? 1 : 2} />
      <DNAHelix3D
        accent={accent}
        secondary={secondary}
        darkMode={darkMode}
        paused={paused}
      />
      <Environment preset="city" />
    </Canvas>
  );
};
