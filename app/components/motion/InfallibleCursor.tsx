"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, ArrowUpRight, Minus } from "lucide-react";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";

type CursorMode = "default" | "plus" | "arrow" | "text" | "minus";

export function InfallibleCursor() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const motionEnabled = useMotionEnabled();

  // Movement states
  const mx = useRef(-100);
  const my = useRef(-100);
  const cx = useRef(-100);
  const cy = useRef(-100);

  // Animation states
  const scale = useRef(1);
  const targetScale = useRef(1);
  const opacity = useRef(0);

  const isHover = useRef(false);
  const shakeTO = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !motionEnabled) return;
    if (!window.matchMedia("(pointer:fine)").matches) return;

    const el = cursorRef.current;
    if (!el) return;

    let disposed = false;

    setTimeout(() => {
      opacity.current = 1;
    }, 100);

    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX;
      my.current = e.clientY;

      const speed = Math.abs(e.movementX) + Math.abs(e.movementY);
      if (speed > 90 && !isHover.current) {
        targetScale.current = 1.6;
        el.classList.add("cursor-shake-pulse");
        clearTimeout(shakeTO.current);
        shakeTO.current = setTimeout(() => {
          targetScale.current = 1;
          el.classList.remove("cursor-shake-pulse");
        }, 500);
      }
    };

    const onMessage = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === "portfolio-cursor-move") {
        const iframes = document.querySelectorAll("iframe");
        let targetIframe: HTMLIFrameElement | null = null;
        for (let i = 0; i < iframes.length; i++) {
          if (iframes[i].contentWindow === e.source) {
            targetIframe = iframes[i] as HTMLIFrameElement;
            break;
          }
        }
        if (targetIframe) {
          const rect = targetIframe.getBoundingClientRect();
          mx.current = rect.left + e.data.x;
          my.current = rect.top + e.data.y;
        }
      } else if (e.data.type === "portfolio-cursor-hover") {
        isHover.current = true;
        targetScale.current = 4;
        setMode(e.data.mode || "default");
      } else if (e.data.type === "portfolio-cursor-leave") {
        isHover.current = false;
        targetScale.current = 1;
        setMode("default");
      }
    };

    const onEnter = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        "a,button,[data-h],input,select,[data-cursor-plus],[data-cursor-minus]",
      ) as HTMLElement;
      if (!target) return;

      isHover.current = true;
      targetScale.current = 4;

      if (target.hasAttribute("data-cursor-plus")) setMode("plus");
      else if (target.hasAttribute("data-cursor-minus")) setMode("minus");
      else if (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
        setMode("text");
      else if (
        target.tagName === "A" &&
        target.getAttribute("target") === "_blank"
      )
        setMode("arrow");
      else setMode("default");
    };

    const onLeave = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        "a,button,[data-h],input,select,[data-cursor-plus],[data-cursor-minus]",
      ) as HTMLElement;
      if (!target) return;
      isHover.current = false;
      if (!el.classList.contains("cursor-shake-pulse")) targetScale.current = 1;
      setMode("default");
    };

    const animate = () => {
      if (disposed) return;

      if (document.visibilityState !== "visible") {
        rafRef.current = 0;
        return;
      }

      let targetX = mx.current;
      let targetY = my.current;
      let skewXVal = 0;
      let skewYVal = 0;

      // Find hovered interactive elements for magnetic snapping
      const hoveredEl = document.querySelector("a:hover, button:hover, [data-h]:hover, input:hover, select:hover, [data-cursor-plus]:hover, [data-cursor-minus]:hover");
      if (hoveredEl && window.matchMedia("(pointer:fine)").matches) {
        const rect = hoveredEl.getBoundingClientRect();
        const bx = rect.left + rect.width / 2;
        const by = rect.top + rect.height / 2;

        // Snapping factor: interpolate closer to the center of the button, while still following mouse offset slightly
        targetX = bx + (mx.current - bx) * 0.35;
        targetY = by + (my.current - by) * 0.35;

        // Apply elastic skew based on physical tension (distance between mouse pointer and target center)
        const distX = mx.current - bx;
        const distY = my.current - by;
        skewXVal = Math.max(-15, Math.min(15, distX * 0.08));
        skewYVal = Math.max(-15, Math.min(15, distY * 0.08));

        cx.current += (targetX - cx.current) * 0.22;
        cy.current += (targetY - cy.current) * 0.22;
      } else {
        cx.current += (mx.current - cx.current) * 0.15;
        cy.current += (my.current - cy.current) * 0.15;
      }

      scale.current += (targetScale.current - scale.current) * 0.18;

      if (el) {
        let transformStr = `translate3d(${cx.current - 10}px, ${cy.current - 10}px, 0) scale(${scale.current})`;
        if (skewXVal !== 0 || skewYVal !== 0) {
          transformStr += ` skew(${skewXVal}deg, ${skewYVal}deg)`;
        }
        el.style.transform = transformStr;
        el.style.opacity = String(opacity.current);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    const handleVisibility = () => {
      if (!disposed && document.visibilityState === "visible" && !rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("message", onMessage);
    window.addEventListener("mouseenter", onEnter, true);
    window.addEventListener("mouseleave", onLeave, true);
    document.addEventListener("visibilitychange", handleVisibility);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("message", onMessage);
      window.removeEventListener("mouseenter", onEnter, true);
      window.removeEventListener("mouseleave", onLeave, true);
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(shakeTO.current);
    };
  }, [mounted, motionEnabled]);

  if (!mounted || !motionEnabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      data-noprint
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999999,
        pointerEvents: "none",
        width: "20px",
        height: "20px",
        borderRadius: "9999px",
        backgroundColor: "white",
        border: "1px solid rgba(128,128,128,0.2)",
        mixBlendMode: "difference",
        opacity: 0,
        willChange: "transform, scale",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.3s ease, background-color 0.4s ease",
      }}
    >
      <div
        className="transition-all duration-300 flex items-center justify-center"
        style={{
          transform: `scale(${isHover.current ? 0.3 : 0})`,
          color: "black",
        }}
      >
        {mode === "plus" && <Plus size={16} strokeWidth={4} />}
        {mode === "minus" && <Minus size={16} strokeWidth={4} />}
        {mode === "arrow" && <ArrowUpRight size={16} strokeWidth={4} />}
        {mode === "text" && <div className="w-[2px] h-4 bg-black" />}
      </div>
    </div>
  );
}
