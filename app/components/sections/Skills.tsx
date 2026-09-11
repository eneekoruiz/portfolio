"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { Pause, Play } from "lucide-react";
import { SKILLS, type SkillCategory } from "../../lib/constants";
import type { Lang, Tx } from "../../types";
import { SectionFrame } from "./SectionFrame";
import { useMateriaSurface } from "../../hooks/useMateriaSurface";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { SpringValue } from "../../lib/spring";

function SkillOrbit({
  category,
  label,
  motion,
  lang,
}: {
  category: SkillCategory;
  label: string;
  motion: boolean;
  lang: Lang;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  useEffect(() => {
    pausedRef.current = paused;
    orbitRef.current?.dispatchEvent(new Event("orbit-pause"));
  }, [paused]);
  useMateriaSurface(cardRef, category.c, motion, 32);

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit || !motion) return;
    const items = Array.from(
      orbit.querySelectorAll<HTMLElement>("[data-orbit-pill]"),
    );
    const angle = new SpringValue(0, 110, 19);
    let visible = false,
      focused = false,
      hovering = false,
      dragging = false;
    let pointerId = -1,
      startX = 0,
      startAngle = 0,
      elapsed = 0;
    let lastX = 0,
      lastTime = 0,
      releaseVelocity = 0;
    const pitch = new SpringValue(0, 100, 18);
    let radius = 115;
    const resize = new ResizeObserver(([entry]) => {
      radius = Math.min(178, Math.max(90, entry.contentRect.width * 0.31));
      wake();
    });
    const draw = () => {
      for (let i = 0; i < items.length; i++) {
        const theta = (i * Math.PI * 2) / items.length + angle.value;
        const depth = (Math.cos(theta) + 1) / 2;
        const x = Math.sin(theta) * radius;
        const y =
          Math.sin(theta * 2 + elapsed * 0.7) * 12 +
          Math.cos(theta) * pitch.value * 18;
        items[i].style.transform =
          `translate(-50%,-50%) translate3d(${x}px,${y}px,${(depth - 0.5) * 100}px) rotateY(${Math.sin(theta) * -12}deg) scale(${0.64 + depth * 0.36})`;
        items[i].style.opacity = String(0.38 + depth * 0.62);
        items[i].style.zIndex = String(Math.round(depth * 100));
      }
    };
    const tick = (_time: number, delta: number) => {
      const dt = delta / 1000;
      const rotating = !pausedRef.current && !focused && !hovering && !dragging;
      if (rotating) {
        const advance = Math.min(dt, 0.08);
        angle.target += advance * 0.24;
        elapsed += advance;
      }
      // Autonomous drift stays bounded after a missed frame. The analytic
      // springs use real elapsed time so pausing never becomes slow motion.
      angle.step(dt);
      pitch.target = Math.max(-1, Math.min(1, angle.velocity * 0.15));
      pitch.step(dt);
      draw();
      if (!rotating && angle.settled && pitch.settled) gsap.ticker.remove(tick);
    };
    function wake() {
      if (visible && document.visibilityState === "visible")
        gsap.ticker.add(tick);
      else gsap.ticker.remove(tick);
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    const enter = () => {
      hovering = true;
      wake();
    };
    const leave = () => {
      hovering = false;
      wake();
    };
    const focus = () => {
      focused = true;
      wake();
    };
    const blur = () => {
      focused = false;
      wake();
    };
    const down = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return;
      dragging = true;
      pointerId = event.pointerId;
      startX = event.clientX;
      startAngle = angle.target;
      lastX = startX;
      lastTime = event.timeStamp;
      releaseVelocity = 0;
      orbit.setPointerCapture(pointerId);
      wake();
    };
    const move = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointerId) return;
      angle.target = startAngle + (event.clientX - startX) * 0.012;
      const dt = (event.timeStamp - lastTime) / 1000;
      if (dt > 0)
        releaseVelocity = Math.max(
          -5,
          Math.min(5, ((event.clientX - lastX) * 0.012) / dt),
        );
      lastX = event.clientX;
      lastTime = event.timeStamp;
      wake();
    };
    const release = (event: PointerEvent) => {
      if (!dragging) return;
      // A cancelled touch scroll must not fling the cylinder. Momentum decays
      // from the last actual movement, so holding before release never kicks it.
      if (event.type === "pointerup")
        angle.target +=
          releaseVelocity *
          Math.exp(-Math.max(0, event.timeStamp - lastTime) / 90) *
          0.2;
      dragging = false;
      pointerId = -1;
      wake();
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || dragging) return;
      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? orbit.clientHeight
            : 1;
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      angle.target += Math.max(-240, Math.min(240, delta * unit)) * 0.0015;
      wake();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      angle.target +=
        ((event.key === "ArrowRight" ? 1 : -1) * Math.PI * 2) / items.length;
      wake();
    };
    orbit.dataset.orbitActive = "true";
    resize.observe(orbit);
    observer.observe(orbit);
    orbit.addEventListener("pointerenter", enter);
    orbit.addEventListener("pointerleave", leave);
    orbit.addEventListener("pointerdown", down);
    orbit.addEventListener("wheel", wheel, { passive: true });
    orbit.addEventListener("keydown", key);
    orbit.addEventListener("pointermove", move);
    orbit.addEventListener("pointerup", release);
    orbit.addEventListener("pointercancel", release);
    orbit.addEventListener("lostpointercapture", release);
    orbit.addEventListener("focusin", focus);
    orbit.addEventListener("focusout", blur);
    orbit.addEventListener("orbit-pause", wake);
    document.addEventListener("visibilitychange", wake);
    draw();
    return () => {
      observer.disconnect();
      resize.disconnect();
      gsap.ticker.remove(tick);
      orbit.removeAttribute("data-orbit-active");
      for (const item of items) item.removeAttribute("style");
      orbit.removeEventListener("pointerenter", enter);
      orbit.removeEventListener("pointerleave", leave);
      orbit.removeEventListener("pointerdown", down);
      orbit.removeEventListener("wheel", wheel);
      orbit.removeEventListener("keydown", key);
      orbit.removeEventListener("pointermove", move);
      orbit.removeEventListener("pointerup", release);
      orbit.removeEventListener("pointercancel", release);
      orbit.removeEventListener("lostpointercapture", release);
      orbit.removeEventListener("focusin", focus);
      orbit.removeEventListener("focusout", blur);
      orbit.removeEventListener("orbit-pause", wake);
      document.removeEventListener("visibilitychange", wake);
    };
  }, [motion, category.techs]);

  return (
    <article
      ref={cardRef}
      data-section-reveal
      data-skill-card
      className="materia-surface skill-orbit-card relative overflow-hidden rounded-[32px] border p-6 md:p-8"
      style={{ "--surface-color": category.c } as CSSProperties}
    >
      <header className="relative z-10 flex items-center gap-4">
        <span
          className="skill-orbit-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
          aria-hidden="true"
        >
          <category.I size={26} />
        </span>
        <h3 className="text-xl font-black uppercase tracking-tight text-ink md:text-2xl">
          {label}
        </h3>
        {motion && (
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            aria-label={`${paused ? (lang === "es" ? "Reanudar" : "Resume") : lang === "es" ? "Pausar" : "Pause"} ${label}`}
            className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 text-lead focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
        )}
      </header>
      <ul
        ref={orbitRef}
        tabIndex={motion ? 0 : undefined}
        aria-label={label}
        aria-describedby={`orbit-help-${category.g.replace(/\W/g, "")}`}
        className="skill-orbit mt-7 flex min-h-36 flex-wrap content-center justify-center gap-2 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
      >
        {category.techs.map((tech) => (
          <li
            key={tech}
            data-orbit-pill
            className="skill-orbit-pill rounded-2xl border px-4 py-2.5 text-xs font-bold text-ink"
          >
            <span
              aria-hidden="true"
              className="mr-2 inline-block h-2 w-2 rounded-full bg-current"
            />
            {tech}
          </li>
        ))}
      </ul>
      <p
        id={`orbit-help-${category.g.replace(/\W/g, "")}`}
        className="relative mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-lead"
      >
        {motion
          ? lang === "es"
            ? "Arrastra para explorar · rueda o flechas ← →"
            : "Drag to explore · wheel or arrows ← →"
          : category.techs.length +
            (lang === "es" ? " tecnologías" : " technologies")}
      </p>
    </article>
  );
}

export function Skills({ t, lang = "es" }: { t: Tx; lang?: Lang }) {
  const motion = useMotionEnabled();
  return (
    <SectionFrame id="skills" index="01" label={t.skLb} title={t.skH}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7">
        {SKILLS.map((category, index) => (
          <div
            key={category.g}
            className={
              index === SKILLS.length - 1
                ? "md:col-span-2 md:mx-auto md:w-[calc(50%-0.875rem)]"
                : ""
            }
          >
            <SkillOrbit
              category={category}
              label={t.skCats[index] ?? category.g}
              motion={motion}
              lang={lang}
            />
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
