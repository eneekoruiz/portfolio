"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Tx, Lang } from "../../types";
import { UI_COPY } from "../../data/interface-translations";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";

/** A compact map for touch screens, where the main navigation is collapsed. */
export function ReadingNav({
  active,
  t,
  lang,
}: {
  active: string;
  t: Tx;
  lang: Lang;
}) {
  const motion = useMotionEnabled();
  const chapters = [0, 1, 3, 2, 4, 5].map((i) => ({
    href: t.hrefs[i],
    label: t.menu[i],
  }));
  const index = Math.max(
    0,
    chapters.findIndex((item) => item.href === `#${active}`),
  );
  const previous = chapters[Math.max(0, index - 1)];
  const next = chapters[(index + 1) % chapters.length];
  const navigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const destination = document.getElementById(href.slice(1));
    if (!destination) return;
    event.preventDefault();
    if (motion && window.__lenis)
      window.__lenis.scrollTo(destination, { offset: -85 });
    else
      window.scrollTo({
        top: Math.max(
          0,
          destination.getBoundingClientRect().top + scrollY - 85,
        ),
        behavior: "instant",
      });
    history.replaceState(null, "", href);
    destination.tabIndex = -1;
    destination.focus({ preventScroll: true });
  };
  return (
    <nav
      data-reading-nav
      aria-label={UI_COPY[lang].navigation}
      aria-hidden={index === 0}
      inert={index === 0}
      className={`reading-nav fixed left-1/2 z-[90] flex w-[min(22rem,calc(100dvw-2rem))] -translate-x-1/2 items-center gap-2 rounded-full border border-ink/15 bg-page px-2 py-1.5 text-ink shadow-xl md:hidden ${index === 0 ? "invisible" : "visible"}`}
    >
      <a
        href={previous.href}
        onClick={(event) => navigate(event, previous.href)}
        aria-label={previous.label}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/15 outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <ArrowLeft size={16} aria-hidden="true" />
      </a>
      <span
        aria-current="location"
        className="min-w-0 flex-1 truncate text-center text-xs font-semibold"
      >
        <span dir="ltr" className="me-2 font-mono text-[10px] text-lead">
          {String(index + 1).padStart(2, "0")} / 06
        </span>
        {chapters[index].label}
      </span>
      <a
        href={next.href}
        onClick={(event) => navigate(event, next.href)}
        aria-label={next.label}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-page outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <ArrowRight size={16} aria-hidden="true" />
      </a>
    </nav>
  );
}
