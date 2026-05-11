'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Check, ArrowUpRight, Github, Zap } from 'lucide-react';
import { useMagnetic } from '../../hooks/useMagnetic';
import { triggerPortal } from './PortalTransition';

type BtnState = 'idle' | 'animating' | 'done';

/* ── WorkScrollBtn ─────────────────────────────────────────────── */
export function WorkScrollBtn({ label }: { label: string }) {
  const [state, setState] = useState<BtnState>('idle');
  const toRef = useRef<ReturnType<typeof setTimeout>>();

  const handleClick = () => {
    if (state !== 'idle') return;
    setState('animating');
    toRef.current = setTimeout(() => {
      setState('done');
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => setState('idle'), 1800);
    }, 700);
  };

  useEffect(() => () => clearTimeout(toRef.current), []);

  return (
    <button
      onClick={handleClick}
      data-h
      aria-label={label}
      className={[
        'relative inline-flex items-center gap-2 px-[1.85rem] py-[.85rem] rounded-full overflow-hidden',
        'font-bold text-[14px] tracking-[-0.2px] transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]',
        state === 'done'     ? 'bg-[#34c759] text-white scale-[1.02] shadow-[0_8px_28px_rgba(52,199,89,.35)]'
        : state === 'animating' ? 'bg-ink text-page scale-[1.01] shadow-[0_8px_28px_rgba(0,0,0,.25)]'
        : 'bg-ink text-page shadow-[0_8px_28px_rgba(0,0,0,.2)] hover:scale-[1.05] hover:shadow-[0_12px_40px_rgba(0,0,0,.3)]',
        'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black outline-none'
      ].join(' ')}
    >
      {state === 'animating' && (
        <span aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,.18) 50%,transparent 100%)', animation: 'btn-scan .7s ease-in-out' }} />
      )}
      {state === 'idle'      && <>{label} <ArrowUpRight size={15} aria-hidden="true" /></>}
      {state === 'animating' && (
        <>
          <span className="inline-flex gap-[3px]" aria-hidden="true">
            {[0,1,2].map(i => (
              <span key={i} className="w-[4px] h-[4px] rounded-full bg-white"
                style={{ animation: `dot-bounce .6s ease-in-out ${i * .12}s infinite` }} />
            ))}
          </span>
          <span>Cargando…</span>
        </>
      )}
      {state === 'done'      && <><Check size={15} aria-hidden="true" /> {label}</>}
    </button>
  );
}

