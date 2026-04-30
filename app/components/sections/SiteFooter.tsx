'use client';

import { LiveStatus } from '../ui/LiveStatus';
import { PortalWarpBtn } from '../ui/Buttons';
import type { Tx } from '../../lib/types';

export function SiteFooter({ t }: { t: Tx }) {
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
      <a
        href="https://github.com/eneekoruiz/portfolio"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.footerSrc}
        data-h
        className="hidden md:block no-underline text-lead transition-colors duration-200 text-center flex-1 hover:text-brand"
      >
        <p className="font-mono text-[11px] leading-[1.6]">{t.footerTech}</p>
        <span className="text-[10px] underline opacity-50">{t.footerSrc}</span>
      </a>

      {/* Derecha — LAB (Centrado en móvil, a la derecha en PC) */}
      <div className="w-full md:w-auto flex justify-center md:justify-end items-center gap-2.5">
        <PortalWarpBtn />
      </div>
    </footer>
  );
}