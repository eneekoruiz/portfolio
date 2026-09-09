"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import type { Lang, Tx } from "../../types";
import { SectionFrame } from "./SectionFrame";
import { useSpringHover } from "../../hooks/useSpringHover";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { useMateriaSurface } from "../../hooks/useMateriaSurface";

const EMAIL = "eneekoruiz@gmail.com";

export function Contact({ t, lang = "es" }: { t: Tx; lang?: Lang }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);
  const motion = useMotionEnabled();
  const cardRef = useRef<HTMLDivElement>(null);
  useMateriaSurface(cardRef, "#0066ff", motion, 28);
  const mailRef = useSpringHover<HTMLAnchorElement>(motion);
  const copyRef = useSpringHover<HTMLButtonElement>(motion);
  const es = lang === "es";

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      if (!alive.current) return;
      setStatus("copied");
    } catch {
      if (alive.current) setStatus("failed");
    }
    if (!alive.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <SectionFrame id="contact" index="05" label={t.coLb} title={t.coH}>
      <div
        ref={cardRef}
        data-section-reveal
        className="materia-surface relative overflow-hidden rounded-[28px] border border-ink/15 p-6 md:p-10 transition-colors duration-300"
      >
        <div className="grid gap-8 border-b border-ink/15 pb-9 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <p className="max-w-xl text-lg leading-relaxed tracking-tight text-lead md:text-2xl">
            {t.coP}
          </p>
          <span className="flex items-center gap-2 text-xs font-medium text-lead md:justify-end">
            <span
              className="h-2 w-2 rounded-full bg-emerald-600"
              aria-hidden="true"
            />
            {t.status}
          </span>
        </div>
        <a
          href={`mailto:${EMAIL}`}
          className="my-9 block w-fit break-all text-[clamp(1.4rem,4.4vw,4.7rem)] font-bold leading-tight tracking-[-0.06em] text-ink underline decoration-brand/40 decoration-1 underline-offset-8 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
        >
          {EMAIL}
        </a>
        <div className="flex flex-wrap items-center gap-3">
          <a
            ref={mailRef}
            href={`mailto:${EMAIL}`}
            className="materia-button bg-ink text-page"
          >
            <Mail size={16} aria-hidden="true" />
            {es ? "Escríbeme" : "Email me"}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <button
            ref={copyRef}
            type="button"
            onClick={copy}
            className="materia-button border border-ink/20 text-ink"
          >
            {status === "copied" ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
            {es ? "Copiar correo" : "Copy email"}
          </button>
          <a
            href="https://github.com/eneekoruiz"
            target="_blank"
            rel="noopener noreferrer"
            className="materia-button text-ink"
          >
            <Github size={16} aria-hidden="true" />
            GitHub
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a
            href="https://linkedin.com/in/eneekoruiz"
            target="_blank"
            rel="noopener noreferrer"
            className="materia-button text-ink"
          >
            <Linkedin size={16} aria-hidden="true" />
            LinkedIn
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
        <p
          role="status"
          aria-live="polite"
          className="mt-4 min-h-6 text-sm text-lead"
        >
          {status === "copied"
            ? es
              ? "Correo copiado."
              : "Email copied."
            : status === "failed"
              ? es
                ? "No se pudo copiar. Puedes seleccionar el correo o usar Escríbeme."
                : "Could not copy. Select the address or use Email me."
              : ""}
        </p>
      </div>
    </SectionFrame>
  );
}
