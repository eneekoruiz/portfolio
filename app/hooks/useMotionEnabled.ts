"use client";
import { useSyncExternalStore } from "react";
import {
  subscribeMotion,
  getMotionSnapshot,
  getServerMotionSnapshot,
} from "../lib/motion-store";
export function useMotionPolicy() {
  return useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    getServerMotionSnapshot,
  );
}
export function useMotionEnabled(): boolean {
  return useMotionPolicy().enabled;
}
