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
        {/* The offer is the invitation; presence and one clear action follow. */}
        <p className="contact-offer max-w-4xl text-balance text-[clamp(1.6rem,3.6vw,3rem)] font-black leading-[1.06] tracking-[-0.035em] text-ink">
          {t.coP}
        </p>

        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-lead">
          <span className="inline-flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="contact-pulse h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            {t.status}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Donostia
            {localTime && <time className="ml-2 tabular-nums">{localTime}</time>}
          </span>
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-5">
          <a
            ref={mailRef}
            href={`mailto:${EMAIL}`}
            className="materia-button contact-primary !min-h-12 !px-6"
          >
            <Mail size={16} aria-hidden="true" />
            {ui.email}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <SignatureLink label={t.ctaCv} kind="cv" />
          <p
            role="status"
            aria-live="polite"
            className="contact-copy-status font-mono text-xs text-lead"
          >
            {status === "copied"
              ? ui.copied
              : status === "failed"
                ? ui.copyFailed
                : ""}
          </p>
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
