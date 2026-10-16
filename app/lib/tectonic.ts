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
