"use client";

import { useState } from "react";
import { useSectionObserver } from "./useSectionObserver";
import type { Tx } from "../types";

export function useActiveSection(
  ready: boolean,
  t: Tx,
  navInnerRef: React.RefObject<HTMLDivElement | null>,
  indRef: React.RefObject<HTMLDivElement | null>,
  activeLinkRef: React.MutableRefObject<HTMLAnchorElement | null>,
) {
  const [activeSection, setActiveSection] = useState("hero");

  useSectionObserver(
    ready,
    t,
    navInnerRef,
    indRef,
    activeLinkRef,
    setActiveSection,
  );

  return activeSection;
}
