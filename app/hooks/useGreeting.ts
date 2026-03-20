'use client';

import { useState, useEffect } from 'react';

/**
 * useGreeting — flexible i18n greeting
 * Uses greetingFn(timeGreeting) to allow per-language grammar ordering
 * e.g. Basque: "Egun on! Eneko naiz" vs Spanish: "Buenos días, soy"
 */
export function useGreeting(
  times: [string, string, string],
  greetingFn: (timeGreeting: string) => string,
): string {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    const timeOfDay =
      hour >= 6 && hour < 14  ? times[0]
      : hour >= 14 && hour < 21 ? times[1]
      : times[2];
    setGreeting(greetingFn(timeOfDay));
  }, [times, greetingFn]);

  return greeting;
}
