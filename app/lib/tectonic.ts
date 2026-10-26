/**
 * TECTONIC DESIGN SYSTEM
 * ─────────────────────────────────────────────────────────────────────────────
 * Dispatches physical seismic impulses and tectonic shockfronts across the UI.
 * Connects any button, card, link, or scroll event to the shared seismic engine.
 */

export function triggerTectonicImpact(
  x?: number,
  y?: number,
  intensity = 1.0,
) {
  if (typeof window === "undefined") return;

  const posX = x ?? window.innerWidth / 2;
  const posY = y ?? window.innerHeight / 2;

  window.dispatchEvent(
    new CustomEvent("tectonic-impact", {
      detail: { x: posX, y: posY, intensity },
    }),
  );
}

/**
 * A burst of the opening: the sand cracks and collapses, sparks and earth fly,
 * and the name takes the letters the blast reaches. See useHeroCinematic.
 */
export function triggerHeroBurst(
  x: number,
  y: number,
  power: number,
  options: { tint?: "ember" | "brand"; reveal?: boolean } = {},
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("hero-burst", { detail: { x, y, power, ...options } }),
  );
}
