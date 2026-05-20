"use client";

import { useState, useEffect } from "react";

export function useModalState() {
  const [cmd, setCmd] = useState(false);

  useEffect(() => {
    if (cmd) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.touchAction = "";
    };
  }, [cmd]);

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
