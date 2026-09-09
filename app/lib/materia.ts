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
  accent: "#0066ff",
  secondary: "#8aa8dc",
  paused: false,
  warp: new SpringValue(0, 110, 20),
  composition: new SpringValue(1, 90, 20),
};

export function tickMateria(deltaMs: number) {
  const dt = Math.min(deltaMs / 1000, 2);
  materia.warp.step(dt);
  materia.composition.step(dt);
  if (performance.now() - materia.scrollTime > 100) {
    materia.velocity *= Math.exp(-dt * 16);
    if (Math.abs(materia.velocity) < 0.01) materia.velocity = 0;
  }
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
    const style = surface.element.style;
    style.setProperty(
      "--surface-energy",
      Math.max(0, surface.hover.value).toFixed(4),
    );
    style.setProperty("--surface-x", `${surface.x.value * 100}%`);
    style.setProperty("--surface-y", `${surface.y.value * 100}%`);
  }
}
