"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { useMotionEnabled } from "../../hooks/useMotionEnabled";
import { useSpringHover } from "../../hooks/useSpringHover";

export function HomeReturnLink() {
  const motion = useMotionEnabled();
  const ref = useSpringHover<HTMLAnchorElement>(motion, 32);
  return (
    <Link
      ref={ref}
      href="/"
      aria-label="Volver al inicio"
      className="inline-flex items-center gap-2.5 px-8 py-[.9rem] rounded-full bg-ink text-page font-bold text-[14px] no-underline shadow-[0_8px_25px_rgba(0,0,0,.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4"
    >
      <Home size={16} aria-hidden="true" />
      Volver al inicio
    </Link>
  );
}
