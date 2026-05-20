"use client";

interface SkeletonRowProps {
  idx: number;
}

export function SkeletonRow({ idx }: SkeletonRowProps) {
  return (
    <div
      className="border-b border-black/5 dark:border-white/5 py-[14px] md:py-5 px-0 md:px-6 flex items-center justify-between animate-pulse"
      style={{ animationDelay: `${idx * 0.07}s` }}
    >
      <div className="flex items-center gap-5">
        <span className="w-4 h-3 rounded bg-black/8 dark:bg-white/8" />
        <span className="block h-5 w-36 md:w-56 rounded-lg bg-black/5 dark:bg-white/5" />
      </div>
      <span className="block h-8 w-8 rounded-full bg-black/5 dark:bg-white/5" />
    </div>
  );
}
