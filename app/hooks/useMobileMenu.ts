"use client";

import { useState, useEffect } from "react";
import { useBodyScrollLock } from "./useBodyScrollLock";

export function useMobileMenu() {
  const [menu, setMenu] = useState(false);

  useBodyScrollLock(menu);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return [menu, setMenu] as const;
}
