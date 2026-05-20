"use client";

import { Github, Linkedin } from "lucide-react";
import { useMagnetic } from "../../hooks/useMagnetic";
import { useSound } from "../../hooks/useSound";
import { LiveStatus } from "../ui/LiveStatus";
import { PortalWarpBtn } from "../ui/Buttons";
import type { Tx } from "../../types";

export function SiteFooter({ t }: { t: Tx }) {
  const { playClick } = useSound();
  const magGithub = useMagnetic<HTMLAnchorElement>();
  const magLinkedin = useMagnetic<HTMLAnchorElement>();

  const handleClick = () => playClick();

  return (
    <footer
      className="border-t border-black/10 dark:border-white/10 py-8 px-6 md:px-8 max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4"
      data-noprint
    >
      {/* Izquierda — Status (Centrado en móvil, a la izquierda en PC) */}
      <div className="w-full md:w-auto flex justify-center md:justify-start">
        <LiveStatus label={t.status} />
      </div>

      {/* Centro — Tech + Source (Oculto en móvil, visible en PC) */}
      <div className="hidden md:flex items-center gap-6">
        <a
          ref={magGithub}
          href="https://github.com/eneekoruiz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lead hover:text-brand transition-colors duration-300"
          onClick={handleClick}
          aria-label="GitHub"
        >
          <Github size={18} strokeWidth={2} />
        </a>
        <a
          ref={magLinkedin}
          href="https://linkedin.com/in/eneekoruiz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lead hover:text-brand transition-colors duration-300"
          onClick={handleClick}
          aria-label="LinkedIn"
        >
          <Linkedin size={18} strokeWidth={2} />
        </a>
        <div className="w-[1px] h-4 bg-line mx-2" />
        <a
          href="https://github.com/eneekoruiz/portfolio"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.footerSrc}
          data-h
          className="no-underline text-lead transition-colors duration-200 hover:text-brand"
          onClick={handleClick}
        >
          <p className="font-mono text-[10px] leading-none opacity-80">
            {t.footerTech}
          </p>
        </a>
      </div>

      {/* Derecha — LAB (Centrado en móvil, a la derecha en PC) */}
      <div className="w-full md:w-auto flex justify-center md:justify-end items-center gap-2.5">
        <PortalWarpBtn />
      </div>
    </footer>
  );
}
