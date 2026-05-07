'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Tx } from '@/app/types';

interface SectionMap {
  id: string;
  c: string;
}

export function useSectionObserver(ready: boolean, t: Tx, navInnerRef: React.RefObject<HTMLDivElement>, indRef: React.RefObject<HTMLDivElement>, activeLinkRef: React.MutableRefObject<HTMLAnchorElement | null>) {
  useEffect(() => {
    if (!ready) return;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) return;

    const map: SectionMap[] = [
      { id: 'hero', c: '#f5f5f7' },
      { id: 'skills', c: '#ffffff' },
      { id: 'work', c: '#f5f5f7' },
      { id: 'github', c: '#ffffff' },
      { id: 'about', c: '#f5f5f7' },
      { id: 'values', c: '#ffffff' },
      { id: 'contact', c: '#f5f5f7' },
    ];

    const observers = map.map(({ id, c }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) meta.content = c; },
        { threshold: 0.4 }
      );
      io.observe(el);
      return io;
    });

    return () => observers.forEach(io => io?.disconnect());
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const sections = t.hrefs.map((h: string) => document.querySelector(h)).filter(Boolean) as HTMLElement[];
    const navLinks = navInnerRef.current?.querySelectorAll<HTMLAnchorElement>('a');
    if (!sections.length || !navLinks?.length) return;

    const ctx = gsap.context(() => {
      function setActive(idx: number) {
        const link = navLinks![idx];
        if (!link || !indRef.current || !navInnerRef.current) return;

        activeLinkRef.current = link;
        const r = link.getBoundingClientRect();
        const nr = navInnerRef.current.getBoundingClientRect();
        gsap.to(indRef.current, {
          x: r.left - nr.left,
          width: r.width,
          height: r.height,
          opacity: 0.65,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }

      sections.forEach((sec, idx) => {
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActive(idx),
          onEnterBack: () => setActive(idx),
        });
      });

      if (window.scrollY < 100) setActive(0);
    });

    return () => ctx.revert();
  }, [ready, t, navInnerRef, indRef, activeLinkRef]);
}
