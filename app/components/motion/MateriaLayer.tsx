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

import { useMotionPolicy } from "../../hooks/useMotionEnabled";
import { materia, onMateriaWake, tickMateria } from "../../lib/materia";
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
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setHeroVisible(entry.isIntersecting);
      }
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);
  // The springs only tick while something moves: an idle page keeps no
  // animation loop alive. Input wakes it, with a short grace period so
  // targets set a moment later (debounced hovers, effects) are not missed.
  useEffect(() => {
    if (!enabled) return;
    let running = false;
    let awakeUntil = 0;
    const tick = (_time: number, delta: number) => {
      if (document.visibilityState !== "visible") return;
      const busy = tickMateria(delta);
      if (!busy && performance.now() > awakeUntil) {
        gsap.ticker.remove(tick);
        running = false;
      }
    };
    const wake = () => {
      awakeUntil = performance.now() + 400;
      if (running) return;
      running = true;
      gsap.ticker.add(tick);
    };
    const events = ["scroll", "pointermove", "pointerdown", "keydown", "resize", "focusin"];
    for (const type of events)
      window.addEventListener(type, wake, { passive: true, capture: true });
    onMateriaWake(wake);
    wake();
    return () => {
      for (const type of events)
        window.removeEventListener(type, wake, { capture: true });
      onMateriaWake(null);
      gsap.ticker.remove(tick);
    };
  }, [enabled]);
  // The helix belongs to case studies; on the home page the sand field owns the opening shot.
  const routeHasScene = pathname.startsWith("/work/");
  // Outside the hero the GPU sleeps; the bounded SVG projection animates only in the hero.
  const animateFallback = enabled && heroVisible;
  if (!mounted || !routeHasScene) return null;

  return (
    <div
      className="materia-canvas fixed inset-0 z-0 pointer-events-none overflow-hidden"
      data-scene-active={heroVisible && enabled}
      data-scene-degraded={degraded || undefined}
      aria-hidden="true"
    >
      <GraphicsBoundary animateFallback={animateFallback}>
        {!allowed || lightweight || !sceneReady || degraded ? (
          <StaticDNA animate={animateFallback} />
        ) : (
          <CanvasScene
            accent={materia.accent}
            secondary={materia.secondary}
            darkMode={resolvedTheme === "dark"}
            paused={!enabled || !heroVisible}
            animateFallback={animateFallback}
            onSlow={degrade}
          />
        )}
      </GraphicsBoundary>
    </div>
  );
}
