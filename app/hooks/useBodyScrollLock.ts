"use client";

import { useLayoutEffect } from "react";
import { lockBodyScroll } from "../lib/body-scroll-lock";

export function useBodyScrollLock(active: boolean) {
  useLayoutEffect(() => {
    if (active) return lockBodyScroll();
  }, [active]);
}
