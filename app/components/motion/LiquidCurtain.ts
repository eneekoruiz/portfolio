"use client";

/**
 * createLiquidCurtain — SVG Morphing Curtain Transition (Punto 8)
 * ───────────────────────────────────────────────────────────────
 * Creates an SVG overlay with a `<path>` that animates from flat bottom
 * to a liquid curve in the middle, then snaps straight at the top.
 *
 * The curve gives an elastic/liquid feel vs. the plain scaleY div.
 *
 * Usage:
 *   const svg = createLiquidCurtain({ color: '#ff2d78', direction: 'up' });
 *   document.body.appendChild(svg);
 *   animateLiquidCurtainIn(svg, { duration: 0.55, onMidway: () => router.push('/'), onComplete: () => {} });
 *
 * Directions:
 *   'up'   — curtain rises from bottom (used when navigating TO a project)
 *   'down' — curtain drops from top (used when returning FROM a project)
 */

import gsap from "gsap";

// Map to track active tweens per SVG to prevent race conditions during rapid navigation
const activeTweens = new Map<SVGSVGElement, gsap.core.Tween[]>();

function clearTweens(svg: SVGSVGElement) {
  const tweens = activeTweens.get(svg);
  if (tweens) {
    tweens.forEach((t) => t.kill());
    activeTweens.delete(svg);
  }
}

export interface LiquidCurtainOptions {
  /** Fill color of the main curtain */
  color: string;
  /** Fill color of the base curtain (animates first). Default: '#0A0A0A' */
  baseColor?: string;
  /** Direction of the curtain. 'up' = rises from bottom, 'down' = drops from top */
  direction: "up" | "down";
  /** DOM id for the SVG element */
  id?: string;
}

/**
 * Creates the SVG element with a path ready to be animated.
 * The path starts as a flat line at the edge (invisible).
 */
export function createLiquidCurtain(opts: LiquidCurtainOptions): SVGSVGElement {
  const {
    color,
    baseColor = "var(--page)",
    direction,
    id = "liquid-curtain",
  } = opts;

  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("id", id);
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");

  Object.assign(svg.style, {
    position: "fixed",
    inset: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "99999",
    pointerEvents: "all",
  });

  const path1 = document.createElementNS(ns, "path");
  path1.setAttribute("fill", baseColor);
  path1.setAttribute("data-direction", direction);
  path1.setAttribute("class", "liquid-base");

  const path2 = document.createElementNS(ns, "path");
  path2.setAttribute("fill", color);
  path2.setAttribute("data-direction", direction);
  path2.setAttribute("class", "liquid-main");

  const initialPath =
    direction === "up"
      ? "M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z"
      : "M 0 0 Q 50 0 100 0 L 100 0 L 0 0 Z";

  path1.setAttribute("d", initialPath);
  path2.setAttribute("d", initialPath);

  svg.appendChild(path1);
  svg.appendChild(path2);
  return svg;
}

// ── Animation IN (curtain covers the screen) ──────────────────

export interface LiquidAnimateOptions {
  /** Total duration of the animation. Default: 0.55s */
  duration?: number;
  /** Called when the curtain covers ~80% of the screen (good for starting navigation) */
  onMidway?: () => void;
  /** Called when the animation completes and the screen is fully covered */
  onComplete?: () => void;
}

/**
 * Animates the curtain IN (covers the screen).
 *
 * Phase 1 (0%–70%): Path curves in the center creating a liquid bulge
 * Phase 2 (70%–100%): Curve snaps flat for a clean finish
 */
export function animateLiquidCurtainIn(
  svg: SVGSVGElement,
  opts: LiquidAnimateOptions = {},
) {
  clearTweens(svg);

  const { duration = 0.45, onMidway, onComplete } = opts; // Snappier default
  const path1 = svg.querySelector(".liquid-base")!;
  const path2 = svg.querySelector(".liquid-main")!;
  const direction = path1.getAttribute("data-direction") || "up";

  let midwayFired = false;
  const p1 = { value: 0 };
  const p2 = { value: 0 };

  const t1 = gsap.to(p1, {
    value: 1,
    duration,
    ease: "expo.inOut", // Faster snap
    onUpdate: () =>
      path1.setAttribute(
        "d",
        buildCurtainPath(direction as "up" | "down", p1.value),
      ),
  });

  const t2 = gsap.to(p2, {
    value: 1,
    duration,
    delay: 0.04, // Reduced delay
    ease: "expo.inOut",
    onUpdate: () => {
      const t = p2.value;
      path2.setAttribute("d", buildCurtainPath(direction as "up" | "down", t));
      if (!midwayFired && t >= 0.45) {
        // Trigger MUCH earlier
        midwayFired = true;
        onMidway?.();
      }
    },
    onComplete: () => {
      const finalPath = "M 0 0 L 100 0 L 100 100 L 0 100 Z";
      path1.setAttribute("d", finalPath);
      path2.setAttribute("d", finalPath);
      activeTweens.delete(svg);
      onComplete?.();
    },
  });

  activeTweens.set(svg, [t1, t2]);
}

