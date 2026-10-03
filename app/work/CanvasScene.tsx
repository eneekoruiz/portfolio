"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OpticalCompositor } from "./OpticalCompositor";

/** A decorative scene gets at most 30 frames/s, even on 120/144 Hz screens. */
function FrameBudget({
  active,
  onSlow,
}: {
  active: boolean;
  onSlow: () => void;
}) {
  const { invalidate } = useThree();
  useEffect(() => {
    if (!active) return;
    let frame = 0,
      last = 0,
      count = 0,
      start = performance.now(),
      slowWindows = 0;
    const tick = (now: number) => {
      if (now - last >= 1000 / 30 - 1) {
        last = now;
        count++;
        invalidate();
      }
      if (now - start > 2500) {
        if (count / ((now - start) / 1000) < 18) slowWindows++;
        else slowWindows = 0;
        count = 0;
        start = now;
        if (slowWindows >= 2) {
          onSlow();
          return;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, invalidate, onSlow]);
  return null;
}
export function CanvasScene({
  accent,
  secondary,
  darkMode,
  paused = false,
  onSlow,
}: {
  accent: string;
  secondary: string;
  darkMode: boolean;
  paused?: boolean;
  onSlow: () => void;
}) {
  const [visible, setVisible] = useState(true);
  const [inView, setInView] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    if (host.current) observer.observe(host.current);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const active = visible && inView && !paused;
  return (
    <div ref={host} className="h-full w-full">
      <Canvas
        camera={{ position: [0, 1.2, 16], fov: 42 }}
        dpr={[1, 1.25]}
        frameloop="demand"
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "low-power",
          stencil: false,
        }}
      >
        <FrameBudget active={active} onSlow={onSlow} />
        <OpticalCompositor
          accent={accent}
          secondary={secondary}
          darkMode={darkMode}
          active={active}
          lowPower={false}
          isMobile={false}
        />
      </Canvas>
    </div>
  );
}
