'use client';

import React from 'react';
import { Search, Menu as MenuIcon } from 'lucide-react';
import { LangDD } from '../ui/LangDD';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useMagnetic } from '../../hooks/useMagnetic';
import type { Lang, Tx } from '../../types';

interface NavbarProps {
  t: Tx;
  lang: Lang;
  setLang: (l: Lang) => void;
  setCmd: (open: boolean) => void;
  setMenu: (open: boolean) => void;
  navInnerRef: React.RefObject<HTMLDivElement>;
  indRef: React.RefObject<HTMLDivElement>;
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
  onNavContainerLeave
}: NavbarProps) {
  return (
    <header
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[50] w-[calc(100%-2rem)] max-w-[940px]"
      data-noprint
    >
      <div className="flex items-center justify-between gap-2 md:gap-4 px-3 md:px-5 py-[.62rem] rounded-full bg-white/82 dark:bg-[#0a0a0a]/82 backdrop-blur-3xl border border-white/80 dark:border-white/10 shadow-glass">
        <a href="#hero" className="n-el font-black text-[1rem] tracking-[-0.8px] text-ink no-underline shrink-0">
          <span className="hidden min-[380px]:inline">Eneko.</span>
          <span className="inline min-[380px]:hidden">E.</span>
        </a>

        <nav
          ref={navInnerRef}
          aria-label="Navegación principal"
          className="hidden md:flex items-center relative gap-1"
          onMouseLeave={onNavContainerLeave}
        >
          <div
            ref={indRef}
            className="nav-ind absolute top-0 left-0 h-9 bg-black/5 dark:bg-white/10 rounded-xl opacity-0"
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

        <div className="n-el flex items-center gap-2 shrink-0">
          <LangDD lang={lang} setLang={setLang} />
          <ThemeToggle />
          <button
            onClick={() => setCmd(true)}
            aria-label="Buscar"
            className="p-2 border border-black/10 dark:border-white/10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Search size={14} />
          </button>
          <button
            onClick={() => setMenu(true)}
            aria-label="Abrir menú"
            className="md:hidden p-2 border border-black/10 dark:border-white/10 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center"
          >
            <MenuIcon size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

function NavItem({ link, href, onEnter }: {
  link: string; href: string; onEnter: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const ref = useMagnetic<HTMLAnchorElement>({ strength: 0.2 });
  return (
    <a
      ref={ref}
      href={href}
      className="n-el relative z-[1] text-[13px] font-semibold text-lead no-underline px-[14px] py-[7px] group transition-transform duration-200"
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