// ── Animation OUT (curtain reveals — used on the destination page) ──

export interface LiquidRevealOptions {
  /** Duration of the reveal. Default: 0.45s */
  duration?: number;
  /** Called when the reveal completes */
  onComplete?: () => void;
}

/**
 * Animates the curtain OUT (reveals the page behind it).
 * Reverses the liquid curve and slides the path off-screen.
 */
export function animateLiquidCurtainOut(
  svg: SVGSVGElement,
  opts: LiquidRevealOptions = {},
) {
  clearTweens(svg);

  const { duration = 0.42, onComplete } = opts;
  const path1 = svg.querySelector(".liquid-base")!;
  const path2 = svg.querySelector(".liquid-main")!;
  const direction = path1.getAttribute("data-direction") || "up";

  const p1 = { value: 0 };
  const p2 = { value: 0 };

  const t1 = gsap.to(p1, {
    value: 1,
    duration,
    ease: "power3.out",
    onUpdate: () =>
      path1.setAttribute(
        "d",
        buildRevealPath(direction as "up" | "down", p1.value),
      ),
  });

  const t2 = gsap.to(p2, {
    value: 1,
    duration,
    delay: 0.06,
    ease: "power3.out",
    onUpdate: () =>
      path2.setAttribute(
        "d",
        buildRevealPath(direction as "up" | "down", p2.value),
      ),
    onComplete: () => {
      svg.remove();
      activeTweens.delete(svg);
      onComplete?.();
    },
  });

  activeTweens.set(svg, [t1, t2]);
}

// ── Path builders ─────────────────────────────────────────────

/**
 * Builds the SVG path for the curtain-in animation.
 * `t` goes from 0 (hidden) to 1 (fully covering).
 *
 * The curve amount peaks around t=0.5 and flattens to 0 at t=1
 * creating the "liquid bulge then snap" effect.
 */
function buildCurtainPath(direction: "up" | "down", t: number): string {
  // Curve intensity: peaks at t≈0.5, returns to 0 at t=1
  const curveAmount = Math.sin(t * Math.PI) * 25;

  if (direction === "up") {
    // Rising from bottom: the leading edge moves up
    const edgeY = 100 - t * 100; // 100 → 0
    const curveY = edgeY - curveAmount; // Bulges upward
    return `M 0 ${edgeY} Q 50 ${curveY} 100 ${edgeY} L 100 100 L 0 100 Z`;
  } else {
    // Dropping from top: the leading edge moves down
    const edgeY = t * 100; // 0 → 100
    const curveY = edgeY + curveAmount; // Bulges downward
    return `M 0 0 L 100 0 L 100 ${edgeY} Q 50 ${curveY} 0 ${edgeY} Z`;
  }
}

/**
 * Builds the SVG path for the curtain-out (reveal) animation.
 * `t` goes from 0 (covering) to 1 (hidden).
 */
function buildRevealPath(direction: "up" | "down", t: number): string {
  const curveAmount = Math.sin(t * Math.PI) * 20;

  if (direction === "up") {
    // Reveal upward: trailing edge moves up
    const edgeY = t * 100; // 0 → 100 (moving the bottom edge up, but we slide the whole thing up)
    const curveY = edgeY - curveAmount;
    // The curtain was covering fully; now the top edge stays at 0 and bottom edge moves up
    return `M 0 0 L 100 0 L 100 ${100 - edgeY} Q 50 ${100 - edgeY - curveAmount} 0 ${100 - edgeY} Z`;
  } else {
    // Reveal downward: the curtain slides down revealing from top
    const edgeY = t * 100;
    const curveY = edgeY + curveAmount;
    return `M 0 ${edgeY} Q 50 ${curveY} 100 ${edgeY} L 100 100 L 0 100 Z`;
  }
}
