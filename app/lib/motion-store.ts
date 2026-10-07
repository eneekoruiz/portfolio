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
  allowed: false,
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
    // A click can opt into light motion for this visit. A stored preference
    // alone never overrides the operating system's reduced-motion setting.
    let explicitOptIn = false;
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
        reduced.matches ||
        window.__LITE === true ||
        !!nav.connection?.saveData ||
        (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) ||
        (nav.hardwareConcurrency > 0 && nav.hardwareConcurrency <= 4);
      const visible = document.visibilityState === "visible";
      const reducedMotion = reduced.matches && !explicitOptIn;
      const allowed =
        !reducedMotion &&
        (preference ??
          (!touch.matches &&
            !nav.connection?.saveData &&
            window.__LITE !== true));
      const enabled = visible && allowed && !isBodyScrollLocked();
      document.documentElement.dataset.motion = enabled ? "on" : "off";
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
        event as CustomEvent<{
          enabled?: boolean;
          userInitiated?: boolean;
        }>
      ).detail;
      if (typeof detail?.enabled === "boolean") {
        preference = detail.enabled;
        explicitOptIn = detail.enabled && detail.userInitiated === true;
      } else {
        explicitOptIn = false;
        readPreference();
      }
      update();
    };
    const systemPreferenceChanged = () => {
      explicitOptIn = false;
      update();
    };
    reduced.addEventListener("change", systemPreferenceChanged);
    touch.addEventListener("change", update);
    nav.connection?.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("portfolio-overlay-changed", update);
    window.addEventListener("portfolio-motion-changed", change);
    window.addEventListener("storage", change);
    dispose = () => {
      reduced.removeEventListener("change", systemPreferenceChanged);
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
