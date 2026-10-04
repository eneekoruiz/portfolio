type SavedProperty = { value: string; priority: string };
const locks = new Set<symbol>();
let saved: Map<string, SavedProperty> | undefined;
let stoppedLenis: Window["__lenis"];

/** Each overlay owns a release; only the final release restores the page. */
export function lockBodyScroll() {
  const token = Symbol("body-scroll-lock");
  if (!locks.size) {
    const style = document.body.style;
    saved = new Map(
      ["overflow", "padding-right", "touch-action"].map((property) => [
        property,
        {
          value: style.getPropertyValue(property),
          priority: style.getPropertyPriority(property),
        },
      ]),
    );
    const gutter = Math.max(
      0,
      window.innerWidth - document.documentElement.clientWidth,
    );
    if (gutter) {
      const padding =
        parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      style.setProperty("padding-right", `${padding + gutter}px`);
    }
    style.setProperty("overflow", "hidden");
    style.setProperty("touch-action", "none");
    const lenis = window.__lenis;
    if (lenis && !lenis.isStopped) {
      lenis.stop();
      stoppedLenis = lenis;
    }
  }
  locks.add(token);
  return () => {
    if (!locks.delete(token) || locks.size) return;
    for (const [property, previous] of saved ?? []) {
      if (previous.value)
        document.body.style.setProperty(
          property,
          previous.value,
          previous.priority,
        );
      else document.body.style.removeProperty(property);
    }
    saved = undefined;
    stoppedLenis?.start();
    stoppedLenis = undefined;
  };
}
