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
import { UI_COPY } from "../../data/interface-translations";
import { triggerTectonicImpact } from "../../lib/tectonic";

const EMAIL = "eneekoruiz@gmail.com";
const LOCAL_TIME_REFRESH_MS = 30_000;

/** Rendered after mount: server and client clocks differ, and the offset changes with DST. */
function useLocalTime(lang: Lang) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const format = new Intl.DateTimeFormat(lang, {
      timeZone: "Europe/Madrid",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "shortOffset",
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = setInterval(tick, LOCAL_TIME_REFRESH_MS);
    return () => clearInterval(id);
  }, [lang]);
  return time;
}

export function Contact({ t, lang = "es" }: { t: Tx; lang?: Lang }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);
  const motion = useMotionEnabled();
  const cardRef = useRef<HTMLDivElement>(null);
  useMateriaSurface(cardRef, "#1f4bff", motion, 28);
  const mailRef = useSpringHover<HTMLAnchorElement>(motion);
  const ui = UI_COPY[lang];
  const localTime = useLocalTime(lang);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = async (e?: React.MouseEvent) => {
    if (e) triggerTectonicImpact(e.clientX, e.clientY, 1.25);
    else triggerTectonicImpact(undefined, undefined, 1.25);
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
        className="contact-intro materia-surface relative overflow-hidden rounded-[24px] border border-ink/15 transition-colors duration-300"
      >
        {/* Header statement + live status indicator */}
        <div className="contact-intro-heading flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink/10 pb-4">
          <p className="max-w-xl text-base font-medium leading-relaxed tracking-tight text-ink md:text-xl">
            {t.coP}
          </p>
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 shrink-0 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{t.status}</span>
          </div>
        </div>

        {/* Email display and copy action */}
        <div className="my-5 flex flex-wrap items-center justify-between gap-4">
          <a
            dir="ltr"
            href={`mailto:${EMAIL}`}
            className="contact-email block break-all text-[clamp(1.5rem,3.8vw,3.2rem)] font-black leading-tight tracking-[-0.05em] text-ink hover:text-brand transition-colors decoration-brand/30 decoration-2 underline-offset-8 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            {EMAIL}
          </a>
        </div>

        {/* Action triggers + status line */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <a
              ref={mailRef}
              href={`mailto:${EMAIL}`}
              className="materia-button bg-ink text-page !min-h-10 !py-2 !px-5"
            >
              <Mail size={15} aria-hidden="true" />
              {ui.email}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <SignatureLink label={t.ctaCv} kind="cv" />
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-lead min-h-[1.25rem]">
            <p
              role="status"
              aria-live="polite"
              className="contact-copy-status flex items-center"
            >
              {status === "copied"
                ? ui.copied
                : status === "failed"
                  ? ui.copyFailed
                  : ""}
            </p>
            {status === "idle" && (
              <span className="opacity-70">
                DONOSTIA / SAN SEBASTIÁN
                {localTime && <time className="ml-2">{localTime}</time>}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="contact-tiles grid mt-4">
        <ContactTile
          label="Gmail"
          value={EMAIL}
          action={ui.copyEmail}
          color="#d83c30"
          icon={status === "copied" ? Check : Mail}
          onClick={copy}
          motion={motion}
        />
        <ContactTile
          label="GitHub"
          value="github.com/eneekoruiz"
          action={ui.profile}
          color="#747a88"
          icon={Github}
          href="https://github.com/eneekoruiz"
          motion={motion}
        />
        <ContactTile
          label="LinkedIn"
          value="linkedin.com/in/eneekoruiz"
          action={ui.connect}
          color="#0077b5"
          icon={Linkedin}
          href="https://linkedin.com/in/eneekoruiz"
          motion={motion}
        />
      </div>
    </SectionFrame>
  );
}
