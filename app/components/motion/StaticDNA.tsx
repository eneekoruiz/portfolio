"use client";

import { useEffect, useRef } from "react";

// The projected silhouette stays recognizable without WebGL. Its optional
// fallback motion updates SVG attributes directly and is paced below 20Hz.
const pairs = Array.from({ length: 36 }, (_, i) => {
  const progress = i / 35;
  const y = 20 + progress * 780;
  const phase = progress * Math.PI * 6;
  return { y, phase };
});
// Cubic tangents keep the strands smooth at the same geometry/sample budget.
const pathSegment = (i: number, yaw: number, direction: number) => {
  const { y, phase } = pairs[i];
  const x = 150 + Math.sin(phase + yaw) * 82 * direction;
  if (!i) return `M${x.toFixed(2)},${y.toFixed(2)}`;
  const previous = pairs[i - 1];
  const third = (y - previous.y) / 3;
  const slope = (82 * Math.PI * 6 * direction) / 780;
  const previousX = 150 + Math.sin(previous.phase + yaw) * 82 * direction;
  const controlA = previousX + Math.cos(previous.phase + yaw) * slope * third;
  const controlB = x - Math.cos(phase + yaw) * slope * third;
  return `C${controlA.toFixed(2)},${(previous.y + third).toFixed(2)} ${controlB.toFixed(2)},${(y - third).toFixed(2)} ${x.toFixed(2)},${y.toFixed(2)}`;
};
const pathFor = (direction: number) =>
  pairs.map((_, i) => pathSegment(i, 0, direction)).join(" ");

export function StaticDNA({ animate = false }: { animate?: boolean }) {
  const strandARef = useRef<SVGPathElement>(null);
  const strandBRef = useRef<SVGPathElement>(null);
  const rungsRef = useRef<(SVGLineElement | null)[]>([]);
  const nodesARef = useRef<(SVGCircleElement | null)[]>([]);
  const nodesBRef = useRef<(SVGCircleElement | null)[]>([]);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (!animate) return;

    let active = false;
    let timer = 0;
    let frame = 0;
    let lastTime = 0;

    const update = (now: number) => {
      if (!active) return;
      elapsedRef.current += Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Rotate the helix phase itself so the projected strands keep their
      // width through a turn instead of flattening into a line.
      const yaw = elapsedRef.current * 0.24;
      const dA: string[] = [];
      const dB: string[] = [];
      for (let i = 0; i < pairs.length; i++) {
        const { phase } = pairs[i];
        const angle = phase + yaw;
        const front = Math.cos(angle);
        const xA = 150 + Math.sin(angle) * 82;
        const xB = 150 - Math.sin(angle) * 82;
        dA.push(pathSegment(i, yaw, 1));
        dB.push(pathSegment(i, yaw, -1));

        const rung = rungsRef.current[i];
        const nodeA = nodesARef.current[i];
        const nodeB = nodesBRef.current[i];
        if (rung) {
          rung.setAttribute("x1", xA.toFixed(2));
          rung.setAttribute("x2", xB.toFixed(2));
        }
        if (nodeA) {
          nodeA.setAttribute("cx", xA.toFixed(2));
          nodeA.setAttribute("r", String(2.6 + Math.max(0, front) * 0.8));
          nodeA.setAttribute(
            "fill-opacity",
            String(0.5 + Math.max(0, front) * 0.45),
          );
        }
        if (nodeB) {
          nodeB.setAttribute("cx", xB.toFixed(2));
          nodeB.setAttribute("r", String(2.6 + Math.max(0, -front) * 0.8));
          nodeB.setAttribute(
            "fill-opacity",
            String(0.5 + Math.max(0, -front) * 0.45),
          );
        }
      }
      strandARef.current?.setAttribute("d", dA.join(" "));
      strandBRef.current?.setAttribute("d", dB.join(" "));
      timer = window.setTimeout(() => {
        frame = window.requestAnimationFrame(update);
      }, 50);
    };

    const stop = () => {
      active = false;
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
    };
    const start = () => {
      if (active || document.visibilityState !== "visible") return;
      active = true;
      lastTime = performance.now();
      timer = window.setTimeout(() => {
        frame = window.requestAnimationFrame(update);
      }, 50);
    };
    const syncVisibility = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    document.addEventListener("visibilitychange", syncVisibility);
    start();
    return () => {
      stop();
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, [animate]);

  return (
    <svg
      data-dna-static
      data-dna-animated={animate}
      aria-hidden="true"
      viewBox="0 0 300 820"
      className="dna-static absolute right-[8%] top-1/2 h-[110%] w-[min(65vw,480px)] -translate-y-1/2 -rotate-12"
      fill="none"
    >
      {pairs.map(({ y, phase }, i) => {
        const x = Math.sin(phase) * 82;
        return (
          <g key={i}>
            <line
              ref={(node) => {
                rungsRef.current[i] = node;
              }}
              x1={150 + x}
              x2={150 - x}
              y1={y}
              y2={y}
              stroke="var(--lead)"
              strokeOpacity="0.35"
            />
            <circle
              ref={(node) => {
                nodesARef.current[i] = node;
              }}
              cx={150 + x}
              cy={y}
              r="3"
              fill="var(--brand)"
            />
            <circle
              ref={(node) => {
                nodesBRef.current[i] = node;
              }}
              cx={150 - x}
              cy={y}
              r="3"
              fill="var(--lead)"
            />
          </g>
        );
      })}
      <path
        ref={strandARef}
        d={pathFor(1)}
        stroke="var(--brand)"
        strokeWidth="2"
      />
      <path
        ref={strandBRef}
        d={pathFor(-1)}
        stroke="var(--lead)"
        strokeWidth="2"
      />
    </svg>
  );
}
