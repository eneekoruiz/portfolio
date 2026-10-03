"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";

const NODES = [
  { id: "react", label: "React / Next.js", top: "15%", left: "10%", delay: 0 },
  { id: "gsap", label: "GSAP / Motion", top: "35%", left: "75%", delay: 1 },
  { id: "brand", label: "Brand Identity", top: "70%", left: "20%", delay: 0.5 },
  { id: "perf", label: "Webgl / Webgpu", top: "65%", left: "65%", delay: 1.5 },
];

export function FloatingNodes() {
  const motionEnabled = useMotionEnabled();
  const containerRef = useRef<HTMLDivElement>(null);

  if (!motionEnabled) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden md:block">
      {NODES.map((node) => (
        <motion.div
          key={node.id}
          drag
          dragConstraints={containerRef}
          whileHover={{ scale: 1.05, zIndex: 10 }}
          whileDrag={{ scale: 1.1, cursor: "grabbing" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: [0, -20, 0],
            x: [0, 15, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: node.delay },
            y: { duration: 6 + node.delay, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 7 + node.delay, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute pointer-events-auto cursor-grab rounded-full border border-ink/20 bg-page/40 backdrop-blur-md px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ink shadow-[0_4px_24px_-4px_rgba(0,0,0,0.1)]"
          style={{ top: node.top, left: node.left }}
        >
          {node.label}
        </motion.div>
      ))}
    </div>
  );
}
