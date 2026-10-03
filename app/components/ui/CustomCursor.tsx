"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";

export function CustomCursor() {
  const enabled = useMotionEnabled();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.2 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (!enabled || !window.matchMedia("(pointer: fine)").matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - (isHovering ? 24 : 8));
      cursorY.set(e.clientY - (isHovering ? 24 : 8));
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.hasAttribute("data-cursor-plus")
      ) {
        setIsHovering(true);
        // adjust offset immediately so it expands from center
        cursorX.set(e.clientX - 24);
        cursorY.set(e.clientY - 24);
      } else {
        setIsHovering(false);
        cursorX.set(e.clientX - 8);
        cursorY.set(e.clientY - 8);
      }
    };

    const handleMouseOut = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [enabled, isVisible, isHovering, cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference hidden md:block"
      style={{
        x: smoothX,
        y: smoothY,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <motion.div
        animate={{
          width: isHovering ? 48 : 16,
          height: isHovering ? 48 : 16,
          backgroundColor: isHovering ? "transparent" : "#ffffff",
          border: isHovering ? "2px solid #ffffff" : "0px solid transparent",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
      />
    </motion.div>
  );
}
