"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

type PortalOrigin = { x: number; y: number };

const getCenterOrigin = (): PortalOrigin => ({
  x: typeof window === "undefined" ? 0 : window.innerWidth / 2,
  y: typeof window === "undefined" ? 0 : window.innerHeight / 2,
});

export function PortalTransition() {
  const [active, setActive] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [origin, setOrigin] = useState<PortalOrigin>(() => getCenterOrigin());
  const overlayRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const startPortal = useCallback(
    (url: string, nextOrigin?: PortalOrigin) => {
      if (active) return;
      setPendingUrl(url);
      setOrigin(nextOrigin ?? getCenterOrigin());
      setActive(true);
      window.__lenis?.stop?.();
      document.body.style.overflow = "hidden";
    },
    [active],
  );

  useEffect(() => {
    if (!active || !pendingUrl) return;

    const motionEnabled =
      localStorage.getItem("portfolio-motion-enabled") !== "false";
    const duration = motionEnabled ? 0.95 : 0.24;
    const navigate = () => {
      if (pendingUrl.startsWith("/") && !pendingUrl.startsWith("//")) {
        router.push(pendingUrl);
      } else {
        window.location.href = pendingUrl;
      }
    };

    const tl = gsap.timeline({ onComplete: navigate });
    gsap.set(
      [overlayRef.current, lensRef.current, ringRef.current, scanRef.current],
      {
        transformOrigin: `${origin.x}px ${origin.y}px`,
      },
    );

    tl.set(overlayRef.current, { opacity: 0 })
      .set(lensRef.current, {
        x: origin.x,
        y: origin.y,
        xPercent: -50,
        yPercent: -50,
        scale: 0.04,
        opacity: motionEnabled ? 0.9 : 0,
        rotate: 0,
      })
      .set(ringRef.current, {
        x: origin.x,
        y: origin.y,
        xPercent: -50,
        yPercent: -50,
        scale: 0.25,
        opacity: motionEnabled ? 1 : 0,
        rotate: 0,
      })
      .set(scanRef.current, { opacity: 0, yPercent: -25 })
      .to(
        overlayRef.current,
        {
          opacity: 1,
          duration: duration * 0.72,
          ease: motionEnabled ? "power3.inOut" : "power1.out",
        },
        0,
      )
      .to(
        lensRef.current,
        {
          scale: motionEnabled ? 38 : 1,
          opacity: 1,
          rotate: motionEnabled ? 18 : 0,
          duration,
          ease: motionEnabled ? "expo.inOut" : "power1.out",
          force3D: true,
        },
        0,
      )
      .to(
        ringRef.current,
        {
          scale: motionEnabled ? 26 : 1,
          opacity: motionEnabled ? 0.65 : 0,
          rotate: motionEnabled ? -42 : 0,
          duration: duration * 0.86,
          ease: motionEnabled ? "power4.in" : "power1.out",
          force3D: true,
        },
        0.04,
      )
      .to(
        scanRef.current,
        {
          opacity: motionEnabled ? 0.42 : 0,
          yPercent: 18,
          duration: duration * 0.78,
          ease: "power2.inOut",
        },
        0.08,
      );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
      window.__lenis?.start?.();
    };
  }, [active, origin.x, origin.y, pendingUrl, router]);

  useEffect(() => {
    if (!active) return;
    const cancel = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(false);
        setPendingUrl(null);
      }
    };
    window.addEventListener("keydown", cancel);
    return () => window.removeEventListener("keydown", cancel);
  }, [active]);

  useEffect(() => {
    const handlePortal = (e: Event) => {
      if (!(e instanceof CustomEvent)) return;

      const url = e.detail?.url;
      const x = e.detail?.x;
      const y = e.detail?.y;
      if (typeof url === "string" && url.length > 0) {
        startPortal(
          url,
          typeof x === "number" && typeof y === "number" ? { x, y } : undefined,
        );
      }
    };

    window.addEventListener("trigger-portal", handlePortal);
    return () => window.removeEventListener("trigger-portal", handlePortal);
  }, [startPortal]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
      <div
        ref={overlayRef}
        className="portal-eclipse-overlay absolute inset-0 bg-page opacity-0"
      />
      <div ref={scanRef} className="portal-scan-field absolute inset-0" />
      <div
        ref={lensRef}
        className="portal-eclipse-lens absolute left-0 top-0 h-24 w-24 rounded-full"
      />
      <div
        ref={ringRef}
        className="portal-eclipse-ring absolute left-0 top-0 h-28 w-28 rounded-full"
      />
    </div>
  );
}

/**
 * Utility to trigger the portal from anywhere.
 */
export const triggerPortal = (url: string, origin?: PortalOrigin) => {
  const event = new CustomEvent("trigger-portal", {
    detail: { url, ...origin },
  });
  window.dispatchEvent(event);
};
