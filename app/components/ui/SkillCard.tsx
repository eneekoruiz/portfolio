'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import type { LucideIcon } from 'lucide-react';

interface SkillCardProps {
  g: string;
  I: LucideIcon;
  c: string;
  tint: string;
  border: string;
  techs: readonly string[];
  onEnter?: () => void;
}

export function SkillCard({ g, I: Icon, c, tint, border, techs, onEnter }: SkillCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!;
    const r  = el.getBoundingClientRect();
    gsap.to(el, { rotateY: ((e.clientX - r.left) / r.width - .5) * 14, rotateX: ((e.clientY - r.top) / r.height - .5) * -14, duration: .3, ease: 'power3.out', transformPerspective: 700 });
  };
  const onLeave = () => gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: .5, ease: 'power3.out' });
  const doubled = [...techs, ...techs, ...techs];

  return (
    <div
      ref={ref}
      className={`bento-glow rounded-3xl shadow-rest border ${border} bg-gradient-to-br ${tint} to-transparent sr transition-all duration-500 ease-spring hover:-translate-y-1.5 hover:shadow-float`}
      style={{ padding: '1.75rem', transformStyle: 'preserve-3d' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onEnter}
      data-h
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="p-[.55rem] rounded-[12px] shrink-0" style={{ background: `${c}18`, border: `1px solid ${c}28` }}>
          <Icon size={18} style={{ color: c, display: 'block' }} aria-hidden="true" />
        </div>
        <span className="font-black text-[15px] text-ink tracking-[-0.3px]">{g}</span>
      </div>
      <div className="overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-r from-white/85 dark:from-[#0a0a0a]/85 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-l from-white/85 dark:from-[#0a0a0a]/85 to-transparent" />
        <div className="mq gap-[.4rem] py-[.2rem]">
          {doubled.map((tech, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/5 dark:bg-white/[0.03] border border-black/8 dark:border-white/10 text-lead whitespace-nowrap shrink-0">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
