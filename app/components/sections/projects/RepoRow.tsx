"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { ArrowUpRight } from "lucide-react";
import { LANG_COLORS, getTechColor } from "../../../lib/constants";
import type { RepoFull } from "../../../types";

interface RepoRowProps {
  r: RepoFull;
  idx: number;
  activeRepo: number | null;
  setActiveRepo: (i: number | null) => void;
  lineRef: (el: HTMLDivElement | null) => void;
  isMobile: boolean;
}

export function RepoRow({
  r,
  idx,
  activeRepo,
  setActiveRepo,
  lineRef,
  isMobile,
}: RepoRowProps) {
  const isActive = activeRepo === idx;
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div
      ref={lineRef}
      className="border-b border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200 hover:bg-black/[0.012] dark:hover:bg-white/[0.02]"
    >
      <div
        className="py-[18px] md:py-5 cursor-pointer relative z-10"
        onMouseEnter={() => !isMobile && setActiveRepo(idx)}
        onMouseLeave={() => !isMobile && setActiveRepo(null)}
        onClick={() => {
          if (isMobile) {
            setActiveRepo(isActive ? null : idx);
          } else {
            window.open(r.html_url, "_blank", "noopener,noreferrer");
          }
        }}
      >
        <div className="flex items-start md:items-center gap-4 md:gap-5">
          <span className="font-mono text-[10px] text-lead/40 w-6 shrink-0 pt-1 md:pt-0">
            {String(idx + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-3">
              <span
                className={`font-mono text-[13px] font-bold md:font-medium tracking-[-0.01em] transition-colors duration-200 ${!isActive ? "text-ink" : ""}`}
                style={
                  isActive ? { color: getTechColor(r.langs?.[0]) } : undefined
                }
              >
                {r.name}
              </span>
              <div className="flex flex-wrap gap-[0.3rem]">
                {r.langs?.map((l) => {
                  const tColor = getTechColor(l);
                  return (
                    <span
                      key={l}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border whitespace-nowrap transition-all"
                      style={{
                        background: tColor + "30",
                        borderColor: tColor + "B0",
                        color: tColor,
                      }}
                    >
                      <span
                        className="w-[5px] h-[5px] rounded-full shrink-0"
                        style={{
                          background: tColor,
                          filter: isActive
                            ? `drop-shadow(0 0 4px ${tColor})`
                            : "none",
                          transition: "filter .2s",
                        }}
                      />
                      {l}
                    </span>
                  );
                })}
              </div>
            </div>
            <div
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ${isActive ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"}`}
            >
              {r.description && (
                <p className="text-[11px] text-lead/80 leading-[1.7] mb-3 pr-4">
                  {r.description}
                </p>
              )}
              <a
                href={r.html_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex md:hidden items-center gap-2 px-4 py-2 rounded-full text-white text-[9px] font-black uppercase tracking-[0.22em] hover:scale-105 transition-all shadow-lg border backdrop-blur-md"
                style={{
                  background: isDark
                    ? `linear-gradient(145deg, ${LANG_COLORS[r.langs?.[0]] || "#666666"}80 0%, transparent 100%)`
                    : `linear-gradient(145deg, ${LANG_COLORS[r.langs?.[0]] || "#24292F"} 0%, ${LANG_COLORS[r.langs?.[0]] || "#24292F"}ee 100%)`,
                  borderColor: isDark ? "rgba(255,255,255,0.1)" : "transparent",
                  boxShadow: `0 8px 20px rgba(0,0,0,0.15)`,
                }}
              >
                Visitar Repo <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <span className="font-mono text-[10px] text-lead/40">
              {(r.size / 1024).toFixed(1)}MB
            </span>
            {r.stargazers_count > 0 && (
              <span className="text-[10px] text-lead/40">
                ★{r.stargazers_count}
              </span>
            )}
            <span className="font-mono text-[10px] text-lead/30">
              {r.pushed_at.split("-")[0]}
            </span>
            <div
              className={`flex items-center justify-center gap-2 rounded-full border transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isActive
                  ? "px-4 py-2 text-white shadow-md"
                  : "w-7 h-7 border-transparent text-lead opacity-30"
              }`}
              style={
                isActive
                  ? {
                      background: isDark
                        ? `linear-gradient(145deg, ${LANG_COLORS[r.langs?.[0]] || "#666666"}80 0%, transparent 100%)`
                        : `linear-gradient(145deg, ${LANG_COLORS[r.langs?.[0]] || "#24292F"} 0%, ${LANG_COLORS[r.langs?.[0]] || "#24292F"}ee 100%)`,
                      borderColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "transparent",
                      boxShadow: `0 8px 20px rgba(0,0,0,0.12)`,
                    }
                  : undefined
              }
            >
              <span
                className={`font-mono text-[8px] font-black uppercase tracking-[0.22em] transition-all duration-500 overflow-hidden whitespace-nowrap ${
                  isActive ? "max-w-[120px] opacity-100" : "max-w-0 opacity-0"
                }`}
              >
                Visitar Repo
              </span>
              <ArrowUpRight
                size={12}
                className={`transition-colors duration-300 shrink-0 ${isActive ? "text-white" : "text-lead"}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
