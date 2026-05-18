import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

interface UseProjectsAnimationsProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  load: boolean;
  expandedIdx: number | null;
}

export function useProjectsAnimations({ sectionRef, load, expandedIdx }: UseProjectsAnimationsProps) {
  const expandedIdxRef = useRef<number | null>(expandedIdx);

  // Keep ref up to date
  useEffect(() => {
    expandedIdxRef.current = expandedIdx;
    if (expandedIdx !== null) {
      // Immediately smooth out active skew or translation on expand to prevent sudden jerks
      gsap.to('.work-row-anim', { skewY: 0, y: 0, duration: 0.3, overwrite: 'auto' });
    }
  }, [expandedIdx]);

  useEffect(() => {
    if (load) return;

    const ctx = gsap.context(() => {
      // 1. Header Entrance
      gsap.fromTo('.projects-header',
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.26, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        }
      );

      // 2. Cinematic Title Character Reveal
      const titleChars = sectionRef.current?.querySelectorAll('.title-char');
      if (titleChars && titleChars.length > 0) {
        gsap.fromTo(titleChars,
          { y: '100%', rotateX: -90, opacity: 0 },
          {
            y: 0, rotateX: 0, opacity: 1,
            duration: 1.2,
            stagger: 0.03,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: '.projects-header',
              start: 'top 85%',
            }
          }
        );
      }

      // 3. Project Rows entrance fade and slide
      gsap.fromTo('.work-row-anim',
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.18, stagger: 0.015, ease: 'power2.out',
          scrollTrigger: { trigger: '.projects-list', start: 'top 90%', once: true },
        }
      );

      // 4. Wave Inertia Scrolling Effect (Efecto Ola)
      const rows = gsap.utils.toArray<HTMLElement>('.work-row-anim');
      if (rows.length > 0) {
        const skewSetter = gsap.quickTo(rows, 'skewY', { duration: 0.4, ease: 'power2.out' });
        const ySetter = gsap.quickTo(rows, 'y', { duration: 0.5, ease: 'power2.out' });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            if (expandedIdxRef.current !== null) {
              gsap.set(rows, { skewY: 0, y: 0, overwrite: 'auto' });
              return;
            }
            const v = self.getVelocity();
            const skew = gsap.utils.clamp(-6, 6, v / 180);
            const yOffset = gsap.utils.clamp(-20, 20, v / 100);
            
            skewSetter(skew);
            ySetter(yOffset);
          },
        });

        // Soft recovery when scroll stops
        ScrollTrigger.addEventListener('scrollEnd', () => {
          skewSetter(0);
          ySetter(0);
        });
      }
    });

    return () => ctx.revert();
  }, [load]);
}
