"use client";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { KineticText } from "../motion/KineticText";

/**
 * A chapter title in fluid type: the letters rise in when the chapter arrives
 * and the word stretches and leans with the speed of the scroll.
 */
export function ChapterTitle({ id, title }: { id: string; title: string }) {
  const motion = useMotionEnabled();
  return (
    <h2 id={id} className="chapter-title">
      <KineticText text={title} enabled={motion} wrap />
    </h2>
  );
}
