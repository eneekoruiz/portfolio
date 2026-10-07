"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
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
}: {
  category: SkillCategory;
  label: string;
  motion: boolean;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLUListElement>(null);
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
      dragging = false;
    let pointerId = -1,
      startX = 0,
      startAngle = 0;
    let lastX = 0,
      lastTime = 0,
      releaseVelocity = 0;
    const pitch = new SpringValue(0, 100, 18);
    const displacements = items.map(() => ({
      x: new SpringValue(0, 190, 19),
      y: new SpringValue(0, 165, 18),
      z: new SpringValue(0, 155, 19),
    }));
    let disposed = false;
    let pointerX = 0,
      pointerY = 0,
      interacting = false;
    let radius = 100;
    const resize = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      radius = Math.min(155, width * 0.32, Math.max(55, (width - 110) / 2));
      wake();
    });
    const draw = (dt = 0) => {
      if (disposed) return true;
      let settled = true;
      for (let i = 0; i < items.length; i++) {
        const theta = (i * Math.PI * 2) / items.length + angle.value;
        const depth = (Math.cos(theta) + 1) / 2;
        const x = Math.sin(theta) * radius;
        const y = Math.sin(theta * 2) * 14 + pitch.value * 10;
        const dx = x - pointerX,
          dy = y - pointerY;
        const distance = Math.sqrt(dx * dx + dy * dy + 400);
        const influence =
          interacting && !dragging
            ? Math.exp(-(dx * dx + dy * dy) / 6200) * depth
            : 0;
        const displacement = displacements[i];
        displacement.x.target = (dx / distance) * influence * 18;
        displacement.y.target = (dy / distance) * influence * 14;
        displacement.z.target = influence * 18;
        const ox = displacement.x.step(dt),
          oy = displacement.y.step(dt),
          oz = displacement.z.step(dt);
        const moving =
          !displacement.x.settled ||
          !displacement.y.settled ||
          !displacement.z.settled;
        if (moving) settled = false;
        const zPos = (depth - 0.5) * 80 + oz;
        items[i].style.transform =
          `translate(-50%,-50%) translate3d(${(x + ox).toFixed(1)}px,${(y + oy).toFixed(1)}px,${zPos.toFixed(1)}px) rotateY(${(Math.sin(theta) * -12).toFixed(1)}deg) scale(${(0.68 + depth * 0.36).toFixed(3)})`;
        items[i].style.setProperty("--pill-light", String(oz / 18));
        items[i].style.willChange = moving || dragging ? "transform" : "";
        items[i].style.opacity = String((0.36 + depth * 0.64).toFixed(3));
        items[i].style.zIndex = String(Math.round(depth * 100));
      }
      return settled;
    };
    const tick = (_time: number, delta: number) => {
      if (disposed) return;
      const dt = delta / 1000;
      const rotating = !focused && !dragging;
      if (rotating) {
        const advance = Math.min(dt, 0.08);
        angle.target += advance * 0.28;
      }
      angle.step(dt);
      pitch.target = Math.max(-1, Math.min(1, angle.velocity * 0.15));
      pitch.step(dt);
      const settled = draw(dt);
      if (!rotating && angle.settled && pitch.settled && settled)
        gsap.ticker.remove(tick);
    };
    function wake() {
      if (disposed) return;
      if (visible && document.visibilityState === "visible")
        gsap.ticker.add(tick);
      else {
        gsap.ticker.remove(tick);
        for (const item of items) item.style.willChange = "";
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) cancel();
      wake();
    });
    const enter = () => {
      wake();
    };
    const leave = () => {
      interacting = false;
      wake();
    };
    const focus = () => {
      focused = true;
      wake();
    };
    const blur = (event: FocusEvent) => {
      if (
        event.relatedTarget instanceof Node &&
        orbit.contains(event.relatedTarget)
      )
        return;
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
      if (!dragging && event.pointerType !== "touch") {
        const rect = orbit.getBoundingClientRect();
        pointerX = event.clientX - rect.left - rect.width / 2;
        pointerY = event.clientY - rect.top - rect.height / 2;
        interacting = true;
        wake();
      }
      if (!dragging || event.pointerId !== pointerId) return;
      angle.target = startAngle + (event.clientX - startX) * 0.015;
      const dt = (event.timeStamp - lastTime) / 1000;
      if (dt > 0)
        releaseVelocity = Math.max(
          -8,
          Math.min(8, ((event.clientX - lastX) * 0.015) / dt),
        );
      lastX = event.clientX;
      lastTime = event.timeStamp;
      wake();
    };
    const release = (event: PointerEvent) => {
      if (event.type !== "pointerup") interacting = false;
      if (!dragging) return;
      if (event.type === "pointerup")
        angle.target +=
          releaseVelocity *
          Math.exp(-Math.max(0, event.timeStamp - lastTime) / 100) *
          0.35;
      dragging = false;
      if (pointerId >= 0 && orbit.hasPointerCapture(pointerId)) {
        try {
          orbit.releasePointerCapture(pointerId);
        } catch {}
      }
      pointerId = -1;
      wake();
    };
    const cancel = () => {
      if (disposed) return;
      dragging = interacting = false;
      releaseVelocity = 0;
      if (pointerId >= 0 && orbit.hasPointerCapture(pointerId))
        orbit.releasePointerCapture(pointerId);
      pointerId = -1;
      angle.snap(angle.value);
      pitch.snap(0);
      for (const displacement of displacements) {
        displacement.x.snap(0);
        displacement.y.snap(0);
        displacement.z.snap(0);
      }
      draw();
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
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("blur", cancel);
    draw();
    return () => {
      disposed = true;
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
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("blur", cancel);
      if (pointerId >= 0 && orbit.hasPointerCapture(pointerId))
        orbit.releasePointerCapture(pointerId);
    };
  }, [motion, category.techs]);

  return (
    <article
      ref={cardRef}
      data-section-reveal
      data-skill-card
      className="materia-surface skill-orbit-card relative overflow-hidden rounded-[24px] border p-5 md:p-6"
      style={{ "--surface-color": category.c } as CSSProperties}
    >
      <header className="skill-orbit-header relative z-10 flex items-center">
        <span
          className="skill-orbit-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]"
          aria-hidden="true"
        >
          <category.I size={22} />
        </span>
        <h3 className="font-black uppercase tracking-tight text-ink">
          {label}
        </h3>
      </header>
      <ul
        ref={orbitRef}
        tabIndex={motion ? 0 : undefined}
        aria-label={label}
        className="skill-orbit mt-4 flex min-h-24 flex-wrap content-center justify-center gap-2 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
      >
        {category.techs.map((tech) => (
          <li
            key={tech}
            data-orbit-pill
            className="skill-orbit-pill rounded-2xl border px-3 py-2 text-xs font-bold text-ink"
          >
            <span
              aria-hidden="true"
              className="mr-2 inline-block h-2 w-2 rounded-full bg-current"
            />
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Skills({ t }: { t: Tx; lang?: Lang }) {
  const motion = useMotionEnabled();
  return (
    <SectionFrame id="skills" index="03" label={t.skLb} title={t.skH}>
      <div className="skills-grid grid">
        {SKILLS.map((category, index) => (
          <SkillOrbit
            key={category.g}
            category={category}
            label={t.skCats[index] ?? category.g}
            motion={motion}
          />
        ))}
      </div>
    </SectionFrame>
  );
}
