'use client';

import { LiveStatus } from '../ui/LiveStatus';
import { PortalWarpBtn } from '../ui/Buttons';
import type { Tx } from '../../lib/types';

export function SiteFooter({ t }: { t: Tx }) {
  return (
    <footer
      className="border-t border-black/7 dark:border-white/10 py-7 px-8 max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-4"
      data-noprint
    >
      {/* Izquierda — Status */}
      <LiveStatus label={t.status} />

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

      {/* Derecha — LAB */}
      <div className="flex items-center gap-2.5">
        <PortalWarpBtn />
      </div>
    </footer>
  );
}