import { isBodyScrollLocked } from "./body-scroll-lock";

/** A single subscription shared by every visual component. */
type Connection = EventTarget & { saveData?: boolean };
type MotionSnapshot = {
  allowed: boolean;
  enabled: boolean;
  reduced: boolean;
  visible: boolean;
  lightweight: boolean;
};
const serverSnapshot: MotionSnapshot = {
  allowed: true,
  enabled: true,
  reduced: false,
  visible: true,
  lightweight: false,
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
    // Motion is on by default on every load. The pause button only lasts for
    // the page it was pressed on: a stale stored "paused" used to survive every
    // refresh and hide the whole site from people who never asked for it.
    // sessionStorage stays readable as an override for tests and debugging.
    let preference: boolean | null = null;
    const readPreference = () => {
      try {
        localStorage.removeItem("portfolio-motion-enabled");
        const value = sessionStorage.getItem("portfolio-motion-enabled");
        preference = value === null ? null : value === "true";
      } catch {
        preference = null;
      }
    };
    readPreference();
    const update = () => {
      const lightweight =
        touch.matches ||
        reduced.matches ||
        window.__LITE === true ||
        !!nav.connection?.saveData ||
        (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) ||
        (nav.hardwareConcurrency > 0 && nav.hardwareConcurrency <= 4);
      const visible = document.visibilityState === "visible";
      // The OS reduced-motion flag only lightens the scene. Windows sets it for
      // anyone on the "best performance" profile, and pausing on it hid the
      // opening from visitors who never asked; the pause button is the opt-out.
      const allowed =
        preference ?? (window.__LITE !== true && !nav.connection?.saveData);
      const reducedMotion = !allowed;
      const enabled = visible && allowed && !isBodyScrollLocked();
      const root = document.documentElement;
      root.dataset.motion = enabled ? "on" : "off";
      root.toggleAttribute("data-paused", !allowed);
      if (
        snapshot.allowed === allowed &&
        snapshot.enabled === enabled &&
        snapshot.reduced === reducedMotion &&
        snapshot.visible === visible &&
        snapshot.lightweight === lightweight
      )
        return;
      snapshot = {
        allowed,
        enabled,
        reduced: reducedMotion,
        visible,
        lightweight,
      };
      for (const notify of listeners) notify();
    };
    const change = (event: Event) => {
      const detail = (
        event as CustomEvent<{ enabled?: boolean }>
      ).detail;
      if (typeof detail?.enabled === "boolean") preference = detail.enabled;
      else readPreference();
      update();
    };
    reduced.addEventListener("change", update);
    touch.addEventListener("change", update);
    nav.connection?.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("portfolio-overlay-changed", update);
    window.addEventListener("portfolio-motion-changed", change);
    window.addEventListener("storage", change);
    dispose = () => {
      reduced.removeEventListener("change", update);
      touch.removeEventListener("change", update);
      nav.connection?.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("portfolio-overlay-changed", update);
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
