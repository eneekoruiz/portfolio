"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { SpringValue } from "../../lib/spring";
import { ProjectVisual } from "./ProjectVisual";

type Preview = { name: string; color: string };
export function ProjectPreviewFollower({
  activeProject,
}: {
  activeProject: Preview | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const wakeRef = useRef<() => void>(() => {});
  const [project, setProject] = useState(activeProject);
  const enabled = useMotionEnabled();
  const poseRef = useRef({
    x: new SpringValue(0, 160, 22),
    y: new SpringValue(0, 160, 22),
    angle: new SpringValue(0, 130, 18),
    reveal: new SpringValue(0, 190, 23),
  });
  useEffect(() => {
    const pose = poseRef.current;
    const element = ref.current;
    if (!element || !enabled || matchMedia("(pointer: coarse)").matches) return;
    let positioned = false;
    const tick = (_time: number, delta: number) => {
      const dt = delta / 1000;
      const progress = pose.reveal.step(dt);
      element.style.transform = `translate3d(${pose.x.step(dt)}px,${pose.y.step(dt)}px,0) rotate(${pose.angle.step(dt)}deg) scale(${0.8 + progress * 0.2})`;
      element.style.opacity = String(Math.max(0, Math.min(1, progress)));
      element.style.visibility =
        positioned && progress > 0.001 ? "visible" : "hidden";
      if (
        pose.x.settled &&
        pose.y.settled &&
        pose.angle.settled &&
        pose.reveal.settled
      ) {
        gsap.ticker.remove(tick);
        element.style.willChange = "";
      }
    };
    const wake = () => {
      element.style.willChange = "transform, opacity";
      gsap.ticker.add(tick);
    };
    wakeRef.current = wake;
    const move = (event: PointerEvent) => {
      const x = Math.max(12, Math.min(innerWidth - 208, event.clientX + 24));
      const y = Math.max(85, Math.min(innerHeight - 144, event.clientY - 148));
      if (!positioned) {
        pose.x.snap(x);
        pose.y.snap(y);
        positioned = true;
      }
      pose.x.target = x;
      pose.y.target = y;
      pose.angle.target = Math.max(-8, Math.min(8, event.movementX * 0.3));
      if (pose.reveal.target > 0 || !pose.reveal.settled) wake();
    };
    const leave = () => {
      pose.reveal.target = 0;
      pose.angle.target = 0;
      wake();
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    wake();
    return () => {
      gsap.ticker.remove(tick);
      wakeRef.current = () => {};
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      pose.reveal.snap(0);
      element.style.opacity = "0";
    };
  }, [enabled]);
  useEffect(() => {
    const pose = poseRef.current;
    if (activeProject) setProject(activeProject);
    pose.reveal.target = activeProject && enabled ? 1 : 0;
    pose.angle.target = 0;
    wakeRef.current();
  }, [activeProject, enabled]);
  return (
    <div
      ref={ref}
      id="project-preview-follower"
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] h-[132px] w-[196px] overflow-hidden rounded-xl border border-ink/20 bg-page text-ink shadow-xl"
      style={{ opacity: 0, visibility: "hidden" }}
    >
      {project && (
        <ProjectVisual
          id={project.name.toLowerCase().replace(/[\s_]+/g, "-")}
          className="project-follower-visual"
        />
      )}
      <div className="project-follower-caption absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-page/95 px-3 py-2">
        <span className="truncate text-[11px] font-semibold capitalize">
          {project?.name === "ana-peluquera"
            ? "AG Beauty Salon"
            : project?.name.replace(/[-_]/g, " ")}
        </span>
        <span className="text-sm" style={{ color: project?.color }}>
          ↗
        </span>
      </div>
    </div>
  );
}
