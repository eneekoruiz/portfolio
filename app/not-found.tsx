'use client';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function NotFound() {
  const btn = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const el = btn.current;
    if (!el) return;
    const mv = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * .3, y: (e.clientY - (r.top + r.height / 2)) * .3, duration: .32, ease: 'power3.out' });
    };
    const lv = () => gsap.to(el, { x: 0, y: 0, duration: .55, ease: 'elastic.out(1,.4)' });
    el.addEventListener('mousemove', mv);
    el.addEventListener('mouseleave', lv);
    return () => { el.removeEventListener('mousemove', mv); el.removeEventListener('mouseleave', lv); };
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-8" style={{ background: 'var(--page)', cursor: 'auto' }}>
      <div className="max-w-[420px] w-full text-center">
        <div className="bento-glow rounded-3xl shadow-rest border border-white/70 bg-gradient-to-br from-white/90 to-white/65 p-14 flex flex-col items-center gap-6">
          <p className="font-black text-[clamp(4rem,15vw,6rem)] leading-none tracking-[-4px] text-ink">404</p>
          <h1 className="font-black text-[1.3rem] tracking-[-0.5px] text-ink">Parece que has roto algo.</h1>
          <p className="text-[13px] text-lead leading-[1.6] max-w-[300px]">
            O simplemente te has perdido. Volvamos al código limpio.
          </p>
          <Link
            ref={btn}
            href="/"
            aria-label="Volver al inicio"
            className="inline-flex items-center gap-2.5 px-8 py-[.9rem] rounded-full bg-ink text-page font-bold text-[14px] no-underline shadow-[0_8px_25px_rgba(0,0,0,.2)]"
          >
            <Home size={16} /> Volver al inicio
          </Link>
          <code className="text-[10px] text-lead/50 font-mono">git checkout main</code>
        </div>
      </div>
    </main>
  );
}
