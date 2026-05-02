'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { LANG_LABELS } from '../../lib/constants';
import type { Lang } from '../../lib/types';

export function LangDD({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={`Idioma: ${LANG_LABELS[lang]}`}
        aria-haspopup="menu"
        aria-expanded={open}
        data-h
        className="flex items-center gap-[.3rem] px-[.75rem] py-[.38rem] rounded-[10px] border border-black/9 dark:border-white/10 bg-white/65 dark:bg-white/[0.06] backdrop-blur-[18px] text-[12px] font-bold text-lead tracking-[.04em] transition-all duration-200"
      >
        {lang.toUpperCase()}
        <ChevronDown size={11} className="transition-transform duration-300 ease-spring" style={{ transform: open ? 'rotate(180deg)' : '' }} />
      </button>
      
      {open && (
        /* ── EL ARREGLO ESTÁ AQUÍ: Contenedor rígido estilo iOS ── */
        <div className="absolute top-[120%] right-0 w-44 p-2 rounded-2xl bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-2xl z-[999] origin-top-right animate-in fade-in zoom-in-95 duration-200">
          
          {/* Scroll interno seguro para móviles */}
          <div className="max-h-[40vh] overflow-y-auto scrollbar-hide flex flex-col gap-1">
            {(Object.entries(LANG_LABELS) as [Lang, string][]).map(([k, label]) => (
              <button
                key={k}
                type="button"
                className={`flex items-center justify-between px-[.9rem] py-[.55rem] rounded-[11px] text-[13px] text-left transition-all duration-100 ${
                  lang === k 
                    ? 'font-bold text-brand bg-brand/10 dark:bg-brand/20' 
                    : 'font-medium text-ink hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                onClick={() => { setLang(k as Lang); setOpen(false); }}
              >
                <span>{label}</span>
                {lang === k && <Check size={13} className="text-brand" />}
              </button>
            ))}
          </div>
          
        </div>
      )}
    </div>
  );
}