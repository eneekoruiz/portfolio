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
import {
  materia,
  setMateriaPalette,
  wakeMateria,
  type OpticalSurface,
} from "../../lib/materia";
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
      const visual = clone.querySelector<HTMLElement>("[data-project-visual]");
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
      setMateriaPalette(color, materia.secondary);
      materia.warp.target = 1;
      umbral.active = true;
      const oldOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      window.__lenis?.stop();
      document.documentElement.dataset.umbral = "active";
      const content = contentRef.current;
      if (content) {
        content.inert = true;
        // The page sinks back behind the card instead of blinking out.
        gsap.to(content, {
          opacity: 0,
          scale: 0.94,
          transformOrigin: `50% ${scrollY + innerHeight / 2}px`,
          duration: 0.55,
          ease: "power3.in",
          overwrite: true,
        });
      }
      // The project's colour floods out from the card as it opens.
      const wash = document.createElement("div");
      wash.className = "umbral-wash";
      wash.style.setProperty("--wash", color);
      shell.appendChild(wash);
      let disposed = false;
      let handingOff = false;
      let transition: ViewTransition | undefined;
      let destination: HTMLElement | null = null;
      let destinationTitle: HTMLElement | null = null;
      let destinationVisual: HTMLElement | null = null;
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
          content.style.removeProperty("transform");
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
        destinationVisual?.style.removeProperty("view-transition-name");
        materia.surfaces.delete(optical);
        materia.warp.target = 0;
        wakeMateria();
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
        destinationVisual =
          destination?.querySelector<HTMLElement>("[data-project-visual]") ??
          null;
        if (!destination) {
          dispose();
          return;
        }
        handingOff = true;
        // FLIP keeps the surface live while Next mounts. Native snapshots only own the final handoff.
        if (document.startViewTransition && !document.hidden) {
          shell.style.viewTransitionName = "project-surface";
          if (heading) heading.style.viewTransitionName = "project-title";
          if (visual && destinationVisual)
            visual.style.viewTransitionName = "project-image";
          try {
            const vt = document.startViewTransition(() => {
              shell.hidden = true;
              if (content) {
                gsap.killTweensOf(content);
                content.style.removeProperty("transform");
                content.style.opacity = "1";
              }
              if (destination)
                destination.style.viewTransitionName = "project-surface";
              if (destinationTitle)
                destinationTitle.style.viewTransitionName = "project-title";
              if (destinationVisual)
                destinationVisual.style.viewTransitionName = "project-image";
            });
            transition = vt;
            vt.ready.catch(() => {});
            vt.updateCallbackDone.catch(() => {});
            vt.finished.then(finishFocus, finishFocus);
          } catch {
            finishFocus();
          }
        } else {
          if (content) {
            gsap.killTweensOf(content);
            content.style.removeProperty("transform");
            content.style.opacity = "1";
          }
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
      const state = Flip.getState([
        shell,
        ...(heading ? [heading] : []),
        ...(visual ? [visual] : []),
      ]);
      Object.assign(shell.style, {
        top: "0px",
        left: "0px",
        width: "100vw",
        height: "100dvh",
        borderRadius: "0px",
      });
      if (visual) {
        clone.appendChild(visual);
        Object.assign(visual.style, {
          position: "absolute",
          insetInlineEnd: "-2vw",
          top: "10vh",
          width: "min(65vw, 900px)",
          height: "auto",
          opacity: "0.22",
          transform: "none",
          pointerEvents: "none",
        });
      }
      if (heading)
        Object.assign(heading.style, {
          position: "absolute",
          left: "50%",
          top: "40vh",
          transform: "translate(-50%, -50%)",
          width: "min(90vw, 1200px)",
          margin: "0",
          textAlign: "center",
          fontSize: "clamp(3rem, 11vw, 9rem)",
          fontWeight: "900",
          lineHeight: "0.9",
          letterSpacing: "-0.045em",
          color,
        });
      // Three beats: the card's small print leaves, the surface opens to the
      // screen while the colour floods out from where the card was, and the
      // title travels to the centre a breath behind it.
      const originX = ((rect.left + rect.width / 2) / innerWidth) * 100;
      const originY = ((rect.top + rect.height / 2) / innerHeight) * 100;
      animation = gsap
        .timeline({
          onComplete: () => {
            journey.expanded = true;
            complete();
          },
        })
        .to(
          clone.querySelectorAll(
            "[data-project-body], .work-card-pitch, .work-card-tech, .work-card-actions, .work-card-story",
          ),
          { opacity: 0, y: -14, duration: 0.28, ease: "power2.in", stagger: 0.04 },
          0,
        )
        .add(
          Flip.from(state, {
            duration: 0.95,
            ease: "expo.inOut",
            scale: true,
            nested: true,
          }),
          0.08,
        )
        .fromTo(
          wash,
          { clipPath: `circle(0% at ${originX}% ${originY}%)`, opacity: 1 },
          { clipPath: `circle(150% at ${originX}% ${originY}%)`, duration: 1, ease: "power3.inOut" },
          0.12,
        )
        .to(wash, { opacity: 0, duration: 0.35, ease: "power1.out" }, 0.85);
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
