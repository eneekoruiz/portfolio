"use client";

import { useRef } from "react";
import { SKILLS, type SkillCategory } from "../../lib/constants";
import type { Tx } from "../../types";
import { SectionFrame } from "./SectionFrame";
import { useMateriaSurface } from "../../hooks/useMateriaSurface";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";

interface SkillRowProps {
  category: SkillCategory;
  categoryLabel: string;
  motion: boolean;
}

function SkillRow({ category, categoryLabel, motion }: SkillRowProps) {
  const ref = useRef<HTMLElement>(null);
  useMateriaSurface(ref, category.c, motion, 24);

  return (
    <article
      ref={ref}
      data-section-reveal
      className="materia-surface relative overflow-hidden grid gap-5 border-b border-ink/10 p-6 last:border-b-0 md:grid-cols-[0.8fr_1.4fr] md:gap-10 md:p-8 transition-colors duration-300"
    >
      <div className="flex items-center gap-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15"
          style={{ color: category.c }}
        >
          <category.I size={20} aria-hidden="true" />
        </span>
        <h3 className="text-xl font-bold tracking-tight text-ink md:text-2xl">
          {categoryLabel}
        </h3>
      </div>
      <ul
        className="flex flex-wrap items-center gap-2"
        aria-label={categoryLabel}
      >
        {category.techs.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-ink/15 px-4 py-2 font-mono text-xs text-ink"
          >
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Skills({ t }: { t: Tx }) {
  const motion = useMotionEnabled();

  return (
    <SectionFrame id="skills" index="01" label={t.skLb} title={t.skH}>
      <div className="overflow-hidden rounded-[24px] border border-ink/15 bg-page/90">
        {SKILLS.map((category, index) => (
          <SkillRow
            key={category.g}
            category={category}
            categoryLabel={t.skCats[index] ?? category.g}
            motion={motion}
          />
        ))}
      </div>
    </SectionFrame>
  );
}
