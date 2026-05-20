"use client";

import { useState, useEffect } from "react";

interface Tilt {
  x: number;
  y: number;
}

export function useDeviceTilt() {
  const [tilt, setTilt] = useState<Tilt>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMotion = (e: DeviceOrientationEvent) => {
      // Gamma: left/right [-90, 90] -> Normalize to [-1, 1]
      const rawX = e.gamma ? e.gamma / 38 : 0;
      // Beta: front/back [-180, 180].
      // Assume natural holding angle is around 45-55 degrees.
      const rawY = e.beta ? (e.beta - 50) / 38 : 0;

      setTilt((prev) => ({
        x: prev.x * 0.7 + Math.max(-1, Math.min(1, rawX)) * 0.3,
        y: prev.y * 0.7 + Math.max(-1, Math.min(1, rawY)) * 0.3,
      }));
    };

    const requestPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        try {
          const permission = await (
            DeviceOrientationEvent as any
          ).requestPermission();
          if (permission === "granted") {
            window.addEventListener("deviceorientation", handleMotion);
          }
        } catch (error) {
          console.error("DeviceOrientation permission error:", error);
        }
      } else {
        window.addEventListener("deviceorientation", handleMotion);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener("deviceorientation", handleMotion);
    };
  }, []);

  return tilt;
}
