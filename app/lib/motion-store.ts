/** A single subscription shared by every visual component. */
type Connection = EventTarget & { saveData?: boolean };
type MotionSnapshot = {
  enabled: boolean;
  reduced: boolean;
  visible: boolean;
  lightweight: boolean;
};
const serverSnapshot: MotionSnapshot = {
  enabled: false,
  reduced: true,
  visible: true,
  lightweight: true,
};
let snapshot = serverSnapshot;
const listeners = new Set<() => void>();
let dispose: (() => void) | undefined;
export function subscribeMotion(listener: () => void) {
  listeners.add(listener);
  if (!dispose) {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const touch = matchMedia(
      "(hover: none), (pointer: coarse), (max-width: 767px)",
    );
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: Connection;
    };
    let preference: boolean | null = null;
    const readPreference = () => {
      try {
        const value = localStorage.getItem("portfolio-motion-enabled");
        preference = value === null ? null : value === "true";
      } catch {
        preference = null;
      }
    };
    readPreference();
    const update = () => {
      const lightweight =
        touch.matches ||
        window.__LITE === true ||
        !!nav.connection?.saveData ||
        (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) ||
        (nav.hardwareConcurrency > 0 && nav.hardwareConcurrency <= 4);
      const visible = document.visibilityState === "visible";
      const enabled =
        visible &&
        !reduced.matches &&
        !nav.connection?.saveData &&
        window.__LITE !== true &&
        (preference ?? !lightweight);
      document.documentElement.dataset.motion = enabled ? "on" : "off";
      if (
        snapshot.enabled === enabled &&
        snapshot.reduced === reduced.matches &&
        snapshot.visible === visible &&
        snapshot.lightweight === lightweight
      )
        return;
      snapshot = { enabled, reduced: reduced.matches, visible, lightweight };
      for (const notify of listeners) notify();
    };
    const change = (event: Event) => {
      const value = (event as CustomEvent<{ enabled?: boolean }>).detail
        ?.enabled;
      if (typeof value === "boolean") preference = value;
      else readPreference();
      update();
    };
    reduced.addEventListener("change", update);
    touch.addEventListener("change", update);
    nav.connection?.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("portfolio-motion-changed", change);
    window.addEventListener("storage", change);
    dispose = () => {
      reduced.removeEventListener("change", update);
      touch.removeEventListener("change", update);
      nav.connection?.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("portfolio-motion-changed", change);
      window.removeEventListener("storage", change);
      dispose = undefined;
    };
    update();
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) dispose?.();
  };
}
export const getMotionSnapshot = () => snapshot;
export const getServerMotionSnapshot = () => serverSnapshot;
