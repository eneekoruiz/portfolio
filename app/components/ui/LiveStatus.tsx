'use client';

import { useEffect, useState } from 'react';
import { MapPin, Clock } from 'lucide-react';

const fmt = () =>
  new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

export function LiveStatus({ label }: { label: string }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    setTime(fmt());

    // Sync to next exact minute boundary
    const delay = 60_000 - (Date.now() % 60_000);
    const firstTick = setTimeout(() => {
      setTime(fmt());
      const interval = setInterval(() => setTime(fmt()), 60_000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(firstTick);
  }, []);

  return (
    <div className="inline-flex items-center gap-[.45rem] text-[11px] font-semibold px-[.9rem] py-[.38rem] rounded-full bg-black/5 dark:bg-white/[0.04] border border-black/[.06] dark:border-white/10 text-lead w-fit tracking-[.04em] focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none">
      <MapPin size={10} aria-hidden="true" />
      <span>Donostia</span>
      {time && (
        <>
          <span>·</span>
          <Clock size={10} aria-hidden="true" />
          <span>{time}</span>
        </>
      )}
      <span>·</span>
      <span className="w-[6px] h-[6px] rounded-full bg-[#34c759] shadow-[0_0_7px_#34c759] shrink-0" />
      <span className="text-[#1a7a2e] dark:text-[#34c759] font-bold">{label}</span>
    </div>
  );
}
