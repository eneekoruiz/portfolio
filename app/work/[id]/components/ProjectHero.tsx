"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PROJECT HERO — Fake 3D / Cinematic Parallax Effect
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ESTRUCTURA:
 *   - Hero ocupa 100vh con imagen de fondo (cover del proyecto)
 *   - Título + stack en primer plano
 *   - ScrollTrigger pinea el hero brevemente
 *
 * ANIMACIÓN:
 *   - Al scroll: imagen hace zoom lento (1.0 → 1.2)
 *   - Título hace parallax (sube más rápido que la imagen)
 *   - Efecto cinematic con scrub: 1.5
 *
 * TRANSICIÓN:
 *   - Contenido por debajo (z-10) desliza por encima del hero (z-0)
 *   - Ocultamiento suave del hero
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Activity,
  MousePointer2,
  X,
  ExternalLink,
  MoveUp,
  GithubIcon,
} from "lucide-react";
import { useMotionEnabled } from "../../../hooks/useMotionEnabled";
import type { Lang } from "../../../types";
import { STUDIO_TX } from "../../../data/studio-translations";
import { materia } from "../../../lib/materia";
import { UI_COPY } from "../../../data/interface-translations";
import { TX } from "../../../data/translations";
import { ProjectVisual } from "../../../components/motion/ProjectVisual";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface ProjectHeroProps {
  projectId: string;
  title: string;
  subtitle: string;
  accent: string;
  accentBg: string;
  liveUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  iframeTitle?: string;
  label: string;
  langs: string[];
  darkMode: boolean;
  index?: number;
  isReady?: boolean;
  lang?: Lang;
}

