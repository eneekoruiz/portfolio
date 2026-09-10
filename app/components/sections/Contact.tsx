"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Github, Linkedin, Mail } from "lucide-react";
import type { Lang, Tx } from "../../types";
import { SectionFrame } from "./SectionFrame";
import { useSpringHover } from "../../hooks/useSpringHover";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { useMateriaSurface } from "../../hooks/useMateriaSurface";
import { ContactTile } from "./ContactTile";
import { SignatureLink } from "../ui/SignatureLink";

const EMAIL = "eneekoruiz@gmail.com";

export function Contact({ t, lang = "es" }: { t: Tx; lang?: Lang }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);
  const motion = useMotionEnabled();
  const cardRef = useRef<HTMLDivElement>(null);
  useMateriaSurface(cardRef, "#0066ff", motion, 28);
  const mailRef = useSpringHover<HTMLAnchorElement>(motion);
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
          <SignatureLink label={t.ctaCv} kind="cv" />
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
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <ContactTile
          label="Gmail"
          value={EMAIL}
          action={es ? "Copiar correo" : "Copy email"}
          color="#d83c30"
          icon={status === "copied" ? Check : Mail}
          onClick={copy}
          motion={motion}
        />
        <ContactTile
          label="GitHub"
          value="github.com/eneekoruiz"
          action={es ? "Ver perfil" : "View profile"}
          color="#747a88"
          icon={Github}
          href="https://github.com/eneekoruiz"
          motion={motion}
        />
        <ContactTile
          label="LinkedIn"
          value="linkedin.com/in/eneekoruiz"
          action={es ? "Conectar" : "Connect"}
          color="#0077b5"
          icon={Linkedin}
          href="https://linkedin.com/in/eneekoruiz"
          motion={motion}
        />
      </div>
    </SectionFrame>
  );
}
