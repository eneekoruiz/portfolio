'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function useGsapOrchestration(
  mainRef: React.RefObject<HTMLDivElement | null>,
  ready: boolean,
  reduced: boolean
) {
  // Preset entrance properties to avoid layout shifts on first render
  useLayoutEffect(() => {
    if (!ready || reduced) return;
    gsap.set('.n-el', { opacity: 0, y: -14 });
    gsap.set('.h-ln', { yPercent: 115 });
    gsap.set('.h-fd', { opacity: 0, y: 16 });
    gsap.set('.memoji', { opacity: 0, x: 60 });
  }, [ready, reduced]);

  // Orchestrate timelines using @gsap/react safe-scoping
  useGSAP(() => {
    if (reduced) return;

    // Parallax hero
    if (document.querySelector('.h-txt')) {
      gsap.to('.h-txt', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.45,
        },
      });
    }

    if (document.querySelector('.memoji')) {
      gsap.to('.memoji', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.45,
        },
      });
    }

    // Section headings reveal
    const headings = document.querySelectorAll<HTMLElement>('.sec-h');
    if (headings.length) {
      headings.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.24,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 83%',
              once: true,
            },
          }
        );
      });
    }

    // Dynamic intro stagger timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (document.querySelectorAll('.n-el, .h-ln, .h-fd, .memoji').length) {
      tl.to('.n-el', { opacity: 1, y: 0, duration: 0.12, stagger: 0.015 })
        .to('.h-ln', { yPercent: 0, duration: 0.25, stagger: 0.02 }, '-=0.1')
        .to('.h-fd', { opacity: 1, y: 0, duration: 0.18, stagger: 0.02 }, '-=0.15')
        .to('.memoji', { opacity: 1, x: 0, duration: 0.3, ease: 'power3.out' }, '-=0.25');
    }
  }, { scope: mainRef, dependencies: [ready, reduced] });
}
