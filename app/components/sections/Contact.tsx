"use client";

import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import type { Lang, Tx } from "../../types";
import { SectionFrame } from "./SectionFrame";
import { useSpringHover } from "../../hooks/useSpringHover";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { UI_COPY } from "../../data/interface-translations";
import { triggerTectonicImpact } from "../../lib/tectonic";

const EMAIL = "eneekoruiz@gmail.com";

/**
 * The closing chapter: the title runs edge to edge, one sentence says what I am
 * looking for, and three equal doors lead out. Nothing else competes with them.
 */
export function Contact({ t, lang = "es" }: { t: Tx; lang?: Lang }) {
  const motion = useMotionEnabled();
  const mailRef = useSpringHover<HTMLAnchorElement>(motion);
  const githubRef = useSpringHover<HTMLAnchorElement>(motion);
  const linkedinRef = useSpringHover<HTMLAnchorElement>(motion);
  const ui = UI_COPY[lang];
  const impact = (event: React.MouseEvent) =>
    triggerTectonicImpact(event.clientX, event.clientY, 1.25);

  return (
    <SectionFrame id="contact" title={t.coH} fitTitle>
      <p data-section-reveal className="contact-line">
        {t.coP}
      </p>
      <div data-section-reveal className="contact-doors">
        <a
          ref={mailRef}
          href={`mailto:${EMAIL}`}
          onClick={impact}
          className="contact-door contact-door-primary"
          title={EMAIL}
        >
          <Mail size={18} aria-hidden="true" />
          <span>{ui.email}</span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <a
          ref={githubRef}
          href="https://github.com/eneekoruiz"
          target="_blank"
          rel="noopener noreferrer"
          onClick={impact}
          className="contact-door"
        >
          <Github size={18} aria-hidden="true" />
          <span>GitHub</span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <a
          ref={linkedinRef}
          href="https://linkedin.com/in/eneekoruiz"
          target="_blank"
          rel="noopener noreferrer"
          onClick={impact}
          className="contact-door"
        >
          <Linkedin size={18} aria-hidden="true" />
          <span>LinkedIn</span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </SectionFrame>
  );
}
