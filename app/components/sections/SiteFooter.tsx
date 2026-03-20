'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Github, Linkedin, Mail } from 'lucide-react';
import { LiveStatus } from '../ui/LiveStatus';
import { PortalWarpBtn } from '../ui/Buttons';
import type { Tx } from '../../lib/types';

/* ── Magnetic social icon link ── */
function MagSocial({
  href, label, children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - (r.left + r.width  / 2)) * 0.35,
        y: (e.clientY - (r.top  + r.height / 2)) * 0.35,
        duration: .3, ease: 'power3.out',
      });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: .55, ease: 'elastic.out(1,.4)' });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-h
      className="flex items-center justify-center w-9 h-9 rounded-full border border-black/8 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] text-lead hover:text-ink hover:border-black/20 dark:hover:border-white/20 hover:bg-white/90 dark:hover:bg-white/[0.10] transition-all duration-200 no-underline"
    >
      {children}
    </a>
  );
}

export function SiteFooter({ t }: { t: Tx }) {
  return (
    <footer
      className="border-t border-black/7 dark:border-white/10 py-7 px-8 max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-4"
      data-noprint
    >
      <LiveStatus label={t.status} />

      {/* Center — tech + source */}
      <a
        href="https://github.com/eneekoruiz/portfolio"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.footerSrc}
        data-h
        className="no-underline text-lead transition-colors duration-200 text-center flex-1 hover:text-brand"
      >
        <p className="font-mono text-[11px] leading-[1.6]">{t.footerTech}</p>
        <span className="text-[10px] underline opacity-50">{t.footerSrc}</span>
      </a>

      {/* Right — magnetic socials + LAB */}
      <div className="flex items-center gap-2.5">
        <MagSocial href="mailto:eneekoruiz@gmail.com" label="Email">
          <Mail size={15} aria-hidden="true" />
        </MagSocial>
        <MagSocial href="https://github.com/eneekoruiz" label="GitHub">
          <Github size={15} aria-hidden="true" />
        </MagSocial>
        <MagSocial href="https://linkedin.com/in/eneekoruiz" label="LinkedIn">
          <Linkedin size={15} aria-hidden="true" />
        </MagSocial>
        <PortalWarpBtn />
      </div>
    </footer>
  );
}
