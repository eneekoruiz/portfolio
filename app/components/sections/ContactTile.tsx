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
      className="contact-flip-visual relative block min-h-[145px] sm:min-h-[160px]"
      data-contact-flip
    >
      <span className="contact-flip-face relative flex min-h-[145px] sm:min-h-[160px] flex-col items-start gap-2.5 rounded-[22px] border p-4 sm:p-5">
        <span className="contact-tile-icon" aria-hidden="true">
          <Icon size={24} style={{ color }} />
        </span>
        <span className="contact-tile-label text-lg sm:text-xl font-bold text-ink">
          {label}
        </span>
        <span className="contact-tile-value break-all font-mono text-[11px] text-lead">
          {value}
        </span>
        <span className="contact-tile-action mt-auto flex items-center gap-2 text-xs font-bold text-ink">
          {action}
          <ArrowUpRight size={13} aria-hidden="true" />
        </span>
      </span>
      <span
        aria-hidden="true"
        className="contact-flip-face contact-flip-back absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[22px] border p-4 sm:p-5"
      >
        <span className="contact-tile-icon">
          <Icon size={30} style={{ color }} />
        </span>
        <span className="text-sm sm:text-base font-bold text-ink">{action}</span>
        <span className="break-all text-center font-mono text-[10px] sm:text-xs text-lead">
          {value}
        </span>
      </span>
    </span>
  );
  const className =
    "block h-full w-full rounded-[22px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand";
  return (
    <div
      ref={host}
      data-section-reveal
      data-contact-motion={motion ? "on" : "off"}
      data-contact-service={label.toLowerCase()}
      className="contact-tile materia-surface relative rounded-[22px]"
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
