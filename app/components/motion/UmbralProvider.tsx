"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { materia, type OpticalSurface } from "../../lib/materia";
import { SpringValue } from "../../lib/spring";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { usePreferredMotion } from "../../hooks/usePreferredMotion";

gsap.registerPlugin(Flip);

interface Request {
  source: HTMLElement;
  id: string;
  color: string;
  url: string;
}
type Navigate = (request: Request) => void;
const Context = createContext<Navigate | null>(null);
export const umbral = { active: false };

export function useUmbral() {
  const navigate = useContext(Context);
  if (!navigate) throw new Error("useUmbral requires UmbralProvider");
  return navigate;
}

interface Journey {
  url: string;
  id: string;
  arrived: boolean;
  expanded: boolean;
  complete: () => void;
  dispose: () => void;
}

export function UmbralProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const shellRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<Journey | null>(null);
  const enabled = useMotionEnabled();
  const reduced = usePreferredMotion();

  const navigate = useCallback<Navigate>(
    ({ source, id, color, url }) => {
      if (journeyRef.current) return;
      const shell = shellRef.current;
      if (
        !shell ||
        !enabled ||
        reduced ||
        matchMedia("(pointer: coarse)").matches
      ) {
        router.push(url, { scroll: false });
        return;
      }
      const rect = source.getBoundingClientRect();
      const clone = source.cloneNode(true) as HTMLElement;
      clone.removeAttribute("id");
      clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      clone.setAttribute("data-umbral-clone", "");
      clone.style.height = "100%";
      const heading = clone.querySelector<HTMLElement>("[data-project-title]");
      shell.replaceChildren(clone);
      shell.hidden = false;
      Object.assign(shell.style, {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        opacity: "1",
        borderRadius: "20px",
        background: "transparent",
      });
      const optical: OpticalSurface = {
        element: shell,
        color,
        radius: 20,
        visible: true,
        hover: new SpringValue(0.8),
        x: new SpringValue(0.5),
        y: new SpringValue(0.5),
        tangentX: new SpringValue(0),
        tangentY: new SpringValue(-1),
      };
      materia.surfaces.add(optical);
      materia.accent = color;
      materia.warp.target = 1;
      umbral.active = true;
      const oldOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      window.__lenis?.stop();
      document.documentElement.dataset.umbral = "active";
      const content = contentRef.current;
      if (content) {
        content.inert = true;
        gsap.to(content, { opacity: 0, duration: 0.18, overwrite: true });
      }
      let disposed = false;
      let handingOff = false;
      let transition: ViewTransition | undefined;
      let destination: HTMLElement | null = null;
      let destinationTitle: HTMLElement | null = null;
      let animation: gsap.core.Timeline | undefined;
      let timeout: ReturnType<typeof setTimeout>;
      let frame = 0;
      const dispose = () => {
        if (disposed) return;
        disposed = true;
        clearTimeout(timeout);
        cancelAnimationFrame(frame);
        animation?.kill();
        gsap.killTweensOf(shell);
        if (content) {
          gsap.killTweensOf(content);
          content.style.removeProperty("opacity");
          content.inert = false;
        }
        gsap.killTweensOf(clone.querySelectorAll("[data-project-body]"));
        if (transition) {
          try {
            transition.skipTransition();
          } catch {}
          transition = undefined;
        }
        shell.hidden = true;
        shell.replaceChildren();
        shell.removeAttribute("style");
        destination?.style.removeProperty("view-transition-name");
        destinationTitle?.style.removeProperty("view-transition-name");
        materia.surfaces.delete(optical);
        materia.warp.target = 0;
        umbral.active = false;
        journeyRef.current = null;
        delete document.documentElement.dataset.umbral;
        document.body.style.overflow = oldOverflow;
        window.__lenis?.start();
      };
      const finishFocus = () => {
        dispose();
        destinationTitle?.setAttribute("tabindex", "-1");
        destinationTitle?.focus({ preventScroll: true });
      };
      const complete = () => {
        const journey = journeyRef.current;
        if (disposed || handingOff || !journey?.arrived || !journey.expanded)
          return;
        destination = document.querySelector<HTMLElement>(
          `[data-umbral-destination="${CSS.escape(id)}"]`,
        );
        destinationTitle =
          destination?.querySelector<HTMLElement>("h1") ?? null;
        if (!destination) {
          dispose();
          return;
        }
        handingOff = true;
        // FLIP keeps the surface live while Next mounts. Native snapshots only own the final handoff.
        if (document.startViewTransition && !document.hidden) {
          shell.style.viewTransitionName = "project-surface";
          if (heading) heading.style.viewTransitionName = "project-title";
          try {
            const vt = document.startViewTransition(() => {
              shell.hidden = true;
              if (content) content.style.opacity = "1";
              if (destination)
                destination.style.viewTransitionName = "project-surface";
              if (destinationTitle)
                destinationTitle.style.viewTransitionName = "project-title";
            });
            transition = vt;
            vt.ready.catch(() => {});
            vt.updateCallbackDone.catch(() => {});
            vt.finished.then(finishFocus, finishFocus);
          } catch {
            finishFocus();
          }
        } else {
          if (content) content.style.opacity = "1";
          gsap.to(shell, {
            opacity: 0,
            duration: 0.2,
            ease: "expo.out",
            onComplete: finishFocus,
          });
        }
      };
      const journey: Journey = {
        url,
        id,
        arrived: false,
        expanded: false,
        complete,
        dispose,
      };
      journeyRef.current = journey;
      const state = Flip.getState(heading ? [shell, heading] : [shell]);
      Object.assign(shell.style, {
        top: "0px",
        left: "0px",
        width: "100vw",
        height: "100dvh",
        borderRadius: "0px",
      });
      if (heading)
        Object.assign(heading.style, {
          position: "absolute",
          left: "6vw",
          top: "38vh",
          width: "88vw",
          margin: "0",
          fontSize: "clamp(3.5rem, 10vw, 10rem)",
          lineHeight: "0.9",
          color,
        });
      animation = Flip.from(state, {
        duration: 0.72,
        ease: "expo.inOut",
        scale: true,
        nested: true,
        onComplete: () => {
          journey.expanded = true;
          complete();
        },
      });
      gsap.to(clone.querySelectorAll("[data-project-body]"), {
        opacity: 0,
        duration: 0.18,
        overwrite: true,
      });
      // Next navigates during the expansion, rather than waiting behind a loading screen.
      frame = requestAnimationFrame(() => router.push(url, { scroll: false }));
      timeout = setTimeout(dispose, 8000);
    },
    [enabled, reduced, router],
  );

  useEffect(() => {
    const journey = journeyRef.current;
    if (!journey) return;
    if (pathname === journey.url) {
      journey.arrived = true;
      const frame = requestAnimationFrame(journey.complete);
      return () => cancelAnimationFrame(frame);
    }
  }, [pathname]);

  useEffect(() => {
    const skip = () => journeyRef.current?.dispose();
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") skip();
    };
    window.addEventListener("popstate", skip);
    window.addEventListener("resize", skip);
    window.addEventListener("keydown", escape);
    return () => {
      skip();
      window.removeEventListener("popstate", skip);
      window.removeEventListener("resize", skip);
      window.removeEventListener("keydown", escape);
    };
  }, []);
  useEffect(() => {
    if (!enabled || reduced) journeyRef.current?.dispose();
  }, [enabled, reduced]);
  const value = useMemo(() => navigate, [navigate]);
  return (
    <Context.Provider value={value}>
      <div ref={contentRef}>{children}</div>
      <div
        ref={shellRef}
        className="umbral-surface fixed z-[99990] overflow-hidden pointer-events-auto"
        hidden
        inert
        aria-hidden="true"
      />
    </Context.Provider>
  );
}
