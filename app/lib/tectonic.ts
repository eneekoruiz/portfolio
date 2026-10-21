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
 * The breach the hero cinematic opens in the sand. Fractions of the stage size;
 * `open` 0..1 drives width and propagation, `glow` the ember light inside it.
 * Mutated by GSAP; call wakeSand() after each change so the field redraws.
 */
export const sandCrack = { x: 0.5, y: 0.5, length: 0.46, open: 0, glow: 0 };

export function wakeSand() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event("sand-wake"));
}
