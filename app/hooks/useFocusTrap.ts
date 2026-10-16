"use client";

import { useLayoutEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], area[href], button, input, select, textarea, [tabindex], [contenteditable="true"], audio[controls], video[controls]';
// Keep the original visible trigger across an immediate modal handoff.
let overlayReturnTarget: HTMLElement | null = null;

function available(element: HTMLElement) {
  if (
    !element.isConnected ||
    element.matches(":disabled") ||
    element.closest('[inert], [hidden], [aria-hidden="true"]')
  )
    return false;
  const style = getComputedStyle(element);
  return (
    style.visibility !== "hidden" &&
    style.visibility !== "collapse" &&
    style.display !== "none" &&
    element.getClientRects().length > 0
  );
}

export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;
    const owningDialog =
      container.closest<HTMLElement>('[role="dialog"][aria-modal="true"]') ??
      container;
    const currentFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previous =
      currentFocus &&
      currentFocus !== document.body &&
      !container.contains(currentFocus) &&
      available(currentFocus)
        ? currentFocus
        : overlayReturnTarget && available(overlayReturnTarget)
          ? overlayReturnTarget
          : null;
    if (previous && !previous.closest('[role="dialog"][aria-modal="true"]'))
      overlayReturnTarget = previous;
    const originalTabIndex = container.getAttribute("tabindex");
    if (originalTabIndex === null) container.tabIndex = -1;
    let disposed = false;
    const ownsFocus = () =>
      !disposed &&
      container.isConnected &&
      !container.inert &&
      container.getAttribute("aria-hidden") !== "true";
    const items = () =>
      [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (element) => element.tabIndex >= 0 && available(element),
      );
    const focusBoundary = (last = false) => {
      if (!ownsFocus()) return;
      const elements = items();
      (last ? elements.at(-1) : elements[0])?.focus({ preventScroll: true });
      if (!elements.length) container.focus({ preventScroll: true });
    };
    const frame = requestAnimationFrame(() => {
      // Preserve an input's own autofocus when it already belongs to this dialog.
      if (!container.contains(document.activeElement)) focusBoundary();
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !ownsFocus()) return;
      const elements = items();
      const index = elements.findIndex(
        (element) => element === document.activeElement,
      );
      if (
        !elements.length ||
        index === -1 ||
        (event.shiftKey && index === 0) ||
        (!event.shiftKey && index === elements.length - 1)
      ) {
        event.preventDefault();
        focusBoundary(event.shiftKey);
      }
    };
    const handleFocusIn = (event: FocusEvent) => {
      if (
        !ownsFocus() ||
        !(event.target instanceof HTMLElement) ||
        container.contains(event.target)
      )
        return;
      const nextDialog = event.target.closest(
        '[role="dialog"][aria-modal="true"]',
      );
      // A newly mounted modal owns its own focus during an overlay handoff.
      if (
        nextDialog &&
        nextDialog !== owningDialog &&
        nextDialog.getAttribute("aria-hidden") !== "true"
      )
        return;
      focusBoundary();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      if (originalTabIndex === null) container.removeAttribute("tabindex");
      const anotherModal = [
        ...document.querySelectorAll<HTMLElement>(
          '[role="dialog"][aria-modal="true"]',
        ),
      ].some((element) => element !== owningDialog && available(element));
      const current = document.activeElement;
      if (
        !anotherModal &&
        previous &&
        available(previous) &&
        (current === document.body ||
          current === previous ||
          container.contains(current))
      )
        previous.focus({ preventScroll: true });
      if (!anotherModal) overlayReturnTarget = null;
    };
  }, [active]);

  return containerRef;
}
