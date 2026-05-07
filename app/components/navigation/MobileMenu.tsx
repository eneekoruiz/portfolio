'use client';

import React from 'react';
import type { Lang, Tx } from '../../types';
import { LANG_LABELS } from '../../data/translations';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface MobileMenuProps {
  menu: boolean;
  setMenu: (open: boolean) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Tx;
  menuRefs: React.MutableRefObject<(HTMLAnchorElement | null)[]>;
}

export function MobileMenu({ menu, setMenu, lang, setLang, t, menuRefs }: MobileMenuProps) {
  const containerRef = useFocusTrap(menu);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-title"
      aria-hidden={!menu}
      data-lenis-prevent="true"
      className="fixed inset-0 z-[80] bg-white/97 dark:bg-[#0a0a0a]/97 backdrop-blur-[40px] transition-[clip-path] duration-[600ms] [transition-timing-function:cubic-bezier(.76,0,.24,1)]"
      style={{ clipPath: menu ? 'inset(0)' : 'inset(100% 0 0 0)', pointerEvents: menu ? 'all' : 'none' }}
      data-noprint
    >
      <h2 id="mobile-menu-title" className="sr-only">Menú</h2>
      <button
        onClick={() => setMenu(false)}
        className="absolute top-5 right-8 p-2 text-lead hover:text-ink transition-colors"
        aria-label="Cerrar"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div className="h-full flex flex-col justify-center px-14">
        {t.menu.map((link: string, i: number) => (
          <div key={link} className="overflow-hidden leading-[1.05]">
            <a
              ref={(el: HTMLAnchorElement | null) => { menuRefs.current[i] = el; }}
              href={t.hrefs[i]}
              className="font-black text-[clamp(2.5rem,8vw,6.5rem)] tracking-[-3px] text-ink no-underline block transition-colors duration-200 hover:text-brand"
              style={{ transform: 'translateY(112%)' }}
              onClick={() => setMenu(false)}
            >
              {link}
            </a>
          </div>
        ))}
        <div className="flex gap-2 flex-wrap mt-10">
          {(Object.keys(LANG_LABELS) as Lang[]).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`font-mono text-[11px] tracking-[.15em] border-none rounded-[7px] px-2.5 py-1 transition-all duration-200 ${lang === l
                  ? 'bg-ink text-page'
                  : 'bg-black/6 dark:bg-white/[0.06] text-lead hover:bg-black/10 dark:hover:bg-white/10'
                }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
