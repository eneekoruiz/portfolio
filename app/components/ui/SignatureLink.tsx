"use client";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSpringHover } from "../../hooks/useSpringHover";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { triggerPortal } from "./PortalTransition";
import type { MouseEvent } from "react";

/** Native links retain their own visual language without delaying navigation. */
export function SignatureLink({
  label,
  kind,
  onClick,
}: {
  label: string;
  kind: "work" | "cv";
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const enabled = useMotionEnabled();
  const ref = useSpringHover<HTMLAnchorElement>(enabled);
  const router = useRouter();
  return (
    <a
      ref={ref}
      href={kind === "work" ? "#work" : "/curriculum"}
      data-signature-link={kind}
      onPointerEnter={() => {
        if (kind === "cv") router.prefetch("/curriculum");
      }}
      onClick={(event) => {
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        )
          return;
        if (onClick) return onClick(event);
        if (kind === "cv") {
          event.preventDefault();
          const box = event.currentTarget.getBoundingClientRect();
          if (enabled)
            triggerPortal("/curriculum", {
              x: event.detail ? event.clientX : box.x + box.width / 2,
              y: event.detail ? event.clientY : box.y + box.height / 2,
            });
          else router.push("/curriculum");
        }
      }}
      className={`signature-link materia-button relative isolate overflow-hidden ${kind === "work" ? "bg-ink text-page" : "border border-ink/20 bg-page/80 text-ink"}`}
    >
      <span aria-hidden="true" className="signature-stream">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            style={{ left: `${8 + i * 9}%`, animationDelay: `${i * -0.11}s` }}
          >
            {kind === "cv" ? (i % 2 ? "01" : "10") : "↓"}
          </span>
        ))}
      </span>
      <span className="relative z-10">{label}</span>
      {kind === "work" ? (
        <ArrowDown size={16} aria-hidden="true" />
      ) : (
        <ArrowUpRight size={16} aria-hidden="true" />
      )}
    </a>
  );
}
