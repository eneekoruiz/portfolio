'use client';

import { useEffect } from 'react';

export function useScrollReveal(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    const io = new IntersectionObserver(
      (es: IntersectionObserverEntry[]) => es.forEach((e: IntersectionObserverEntry) => {
        if (e.isIntersecting) { 
          e.target.classList.add('in'); 
          io.unobserve(e.target); 
        }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.sr').forEach((el: Element) => io.observe(el));
    return () => io.disconnect();
  }, [ready]);
}
