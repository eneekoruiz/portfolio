"use client";

import { useMemo } from "react";
import type { ProjectCard } from "../types";

export function useDnaColors(
  theme: string | undefined,
  resolvedTheme: string | undefined,
  activeSection: string,
  expandedIdx: number | null,
  top3: ProjectCard[],
) {
  return useMemo(() => {
    const isDarkLocal = theme === "dark" || resolvedTheme === "dark";
    const PROJ_COLORS: Record<string, string> = {
      "ana-peluquera": "#ff2d78",
      "who-are-ya-backend": "#00c940",
      rides24ofiziala: "#e69400",
      "spotshare-parking": "#00d4e8",
      "pke-web": "#9b1fff",
    };

    if (activeSection === "work") {
      if (expandedIdx !== null && top3[expandedIdx]) {
        const pColor =
          PROJ_COLORS[top3[expandedIdx].name] ||
          (isDarkLocal ? "#0066ff" : "#0044cc");
        return {
          accent: pColor,
          secondary: isDarkLocal ? "#444444" : "#cccccc",
        };
      }
    }

    // Natural color fallback
    return {
      accent: isDarkLocal ? "#729bff" : "#0066ff",
      secondary: isDarkLocal ? "#d1dfff" : "#8aa8dc",
    };
  }, [activeSection, expandedIdx, top3, theme, resolvedTheme]);
}
