'use client';

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

import gsap from 'gsap';

// ── SVG Creation ──────────────────────────────────────────────

export interface LiquidCurtainOptions {
  /** Fill color of the main curtain */
  color: string;
  /** Fill color of the base curtain (animates first). Default: '#0A0A0A' */
  baseColor?: string;
  /** Direction of the curtain. 'up' = rises from bottom, 'down' = drops from top */
  direction: 'up' | 'down';
  /** DOM id for the SVG element */
  id?: string;
}

/**
 * Creates the SVG element with a path ready to be animated.
 * The path starts as a flat line at the edge (invisible).
 */
export function createLiquidCurtain(opts: LiquidCurtainOptions): SVGSVGElement {
  const { color, baseColor = '#0A0A0A', direction, id = 'liquid-curtain' } = opts;

  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('id', id);
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');

  Object.assign(svg.style, {
    position: 'fixed',
    inset: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '99999',
    pointerEvents: 'all',
  });

  const path1 = document.createElementNS(ns, 'path');
  path1.setAttribute('fill', baseColor);
  path1.setAttribute('data-direction', direction);
  path1.setAttribute('class', 'liquid-base');

  const path2 = document.createElementNS(ns, 'path');
  path2.setAttribute('fill', color);
  path2.setAttribute('data-direction', direction);
  path2.setAttribute('class', 'liquid-main');

  const initialPath = direction === 'up' 
    ? 'M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z'
    : 'M 0 0 Q 50 0 100 0 L 100 0 L 0 0 Z';

  path1.setAttribute('d', initialPath);
  path2.setAttribute('d', initialPath);

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
  const { duration = 0.55, onMidway, onComplete } = opts;
  const path1 = svg.querySelector('.liquid-base')!;
  const path2 = svg.querySelector('.liquid-main')!;
  const direction = path1.getAttribute('data-direction') || 'up';

  let midwayFired = false;
  const p1 = { value: 0 };
  const p2 = { value: 0 };

  // Animación de la capa oscura (va primero)
  gsap.to(p1, {
    value: 1,
    duration,
    ease: 'power3.inOut',
    onUpdate: () => path1.setAttribute('d', buildCurtainPath(direction as 'up' | 'down', p1.value)),
  });

  // Animación de la capa principal (va detrás)
  gsap.to(p2, {
    value: 1,
    duration,
    delay: 0.1, // Desfase para el efecto doble
    ease: 'power3.inOut',
    onUpdate: () => {
      const t = p2.value;
      path2.setAttribute('d', buildCurtainPath(direction as 'up' | 'down', t));

      // Fire midway callback at ~80% coverage
      if (!midwayFired && t >= 0.78) {
        midwayFired = true;
        onMidway?.();
      }
    },
    onComplete: () => {
      // Ensure final path is perfectly flat
      const finalPath = direction === 'up' 
        ? 'M 0 0 L 100 0 L 100 100 L 0 100 Z'
        : 'M 0 0 L 100 0 L 100 100 L 0 100 Z';
      
      path1.setAttribute('d', finalPath);
      path2.setAttribute('d', finalPath);
      onComplete?.();
    },
  });
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
  const { duration = 0.45, onComplete } = opts;
  const path1 = svg.querySelector('.liquid-base')!;
  const path2 = svg.querySelector('.liquid-main')!;
  const direction = path1.getAttribute('data-direction') || 'up';

  const p1 = { value: 0 };
  const p2 = { value: 0 };

  // Capa oscura desaparece primero
  gsap.to(p1, {
    value: 1,
    duration,
    ease: 'power3.out',
    onUpdate: () => path1.setAttribute('d', buildRevealPath(direction as 'up' | 'down', p1.value)),
  });

  // Capa principal desaparece ligeramente después
  gsap.to(p2, {
    value: 1,
    duration,
    delay: 0.1,
    ease: 'power3.out',
    onUpdate: () => path2.setAttribute('d', buildRevealPath(direction as 'up' | 'down', p2.value)),
    onComplete: () => {
      svg.remove();
      onComplete?.();
    },
  });
}

// ── Path builders ─────────────────────────────────────────────

/**
 * Builds the SVG path for the curtain-in animation.
 * `t` goes from 0 (hidden) to 1 (fully covering).
 *
 * The curve amount peaks around t=0.5 and flattens to 0 at t=1
 * creating the "liquid bulge then snap" effect.
 */
function buildCurtainPath(direction: 'up' | 'down', t: number): string {
  // Curve intensity: peaks at t≈0.5, returns to 0 at t=1
  const curveAmount = Math.sin(t * Math.PI) * 25;

  if (direction === 'up') {
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
function buildRevealPath(direction: 'up' | 'down', t: number): string {
  const curveAmount = Math.sin(t * Math.PI) * 20;

  if (direction === 'up') {
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
