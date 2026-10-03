"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import { useViewportMotion } from "../../hooks/useViewportMotion";

const NODES = [
  { id: "react", label: "React / Next.js", top: "15%", left: "10%", delay: 0 },
  { id: "gsap", label: "GSAP / Motion", top: "35%", left: "75%", delay: 1 },
  { id: "brand", label: "Brand Identity", top: "81%", left: "3%", delay: 0.5 },
  { id: "perf", label: "Webgl / Webgpu", top: "65%", left: "65%", delay: 1.5 },
];

export function FloatingNodes() {
  const { ref, active } = useViewportMotion<HTMLDivElement>(
    "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
  );
  const drag = useRef<{
    pointer: number;
    element: HTMLDivElement;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } | null>(null);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!active || event.button !== 0 || event.pointerType === "touch") return;
    const host = ref.current;
    if (!host) return;
    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();
    const container = host.getBoundingClientRect();
    const offsetX = Number(element.dataset.dragX ?? 0);
    const offsetY = Number(element.dataset.dragY ?? 0);
    drag.current = {
      pointer: event.pointerId,
      element,
      startX: event.clientX,
      startY: event.clientY,
      offsetX,
      offsetY,
      minX: offsetX + container.left - bounds.left,
      maxX: offsetX + container.right - bounds.right,
      minY: offsetY + container.top - bounds.top,
      maxY: offsetY + container.bottom - bounds.bottom,
    };
    element.setPointerCapture(event.pointerId);
    element.dataset.dragging = "true";
    event.preventDefault();
  };
  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!active || !current || current.pointer !== event.pointerId) return;
    const x = Math.max(
      current.minX,
      Math.min(current.maxX, current.offsetX + event.clientX - current.startX),
    );
    const y = Math.max(
      current.minY,
      Math.min(current.maxY, current.offsetY + event.clientY - current.startY),
    );
    current.element.dataset.dragX = String(x);
    current.element.dataset.dragY = String(y);
    current.element.style.transform = `translate3d(${x}px,${y}px,0)`;
  };
  const stopDrag = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.pointer !== event.pointerId) return;
    current.element.removeAttribute("data-dragging");
    drag.current = null;
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-floating-active={active}
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden lg:block"
    >
      {NODES.map((node) => (
        <div
          key={node.id}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onLostPointerCapture={stopDrag}
          className="floating-node absolute pointer-events-auto select-none"
          style={{ top: node.top, left: node.left }}
        >
          <div
            className="floating-node-visual rounded-full border border-ink/20 bg-page/40 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink shadow-[0_4px_24px_-4px_rgba(0,0,0,0.1)]"
            style={
              {
                "--float-duration": `${7 + node.delay}s`,
                "--float-delay": `${node.delay}s`,
              } as CSSProperties
            }
          >
            {node.label}
          </div>
        </div>
      ))}
    </div>
  );
}
