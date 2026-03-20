'use client';

import { SKILLS } from '../../lib/constants';
import { SkillCard } from '../ui/SkillCard';
import type { Tx } from '../../lib/types';

export function Skills({ t }: { t: Tx }) {
  return (
    <section id="skills" data-section="skills" className="border-t border-black/7 dark:border-white/10 py-24 px-8 max-w-[1200px] mx-auto relative">
      <p className="sec-h text-[10px] font-bold tracking-[.22em] uppercase text-lead/60 mb-5">{t.skLb}</p>
      <h2 className="sec-h font-black text-[clamp(2.4rem,5vw,4.8rem)] tracking-[-2.5px] leading-[.91] text-ink mb-10">
        {t.skH}
      </h2>

      {/* Desktop 2-col */}
      <div className="hidden md:grid grid-cols-2 gap-4">
        {SKILLS.map(s => <SkillCard key={s.g} {...s} onEnter={() => {}} />)}
      </div>

      {/* Mobile swipe carousel */}
      <div className="md:hidden flex gap-4 overflow-x-auto [scroll-snap-type:x_mandatory] [-webkit-overflow-scrolling:touch] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SKILLS.map(s => (
          <div key={s.g} className="w-[80vw] max-w-[300px] shrink-0 [scroll-snap-align:start]">
            <SkillCard {...s} onEnter={() => {}} />
          </div>
        ))}
      </div>
    </section>
  );
}