export function ProjectHero({
  projectId,
  title,
  subtitle,
  accent,
  accentBg,
  liveUrl,
  githubUrl,
  videoUrl,
  iframeTitle = "Preview",
  label,
  langs,
  darkMode,
  index = 1,
  isReady = true,
  lang = "es",
}: ProjectHeroProps) {
  const s = STUDIO_TX[lang] ?? STUDIO_TX["en"];
  const ui = UI_COPY[lang];
  const motionEnabled = useMotionEnabled();
  const staticStudioLayout = !motionEnabled;
  const [embeddingOrigin, setEmbeddingOrigin] = useState<string | null>(null);
  useEffect(() => setEmbeddingOrigin(window.location.origin), []);
  // The live salon site permits framing only from its published portfolio hosts.
  // Local and preview deployments use a real external link instead of a blocked iframe.
  const embeddingAllowed =
    embeddingOrigin !== null &&
    (projectId !== "ana-peluquera" ||
      [
        "https://eneko-ruiz.vercel.app",
        "https://eneekoruiz.vercel.app",
        "https://ana-peluqueria.vercel.app",
        "https://ana-peluquera.vercel.app",
        "https://agpeluqueria.vercel.app",
      ].includes(embeddingOrigin));
  const heroRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // HUD scroll progress refs
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const scrollTextRef = useRef<HTMLSpanElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const scrollHintDefaultRef = useRef<HTMLDivElement>(null);
  const scrollHintProgressRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLSpanElement>(null);
  const mobileCtaRef = useRef<HTMLButtonElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const [mobilePressed, setMobilePressed] = useState(false);

  const [isInteracting, setIsInteracting] = useState(false);
  const scrollLockYRef = useRef(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [canInteract, setCanInteract] = useState(false);
  const interRef = useRef(false);
  const canRef = useRef(false);

  // ── DEFERRED LOADING STATE FOR PERFORMANCE ──
  const [shouldLoad, setShouldLoad] = useState(false);
  const shouldLoadRef = useRef(false);

  // Sync refs with state for use in event listeners
  useEffect(() => {
    interRef.current = isInteracting;
  }, [isInteracting]);
  useEffect(() => {
    canRef.current = canInteract;
  }, [canInteract]);
  useEffect(() => {
    shouldLoadRef.current = shouldLoad;
  }, [shouldLoad]);

  useEffect(() => {
    if (!motionEnabled) {
      setShouldLoad(true);
      setCanInteract(true);
    }
  }, [motionEnabled]);

  const disableStudio = projectId === "rides24ofiziala";
  const staticMotionMode = !motionEnabled;

  // Iframe loading safety fallback
  useEffect(() => {
    if (!liveUrl || iframeLoaded || !shouldLoad || !embeddingAllowed) return;
    const timer = setTimeout(() => {
      setIframeLoaded(true);
    }, 6000); // 6s fallback for heavy sites
    return () => clearTimeout(timer);
  }, [liveUrl, iframeLoaded, shouldLoad, embeddingAllowed]);

  // ── CINEMATIC MULTI-STAGE ANIMATION ────────────────────────────────────
  useGSAP(
    () => {
      if (
        !isReady ||
        !heroRef.current ||
        !bgImageRef.current ||
        !titleRef.current ||
        !screenRef.current ||
        !motionEnabled
      )
        return;

      // 1. Cinematic Scroll Sequence — INCREASED END for better pacing
      const tl = gsap.timeline({
        scrollTrigger: {
          id: `studio-${projectId}`,
          trigger: heroRef.current,
          start: "top top",
          end: disableStudio ? "+=120%" : "+=250%", // More space for a grander transition
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self: ScrollTrigger) => {
            materia.studio.target = self.progress;
            const isLocked = self.progress > 0.88; // Trigger CTA earlier
            if (!disableStudio && canRef.current !== isLocked) {
              canRef.current = isLocked;
              setCanInteract(isLocked);
            }

            // Trigger deferred loading when the user begins to scroll down
            if (self.progress > 0.05 && !shouldLoadRef.current) {
              shouldLoadRef.current = true;
              setShouldLoad(true);
            }

            if (screenRef.current && !interRef.current) {
              screenRef.current.style.setProperty(
                "--shield-opacity",
                isLocked ? "0.4" : "1",
              );
              screenRef.current.style.setProperty(
                "--shield-pointer",
                isLocked ? "all" : "none",
              );
            }

            // Update scroll telemetry HUD
            const progressPercent = Math.round(self.progress * 100);
            if (scrollTextRef.current) {
              scrollTextRef.current.textContent = `${progressPercent}%`;
            }
            if (scrollBarRef.current) {
              scrollBarRef.current.style.width = `${progressPercent}%`;
            }

            if (scrollProgressRef.current) {
              if (self.progress > 0.85) {
                scrollProgressRef.current.style.opacity = "0";
                scrollProgressRef.current.style.pointerEvents = "none";
              } else if (self.progress > 0.02) {
                scrollProgressRef.current.style.opacity = "1";
                scrollProgressRef.current.style.pointerEvents = "auto";
                if (scrollHintDefaultRef.current)
                  scrollHintDefaultRef.current.style.display = "none";
                if (scrollHintProgressRef.current)
                  scrollHintProgressRef.current.style.display = "flex";
              } else {
                scrollProgressRef.current.style.opacity = "1";
                scrollProgressRef.current.style.pointerEvents = "auto";
                if (scrollHintDefaultRef.current)
                  scrollHintDefaultRef.current.style.display = "flex";
                if (scrollHintProgressRef.current)
                  scrollHintProgressRef.current.style.display = "none";
              }
            }
          },
        },
      });

      if (contentRef.current && bgImageRef.current) {
        tl
          // Phase 1: Background & Content Fade
          .to(
            contentRef.current,
            {
              y: -120,
              opacity: 0,
              scale: 0.9,
              force3D: true,
              ease: "power2.in",
              duration: 1.2,
            },
            0,
          )
          .to(
            bgImageRef.current,
            {
              scale: disableStudio ? 1.4 : 2.2,
              opacity: disableStudio ? 0.3 : 0.1,
              force3D: true,
              ease: "power2.inOut",
              duration: 2.5,
            },
            0,
          );
      }

      if (!disableStudio && screenRef.current && overlayRef.current) {
        tl
          // Phase 2: Screen reveals with a "Window" effect
          .fromTo(
            screenRef.current,
            {
              scale: 0.05,
              opacity: 0,
              z: -1500,
              rotateX: 18,
              rotateY: -22,
              // Explicitly center the start state so it appears in the center, not corner
              xPercent: -50,
              yPercent: -50,
              left: "50%",
              top: "50%",
            },
            {
              scale: 1,
              opacity: 1,
              z: 0,
              rotateX: 0,
              rotateY: 0,
              xPercent: -50,
              yPercent: -50,
              left: "50%",
              top: "50%",
              force3D: true,
              ease: "expo.inOut",
              duration: 2.2,
            },
            0.5,
          )

          // Phase 3: Darkening for focus
          .to(
            overlayRef.current,
            {
              opacity: 1,
              backgroundColor: "rgba(0,0,0,0.94)",
              duration: 1.8,
            },
            0.8,
          );
      }

      // 2. Idle floating
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          y: "+=12",
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          force3D: true,
        });
      }

      const title = titleRef.current;
      const glare = glareRef.current;
      const setTitleRotateY = title
        ? gsap.quickTo(title, "rotateY", {
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto",
          })
        : null;
      const setTitleRotateX = title
        ? gsap.quickTo(title, "rotateX", {
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto",
          })
        : null;
      const setTitleScale = title
        ? gsap.quickTo(title, "scale", {
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto",
          })
        : null;
      const setGlareX = glare
        ? gsap.quickTo(glare, "x", {
            duration: 1,
            ease: "power2.out",
            overwrite: "auto",
          })
        : null;
      const setGlareY = glare
        ? gsap.quickTo(glare, "y", {
            duration: 1,
            ease: "power2.out",
            overwrite: "auto",
          })
        : null;
      const setGlareOpacity = glare
        ? gsap.quickTo(glare, "opacity", {
            duration: 1,
            ease: "power2.out",
            overwrite: "auto",
          })
        : null;

      // 3. Mouse Interaction (Optimized)
      const onMove = (e: MouseEvent) => {
        if (!titleRef.current || interRef.current) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const mx = (clientX / innerWidth - 0.5) * 2;
        const my = (clientY / innerHeight - 0.5) * 2;

        setTitleRotateY?.(mx * 10);
        setTitleRotateX?.(-my * 10);
        setTitleScale?.(1.01);

        setGlareX?.(mx * 20);
        setGlareY?.(my * 20);
        setGlareOpacity?.(0.2);
      };

      window.addEventListener("mousemove", onMove);
      return () => {
        window.removeEventListener("mousemove", onMove);
        materia.studio.target = 0;
      };
    },
    {
      scope: heroRef,
      dependencies: [isReady, motionEnabled, projectId],
      revertOnUpdate: true,
    },
  );

  // ── 🚀 STUDIO MODE TRANSITION (Fullscreen Takeover) ────────────────
  useGSAP(() => {
    if (!screenRef.current || !motionEnabled) return;

    if (isInteracting) {
      // Clear all GSAP-set transforms so position:fixed works correctly
      gsap.set(screenRef.current, {
        clearProps:
          "transform,left,top,xPercent,yPercent,width,height,borderRadius,filter,scale,opacity,z",
      });
      const tl = gsap.timeline();
      tl.fromTo(
        ".studio-bar",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      );
    } else {
      // On exit, ScrollTrigger refresh will re-apply the animated state
      ScrollTrigger.refresh();
    }
  }, [isInteracting, motionEnabled]);

  // ── 🚀 STUDIO MODE SIDE EFFECTS (Scroll Lock & ESC Key) ────────────────
  useEffect(() => {
    if (isInteracting) {
      // 1. Strict Scroll Lock & UI Cleanups (avoid position: fixed which breaks GSAP ScrollTrigger)
      scrollLockYRef.current = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.touchAction = "none";
      document.body.classList.add("studio-active");
      window.__lenis?.stop();

      // 2. Prevent Zoom (pinch-to-zoom and Ctrl+wheel) and standard scroll events on parent
      const preventScrollAndZoom = (e: Event) => {
        e.preventDefault();
      };

      const preventZoomKeys = (e: KeyboardEvent) => {
        const isCtrlCmd = e.ctrlKey || e.metaKey;
        if (
          isCtrlCmd &&
          (e.key === "=" || e.key === "-" || e.key === "+" || e.key === "0")
        ) {
          e.preventDefault();
        }
      };

      const preventScrollKeys = (e: KeyboardEvent) => {
        const keys = [
          " ",
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
        ];
        if (keys.includes(e.key)) {
          const active = document.activeElement;
          if (
            active &&
            (active.tagName === "INPUT" ||
              active.tagName === "TEXTAREA" ||
              (active as HTMLElement).isContentEditable)
          ) {
            return;
          }
          e.preventDefault();
        }
      };

      window.addEventListener("wheel", preventScrollAndZoom, {
        passive: false,
      });
      window.addEventListener("touchmove", preventScrollAndZoom, {
        passive: false,
      });
      window.addEventListener("keydown", preventZoomKeys, { passive: false });
      window.addEventListener("keydown", preventScrollKeys, { passive: false });

      // 3. ESC Key Listener
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsInteracting(false);
      };
      window.addEventListener("keydown", handleEsc);

      return () => {
        const lockedY = scrollLockYRef.current;
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
        document.documentElement.style.overflow = "";
        document.documentElement.style.touchAction = "";
        document.body.classList.remove("studio-active");
        window.__lenis?.start();
        window.scrollTo(0, lockedY);
        window.removeEventListener("wheel", preventScrollAndZoom);
        window.removeEventListener("touchmove", preventScrollAndZoom);
        window.removeEventListener("keydown", preventZoomKeys);
        window.removeEventListener("keydown", preventScrollKeys);
        window.removeEventListener("keydown", handleEsc);
      };
    } else {
      // 🚀 When exiting, force ScrollTrigger to refresh immediately and reapply its exact active styles (scale, opacity, etc.)
      ScrollTrigger.refresh();
      ScrollTrigger.getAll().forEach((t: globalThis.ScrollTrigger) =>
        t.update(),
      );
    }
  }, [isInteracting]);

  // Entrance animation for scroll HUD and reduced-motion handling
  useGSAP(
    () => {
      if (!scrollProgressRef.current || !motionEnabled) return;

      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // If user prefers reduced motion, strip decorative animations inside the HUD
      if (prefersReduced && scrollProgressRef.current) {
        scrollProgressRef.current
          .querySelectorAll(".animate-bounce, .animate-pulse")
          .forEach((el) =>
            el.classList.remove("animate-bounce", "animate-pulse"),
          );
        return;
      }

      // Subtle entrance - only when motion enabled and not reduced-motion
      gsap.fromTo(
        scrollProgressRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      );
    },
    { dependencies: [motionEnabled] },
  );

  // Mobile CTA sheen animation (subtle). Respect reduced-motion preferences.
  useGSAP(
    () => {
      if (!mobileCtaRef.current || !sheenRef.current || !motionEnabled) return;

      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) return;

      const anim = gsap.to(sheenRef.current, {
        x: "160%",
        duration: 1.4,
        repeat: -1,
        ease: "power1.inOut",
        repeatDelay: 1.2,
        yoyo: false,
        overwrite: "auto",
      });

      return () => anim.kill();
    },
    { dependencies: [motionEnabled] },
  );

  const renderScreenContents = () => {
    return (
      <>
        {/* Studio HUD - Top Control Bar */}
        {isInteracting && (
          <header className="w-full bg-[#121212] border-b border-white/10 px-6 pb-4 pt-[calc(env(safe-area-inset-top,0px)+1rem)] md:py-4 flex items-center justify-between shrink-0 z-[10000]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse shadow-[0_0_10px_var(--brand)]" />
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-white/90 truncate max-w-[120px] md:max-w-none">
                  {title}{" "}
                  <span className="hidden xs:inline">
                    {" // SYSTEM.ACTIVE"}
                  </span>
                </span>
              </div>

              {/* Real-time Telemetry (Decorative) */}
              <div className="hidden md:flex items-center gap-6 text-white/40 font-mono text-[8px] uppercase tracking-widest">
                <div className="flex flex-col">
                  <span className="text-white/20">Latency</span>
                  <span className="text-brand">24ms</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/20">Security</span>
                  <span className="text-green-400">Hardened</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/20">Environment</span>
                  <span className="text-white/60">Vercel.Edge</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Source Code Access */}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all group flex items-center gap-2"
                  title="View Source Code"
                >
                  <GithubIcon size={16} className="group-hover:scale-110" />
                  <span className="text-[10px] uppercase tracking-widest hidden md:inline font-mono text-white/40 group-hover:text-white">
                    {s.sourceCode}
                  </span>
                </a>
              )}

              {/* External Access */}
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all group"
                  title="Open External"
                >
                  <ExternalLink size={16} className="group-hover:scale-110" />
                </a>
              )}

              {/* Close Session */}
              <button
                onClick={() => setIsInteracting(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all group shrink-0"
              >
                <X size={16} className="font-bold" />
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest hidden xs:block">
                  {s.closeSession}
                </span>
              </button>
            </div>
          </header>
        )}

        {/* Viewport Area */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-black flex items-center justify-center z-[2005]">
          {/* Interaction Shield */}
          <div
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-700 group/shield cursor-pointer"
            style={{
              display: liveUrl && !embeddingAllowed ? "none" : undefined,
              opacity: isInteracting ? 0 : 1,
              pointerEvents: isInteracting ? "none" : "all",
              backgroundColor: canInteract ? "rgba(0,0,0,0.6)" : "transparent",
              backdropFilter: canInteract ? "blur(15px)" : "none",
            }}
            onClick={() => canInteract && setIsInteracting(true)}
          >
            {canInteract && !isInteracting && (
              <div
                className={`flex flex-col items-center justify-center ${
                  motionEnabled ? "animate-in fade-in duration-700" : ""
                }`}
              >
                {/* Desktop/Tablet CTA (md+) */}
                <button
                  type="button"
                  onClick={() => canInteract && setIsInteracting(true)}
                  className="hidden md:flex flex-col items-center gap-6 rounded-2xl p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <div
                    className={`w-20 h-20 rounded-full bg-white/10 backdrop-blur-2xl border border-white/30 flex items-center justify-center text-white shadow-[0_0_50px_rgba(255,255,255,0.12)] ${motionEnabled ? "group-hover/shield:scale-110 transition-transform studio-pulse" : ""}`}
                  >
                    <MousePointer2
                      size={32}
                      className={motionEnabled ? "animate-pulse" : ""}
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <span className="font-mono text-[12px] font-black uppercase tracking-[0.4em] text-white">
                      {s.enterStudio}
                    </span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">
                      {s.clickToInteract}
                    </span>
                  </div>
                </button>

                {/* Mobile tactile CTA (sm) — more artistic and realistic */}
                <div className="md:hidden flex flex-col items-center gap-4">
                  <button
                    ref={mobileCtaRef}
                    type="button"
                    aria-label={s.enterStudio}
                    onClick={() => canInteract && setIsInteracting(true)}
                    onPointerDown={() => setMobilePressed(true)}
                    onPointerUp={() => setMobilePressed(false)}
                    onPointerCancel={() => setMobilePressed(false)}
                    className={`relative w-20 h-20 rounded-full bg-gradient-to-br from-white/6 to-transparent border border-white/10 flex items-center justify-center shadow-[0_18px_60px_rgba(0,0,0,0.6)] overflow-visible transition-transform duration-150 ease-out ${mobilePressed ? "scale-95 translate-y-0.5" : "scale-100"}`}
                  >
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_40%)] blur-sm" />
                    {/* Finger icon */}
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="relative z-10 text-white/90"
                    >
                      <path
                        d="M12 2v8"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 11v6a3 3 0 0 0 6 0v-6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 11c0-1.657 1.343-3 3-3h0"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {/* Ripple / tactile ping */}
                    <span
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/8 opacity-60"
                      aria-hidden
                    />
                    <span
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border border-white/10"
                      aria-hidden
                    />
                    {/* Sheen layer (animated with GSAP) */}
                    <div
                      ref={sheenRef}
                      className="absolute left-[-60%] top-0 h-full w-[60%] rounded-full opacity-20 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02))",
                        transform: "skewX(-15deg)",
                      }}
                    />
                  </button>

                  <div className="flex flex-col items-center gap-1 text-center px-4">
                    <span className="font-mono text-[12px] font-black uppercase tracking-[0.2em] text-white">
                      {s.enterStudio}
                    </span>
                    <span className="text-[11px] text-white/50 leading-snug max-w-[220px]">
                      {s.clickToInteract}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 🌌 Scanning Lines / CRT Effect */}
          {isInteracting && (
            <div className="absolute inset-0 z-[105] pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,210,0.06))] bg-[length:100%_2px,3px_100%] select-none" />
          )}

          {liveUrl && !embeddingAllowed ? (
            <div className="relative z-[110] flex h-full w-full flex-col items-center justify-center gap-6 bg-neutral-950 px-8 py-12 text-center text-white">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
                {s.enterStudio}
              </span>
              <p className="text-2xl font-semibold tracking-tight">{title}</p>
              <p className="max-w-md text-sm leading-relaxed text-white/70">
                {subtitle}
              </p>
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="materia-button bg-white text-black focus-visible:outline-white"
              >
                {TX[lang].openDirect}
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            </div>
          ) : shouldLoad && liveUrl ? (
            <>
              {!iframeLoaded && (
                <div className="absolute inset-0 z-[101] flex flex-col items-center justify-center bg-black gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-white/5 border-t-brand rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border border-white/10 border-b-brand rounded-full animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.5em] text-white animate-pulse">
                      {s.initializing}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-widest text-white/20">
                      {s.mounting}
                    </span>
                  </div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={liveUrl}
                onLoad={() => setIframeLoaded(true)}
                title={iframeTitle}
                className={`w-full h-full border-none transition-all duration-1000 ${iframeLoaded ? "opacity-100" : "opacity-0"} ${isInteracting ? "scale-100" : "scale-[1.05]"}`}
                style={{
                  background: "#000",
                  opacity: iframeLoaded
                    ? canInteract && !isInteracting
                      ? 0.4
                      : 1
                    : 0,
                }}
              />
            </>
          ) : shouldLoad && videoUrl ? (
            <div className="w-full h-full bg-black relative">
              <video
                src={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className={`w-full h-full object-cover transition-all duration-1000 ${isInteracting ? "scale-100" : "scale-[1.05]"}`}
                style={{
                  opacity: canInteract && !isInteracting ? 0.4 : 1,
                }}
              />
              {/* HUD Overlay for Video */}
              {!isInteracting && (
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center gap-6 p-10 text-center">
              <div className="relative">
                {liveUrl || videoUrl ? (
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-white/5 border-t-brand rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border border-white/10 border-b-brand rounded-full animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
                    </div>
                  </div>
                ) : (
                  <Activity size={48} className="text-white/20 animate-pulse" />
                )}
                <div className="absolute inset-0 blur-2xl bg-white/5 animate-pulse" />
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="font-mono text-[10px] font-black uppercase tracking-[0.5em] text-white/60">
                  {projectId === "pke-web"
                    ? ui.previewUnavailable
                    : liveUrl || videoUrl
                      ? s.preparing
                      : projectId === "rides24ofiziala"
                        ? s.demoWorking
                        : s.comingSoon}
                </span>
                <div className="w-12 h-px bg-white/10" />
                <span className="font-mono text-[8px] uppercase tracking-widest text-white/20 max-w-xs leading-relaxed">
                  {liveUrl || videoUrl ? s.scrollDownInit : s.auditDesc}
                </span>
              </div>
            </div>
          )}

          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none opacity-0 mix-blend-overlay"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Studio HUD - Bottom Status Bar */}
        {isInteracting && (
          <footer className="w-full bg-[#121212] border-t border-white/10 px-6 py-3 flex items-center justify-between shrink-0 z-[10000]">
            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-[8px] text-white/60 uppercase tracking-widest">
              Auth: <span className="text-brand">Developer_Privileges</span>{" "}
              {" // "} Root_Access: <span className="text-green-400">True</span>
            </div>

            <div className="hidden sm:flex items-center gap-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-[8px] text-white/60 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span>Signal_Strength: 98%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span>Data_integrity: Verified</span>
              </div>
            </div>
          </footer>
        )}
      </>
    );
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CINEMATIC HERO (Pinned Multi-Phase) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div
        ref={heroRef}
        data-umbral-destination={projectId}
        className="relative h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center bg-transparent"
        style={{
          perspective: isInteracting || !motionEnabled ? "none" : "2000px",
        }}
      >
        {/* ── Background Layer ── */}
        <div
          ref={bgImageRef}
          className="absolute inset-0 will-change-transform z-0"
          style={{
            background: `linear-gradient(135deg, ${accent}15 0%, ${accent}08 100%)`,
            transformOrigin: "center center",
          }}
        >
          {projectId !== "pke-web" && (
            <div
              className="project-hero-art absolute -end-[2vw] top-[10vh] w-[min(65vw,900px)] opacity-[0.22]"
              aria-hidden="true"
            >
              <ProjectVisual id={projectId} priority />
            </div>
          )}
        </div>

        <div
          ref={overlayRef}
          className="absolute inset-0 opacity-0 z-[1] pointer-events-none"
        />

        {/* ── Phase 1 Content: Title focus ── */}
        <div
          ref={contentRef}
          className="relative z-20 flex flex-col items-center justify-center text-center px-6 w-full will-change-transform"
        >
          <div
            className="relative group mb-12"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              ref={titleRef}
              className="relative flex flex-col items-center justify-center will-change-transform pointer-events-none"
            >
              <span
                className="font-mono text-[clamp(0.9rem,1.5vw,1.2rem)] opacity-85 mb-3 tracking-[0.4em]"
                style={{ color: accent }}
              >
                PROJECT // {index.toString().padStart(2, "0")}
              </span>

              <h1
                className="font-black uppercase italic tracking-[-0.05em] leading-[0.85] text-center max-w-[1200px]"
                style={{
                  fontSize: "clamp(3.5rem, 15vw, 12rem)",
                  color: accent,
                  textShadow: `0 30px 100px ${accent}40`,
                }}
              >
                {title}
              </h1>
            </div>
          </div>

          <p
            className="text-xl md:text-2xl font-normal tracking-tight max-w-2xl mb-12 opacity-80"
            style={{ color: darkMode ? "#fff" : "#000" }}
          >
            {subtitle}
          </p>

          <div className="flex items-center gap-6 flex-wrap justify-center">
            {langs.slice(0, 3).map((lang) => (
              <div
                key={lang}
                className="font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-2 rounded-full border"
                style={{ borderColor: `${accent}40`, color: accent }}
              >
                {lang}
              </div>
            ))}
          </div>
        </div>

        {/* If motion is enabled, render the screen ref inside the hero for GSAP pinning / zoom */}
        {!disableStudio && !staticStudioLayout && (
          <div
            ref={screenRef}
            data-studio-screen="cinematic"
            className={
              isInteracting
                ? "absolute inset-0 z-[9999] w-full h-[100dvh] bg-[#0d0d0d] flex flex-col pointer-events-auto shadow-none"
                : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto transition-shadow duration-500 overflow-hidden bg-black flex items-center justify-center shadow-2xl border border-white/10 opacity-0"
            }
            style={
              isInteracting
                ? {
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100dvh",
                    maxWidth: "100vw",
                    maxHeight: "100dvh",
                    transform: "none",
                    borderRadius: 0,
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#0d0d0d",
                  }
                : {
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                    width: "min(94vw, 1400px)",
                    height: "82dvh",
                    borderRadius: "2.5rem",
                    borderColor: "rgba(255,255,255,0.1)",
                  }
            }
          >
            {renderScreenContents()}
          </div>
        )}

        {/* Dynamic Scroll HUD Indicator */}
        {!disableStudio && motionEnabled && (
          <div
            ref={scrollProgressRef}
            className="absolute left-1/2 -translate-x-1/2 z-[40] flex flex-col items-center pointer-events-none transition-all duration-500 w-[250px] max-w-[88vw] px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)_inset]"
            style={{
              opacity: 1,
              bottom: "calc(env(safe-area-inset-bottom, 1rem) + 1.25rem)",
            }}
          >
            {/* Layout 1: Default hint before scroll */}
            <div
              ref={scrollHintDefaultRef}
              className="flex flex-col items-center gap-2.5"
            >
              {/* Elegant scroll wheel animation pill */}
              <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5 relative overflow-hidden bg-white/[0.02]">
                <div className="w-1 h-1.5 rounded-full bg-white/70 animate-scroll-dot" />
              </div>
              <p className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/50 text-center leading-relaxed">
                {s.deepScroll}
              </p>
            </div>

            {/* Layout 2: Progress telemetry during scroll */}
            <div
              ref={scrollHintProgressRef}
              className="hidden flex-col items-center gap-2.5 w-full"
            >
              <div
                className="flex items-center justify-between w-full font-mono text-[8px] uppercase tracking-[0.3em] text-white/60 font-black"
                role="status"
                aria-live="polite"
              >
                <span>{s.initializing}</span>
                <span ref={scrollTextRef} className="text-white">
                  0%
                </span>
              </div>
              <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                <div
                  ref={scrollBarRef}
                  className="h-full transition-all duration-100 ease-linear rounded-full"
                  style={{
                    width: "0%",
                    backgroundColor: accent,
                    boxShadow: `0 0 6px ${accent}`,
                  }}
                />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white font-bold mt-2 flex items-center gap-2 whitespace-nowrap">
                <span
                  className="truncate"
                  style={{ textShadow: `0 6px 30px ${accent}40` }}
                >
                  {s.keepScrolling}
                </span>
                <span
                  ref={chevronRef}
                  className="inline-block animate-bounce font-sans text-xs"
                  aria-hidden
                >
                  ↓
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* If motion is disabled, render the screen ref as a separate, scrollable section beneath the hero */}
      {!disableStudio && staticStudioLayout && (
        <div className="relative py-20 bg-[#0a0a0a] flex flex-col items-center justify-center border-t border-white/10 w-full min-h-[85dvh]">
          <div
            ref={screenRef}
            data-studio-screen="static"
            className={
              isInteracting
                ? "fixed inset-0 z-[9999] w-full h-[100dvh] bg-[#0d0d0d] flex flex-col pointer-events-auto shadow-none"
                : "relative z-30 pointer-events-auto overflow-hidden bg-black flex items-center justify-center shadow-2xl border border-white/10 mx-auto w-[min(94vw,1400px)] h-[65dvh] md:h-[72dvh] rounded-[2.5rem]"
            }
            style={
              isInteracting
                ? {
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100dvh",
                    maxWidth: "100vw",
                    maxHeight: "100dvh",
                    transform: "none",
                    borderRadius: 0,
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#0d0d0d",
                  }
                : {
                    transformStyle: "preserve-3d",
                    willChange: "auto",
                    borderColor: "rgba(255,255,255,0.1)",
                    opacity: 1,
                    transform: "none",
                    width: "min(94vw, 1400px)",
                    maxWidth: "1400px",
                  }
            }
          >
            {renderScreenContents()}
          </div>
        </div>
      )}
    </>
  );
}
