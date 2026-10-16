"use client";
import { useMotionPolicy } from "./useMotionEnabled";
export function usePreferredMotion(): boolean {
  return useMotionPolicy().reduced;
}
