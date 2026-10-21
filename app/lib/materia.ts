import { SpringValue } from "./spring";

export interface OpticalSurface {
  element: HTMLElement;
  color: string;
  radius: number;
  visible: boolean;
  hover: SpringValue;
  x: SpringValue;
  y: SpringValue;
  tangentX: SpringValue;
  tangentY: SpringValue;
}

/** Transient visual state lives outside React and never causes a component render. */
export const materia = {
  surfaces: new Set<OpticalSurface>(),
  velocity: 0,
  scrollTime: 0,
  accent: "#1f4bff",
  secondary: "#8aa8dc",
  paused: false,
  warp: new SpringValue(0, 110, 20),
  composition: new SpringValue(1, 90, 20),
  chapter: new SpringValue(0, 70, 18),
  studio: new SpringValue(0, 95, 20),
  tiltX: new SpringValue(0, 100, 20),
  tiltY: new SpringValue(0, 100, 20),
};

/** Keep WebGL and the inexpensive SVG projection on the same two-strand palette. */
export function setMateriaPalette(accent: string, secondary: string) {
  materia.accent = accent;
  materia.secondary = secondary;
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty("--dna-accent", accent);
    document.documentElement.style.setProperty("--dna-secondary", secondary);
  }
  // Palette changes come with new targets from the same caller.
  wakeMateria();
}

const shared = [
  materia.warp,
  materia.composition,
  materia.chapter,
  materia.studio,
  materia.tiltX,
  materia.tiltY,
];

let waker: (() => void) | null = null;
/** The ticker sleeps once everything settles; whoever moves a target wakes it. */
export function wakeMateria() {
  waker?.();
}
export function onMateriaWake(wake: (() => void) | null) {
  waker = wake;
}

/** Advances every spring; returns false once nothing is moving any more. */
export function tickMateria(deltaMs: number) {
  const dt = Math.min(deltaMs / 1000, 2);
  let busy = false;
  materia.warp.step(dt);
  materia.composition.step(dt);
  materia.chapter.step(dt);
  materia.studio.step(dt);
  materia.tiltX.step(dt);
  materia.tiltY.step(dt);
  for (const spring of shared) if (!spring.settled) busy = true;
  if (performance.now() - materia.scrollTime > 100) {
    materia.velocity *= Math.exp(-dt * 16);
    if (Math.abs(materia.velocity) < 0.01) materia.velocity = 0;
  }
  if (materia.velocity !== 0) busy = true;
  for (const surface of materia.surfaces) {
    if (!surface.visible) continue;
    if (
      surface.hover.settled &&
      surface.x.settled &&
      surface.y.settled &&
      surface.tangentX.settled &&
      surface.tangentY.settled
    )
      continue;
    surface.hover.step(dt);
    surface.x.step(dt);
    surface.y.step(dt);
    surface.tangentX.step(dt);
    surface.tangentY.step(dt);
    busy = true;
    const style = surface.element.style;
    style.setProperty(
      "--surface-energy",
      Math.max(0, surface.hover.value).toFixed(4),
    );
    style.setProperty("--surface-x", `${surface.x.value * 100}%`);
    style.setProperty("--surface-y", `${surface.y.value * 100}%`);
  }
  return busy;
}
