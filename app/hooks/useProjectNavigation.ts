"use client";

import { useEffect, useState } from "react";
import type { Tx } from "../types";

export function useProjectNavigation(t: Tx) {
  const [mounted, setMounted] = useState(false);

  // Dynamic Tab Title Change
  useEffect(() => {
    const originalTitle = document.title;
    const handleVisibilityChange = () => {
      document.title = document.hidden ? t.tabAway : t.tabBack;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = originalTitle;
    };
  }, [t]);

  // Transition owners clean up their own resources; never remove unrelated DOM.
  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
