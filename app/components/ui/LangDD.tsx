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
        onClick={() => setOpen(o => !o)}
        aria-label={`Idioma: ${LANG_LABELS[lang]}`}
        data-h
        className="flex items-center gap-[.3rem] px-[.75rem] py-[.38rem] rounded-[10px] border border-black/9 dark:border-white/10 bg-white/65 dark:bg-white/[0.06] backdrop-blur-[18px] text-[12px] font-bold text-lead tracking-[.04em] transition-all duration-200"
      >
        {lang.toUpperCase()}
        <ChevronDown size={11} className="transition-transform duration-300 ease-spring" style={{ transform: open ? 'rotate(180deg)' : '' }} />
      </button>
      {open && (
        <div className="lang-menu">
          {(Object.entries(LANG_LABELS) as [Lang, string][]).map(([k, label]) => (
            <div
              key={k}
              className={`flex items-center justify-between px-[.9rem] py-[.55rem] rounded-[11px] text-[13px] transition-all duration-100 ${lang === k ? 'font-bold text-brand bg-brand/7' : 'font-medium text-lead hover:bg-brand/7 hover:text-brand'}`}
              onClick={() => { setLang(k); setOpen(false); }}
            >
              <span>{label}</span>
              {lang === k && <Check size={13} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
