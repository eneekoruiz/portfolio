"use client";

import React from "react";
import type { Lang, Tx } from "../../types";
import { LANG_LABELS } from "../../data/translations";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { UI_COPY } from "../../data/interface-translations";

interface MobileMenuProps {
  menu: boolean;
  setMenu: (open: boolean) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Tx;
  menuRefs: React.MutableRefObject<(HTMLAnchorElement | null)[]>;
}

export function MobileMenu({
  menu,
  setMenu,
  lang,
  setLang,
  t,
  menuRefs,
}: MobileMenuProps) {
  const containerRef = useFocusTrap(menu);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-title"
      aria-hidden={!menu}
      inert={!menu}
      tabIndex={-1}
      className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${menu ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
      data-noprint
    >
      {/* 🌑 Fondo oscuro/claro sólido para evitar que se vea el scroll de fondo si falla el bloqueo */}
      <div
        className="absolute inset-0 bg-page dark:bg-[#050505]"
        onClick={() => setMenu(false)}
      />

      <button
        onClick={() => setMenu(false)}
        type="button"
        className="absolute top-6 right-6 p-3 text-ink z-[10001] bg-black/5 dark:bg-white/10 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4"
        aria-label={UI_COPY[lang].close}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="relative z-10 h-full overflow-y-auto flex flex-col px-8 py-24">
        <h2 id="mobile-menu-title" className="sr-only">
          {UI_COPY[lang].navigation}
        </h2>
        <nav className="flex flex-col gap-4">
          {[0, 2, 3, 1, 4, 5].map((i) => (
            <a
              key={t.hrefs[i]}
              ref={(element) => {
                menuRefs.current[i] = element;
              }}
              href={t.hrefs[i]}
              onClick={() => setMenu(false)}
              className="font-black text-[clamp(1.5rem,6vw,2.2rem)] break-words tracking-tight text-ink no-underline block active:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4"
            >
              {t.menu[i]}
            </a>
          ))}
        </nav>

        <div className="mt-12 pt-8 border-t border-black/10 dark:border-white/10">
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setLang(l);
                  setMenu(false);
                }}
                aria-pressed={lang === l}
                className={`min-h-11 font-mono text-[11px] font-bold tracking-widest border rounded-lg px-4 py-2 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 ${
                  lang === l
                    ? "bg-ink text-page border-ink"
                    : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-lead"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
