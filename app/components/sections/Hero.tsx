"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { useSpringHover } from "../../hooks/useSpringHover";
import { useMotionPolicy } from "../../hooks/useMotionEnabled";
import { SignatureLink } from "../ui/SignatureLink";
import { SandField } from "../motion/SandField";
import { ShockType } from "../motion/ShockType";
import { BurstLayer } from "../motion/BurstLayer";
import { triggerTectonicImpact } from "../../lib/tectonic";
import type { Tx } from "../../types";
import { useHeroCinematic } from "../../hooks/useHeroCinematic";

interface HeroProps {
  t: Tx;
  reduced: boolean;
  phase: string;
  onIntroComplete: () => void;
}

// The name heads the poster: on wide screens one line takes at most this share
// of the hero height, on phones each of the two lines does.
const WIDE_SHARE = 0.34;
// Sideways phones have almost no height: the name takes a smaller share.
const SHORT_SHARE = 0.28;
const NARROW_SHARE = 0.25;

export function Hero({ t, reduced, phase, onIntroComplete }: HeroProps) {
  const { enabled: motion, allowed } = useMotionPolicy();
  const enabled = motion && !reduced;
  const heroRef = useRef<HTMLElement>(null);
  const intro = phase === "overture";
  const playCinematic = intro && allowed && !reduced;
  useHeroCinematic(heroRef, playCinematic, onIntroComplete);
  // Without motion there is nothing to play: reveal the hero straight away.
  useEffect(() => {
    if (intro && !playCinematic) onIntroComplete();
  }, [intro, playCinematic, onIntroComplete]);
  const contactRef = useSpringHover<HTMLAnchorElement>(enabled, 6);
  const [firstRole, ...restRole] = t.role.split(" · ");

  const scrollTo = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    triggerTectonicImpact(event.clientX, event.clientY, 1.15);
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    window.scrollTo({
      top: Math.max(0, target.getBoundingClientRect().top + scrollY),
      behavior: enabled ? "smooth" : "instant",
    });
    history.replaceState(null, "", `#${id}`);
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  const heightCap = (share: number) => () => {
    const height = heroRef.current?.clientHeight ?? innerHeight;
    return height * (innerHeight <= 500 ? Math.min(share, SHORT_SHARE) : share);
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Eneko Ruiz"
      data-cinematic={intro ? "" : undefined}
      className="hero-brutal relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      <SandField stageRef={heroRef} enabled={enabled} />
      <div className="hero-rules" aria-hidden="true" />

      <h1 dir="ltr" className="hero-name relative z-10">
        <span className="hero-name-wide">
          <ShockType
            lines={["Eneko Ruiz."]}
            maxSize={heightCap(WIDE_SHARE)}
            enabled={enabled}
            revealOnBurst
            listen
            pressure
          />
        </span>
        <span className="hero-name-narrow">
          <ShockType
            lines={["Eneko", "Ruiz."]}
            maxSize={heightCap(NARROW_SHARE)}
            enabled={enabled}
            revealOnBurst
            listen
          />
        </span>
      </h1>
      <div className="hero-head relative z-10">
        <p data-cine-ui className="hero-role">
          <span>{firstRole}</span>
          {restRole.length > 0 && <span>{restRole.join(" · ")}</span>}
        </p>
        <p data-cine-ui className="hero-tagline">
          {t.tagline}
        </p>
        <div data-cine-ui className="hero-actions">
          <SignatureLink
            label={t.ctaWork}
            kind="work"
            onClick={(e) => scrollTo(e, "work")}
          />
          <a
            ref={contactRef}
            data-magnetic-contact
            href="#contact"
            onClick={(e) => scrollTo(e, "contact")}
            className="materia-button border border-ink/20 text-ink"
          >
            {t.ctaContact}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <SignatureLink label={t.ctaCv} kind="cv" />
        </div>
      </div>

      {enabled && <BurstLayer />}
    </section>
  );
}
