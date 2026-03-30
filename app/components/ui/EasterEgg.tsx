'use client';
import { useEffect } from 'react';

export function EasterEgg() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const brand = "color: #0066ff; font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 900; letter-spacing: -1px;";
    const sub = "color: #888; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 400; text-transform: uppercase; letter-spacing: 2px;";
    const body = "color: inherit; font-family: 'Inter', sans-serif; font-size: 13px; line-height: 1.5;";
    const link = "color: #0066ff; font-family: monospace; font-size: 13px; font-weight: bold; text-decoration: underline;";

    console.log(
      `%cENEKO RUIZ %cENGINEER\n%c\nVeo que te gusta mirar bajo el capó. Si buscas a alguien obsesionado con el detalle, hablemos.\n\n%cEmail:  eneekoruiz@gmail.com\nGithub: github.com/eneekoruiz`,
      brand, sub, body, link
    );
  }, []);
  return null;
}