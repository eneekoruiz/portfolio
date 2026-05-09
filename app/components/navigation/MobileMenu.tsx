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
      className="fixed inset-0 z-[999] bg-white/97 dark:bg-[#0a0a0a]/97 backdrop-blur-[40px] transition-all duration-[500ms] ease-[cubic-bezier(.76,0,.24,1)]"
      style={{ 
        transform: menu ? 'translateY(0)' : 'translateY(-100%)',
        opacity: menu ? 1 : 0,
        pointerEvents: menu ? 'all' : 'none' 
      }}
      data-noprint
      onClick={(e) => {
        if (e.target === e.currentTarget) setMenu(false);
      }}
    >
      <h2 id="mobile-menu-title" className="sr-only">Menú</h2>
      
      <button
        onClick={() => setMenu(false)}
        className="absolute top-[env(safe-area-inset-top,24px)] right-6 p-4 text-lead hover:text-ink transition-colors z-[1001]"
        aria-label="Cerrar"
      >
        <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
          <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      <div className="h-full flex flex-col justify-center px-10 md:px-14">
        <nav className="flex flex-col gap-2">
          {t.menu.map((link: string, i: number) => (
            <div key={link} className="overflow-hidden leading-tight py-1">
              <a
                ref={(el: HTMLAnchorElement | null) => { menuRefs.current[i] = el; }}
                href={t.hrefs[i]}
                className="font-black text-[clamp(2.8rem,12vw,6.5rem)] tracking-[-0.04em] text-ink no-underline block transition-all duration-300 hover:text-brand hover:translate-x-2"
                style={{ transform: 'translateY(112%)' }}
                onClick={() => setMenu(false)}
              >
                {link}
              </a>
            </div>
          ))}
        </nav>

        <div className="flex gap-3 flex-wrap mt-14">
          {(Object.keys(LANG_LABELS) as Lang[]).map(l => (
            <button
              key={l}
              onClick={() => {
                setLang(l);
                // Optionally close menu after language change for better UX
                setTimeout(() => setMenu(false), 300);
              }}
              className={`font-mono text-[13px] font-bold tracking-[.1em] border-2 rounded-[12px] px-5 py-2.5 transition-all duration-200 ${lang === l
                  ? 'bg-ink text-page border-ink scale-105 shadow-lg'
                  : 'bg-black/5 dark:bg-white/5 border-transparent text-lead hover:bg-black/10 dark:hover:bg-white/10'
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
