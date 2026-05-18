import { useState, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Custom hook for standard, responsive mobile detection matching the GSAP media query.
 */
export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(`(max-width: ${breakpoint}px)`, () => {
      setIsMobile(true);
      return () => setIsMobile(false);
    });
    return () => mm.revert();
  }, [breakpoint]);

  return isMobile;
}
