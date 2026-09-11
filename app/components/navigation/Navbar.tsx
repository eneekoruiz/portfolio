"use client";

import React, { useLayoutEffect, useRef } from "react";
import { Search, Menu as MenuIcon } from "lucide-react";
import { LangDD } from "../ui/LangDD";
import { ThemeToggle } from "../ui/ThemeToggle";
import { MotionToggle } from "../ui/MotionToggle";
import { useMagnetic } from "../../hooks/useMagnetic";
import type { Lang, Tx } from "../../types";
import { UI_COPY } from "../../data/interface-translations";

interface NavbarProps {
  t: Tx;
  lang: Lang;
  setLang: (l: Lang) => void;
  setCmd: (open: boolean) => void;
  setMenu: (open: boolean) => void;
  navInnerRef: React.RefObject<HTMLDivElement | null>;
  indRef: React.RefObject<HTMLDivElement | null>;
  onNavEnter: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onNavContainerLeave: () => void;
}

export function Navbar({
  t,
  lang,
  setLang,
  setCmd,
  setMenu,
  navInnerRef,
  indRef,
  onNavEnter,
  onNavContainerLeave,
}: NavbarProps) {
  const logoRef = useMagnetic<HTMLAnchorElement>({ strength: 0.15 });
  const shellRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    const shell = shellRef.current;
    const nav = navInnerRef.current;
    const controls = controlsRef.current;
    const logo = logoRef.current;
    const menu = menuRef.current;
    const header = shell?.parentElement;
    if (!shell || !nav || !controls || !logo || !menu || !header) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const style = getComputedStyle(shell);
      const gap = parseFloat(style.columnGap) || 0;
      const controlGap = parseFloat(getComputedStyle(controls).columnGap) || 0;
      const controlsWidth =
        controls.offsetWidth -
        (menu.offsetWidth ? menu.offsetWidth + controlGap : 0);
      const available =
        shell.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight) -
        logo.offsetWidth -
        controlsWidth -
        gap * 2;
      const compact = innerWidth < 768 || nav.scrollWidth > available;
      const value = String(compact);
      if (header.dataset.navCompact === value) return;
      header.dataset.navCompact = value;
      nav.inert = compact;
      if (compact) nav.setAttribute("aria-hidden", "true");
      else nav.removeAttribute("aria-hidden");
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(queue);
    [shell, nav, controls, logo, ...nav.querySelectorAll("a")].forEach(
      (element) => observer.observe(element),
    );
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      delete header.dataset.navCompact;
      nav.inert = false;
      nav.removeAttribute("aria-hidden");
    };
  }, [lang, navInnerRef, logoRef]);
  return (
    <header
      className="fixed top-3 left-1/2 z-[100] -translate-x-1/2 w-[calc(100dvw-2rem)] max-w-[940px]"
      data-noprint
    >
      <div
        ref={shellRef}
        className="flex items-center justify-between gap-2 md:gap-4 px-3 md:px-5 py-[.62rem] rounded-full glass-hud"
      >
        <a
          ref={logoRef}
          href="#hero"
          className="n-el font-black text-[1rem] tracking-[-0.8px] text-ink no-underline shrink-0"
        >
          <span className="hidden min-[380px]:inline">Eneko.</span>
          <span className="inline min-[380px]:hidden">E.</span>
        </a>

        <nav
          ref={navInnerRef}
          aria-label={UI_COPY[lang].navigation}
          className="navbar-links hidden md:flex w-max shrink-0 items-center relative gap-1"
          onMouseLeave={onNavContainerLeave}
        >
          <div
            ref={indRef}
            className="nav-ind absolute top-0 left-0 h-9 bg-black/5 dark:bg-white/10 rounded-full opacity-0"
            aria-hidden="true"
          />
          {t.menu.map((link: string, i: number) => (
            <NavItem
              key={link}
              link={link}
              href={t.hrefs[i]}
              onEnter={onNavEnter}
            />
          ))}
        </nav>

        <div
          ref={controlsRef}
          className="n-el flex items-center gap-2 shrink-0"
        >
          <LangDD lang={lang} setLang={setLang} />
          <ThemeToggle />
          <MotionToggle />
          <button
            onClick={() => setCmd(true)}
            aria-label={UI_COPY[lang].search}
            title={`${UI_COPY[lang].search} (⌘K)`}
            className="p-2 border border-black/10 dark:border-white/10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Search size={14} />
          </button>
          <button
            ref={menuRef}
            onClick={() => setMenu(true)}
            aria-label={UI_COPY[lang].openMenu}
            className="navbar-menu-trigger md:hidden p-2 border border-black/10 dark:border-white/10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center"
          >
            <MenuIcon size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

function NavItem({
  link,
  href,
  onEnter,
}: {
  link: string;
  href: string;
  onEnter: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const ref = useMagnetic<HTMLAnchorElement>({ strength: 0.2 });
  return (
    <a
      ref={ref}
      href={href}
      className="n-el relative z-[1] shrink-0 whitespace-nowrap text-[13px] font-semibold text-lead no-underline px-[14px] py-[7px] group transition-transform duration-200"
      onMouseEnter={onEnter}
    >
      <span className="relative overflow-hidden block">
        <span className="block transition-transform duration-400 ease-expo group-hover:-translate-y-full">
          {link}
        </span>
        <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-400 ease-expo group-hover:translate-y-0 text-ink">
          {link}
        </span>
      </span>
    </a>
  );
}
