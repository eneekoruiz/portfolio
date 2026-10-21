"use client";

import { useMemo } from "react";
import type { ProjectCard } from "../types";

export function useDnaColors(
  theme: string | undefined,
  resolvedTheme: string | undefined,
  activeSection: string,
  expandedIdx: number | null,
  top3: ProjectCard[],
  hoveredProject?: { name: string; color: string } | null,
) {
  return useMemo(() => {
    const isDarkLocal = theme === "dark" || resolvedTheme === "dark";
    const PROJ_COLORS: Record<string, string> = {
      "ana-peluquera": "#d95b7c",
      "who-are-ya-backend": "#3da54b",
      rides24ofiziala: "#bf7b0e",
      "spotshare-parking": "#1a9eac",
      "pke-web": "#9f71dc",
      recordatorios: "#5688ec",
      passwordmanager: "#16a573",
      regla: "#dc5c69",
    };

    // 1. Immediate priority: Hovered project in Selected Works
    if (hoveredProject?.color) {
      return {
        accent: hoveredProject.color,
        secondary: isDarkLocal ? "#555555" : "#bbbbbb",
      };
    }

    // 2. Expanded project in Selected Works
    if (activeSection === "work") {
      if (expandedIdx !== null && top3[expandedIdx]) {
        const pColor =
          PROJ_COLORS[top3[expandedIdx].name] ||
          (isDarkLocal ? "#6f8cff" : "#1f4bff");
        return {
          accent: pColor,
          secondary: isDarkLocal ? "#444444" : "#cccccc",
        };
      }
    }

    // Natural color fallback
    return {
      accent: isDarkLocal ? "#6f8cff" : "#1f4bff",
      secondary: isDarkLocal ? "#d1dfff" : "#8aa8dc",
    };
  }, [activeSection, expandedIdx, top3, theme, resolvedTheme, hoveredProject]);
}
