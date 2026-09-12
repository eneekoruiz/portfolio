"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { useIntro } from "../IntroProvider";
import { usePreferredMotion } from "../../hooks/usePreferredMotion";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { materia, tickMateria } from "../../lib/materia";
import { StaticDNA } from "./StaticDNA";

const CanvasScene = dynamic(
  () => import("../../work/CanvasScene").then((m) => m.CanvasScene),
  { ssr: false, loading: () => <StaticDNA /> },
);

class GraphicsBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <StaticDNA /> : this.props.children;
  }
}

export function MateriaLayer() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const { phase } = useIntro();
  const reduced = usePreferredMotion();
  const enabled = useMotionEnabled();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!enabled) return;
    const tick = (_time: number, delta: number) => {
      if (document.visibilityState === "visible") tickMateria(delta);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [enabled]);
  const routeHasScene = pathname === "/" || pathname.startsWith("/work/");
  const ready = pathname !== "/" || phase === "ready";
  if (!mounted || !routeHasScene) return null;
  return (
    <div
      className="materia-canvas fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <GraphicsBoundary>
        {!enabled ? (
          <StaticDNA />
        ) : (
          <CanvasScene
            accent="#0066ff"
            secondary="#8aa8dc"
            darkMode={resolvedTheme === "dark"}
            paused={!ready}
          />
        )}
      </GraphicsBoundary>
    </div>
  );
}
