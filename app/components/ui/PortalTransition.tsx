"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

export function PortalTransition() {
  const [active, setActive] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  const startPortal = useCallback((url: string) => {
    setPendingUrl(url);
    setActive(true);

    // Lock scroll
    document.body.style.overflow = "hidden";
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (active && pendingUrl) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (pendingUrl.startsWith("/") && !pendingUrl.startsWith("//")) {
            router.push(pendingUrl);
          } else {
            window.location.href = pendingUrl;
          }
        },
      });

      tl.to("#portal-ring", {
        scale: 25,
        opacity: 1,
        duration: 0.8,
        ease: "power4.in",
      }).to(
        "#portal-overlay",
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.in",
        },
        "-=0.3",
      );
    }
  }, [active, pendingUrl, router]);

  useEffect(() => {
    const handlePortal = (e: Event) => {
      if (!(e instanceof CustomEvent)) return;

      const url = e.detail?.url;
      if (typeof url === "string" && url.length > 0) {
        startPortal(url);
      }
    };

    window.addEventListener("trigger-portal", handlePortal);
    return () => window.removeEventListener("trigger-portal", handlePortal);
  }, [startPortal]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Black background fade */}
      <div id="portal-overlay" className="absolute inset-0 bg-page opacity-0" />

      {/* The Zooming Ring */}
      <div
        id="portal-ring"
        className="w-[100px] h-[100px] rounded-full border-[2px] border-brand/40 opacity-0 shadow-[0_0_100px_rgba(var(--brand-rgb),0.5)]"
        style={{
          boxShadow:
            "inset 0 0 50px rgba(var(--brand-rgb),0.3), 0 0 100px rgba(var(--brand-rgb),0.5)",
        }}
      />

      {/* Internal Glitch Elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-1 h-full bg-brand/5 animate-pulse"
          style={{ transform: "rotate(45deg)" }}
        />
        <div
          className="w-1 h-full bg-brand/5 animate-pulse"
          style={{ transform: "rotate(-45deg)" }}
        />
      </div>
    </div>
  );
}

/**
 * Utility to trigger the portal from anywhere
 */
export const triggerPortal = (url: string) => {
  const event = new CustomEvent("trigger-portal", { detail: { url } });
  window.dispatchEvent(event);
};
