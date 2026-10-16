"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionEnabled } from "./useMotionEnabled";

/** Decorative work runs only while its actual host can be seen. */
export function useViewportMotion<T extends HTMLElement>(mediaQuery?: string) {
  const ref = useRef<T>(null);
  const enabled = useMotionEnabled();
  const [visible, setVisible] = useState(false);
  const [matching, setMatching] = useState(!mediaQuery);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const media = mediaQuery ? matchMedia(mediaQuery) : undefined;
    const updateMedia = () => setMatching(media?.matches ?? true);
    updateMedia();
    media?.addEventListener("change", updateMedia);
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting && entry.intersectionRatio > 0),
    );
    observer.observe(host);
    return () => {
      observer.disconnect();
      media?.removeEventListener("change", updateMedia);
    };
  }, [mediaQuery]);

  return { ref, active: enabled && matching && visible };
}
