import React, { memo } from "react";
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
  menu?: boolean;
  actionLabel?: string;
}

function RepoRowComponent({
  r,
  idx,
  activeRepo,
  setActiveRepo,
  lineRef,
  isMobile,
  menu,
  actionLabel = "Ver código",
}: RepoRowProps) {
  const isActive = activeRepo === idx;
  const isDescriptionOpen = isActive && !menu;
  const topLanguages = (r.langs ?? []).reduce<string[]>((languages, value) => {
    const language = value.trim();
    if (
      language &&
      !languages.some(
        (existing) => existing.toLowerCase() === language.toLowerCase(),
      )
    ) {
      languages.push(language);
    }
    return languages;
  }, []);
  const visibleLanguages = topLanguages.slice(0, 3);
  const remainingLanguages = topLanguages.length - visibleLanguages.length;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      ref={lineRef}
      data-repo-row
      className="border-b border-black/[0.06] dark:border-white/[0.08] transition-colors duration-150 hover:bg-black/[0.012] dark:hover:bg-white/[0.02]"
    >
      <div
        className={`py-[18px] md:py-5 relative z-10 select-none ${isMobile ? "cursor-pointer" : ""}`}
        onPointerEnter={(event) => {
          // A narrow desktop window still has a mouse; width is not input type.
          if (event.pointerType !== "touch") setActiveRepo(idx);
        }}
        onPointerLeave={(event) => {
          if (
            event.pointerType !== "touch" &&
            !event.currentTarget.contains(document.activeElement)
          ) {
            setActiveRepo(null);
          }
        }}
        onFocus={() => setActiveRepo(idx)}
        onBlur={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null) &&
            !event.currentTarget.matches(":hover")
          ) {
            setActiveRepo(null);
          }
        }}
        onClick={(event) => {
          const touch =
            (event.nativeEvent as PointerEvent).pointerType === "touch" ||
            matchMedia("(pointer: coarse)").matches;
          if (touch) setActiveRepo(isActive ? null : idx);
        }}
      >
        <div className="flex items-start md:items-center gap-4 md:gap-5">
          <span className="font-mono text-[10px] text-lead/40 w-6 shrink-0 pt-1 md:pt-0 tabular-nums">
            {String(idx + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-3">
              <a
                href={r.html_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                aria-expanded={isDescriptionOpen}
                aria-controls={`repo-description-${r.id}`}
                className={`font-mono text-[13px] font-bold md:font-medium tracking-[-0.01em] transition-colors duration-150 cursor-pointer ${!isActive ? "text-ink" : ""}`}
                style={
                  isActive ? { color: getTechColor(r.langs?.[0]) } : undefined
                }
              >
                {r.name}
              </a>
              <div className="flex flex-wrap gap-[0.3rem]">
                {visibleLanguages.map((l) => {
                  const tColor = getTechColor(l);
                  return (
                    <span
                      key={l}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border whitespace-nowrap transition-colors duration-150"
                      style={{
                        background: tColor + "30",
                        borderColor: tColor + "B0",
                        color: tColor,
                      }}
                    >
                      <span
                        className="w-[5px] h-[5px] rounded-full shrink-0 transition-transform duration-150"
                        style={{
                          background: tColor,
                          filter: isActive
                            ? `drop-shadow(0 0 4px ${tColor})`
                            : "none",
                        }}
                      />
                      {l}
                    </span>
                  );
                })}
                {remainingLanguages > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono text-lead/60 border border-black/[0.08] dark:border-white/[0.1] whitespace-nowrap">
                    +{remainingLanguages}
                  </span>
                )}
              </div>
            </div>
            <div
              id={`repo-description-${r.id}`}
              className="repo-description-panel grid transition-[grid-template-rows] duration-200 ease-out"
              style={{
                gridTemplateRows: isDescriptionOpen ? "1fr" : "0fr",
              }}
            >
              <div
                className="overflow-hidden transition-[opacity,transform] duration-200 ease-out"
                style={{
                  opacity: isDescriptionOpen ? 1 : 0,
                  transform: isDescriptionOpen
                    ? "translate3d(0, 0, 0)"
                    : "translate3d(0, -5px, 0)",
                  pointerEvents: isDescriptionOpen ? "auto" : "none",
                }}
                aria-hidden={!isDescriptionOpen}
              >
                <div className="pt-3">
                  {r.description && (
                    <p className="text-xs text-lead leading-[1.7] mb-3 pr-4">
                      {r.description}
                    </p>
                  )}
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex md:hidden items-center gap-2 px-4 py-2 rounded-full text-white text-[9px] font-black uppercase tracking-[0.22em] hover:scale-105 transition-transform shadow-lg border backdrop-blur-md"
                    style={{
                      background: isDark
                        ? `linear-gradient(145deg, ${LANG_COLORS[r.langs?.[0]] || "#666666"}80 0%, transparent 100%)`
                        : `linear-gradient(145deg, ${LANG_COLORS[r.langs?.[0]] || "#24292F"} 0%, ${LANG_COLORS[r.langs?.[0]] || "#24292F"}ee 100%)`,
                      borderColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "transparent",
                      boxShadow: `0 8px 20px rgba(0,0,0,0.15)`,
                    }}
                  >
                    {actionLabel} <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
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
            <a
              href={r.html_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className={`flex items-center justify-center gap-2 rounded-full border transition-[padding,background-color,border-color,box-shadow] duration-200 ease-out ${
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
                className={`font-mono text-[8px] font-black uppercase tracking-[0.22em] transition-[max-width,opacity] duration-200 ease-out overflow-hidden whitespace-nowrap ${
                  isActive ? "max-w-[120px] opacity-100" : "max-w-0 opacity-0"
                }`}
              >
                {actionLabel}
              </span>
              <ArrowUpRight
                size={12}
                className={`transition-colors duration-150 shrink-0 ${isActive ? "text-white" : "text-lead"}`}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export const RepoRow = memo(RepoRowComponent, (prev, next) => {
  const prevActive = prev.activeRepo === prev.idx;
  const nextActive = next.activeRepo === next.idx;
  return (
    prevActive === nextActive &&
    prev.r === next.r &&
    prev.menu === next.menu &&
    prev.isMobile === next.isMobile &&
    prev.actionLabel === next.actionLabel
  );
});
