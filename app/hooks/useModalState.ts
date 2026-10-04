"use client";

import { useState, useEffect } from "react";
import { useBodyScrollLock } from "./useBodyScrollLock";

export function useModalState() {
  const [cmd, setCmd] = useState(false);

  useBodyScrollLock(cmd);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        e.stopPropagation();
        setCmd((c) => !c);
        return;
      }
      if (e.key === "Escape") {
        setCmd(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, []);

  return [cmd, setCmd] as const;
}
