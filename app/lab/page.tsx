'use client';

import { useEffect, useRef, useState } from 'react';

/* ══════════════════════════════════════════════════════════════════
   GALACTIC SPIRAL — 2500 particles, 144fps Canvas2D
   Physics: polar orbit + mouse gravity + exponential repulsion
   Colors: Cyan · Brand Blue · White stellar spectrum
══════════════════════════════════════════════════════════════════ */

const N        = 2_500;
const TWO_PI   = Math.PI * 2;
const ARMS     = 3;         // spiral arms
const FPS_CAP  = 1000 / 144;

// Particle: [x, y, vx, vy, baseR, baseTheta, arm, hue, size]
const STRIDE = 9;

function initParticles(W: number, H: number): Float32Array {
  const buf = new Float32Array(N * STRIDE);
  const cx = W / 2, cy = H / 2;

  for (let i = 0; i < N; i++) {
    const off  = i * STRIDE;
    const arm  = i % ARMS;
    // Distribute along arm — inner dense, outer sparse
    const t    = Math.pow(Math.random(), 0.6);         // non-linear: more particles near core
    const r    = 40 + t * Math.min(W, H) * 0.42;      // px from center
    const wind = r * 0.003;                            // winding angle per radius
    const base = (arm / ARMS) * TWO_PI + wind + (Math.random() - 0.5) * 0.28;
    const dispR = (Math.random() - 0.5) * r * 0.12;   // radial scatter
    const x = cx + (r + dispR) * Math.cos(base);
    const y = cy + (r + dispR) * Math.sin(base) * 0.72;

    // HSL: core=white, mid=cyan, outer=blue
    const hue   = t < 0.25 ? 0 : t < 0.6 ? 189 : 220; // white / cyan / blue
    const bright= t < 0.25 ? 1 : 0.75 + Math.random() * 0.25;

    buf[off + 0] = x;
    buf[off + 1] = y;
    buf[off + 2] = 0;                         // vx
    buf[off + 3] = 0;                         // vy
    buf[off + 4] = r;                         // base orbit radius
    buf[off + 5] = base;                      // base theta
    buf[off + 6] = arm;
    buf[off + 7] = hue;
    buf[off + 8] = (0.5 + bright * 1.5) * (t < 0.15 ? 2 : 1); // size
  }
  return buf;
}

