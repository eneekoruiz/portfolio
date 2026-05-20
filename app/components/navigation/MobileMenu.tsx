"use client";

import React from "react";
import type { Lang, Tx } from "../../types";
import { LANG_LABELS } from "../../data/translations";
import { useFocusTrap } from "../../hooks/useFocusTrap";

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
        className="absolute top-6 right-6 p-3 text-ink z-[10001] bg-black/5 dark:bg-white/10 rounded-full"
        aria-label="Cerrar"
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
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="relative z-10 h-full flex flex-col justify-center px-8">
        <nav className="flex flex-col gap-4">
          {t.menu.map((link: string, i: number) => (
            <a
              key={link}
              href={t.hrefs[i]}
              onClick={() => setMenu(false)}
              className="font-black text-[2.2rem] tracking-tight text-ink no-underline block active:text-brand"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="mt-12 pt-8 border-t border-black/10 dark:border-white/10">
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(LANG_LABELS) as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLang(l);
                  setMenu(false);
                }}
                className={`font-mono text-[11px] font-bold tracking-widest border rounded-lg px-4 py-2 transition-all ${
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
