"use client";

/**
 * ScrollRevealText — Awwwards line-mask text reveal
 * ──────────────────────────────────────────────────
 * Wraps each line of text in an overflow:hidden container with an
 * inner element that slides up into view when scrolled into viewport.
 * This is the signature reveal seen on SOTD-level portfolios.
 *
 * Usage:
 *   <ScrollRevealText tag="h2" className="text-5xl font-black">
 *     Building digital<br/>experiences
 *   </ScrollRevealText>
 *
 * Each <br/> creates a new reveal line with a staggered delay.
 */

import { useEffect, useRef } from "react";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";

interface ScrollRevealTextProps {
  children: React.ReactNode;
  tag?: React.ElementType;
  className?: string;
  stagger?: number; // ms per line
  delay?: number;   // initial delay in ms
  threshold?: number; // 0-1
}

export function ScrollRevealText({
  children,
  tag: Tag = "div",
  className = "",
  stagger = 80,
  delay = 0,
  threshold = 0.15,
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const motionEnabled = useMotionEnabled();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Find all reveal-line elements and give them staggered delays
    const lines = el.querySelectorAll<HTMLElement>(".reveal-line-inner");
    lines.forEach((line, i) => {
      line.style.setProperty("--delay", `${delay + i * stagger}ms`);
    });

    if (!motionEnabled) {
      // If motion is disabled, just show everything immediately
      el.querySelectorAll<HTMLElement>(".reveal-line").forEach((line) => {
        line.classList.add("in");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const revealLines = el.querySelectorAll<HTMLElement>(".reveal-line");
            revealLines.forEach((line) => line.classList.add("in"));
            observer.disconnect();
          }
        });
      },
      { threshold },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [motionEnabled, delay, stagger, threshold]);

  // Parse children to split at <br/> boundaries
  const lines = parseChildrenToLines(children);

  return (
    // @ts-ignore — dynamic tag
    <Tag ref={containerRef as any} className={className}>
      {lines.map((line: React.ReactNode, i: number) => (
        <span key={i} className="reveal-line block">
          <span className="reveal-line-inner">{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * Splits React children on <br/> elements into an array of line groups.
 * Non-break children are grouped until a <br/> is encountered.
 */
function parseChildrenToLines(children: React.ReactNode): React.ReactNode[] {
  const React = require("react");
  const childArray = React.Children.toArray(children);
  const lines: React.ReactNode[][] = [[]];

  childArray.forEach((child: React.ReactNode) => {
    if (React.isValidElement(child) && (child as any).type === "br") {
      lines.push([]);
    } else {
      lines[lines.length - 1].push(child);
    }
  });

  return lines.map((line) => (line.length === 1 ? line[0] : line));
}
