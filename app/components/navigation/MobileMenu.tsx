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
      className="fixed inset-0 z-[9999] bg-white dark:bg-[#0a0a0a] transition-all duration-300 ease-out"
      style={{ 
        transform: menu ? 'translateY(0)' : 'translateY(-100%)',
        opacity: menu ? 1 : 0,
        pointerEvents: menu ? 'all' : 'none',
        visibility: menu ? 'visible' : 'hidden'
      }}
      data-noprint
    >
      <div 
        className="absolute inset-0 z-0 bg-white/80 dark:bg-black/80 backdrop-blur-3xl" 
        onClick={() => setMenu(false)}
      />

      <h2 id="mobile-menu-title" className="sr-only">Menú</h2>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenu(false);
        }}
        className="absolute top-6 right-6 p-4 text-ink transition-transform active:scale-90 z-[10001]"
        aria-label="Cerrar"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="relative z-10 h-full flex flex-col justify-center px-10">
        <nav className="flex flex-col gap-4">
          {t.menu.map((link: string, i: number) => (
            <a
              key={link}
              href={t.hrefs[i]}
              onClick={() => setMenu(false)}
              className="font-black text-[3.5rem] tracking-tighter text-ink no-underline block transition-all duration-200 active:text-brand active:translate-x-2"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="flex gap-3 flex-wrap mt-16 pt-8 border-t border-black/5 dark:border-white/10">
          {(Object.keys(LANG_LABELS) as Lang[]).map(l => (
            <button
              key={l}
              onClick={(e) => {
                e.stopPropagation();
                setLang(l);
                setTimeout(() => setMenu(false), 400);
              }}
              className={`font-mono text-[14px] font-bold tracking-widest border-2 rounded-xl px-6 py-3 transition-all ${lang === l
                  ? 'bg-ink text-page border-ink'
                  : 'bg-black/5 dark:bg-white/5 border-transparent text-lead'
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
