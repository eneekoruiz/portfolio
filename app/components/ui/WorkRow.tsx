'use client';

import { useState } from 'react';
import { ChevronDown, Github, ArrowUpRight } from 'lucide-react';
import { LANG_COLORS } from '../../lib/constants';
import type { ProjectCard } from '../../lib/types';

export function WorkRow({ proj, idx }: { proj: ProjectCard; idx: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="sr border-t border-black/7 dark:border-white/10 transition-colors duration-200 hover:bg-black/[.018] dark:hover:bg-white/[0.02]"
      style={{ transitionDelay: `${idx * .05}s` }}
    >
      <div
        className="flex items-center gap-5 px-2 py-[1.6rem]"
        onClick={() => setOpen(o => !o)}
        style={{ cursor: 'default' }}
      >
        <span className="font-mono text-[11px] text-lead/50 w-7 shrink-0">{proj.n}</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
            <span className={`font-black text-[clamp(1.1rem,2vw,1.7rem)] tracking-[-1px] transition-colors duration-200 ${open ? 'text-brand' : 'text-ink'}`}>
              {proj.name}
            </span>
            <span className="text-[11px] text-lead font-medium">{proj.tag} · {proj.year} · {proj.size}</span>
          </div>
          {!open && (
            <div className="flex flex-wrap gap-[.3rem] mt-1">
              {proj.langs.slice(0, 5).map(l => (
                <span key={l} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/5 dark:bg-white/[0.03] border border-black/8 dark:border-white/10 text-lead whitespace-nowrap">
                  <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: LANG_COLORS[l] ?? '#999' }} />
                  {l}
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronDown size={16} className="text-lead shrink-0 transition-transform duration-300 ease-spring" style={{ transform: open ? 'rotate(180deg)' : '' }} />
      </div>

      <div className={`acc ${open ? 'open' : ''}`}>
        <div className="mx-2 mb-5 p-6 rounded-[18px] bg-white/80 dark:bg-white/[0.03] backdrop-blur-2xl border border-white/75 dark:border-white/10 shadow-rest flex flex-col gap-3">
          <p className="text-[13px] text-lead leading-[1.7] max-w-[600px]">{proj.desc}</p>
          <div>
            <p className="text-[9px] font-bold tracking-[.18em] uppercase text-lead/50 mb-2">Stack completo</p>
            <div className="flex flex-wrap gap-[.4rem]">
              {proj.langs.map(l => (
                <span key={l} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/5 dark:bg-white/[0.03] border border-black/8 dark:border-white/10 text-lead whitespace-nowrap">
                  <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: LANG_COLORS[l] ?? '#999' }} />
                  {l}
                </span>
              ))}
            </div>
          </div>
          <a
            href={`https://github.com/eneekoruiz/${proj.name.toLowerCase().replace(/[\s_]+/g, '-')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-[1.2rem] py-[.58rem] rounded-[10px] bg-ink text-page text-[12px] font-bold w-fit transition-transform duration-200 ease-spring hover:scale-[.97]"
          >
            <Github size={13} /> GitHub <ArrowUpRight size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}
