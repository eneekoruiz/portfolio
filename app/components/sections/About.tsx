"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tx } from "../../types";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { useSpringHover } from "../../hooks/useSpringHover";
import { SectionFrame } from "./SectionFrame";
import { MaskedCopy } from "../motion/MaskedCopy";

export function About({ t }: { t: Tx }) {
  const motion = useMotionEnabled();
  const linkRef = useSpringHover<HTMLAnchorElement>(motion);

  return (
    <SectionFrame id="about" title={t.abH}>
      <div className="about-grid">
        <p data-section-reveal className="about-copy">
          <MaskedCopy text={t.mf} enabled={motion} />
        </p>
        <div data-section-reveal className="about-aside">
          <Link
            ref={linkRef}
            href="/curriculum"
            className="materia-button border border-ink/20 text-ink"
          >
            {t.ctaCv}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </SectionFrame>
  );
}