/* ── BinaryStreamBtn ───────────────────────────────────────────── */
export function BinaryStreamBtn({
  label,
  variant = 'light',
  className,
  href = '/curriculum',
}: {
  label: string;
  variant?: 'light' | 'dark' | 'ghost';
  className?: string;
  href?: string;
}) {
  const router = useRouter();
  const [state, setState]       = useState<BtnState>('idle');
  const [progress, setProgress] = useState(0);
  const [bits, setBits]         = useState<{ id: number; x: number; y: number; v: string }[]>([]);
  const [showRipple, setShowRipple] = useState(false);
  const ivRef = useRef<ReturnType<typeof setInterval>>();
  const bvRef = useRef<ReturnType<typeof setInterval>>();
  const toRef = useRef<ReturnType<typeof setTimeout>>();
  const bitId = useRef(0);

  const handleClick = () => {
    if (state !== 'idle') return;
    setState('animating');
    setProgress(0);

    bvRef.current = setInterval(() => {
      setBits((prev: { id: number; x: number; y: number; v: string }[]) => {
        const fresh = { id: bitId.current++, x: Math.random() * 88 + 6, y: 10 + Math.random() * 80, v: Math.random() > .5 ? '1' : '0' };
        return [...prev.slice(-18), fresh];
      });
    }, 95);

    let p = 0;
    ivRef.current = setInterval(() => {
      p += 100 / 20; // 20 steps instead of 60 -> 600ms total
      if (p >= 100) {
        clearInterval(ivRef.current); clearInterval(bvRef.current);
        setBits([]); setProgress(100); setState('done'); setShowRipple(true);
        
        // Navigate using the cinematic portal
        toRef.current = setTimeout(() => {
          triggerPortal(href);
        }, 150);
      } else { setProgress(p); }
    }, 30);
  };

  const handleMouseEnter = () => {
    if (!href.startsWith('http')) {
      router.prefetch(href);
    }
  };

  useEffect(() => () => { clearInterval(ivRef.current); clearInterval(bvRef.current); clearTimeout(toRef.current); }, []);

  const baseIdle = variant === 'dark'
    ? 'bg-ink text-page shadow-[0_10px_32px_rgba(0,0,0,.15)] border border-ink/10 dark:border-white/10 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(0,0,0,.25)]'
    : variant === 'ghost'
    ? 'bg-transparent text-lead border border-lead/20 hover:border-brand hover:text-brand hover:bg-brand/5 shadow-none'
    : 'bg-brand text-white shadow-[0_10px_32px_rgba(0,102,255,.35)] hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(0,102,255,.45)]';

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={state !== 'idle'}
      data-h
      aria-label={label}
      className={[
        'relative inline-flex items-center gap-2 px-[1.85rem] py-[.85rem] rounded-full',
        'font-bold text-[14px] tracking-[-0.2px] overflow-hidden',
        'transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]',
        state === 'done'      ? 'bg-[#34c759] text-white scale-[1.02]'
        : state === 'animating' ? 'bg-ink text-page scale-[1.01]'
        : [baseIdle, 'hover:scale-[1.05]'].join(' '),
        'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black outline-none',
        className ?? '',
      ].join(' ')}
    >
      {state === 'animating' && (
        <>
          {/* 🔍 Scanline / Matrix Overlay */}
          <div aria-hidden="true" className="absolute inset-0 z-10 opacity-[0.08] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,210,0.06))] bg-[length:100%_2px,3px_100%]" />
          
          {/* ⚡ Progress Ring */}
          <div aria-hidden="true" className="absolute inset-0 rounded-full pointer-events-none z-20"
            style={{ padding: '2px',
              background: `conic-gradient(from -90deg, var(--brand) ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
        </>
      )}
      
      {/* 🌌 Streaming Bits */}
      {bits.map(b => (
        <span key={b.id} className="btn-bit-stream !text-white/40" aria-hidden="true"
          style={{ left: `${b.x}%`, bottom: '-10px', animationDuration: `${0.8 + Math.random()}s` }}>{b.v}</span>
      ))}

      {showRipple && <span className="btn-done-ripple bg-[rgba(52,199,89,.35)]" aria-hidden="true" />}
      
      <span className="relative z-30 flex items-center gap-2">
        {state === 'idle'      && <><ArrowUpRight size={14} aria-hidden="true" />{label}</>}
        {state === 'animating' && <><span className="font-mono text-[11px] tracking-wider text-white animate-pulse">01</span>{label}…</>}
        {state === 'done'      && <><Check size={15} aria-hidden="true" />OK</>}
      </span>
    </button>
  );
}

/* ── BranchMergeBtn ────────────────────────────────────────────── */
export function BranchMergeBtn({ label, href = 'https://github.com/eneekoruiz' }: { label: string; href?: string }) {
  const [state, setState] = useState<BtnState>('idle');
  const [drawn, setDrawn] = useState(false);
  const toRef = useRef<ReturnType<typeof setTimeout>>();
  const magnetRef = useMagnetic<HTMLButtonElement>({ strength: 0.3, innerStrength: 0.12 });

  const handleClick = () => {
    if (state !== 'idle') return;
    setState('animating'); setDrawn(false);
    toRef.current = setTimeout(() => {
      setDrawn(true);
      setTimeout(() => {
        setState('done');
        window.open(href, '_blank', 'noopener,noreferrer');
        setTimeout(() => { setState('idle'); setDrawn(false); }, 1800);
      }, 500);
    }, 60);
  };

  useEffect(() => () => clearTimeout(toRef.current), []);
  const merging = state === 'animating' || state === 'done';

  return (
    <button
      ref={magnetRef}
      onClick={handleClick}
      disabled={state !== 'idle'}
      data-h
      aria-label={label}
      className={[
        'relative inline-flex items-center gap-2 px-[1.85rem] py-[.85rem] rounded-full overflow-hidden',
        'font-bold text-[13px] tracking-[-0.2px]',
        'transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]',
        state === 'done'
          ? 'bg-[#34c759] text-white scale-[1.02]'
          : 'bg-ink text-page shadow-[0_8px_28px_rgba(0,0,0,.2)] hover:bg-black hover:text-white hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,.3)]',
        'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black outline-none',
      ].join(' ')}
    >
      {state === 'idle' && <><Github size={15} aria-hidden="true" /><span>{label}</span><span className="font-mono opacity-40 text-[11px]">_</span></>}
      {state === 'animating' && (
        <>
          <span className="relative flex items-center justify-center shrink-0" aria-hidden="true" style={{ width: 44, height: 20 }}>
            <svg viewBox="0 0 44 20" width="44" height="20" className="absolute inset-0" overflow="visible">
              <path d="M 2 2 Q 22 2 22 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                strokeDasharray="26" strokeDashoffset={merging ? 0 : 26} style={{ transition: 'stroke-dashoffset .38s ease-out' }} />
              <path d="M 42 2 Q 22 2 22 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                strokeDasharray="26" strokeDashoffset={merging ? 0 : 26} style={{ transition: 'stroke-dashoffset .38s ease-out .06s' }} />
              <circle cx="22" cy="10" r="3" fill="currentColor" opacity={merging ? 1 : 0} style={{ transition: 'opacity .18s ease .32s' }} />
            </svg>
            <span className={drawn ? 'branch-icon-pop' : ''} style={{ opacity: drawn ? 1 : 0, position: 'relative', zIndex: 1 }}>
              <Github size={14} aria-hidden="true" />
            </span>
          </span>
          <span>Merging…</span>
        </>
      )}
      {state === 'done' && <><Github size={15} aria-hidden="true" /><span>Abriendo ↗</span></>}
    </button>
  );
}

/* ── PortalWarpBtn ─────────────────────────────────────────────── */
export function PortalWarpBtn({ className }: { className?: string }) {
  const [state, setState] = useState<BtnState>('idle');
  const toRef = useRef<ReturnType<typeof setTimeout>>();

  const handleClick = () => {
    if (state !== 'idle') return;
    setState('animating');
    toRef.current = setTimeout(() => { window.location.href = '/lab'; }, 820);
  };

  useEffect(() => () => clearTimeout(toRef.current), []);

  return (
    <button
      onClick={handleClick}
      data-h
      aria-label="The Lab — Physics Playground"
      className={[
        'relative flex items-center gap-1.5 px-[1.2rem] py-[.65rem] rounded-[12px] overflow-hidden',
        'bg-brand text-white shadow-lg',
        'text-[11px] font-black tracking-[.15em]',
        'transition-all duration-300',
        state === 'idle' ? 'hover:scale-105 hover:shadow-brand/30' : 'scale-[0.95]',
        'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black outline-none',
        className ?? '',
      ].join(' ')}
    >
      {state === 'animating' && (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="portal-swirl-spin rounded-full" style={{ width: '120%', height: '120%',
            background: 'conic-gradient(from 0deg,#0066ff 0deg,#6633ff 180deg,#0066ff 360deg)', opacity: .7 }} />
        </span>
      )}
      <Zap size={12} className={`opacity-70 relative z-10 ${state === 'animating' ? 'animate-spin' : ''}`} aria-hidden="true" />
      <span className={`relative z-10 ${state === 'animating' ? 'portal-warp-text' : ''}`}>LAB</span>
    </button>
  );
}
