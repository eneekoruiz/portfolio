'use client';

import { useState, useEffect } from 'react';

interface Tilt {
  x: number;
  y: number;
}

export function useDeviceTilt() {
  const [tilt, setTilt] = useState<Tilt>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMotion = (e: DeviceOrientationEvent) => {
      // Gamma is left/right tilt [-90, 90]
      // Beta is front/back tilt [-180, 180]
      const x = e.gamma ? e.gamma / 45 : 0; // Normalize to approx [-1, 1]
      const y = e.beta ? (e.beta - 45) / 45 : 0; // Normalize assuming 45deg holding angle
      
      setTilt({ 
        x: Math.max(-1, Math.min(1, x)), 
        y: Math.max(-1, Math.min(1, y)) 
      });
    };

    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && 
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleMotion);
          }
        } catch (error) {
          console.error('DeviceOrientation permission error:', error);
        }
      } else {
        window.addEventListener('deviceorientation', handleMotion);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleMotion);
    };
  }, []);

  return tilt;
}
