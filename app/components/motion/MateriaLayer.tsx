"use client";

import {
  Component,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { useIntro } from "../IntroProvider";

import { useMotionPolicy } from "../../hooks/useMotionEnabled";
import { tickMateria } from "../../lib/materia";
import { StaticDNA } from "./StaticDNA";

const CanvasScene = dynamic(
  () => import("../../work/CanvasScene").then((m) => m.CanvasScene),
  { ssr: false, loading: () => <StaticDNA /> },
);

class GraphicsBoundary extends Component<
  { animateFallback: boolean; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <StaticDNA animate={this.props.animateFallback} />
    ) : (
      this.props.children
    );
  }
}

export function MateriaLayer() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const { phase } = useIntro();

  const { allowed, enabled, lightweight } = useMotionPolicy();
  const [sceneReady, setSceneReady] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [degraded, setDegraded] = useState(false);
  const degrade = useCallback(() => setDegraded(true), []);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!enabled || sceneReady || lightweight || degraded) return;
    const prepare = () => {
      if (document.visibilityState === "visible") setSceneReady(true);
    };
    const timer = setTimeout(() => {
      if ("requestIdleCallback" in window)
        idle = window.requestIdleCallback(prepare, {
          timeout: 1500,
        });
      else prepare();
    }, 500);
    let idle = 0;
    return () => {
      clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, [enabled, sceneReady, lightweight, degraded]);
  useEffect(() => {
    const hero =
      document.getElementById("hero") ??
      document.querySelector("[data-umbral-destination]");
    if (!hero) {
      setHeroVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) =>
      setHeroVisible(entry.isIntersecting),
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);
  useEffect(() => {
    if (!enabled) return;
    let until = 0;
    const tick = (_time: number, delta: number) => {
      tickMateria(delta);
      if (performance.now() > until) gsap.ticker.remove(tick);
    };
    const wake = () => {
      until = performance.now() + 1800;
      gsap.ticker.add(tick);
    };
    window.addEventListener("pointermove", wake, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("focusin", wake);
    window.addEventListener("pointerout", wake, { passive: true });
    wake();
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("focusin", wake);
      window.removeEventListener("pointerout", wake);
    };
  }, [enabled]);
  const routeHasScene = pathname === "/" || pathname.startsWith("/work/");
  const ready = pathname !== "/" || phase === "ready";
  const animateFallback = enabled && heroVisible && ready;
  if (!mounted || !routeHasScene) return null;
  return (
    <div
      className="materia-canvas fixed inset-0 z-0 pointer-events-none overflow-hidden"
      data-scene-active={heroVisible && enabled}
      data-scene-ready={ready}
      data-scene-degraded={degraded || undefined}
      aria-hidden="true"
    >
      <GraphicsBoundary animateFallback={animateFallback}>
        {!allowed || lightweight || !sceneReady || degraded ? (
          <StaticDNA animate={animateFallback} />
        ) : (
          <CanvasScene
            accent="#0066ff"
            secondary="#8aa8dc"
            darkMode={resolvedTheme === "dark"}
            paused={!enabled || !ready || !heroVisible}
            onSlow={degrade}
          />
        )}
      </GraphicsBoundary>
    </div>
  );
}
