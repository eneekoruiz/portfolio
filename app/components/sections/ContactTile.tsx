"use client";
import { useRef, type CSSProperties } from "react";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { useSpringTilt } from "../../hooks/useSpringTilt";
import { useMateriaSurface } from "../../hooks/useMateriaSurface";

export function ContactTile({
  label,
  value,
  action,
  color,
  icon: Icon,
  href,
  onClick,
  motion,
}: {
  label: string;
  value: string;
  action: string;
  color: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  motion: boolean;
}) {
  const host = useRef<HTMLDivElement>(null),
    visual = useRef<HTMLSpanElement>(null);
  useSpringTilt(host, visual, motion, true);
  useMateriaSurface(host, color, motion, 28);
  const contents = (
    <span
      ref={visual}
      className="contact-flip-visual relative block min-h-56"
      data-contact-flip
    >
      <span className="contact-flip-face relative flex min-h-56 flex-col items-start gap-4 rounded-[28px] border p-6">
        <Icon size={28} aria-hidden="true" style={{ color }} />
        <span className="text-xl font-bold text-ink">{label}</span>
        <span className="break-all font-mono text-xs text-lead">{value}</span>
        <span className="mt-auto flex items-center gap-3 text-xs font-bold text-ink">
          {action}
          <ArrowUpRight size={14} aria-hidden="true" />
        </span>
      </span>
      <span
        aria-hidden="true"
        className="contact-flip-face contact-flip-back absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-[28px] border p-6"
      >
        <Icon size={42} style={{ color }} />
        <span className="text-base font-bold text-ink">{action}</span>
        <span className="break-all text-center font-mono text-xs text-lead">
          {value}
        </span>
      </span>
    </span>
  );
  const className =
    "block h-full w-full rounded-[28px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand";
  return (
    <div
      ref={host}
      data-section-reveal
      className="materia-surface relative rounded-[28px]"
      style={{ "--surface-color": color } as CSSProperties}
    >
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${action}: ${label}`}
          className={className}
        >
          {contents}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          aria-label={action}
          className={className}
        >
          {contents}
        </button>
      )}
    </div>
  );
}
