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
import { materia, tickMateria } from "../../lib/materia";
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
  const [skillsVisible, setSkillsVisible] = useState(false);
  useEffect(() => {
    const hero =
      document.getElementById("hero") ??
      document.querySelector("[data-umbral-destination]");
    const skills = document.getElementById("skills");
    if (!hero) {
      setHeroVisible(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) setHeroVisible(entry.isIntersecting);
        if (entry.target === skills) setSkillsVisible(entry.isIntersecting);
      }
    });
    observer.observe(hero);
    if (skills) observer.observe(skills);
    return () => observer.disconnect();
  }, [pathname]);
  useEffect(() => {
    if (!enabled) return;
    const tick = (_time: number, delta: number) => {
      if (document.visibilityState === "visible") {
        tickMateria(delta);
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [enabled]);
  const routeHasScene = pathname === "/" || pathname.startsWith("/work/");
  const ready = pathname !== "/" || phase === "ready";
  // Outside the hero the GPU sleeps; the bounded SVG projection animates in hero and skills.
  const animateFallback = enabled && (heroVisible || skillsVisible) && ready;
  if (!mounted || !routeHasScene) return null;
  const inHero = pathname === "/" && heroVisible;

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
            accent={materia.accent}
            secondary={materia.secondary}
            darkMode={resolvedTheme === "dark"}
            paused={!enabled || !ready || !heroVisible}
            animateFallback={animateFallback}
            onSlow={degrade}
          />
        )}
      </GraphicsBoundary>
    </div>
  );
}
