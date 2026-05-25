import type Lenis from "lenis";

declare module "*.css";
declare module "*.scss";
declare module "*.sass";
declare module "*.less";
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";

interface Window {
  __NEXT_DATA__?: Record<string, unknown>;
  __LITE?: boolean;
  __galaxy?: {
    setAttract: (v: boolean) => void;
    setSpeed: (v: number) => void;
  };
  __lenis?: Lenis;
}