export default function LabPage() {
  const cvRef    = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: false });
  const timeRef  = useRef(0);
  const [fps,    setFps]    = useState(0);
  const [attract, setAttract] = useState(false);
  const [speed,   setSpeed]   = useState(1.0);

  useEffect(() => {
    const cv  = cvRef.current!;
    const ctx = cv.getContext('2d', { alpha: true })!;

    let W = 0, H = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = cv.width  = cv.offsetWidth  * dpr;
      H = cv.height = cv.offsetHeight * dpr;
      cv.style.width  = `${cv.offsetWidth}px`;
      cv.style.height = `${cv.offsetHeight}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - r.left) / r.width);
      mouseRef.current.y = ((e.clientY - r.top)  / r.height);
      mouseRef.current.active = true;
    };
    const onLeave = () => { mouseRef.current.active = false; };
    cv.addEventListener('mousemove', onMove);
    cv.addEventListener('mouseleave', onLeave);

    const onTouch = (e: TouchEvent) => {
      const r = cv.getBoundingClientRect();
      mouseRef.current.x = (e.touches[0].clientX - r.left) / r.width;
      mouseRef.current.y = (e.touches[0].clientY - r.top)  / r.height;
      mouseRef.current.active = true;
    };
    cv.addEventListener('touchmove', onTouch, { passive: true });
    cv.addEventListener('touchend', () => { mouseRef.current.active = false; });

    let buf = initParticles(W, H);
    let raf = 0, lastT = 0, frames = 0, lastFpsT = 0;
    let attractMode = false;
    let simSpeed    = 1.0;

    (window as any).__galaxy = {
      setAttract: (v: boolean) => { attractMode = v; },
      setSpeed:   (v: number)  => { simSpeed = v;    },
    };

    const ORBIT_SPEED  = 0.00022;   // base angular velocity
    const DAMPEN       = 0.985;
    const MOUSE_PULL   = 0.000035;
    const CORE_PULL    = 0.000012;  // gentle pull toward galactic center

    const render = (t: number) => {
      raf = requestAnimationFrame(render);
      const dt = t - lastT;
      if (dt < FPS_CAP - 1) return;
      lastT = t;
      timeRef.current += dt * simSpeed;

      frames++;
      if (t - lastFpsT >= 1000) { setFps(frames); frames = 0; lastFpsT = t; }

      const cx = W / 2, cy = H / 2;
      const mx = mouseRef.current.x * W;
      const my = mouseRef.current.y * H;

      /* Trail — deeper black = longer trails */
      ctx.fillStyle = 'rgba(2,2,8,0.18)';
      ctx.fillRect(0, 0, W, H);

      /* ── Update & draw ── */
      for (let i = 0; i < N; i++) {
        const o = i * STRIDE;
        let px = buf[o],   py = buf[o+1];
        let vx = buf[o+2], vy = buf[o+3];
        const baseR = buf[o+4];
        const arm   = buf[o+6];
        const hue   = buf[o+7];
        const size  = buf[o+8];

        /* Spiral angular push — maintains orbital structure */
        const dx = px - cx, dy = py - cy;
        const r  = Math.sqrt(dx * dx + dy * dy) + 1;
        const angV = ORBIT_SPEED * simSpeed * (1 + 60 / r);
        vx += (-dy / r) * angV * W;
        vy += ( dx / r) * angV * H * 0.72;

        /* Galactic core gravity */
        vx -= dx * CORE_PULL * simSpeed;
        vy -= dy * CORE_PULL * simSpeed;

        /* Mouse interaction */
        if (mouseRef.current.active) {
          const mdx = px - mx, mdy = py - my;
          const mr2 = mdx * mdx + mdy * mdy;
          if (mr2 < (0.18 * W) ** 2 && mr2 > 1) {
            const f = MOUSE_PULL * W * W * simSpeed / mr2;
            vx += attractMode ? -mdx * f : mdx * f * 0.4;
            vy += attractMode ? -mdy * f : mdy * f * 0.4;
          }
        }

        vx *= DAMPEN; vy *= DAMPEN;
        px += vx; py += vy;

        /* Soft boundary: wrap with a gentle nudge back toward center */
        const margin = 0.06 * W;
        if (px < -margin) px += W + margin * 2;
        else if (px > W + margin) px -= W + margin * 2;
        if (py < -margin) py += H + margin * 2;
        else if (py > H + margin) py -= H + margin * 2;

        buf[o] = px; buf[o+1] = py;
        buf[o+2] = vx; buf[o+3] = vy;

        /* ── Draw ── */
        const depth  = Math.min(1, r / (Math.min(W, H) * 0.45));
        const alpha  = 0.25 + (1 - depth) * 0.7;
        const bright = 45 + (1 - depth) * 40;
        const sat    = hue === 0 ? 0 : 80 + (1 - depth) * 15;

        ctx.beginPath();
        ctx.arc(px, py, size * 0.8, 0, TWO_PI);
        ctx.fillStyle = `hsla(${hue},${sat}%,${bright}%,${alpha})`;
        ctx.fill();

        /* Bright core glow on innermost particles */
        if (r < 80 && size > 1.5) {
          ctx.beginPath();
          ctx.arc(px, py, size * 2, 0, TWO_PI);
          ctx.fillStyle = `hsla(${hue},${sat}%,95%,0.08)`;
          ctx.fill();
        }
      }

      /* Center bulge glow */
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
      grad.addColorStop(0, 'rgba(120,180,255,0.12)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 90, 0, TWO_PI);
      ctx.fillStyle = grad;
      ctx.fill();
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      cv.removeEventListener('mousemove', onMove);
      cv.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useEffect(() => { (window as any).__galaxy?.setAttract(attract); }, [attract]);
  useEffect(() => { (window as any).__galaxy?.setSpeed(speed); }, [speed]);

  return (
    <div className="fixed inset-0 overflow-hidden select-none" style={{ background: '#020208' }}>
      <canvas ref={cvRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(100,160,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(100,160,255,.6) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* ── Header — glassmorphism ── */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-start justify-between z-10 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/[0.08]">
          <h1 className="font-mono font-bold text-white text-[15px] tracking-[.2em] mb-0.5">GALACTIC SPIRAL</h1>
          <p className="font-mono text-[9px] text-white/30 tracking-[.18em]">
            {N.toLocaleString()} PARTICLES · {fps} FPS
          </p>
        </div>
        <a href="/" className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/[0.08] hover:border-white/20 rounded-xl px-4 py-2 font-mono text-[11px] text-white/50 hover:text-white/80 transition-all flex items-center gap-2">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          EXIT
        </a>
      </div>

      {/* ── Controls — glassmorphism panel ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/[0.08] flex items-center gap-3">
          {/* Attract toggle */}
          <button
            onClick={() => setAttract(a => !a)}
            className={[
              'font-mono text-[11px] font-semibold px-4 py-2 rounded-xl border transition-all duration-300',
              attract
                ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70 hover:border-white/20',
            ].join(' ')}
          >
            {attract ? '⬤ ATTRACT' : '○ REPEL'}
          </button>

          {/* Speed */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-white/30 tracking-wider">SPEED</span>
            <input
              type="range" min="0.2" max="3" step="0.1" value={speed}
              onChange={e => setSpeed(+e.target.value)}
              className="w-20 accent-cyan-400"
            />
            <span className="font-mono text-[9px] text-white/40 w-6">{speed.toFixed(1)}×</span>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className="absolute bottom-8 right-7 font-mono text-[9px] text-white/15 text-right leading-relaxed">
        <p>MOVE CURSOR OVER GALAXY</p>
        <p>TO PUSH / ATTRACT STARS</p>
      </div>
    </div>
  );
}
