"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { sandCrack } from "../../lib/tectonic";
import {
  createSandRenderer,
  type SandMessage,
  type SandRenderer,
  type SandTheme,
} from "../../lib/sand-renderer";

/**
 * SandField — mounts the sand bed behind the hero. Rendering lives in a Web
 * Worker on an OffscreenCanvas when the browser allows it; this component only
 * forwards size, theme, impacts and the cinematic split as small messages.
 * Without OffscreenCanvas WebGL the same renderer runs on the main thread.
 */

const AMBIENT_MS = 14_000;
const IDLE_BEFORE_AMBIENT_MS = 5_000;

function readHex(name: string, fallback: [number, number, number]) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const match = /^#([0-9a-f]{6})$/i.exec(value);
  if (!match) return fallback;
  const n = parseInt(match[1], 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] as [number, number, number];
}

function readTheme(): SandTheme {
  const dark = document.documentElement.classList.contains("dark");
  return {
    base: readHex("--page", dark ? [0.04, 0.05, 0.06] : [0.95, 0.94, 0.91]),
    accent: readHex("--brand", [0.12, 0.29, 1]),
    tone: dark ? [0.85, 0.9, 1] : [0.82, 0.9, 1.08],
    strength: dark ? 0.08 : 0.1,
    grain: dark ? 0.045 : 0.075,
    spark: dark ? 0.22 : 0.08,
  };
}

interface SandLink {
  send(message: SandMessage): void;
  close(): void;
}

function localLink(renderer: SandRenderer): SandLink {
  return {
    send(message) {
      switch (message.type) {
        case "resize":
          return renderer.resize(message.width, message.height);
        case "theme":
          return renderer.theme(message.theme);
        case "impact":
          return renderer.impact(message.x, message.y, message.amplitude);
        case "crack":
          return renderer.crack(message.crack);
        case "state":
          return renderer.state(message.enabled, message.visible);
      }
    },
    close: () => renderer.dispose(),
  };
}

/** One interface over the worker and the in-thread renderer. */
function connect(
  canvas: HTMLCanvasElement,
  allowWorker: boolean,
  onUnsupported: () => void,
): SandLink | null {
  if (allowWorker && typeof Worker !== "undefined" && "transferControlToOffscreen" in canvas) {
    try {
      const worker = new Worker(new URL("../../workers/sand.worker.ts", import.meta.url), {
        type: "module",
        name: "sand",
      });
      const offscreen = canvas.transferControlToOffscreen();
      worker.onmessage = (event: MessageEvent<{ type: string }>) => {
        if (event.data.type === "unsupported") onUnsupported();
      };
      worker.onerror = () => onUnsupported();
      worker.postMessage({ type: "init", canvas: offscreen } satisfies SandMessage, [offscreen]);
      return {
        send: (message) => worker.postMessage(message),
        close: () => {
          worker.postMessage({ type: "dispose" } satisfies SandMessage);
          // Let the worker release its GL objects, then make sure it is gone.
          setTimeout(() => worker.terminate(), 1000);
        },
      };
    } catch {
      return null;
    }
  }
  const renderer = createSandRenderer(canvas);
  return renderer ? localLink(renderer) : null;
}

// A canvas can be handed to a worker only once, so its link outlives a
// StrictMode remount and is only closed when the element really goes away.
const links = new WeakMap<HTMLCanvasElement, { link: SandLink | null; closing?: ReturnType<typeof setTimeout> }>();

interface SandFieldProps {
  stageRef: RefObject<HTMLElement | null>;
  /** When false the sand renders one still frame and ignores impacts. */
  enabled: boolean;
}

export function SandField({ stageRef, enabled }: SandFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linkRef = useRef<SandLink | null>(null);
  const enabledRef = useRef(enabled);
  const visibleRef = useRef(true);
  const lastUserAction = useRef(0);
  // A canvas handed to a worker can never be drawn on here again: the fallback
  // gets a fresh element.
  const [inThread, setInThread] = useState(false);

  const sendState = () =>
    linkRef.current?.send({
      type: "state",
      enabled: enabledRef.current,
      visible: visibleRef.current && !document.hidden,
    });

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    let entry = links.get(canvas);
    if (entry) clearTimeout(entry.closing);
    else {
      entry = { link: connect(canvas, !inThread, () => setInThread(true)) };
      links.set(canvas, entry);
    }
    const link = entry.link;
    linkRef.current = link;
    if (!link) return;

    const impactAtClient = (clientX: number, clientY: number, amplitude: number) => {
      if (!enabledRef.current) return;
      const rect = stage.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      lastUserAction.current = Date.now();
      link.send({ type: "impact", x, y, amplitude });
    };
    const resize = () =>
      link.send({ type: "resize", width: stage.clientWidth, height: stage.clientHeight });
    // Only the numbers: GSAP keeps its own bookkeeping on the tweened object,
    // and functions cannot cross to the worker.
    const sendCrack = () => {
      const { x, y, length, open, pour } = sandCrack;
      link.send({ type: "crack", crack: { x, y, length, open, pour } });
    };

    const onPointerDown = (e: PointerEvent) => {
      // Links and buttons dispatch their own tectonic impact.
      if ((e.target as HTMLElement | null)?.closest("a, button")) return;
      impactAtClient(e.clientX, e.clientY, 1.3);
    };
    const onTectonic = (e: Event) => {
      const { x, y, intensity = 1 } =
        (e as CustomEvent<{ x?: number; y?: number; intensity?: number }>).detail ?? {};
      impactAtClient(x ?? innerWidth / 2, y ?? innerHeight / 2, intensity);
    };

    link.send({ type: "theme", theme: readTheme() });
    resize();
    sendCrack();
    sendState();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    const themeObserver = new MutationObserver(() =>
      link.send({ type: "theme", theme: readTheme() }),
    );
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const visibilityObserver = new IntersectionObserver(([e]) => {
      visibleRef.current = e.isIntersecting;
      sendState();
    });
    visibilityObserver.observe(stage);
    stage.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("tectonic-impact", onTectonic);
    window.addEventListener("sand-wake", sendCrack);
    document.addEventListener("visibilitychange", sendState);

    const owned = entry;
    return () => {
      resizeObserver.disconnect();
      themeObserver.disconnect();
      visibilityObserver.disconnect();
      stage.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("tectonic-impact", onTectonic);
      window.removeEventListener("sand-wake", sendCrack);
      document.removeEventListener("visibilitychange", sendState);
      linkRef.current = null;
      owned.closing = setTimeout(() => {
        owned.link?.close();
        links.delete(canvas);
      });
    };
  }, [stageRef, inThread]);

  // Pausing motion only changes what the renderer does, never the renderer.
  useEffect(() => {
    enabledRef.current = enabled;
    sendState();
    if (!enabled) return;
    const ambient = setInterval(() => {
      const stage = stageRef.current;
      if (!stage || !visibleRef.current || document.hidden) return;
      if (Date.now() - lastUserAction.current < IDLE_BEFORE_AMBIENT_MS) return;
      linkRef.current?.send({
        type: "impact",
        x: stage.clientWidth * (0.3 + Math.random() * 0.4),
        y: stage.clientHeight * (0.35 + Math.random() * 0.3),
        amplitude: 0.3,
      });
    }, AMBIENT_MS);
    return () => clearInterval(ambient);
  }, [enabled, stageRef]);

  return (
    <canvas
      key={inThread ? "thread" : "worker"}
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
