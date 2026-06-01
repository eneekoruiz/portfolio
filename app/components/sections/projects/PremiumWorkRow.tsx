"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  ArrowUpRight,
  ArrowRight,
  Activity,
  Code2,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { getTechColor } from "../../../lib/constants";
import type { ProjectCard } from "../../../types";
import {
  createLiquidCurtain,
  animateLiquidCurtainIn,
} from "../../motion/LiquidCurtain";
import { PROJ_THEMES, DEFAULT_THEME, LIFECYCLE } from "../../../data/config";
import { saveNavState } from "../../../lib/navigationPersistence";

interface WorkRowProps {
  proj: ProjectCard;
  idx: number;
  isExpanded: boolean;
  onToggle: () => void;
  onHoverProject: (p: { name: string; color: string } | null) => void;
  menu?: boolean;
  skipAnimation?: boolean;
  motionEnabled: boolean;
}

export function PremiumWorkRow({
  proj,
  idx,
  isExpanded,
  onToggle,
  onHoverProject,
  menu,
  skipAnimation,
  motionEnabled,
}: WorkRowProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isPrefetched, setIsPrefetched] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context>(undefined);
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const ctaAnim = useRef<Animation | null>(null);
  const ghRef = useRef<HTMLAnchorElement | null>(null);
  const ghAnim = useRef<Animation | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const safeId = proj.name.toLowerCase().replace(/[\s_]+/g, "-");
  const panelId = `panel-${safeId}`;
  const theme = PROJ_THEMES[safeId] ?? DEFAULT_THEME;

  useEffect(() => {
    if (!theme.hasAudit || isPrefetched) return;
    router.prefetch(`/work/${safeId}`);
    setIsPrefetched(true);
  }, [isPrefetched, router, safeId, theme.hasAudit]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    if (!motionEnabled) {
      gsap.killTweensOf(body);
      gsap.set(body, {
        height: isExpanded ? "auto" : 0,
        opacity: isExpanded ? 1 : 0,
        y: 0,
      });
      return;
    }

    if (skipAnimation && isExpanded) {
      gsap.set(body, { height: "auto", opacity: 1, y: 0 });
      body.offsetHeight;
      return;
    }

    ctxRef.current = gsap.context(() => {
      if (isExpanded) {
        gsap.fromTo(
          body,
          { height: 0, opacity: 0, y: -10 },
          {
            height: "auto",
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "expo.out",
            clearProps: "transform",
          },
        );
      } else {
        gsap.to(body, {
          height: 0,
          opacity: 0,
          y: -5,
          duration: 0.5,
          ease: "expo.inOut",
        });
      }
    });

    return () => ctxRef.current?.revert();
  }, [isExpanded, skipAnimation, motionEnabled]);

  const prevExpandedRef = useRef(isExpanded);

  useEffect(() => {
    const justExpanded = isExpanded && !prevExpandedRef.current;
    prevExpandedRef.current = isExpanded;

    if (skipAnimation || !motionEnabled) return;
    if (!justExpanded || !rowRef.current) return;

    const mm = gsap.matchMedia();
    mm.add("(max-width: 768px)", () => {
      setTimeout(() => {
        const y =
          rowRef.current!.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 150);
    });

    return () => mm.revert();
  }, [isExpanded, skipAnimation, motionEnabled]);

  useEffect(() => {
    if (!motionEnabled || !rowRef.current) return;
    const el = rowRef.current;
    const setSkew = gsap.quickTo(el, "skewY", {
      duration: 0.6,
      ease: "power3.out",
    });

    const handleScroll = (e: any) => {
      const vel = e.velocity || 0;
      const skew = gsap.utils.clamp(-3, 3, vel * 0.02);
      setSkew(skew);
    };

    const registerScroll = () => {
      if (window.__lenis) {
        window.__lenis.on("scroll", handleScroll);
      } else {
        setTimeout(registerScroll, 100);
      }
    };
    registerScroll();

    return () => {
      window.__lenis?.off("scroll", handleScroll);
    };
  }, [motionEnabled]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = rowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  const handleNavigate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isNavigating) return;
    setIsNavigating(true);

    saveNavState({ openIdx: idx, scrollY: window.scrollY });

    // Capture preview follower position for FLIP transition
    const follower = document.getElementById("project-preview-follower");
    if (follower) {
      const rect = follower.getBoundingClientRect();
      sessionStorage.setItem(
        "flip_rect",
        JSON.stringify({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        }),
      );
    }

    const targetRoute = `/work/${safeId}`;
    const svg = createLiquidCurtain({
      color: theme.color,
      direction: "up",
      id: "project-transition-layer",
    });
    document.body.appendChild(svg);

    animateLiquidCurtainIn(svg, {
      duration: 1.0,
      onMidway: () => {
        if (typeof window !== "undefined") {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
        router.push(targetRoute, { scroll: false });
        setIsNavigating(false);
      },
      onComplete: () => {
        setIsNavigating(false);
      },
    });
  };

  return (
    <div
      ref={rowRef}
      onMouseMove={onMouseMove}
      className="group/row relative border-b border-black/[0.08] dark:border-white/[0.08]"
      style={{
        background: isExpanded ? theme.gradient : undefined,
        backdropFilter: isExpanded ? "blur(20px) saturate(1.4)" : "none",
        WebkitBackdropFilter: isExpanded ? "blur(20px) saturate(1.4)" : "none",
        boxShadow: isExpanded
          ? `inset 0 1px 0 0 rgba(255,255,255,${isDark ? "0.05" : "0.1"}), inset 0 -1px 0 0 rgba(0,0,0,${isDark ? "0.1" : "0.05"})`
          : "none",
        transitionProperty:
          "background, border-color, box-shadow, backdrop-filter, opacity",
        transitionDuration: "700ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform",
        transformStyle: "preserve-3d",
      }}
    >
      {/* ── Vertical Accent Theme-Colored Bar on Hover ── */}
      <div
        className="absolute left-0 top-0 w-[4px] h-full opacity-0 scale-y-50 group-hover/row:opacity-100 group-hover/row:scale-y-100 transition-all duration-500 ease-out z-30 pointer-events-none origin-center"
        style={{
          background: theme.color,
          boxShadow: `0 0 16px ${theme.color}, 0 0 4px ${theme.color}`,
        }}
      />

      {/* ── Apple-Style Premium Satin Glass Overlay & Gradient Wash ── */}
      <div
        className="absolute inset-0 z-0 opacity-0 group-hover/row:opacity-100 transition-all duration-500 ease-out pointer-events-none"
        style={{
          background: isDark
            ? `linear-gradient(90deg, rgba(${theme.rgb}, 0.08) 0%, rgba(${theme.rgb}, 0.02) 50%, transparent 100%), rgba(255, 255, 255, 0.015)`
            : `linear-gradient(90deg, rgba(${theme.rgb}, 0.07) 0%, rgba(${theme.rgb}, 0.01) 60%, transparent 100%), rgba(0, 0, 0, 0.006)`,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* ── Apple-Style Interactive Radial Glow Spot (Enhanced) ── */}
      <div
        className="absolute inset-0 z-0 opacity-0 group-hover/row:opacity-100 transition-all duration-300 ease-out pointer-events-none"
        style={{
          background: isDark
            ? `radial-gradient(420px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(${theme.rgb}, 0.22) 0%, rgba(${theme.rgb}, 0.06) 50%, transparent 80%)`
            : `radial-gradient(420px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(${theme.rgb}, 0.16) 0%, rgba(${theme.rgb}, 0.03) 60%, transparent 80%)`,
        }}
      />

      {/* ── Top Border Glow Reflect (follows mouse X) ── */}
      <div
        className="absolute top-0 left-0 w-full h-[1.5px] opacity-0 group-hover/row:opacity-100 transition-opacity duration-500 z-20 pointer-events-none"
        style={{
          background: `radial-gradient(180px circle at var(--mouse-x, 50%) 0px, rgba(${theme.rgb}, 0.65) 0%, transparent 100%)`,
        }}
      />

      {/* ── Bottom Border Glow Reflect (follows mouse X) ── */}
      <div
        className="absolute bottom-0 left-0 w-full h-[1.5px] opacity-0 group-hover/row:opacity-100 transition-opacity duration-500 z-20 pointer-events-none"
        style={{
          background: `radial-gradient(180px circle at var(--mouse-x, 50%) 100%, rgba(${theme.rgb}, 0.65) 0%, transparent 100%)`,
        }}
      />

      {/* ── CABECERA DEL ACORDEÓN ── */}
      <button
        onClick={onToggle}
        id={`btn-${safeId}`}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onMouseEnter={() => {
          onHoverProject({ name: proj.name, color: theme.color });
          if (theme.hasAudit && !isPrefetched) {
            router.prefetch(`/work/${safeId}`);
            setIsPrefetched(true);
          }
        }}
        onMouseLeave={() => onHoverProject(null)}
        onFocus={() => {
          if (theme.hasAudit && !isPrefetched) {
            router.prefetch(`/work/${safeId}`);
            setIsPrefetched(true);
          }
        }}
        className="relative z-10 w-full text-left py-[16px] md:py-[22px] px-5 md:px-6 flex items-center justify-between gap-4 cursor-pointer group/btn"
        data-cursor-plus={isExpanded ? undefined : "true"}
        data-cursor-minus={isExpanded ? "true" : undefined}
      >
        {/* Order Number with Theme Color Shift */}
        <span
          className="font-mono text-[10px] md:text-[11px] w-7 shrink-0 tabular-nums transition-all duration-700 font-semibold group-hover/row:scale-110 origin-left"
          style={{
            color: theme.color,
            opacity: isExpanded ? 1 : 0.6,
          }}
        >
          <span
            className="group-hover/row:opacity-100 group-hover/row:text-[var(--theme-color)] transition-colors duration-700"
            style={{ "--theme-color": theme.color } as React.CSSProperties}
          >
            {String(idx + 1).padStart(2, "0")}
          </span>
        </span>

        <div className="flex-1 min-w-0 flex items-center gap-3 md:gap-5">
          {/* Project Name with Color & Translation Pop */}
          <h3
            className="font-bold leading-tight tracking-tight min-w-0 transition-all duration-700 group-hover/row:translate-x-3 group-hover/row:scale-[1.02] origin-left"
            style={{
              fontSize: "clamp(0.92rem, 2.2vw, 1.42rem)",
              color: isExpanded ? theme.color : "var(--ink)",
              opacity: isExpanded ? 1 : 0.9,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            <span
              className="group-hover/row:text-[var(--theme-color)] transition-colors duration-700 drop-shadow-[0_0_8px_var(--theme-glow)]"
              style={
                {
                  "--theme-color": theme.color,
                  "--theme-glow": `${theme.color}30`,
                } as React.CSSProperties
              }
            >
              {proj.name.replace(/-/g, " ").replace(/_/g, " ")}
            </span>
          </h3>

          <span
            className="hidden sm:block font-mono text-[8px] md:text-[9px] uppercase tracking-[0.28em] md:tracking-[0.3em] opacity-0 group-hover/btn:opacity-100 transition-all duration-700 whitespace-nowrap shrink-0 translate-x-4 group-hover/btn:translate-x-0"
            style={{ color: theme.color, letterSpacing: "0.28em" }}
          >
            {proj.tag}
          </span>
        </div>

        <span className="hidden lg:block font-mono text-[11px] text-lead/35 shrink-0 tabular-nums group-hover/row:opacity-100 transition-opacity duration-700">
          {proj.year}
        </span>

        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-700 ${
            isExpanded
              ? "rotate-180 text-white shadow-lg"
              : "border border-black/10 dark:border-white/15 text-lead group-hover/row:border-[var(--theme-color)] group-hover/row:text-[var(--theme-color)] group-hover/row:shadow-[0_0_10px_var(--theme-glow)]"
          }`}
          style={
            isExpanded
              ? { backgroundColor: theme.color }
              : ({
                  "--theme-color": theme.color,
                  "--theme-glow": `${theme.color}40`,
                } as React.CSSProperties)
          }
        >
          <ChevronDown size={15} strokeWidth={2.5} />
        </div>
      </button>

      <div
        ref={bodyRef}
        id={panelId}
        role="region"
        aria-labelledby={`btn-${safeId}`}
        style={{ height: 0, overflow: "hidden", opacity: 0 }}
      >
        <div className="pb-6 md:pb-10 pt-2 px-0 md:px-6 grid grid-cols-1 lg:grid-cols-[1.15fr_2fr] gap-3 md:gap-4 relative z-10">
          {/* Lifecycle Card */}
          <div
            className="p-5 md:p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group/card"
            style={{
              backgroundColor: `${theme.color}08`,
              border: `1px solid ${theme.color}28`,
              boxShadow: `inset 0 1px 0 ${theme.color}12`,
            }}
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 blur-[70px] opacity-20 transition-opacity duration-700 group-hover/card:opacity-40 pointer-events-none"
              style={{ backgroundColor: theme.color }}
            />

            <div className="relative z-10">
              <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.34em] opacity-45">
                Project Lifecycle
              </span>

              <div className="mt-5">
                {LIFECYCLE.map((stage, i) => {
                  const completed = i < theme.progress;
                  const active = i === theme.progress - 1;
                  return (
                    <div
                      key={stage}
                      className="flex items-start gap-3 relative"
                    >
                      {i !== LIFECYCLE.length - 1 && (
                        <div
                          className="absolute left-[4px] top-[11px] w-[1px] h-full"
                          style={{
                            background:
                              completed && !active
                                ? theme.color
                                : "currentColor",
                            opacity: completed && !active ? 0.3 : 0.06,
                          }}
                        />
                      )}
                      <div className="relative flex items-center justify-center w-2.5 h-2.5 mt-1 shrink-0 z-10">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${!completed ? "bg-black/10 dark:bg-white/10" : ""}`}
                          style={{
                            backgroundColor: completed
                              ? theme.color
                              : undefined,
                          }}
                        />
                        {active && (
                          <div
                            className="absolute inset-0 rounded-full animate-ping opacity-40"
                            style={{ backgroundColor: theme.color }}
                          />
                        )}
                      </div>
                      <div
                        className={`pb-4 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.24em] ${completed ? "opacity-70" : "opacity-20"} ${active ? "font-bold" : ""}`}
                        style={{ color: active ? theme.color : "inherit" }}
                      >
                        {stage}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            {theme.hasAudit ? (
              <a
                href={`/work/${safeId}`}
                onClick={handleNavigate}
                ref={ctaRef}
                onMouseEnter={() => {
                  // Project preview handled centrally; here we play a quick WAAPI micro-interaction
                  const el = ctaRef.current;
                  if (el) {
                    ctaAnim.current?.cancel();
                    ctaAnim.current = el.animate(
                      [
                        { transform: "scale(1)", opacity: 1 },
                        { transform: "scale(1.05)", opacity: 1 },
                      ],
                      {
                        duration: 140,
                        easing: "cubic-bezier(0.2,0.9,0.2,1)",
                        fill: "forwards",
                      },
                    );
                  }
                  onHoverProject({ name: proj.name, color: theme.color });
                  if (!isPrefetched) {
                    router.prefetch(`/work/${safeId}`);
                    setIsPrefetched(true);
                  }
                }}
                onMouseLeave={() => {
                  ctaAnim.current?.cancel();
                  const el = ctaRef.current;
                  if (el) {
                    ctaAnim.current = el.animate(
                      [
                        {
                          transform:
                            getComputedStyle(el).transform || "scale(1)",
                          opacity: 1,
                        },
                        { transform: "scale(0.98)", opacity: 0.98 },
                        { transform: "scale(0.72)", opacity: 0 },
                      ],
                      {
                        duration: 120,
                        easing: "cubic-bezier(0.22,1,0.36,1)",
                        fill: "forwards",
                      },
                    );
                    // revert visually after short time
                    ctaAnim.current.onfinish = () => {
                      el.style.transform = "";
                    };
                  }
                  onHoverProject(null);
                }}
                onFocus={() => {
                  if (!isPrefetched) {
                    router.prefetch(`/work/${safeId}`);
                    setIsPrefetched(true);
                  }
                }}
                className={`relative z-10 mt-4 flex items-center justify-between px-6 py-[12px] rounded-full transition-all duration-300 text-white font-black border backdrop-blur-md ${
                  isNavigating
                    ? "cursor-wait opacity-70"
                    : "hover:scale-[1.05] hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)] active:scale-95"
                }`}
                style={{
                  background: isDark
                    ? `linear-gradient(145deg, rgba(${theme.rgb}, 0.7) 0%, rgba(${theme.rgb}, 0.3) 100%)`
                    : `linear-gradient(145deg, rgba(${theme.rgb}, 0.95) 0%, rgba(${theme.rgb}, 0.8) 100%)`,
                  borderColor: isDark
                    ? `rgba(${theme.rgb}, 0.8)`
                    : `rgba(${theme.rgb}, 0.6)`,
                  boxShadow: `0 15px 35px rgba(${theme.rgb}, ${isDark ? "0.5" : "0.35"})`,
                }}
              >
                <span className="text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity
                    size={14}
                    className={isNavigating ? "" : "animate-pulse"}
                  />
                  {isNavigating ? "CARGANDO..." : theme.btnText}
                </span>
                {isNavigating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </a>
            ) : (
              <a
                href={`https://github.com/eneekoruiz/${proj.name}`}
                target="_blank"
                rel="noopener noreferrer"
                ref={ghRef}
                onMouseEnter={() => {
                  const el = ghRef.current;
                  if (el) {
                    ghAnim.current?.cancel();
                    ghAnim.current = el.animate(
                      [
                        { transform: "scale(1)", opacity: 1 },
                        { transform: "scale(1.04)", opacity: 1 },
                      ],
                      {
                        duration: 120,
                        easing: "cubic-bezier(0.2,0.9,0.2,1)",
                        fill: "forwards",
                      },
                    );
                  }
                  onHoverProject({ name: proj.name, color: theme.color });
                }}
                onMouseLeave={() => {
                  ghAnim.current?.cancel();
                  const el = ghRef.current;
                  if (el) {
                    ghAnim.current = el.animate(
                      [
                        {
                          transform:
                            getComputedStyle(el).transform || "scale(1)",
                          opacity: 1,
                        },
                        { transform: "scale(0.98)", opacity: 0.98 },
                      ],
                      {
                        duration: 90,
                        easing: "cubic-bezier(0.22,1,0.36,1)",
                        fill: "forwards",
                      },
                    );
                    ghAnim.current.onfinish = () => {
                      el.style.transform = "";
                    };
                  }
                  onHoverProject(null);
                }}
                className="relative z-10 mt-4 flex items-center justify-between px-6 py-[12px] rounded-full transition-all duration-300 text-white font-black border backdrop-blur-md hover:scale-[1.05] hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] active:scale-95"
                style={{
                  background: isDark
                    ? `linear-gradient(145deg, rgba(${theme.rgb}, 0.7) 0%, rgba(${theme.rgb}, 0.3) 100%)`
                    : `linear-gradient(145deg, rgba(${theme.rgb}, 0.95) 0%, rgba(${theme.rgb}, 0.8) 100%)`,
                  borderColor: isDark
                    ? `rgba(${theme.rgb}, 0.8)`
                    : `rgba(${theme.rgb}, 0.6)`,
                  boxShadow: `0 15px 35px rgba(${theme.rgb}, ${isDark ? "0.5" : "0.35"})`,
                }}
              >
                <span className="text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
                  <Code2 size={14} /> {theme.btnText}
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="p-6 rounded-[20px] border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.05] dark:bg-white/[0.03] backdrop-blur-xl flex flex-col justify-between gap-6">
            <p className="text-sm md:text-[15px] font-light leading-relaxed text-ink/78">
              {proj.desc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-black/5 dark:border-white/5">
              <div className="space-y-1">
                <span className="block font-mono text-[7px] md:text-[8px] uppercase tracking-[0.34em] text-lead/40">
                  Año
                </span>
                <span className="block font-semibold text-[13px] text-ink">
                  {proj.year}
                </span>
              </div>
              <div className="space-y-1">
                <span className="block font-mono text-[7px] md:text-[8px] uppercase tracking-[0.34em] text-lead/40">
                  Tamaño
                </span>
                <span className="block font-semibold text-[13px] text-ink">
                  {proj.size}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 space-y-2">
                <span className="block font-mono text-[7px] md:text-[8px] uppercase tracking-[0.34em] text-lead/40">
                  Stack
                </span>
                <div className="flex flex-wrap gap-1">
                  {proj.langs.map((l) => {
                    const tColor = getTechColor(l);
                    return (
                      <span
                        key={l}
                        className="px-2 py-0.5 rounded-full border text-[8px] md:text-[9px] font-bold tracking-wide transition-all"
                        style={{
                          background: tColor + "30",
                          borderColor: tColor + "B0",
                          color: tColor,
                        }}
                      >
                        {l}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
