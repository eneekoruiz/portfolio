"use client";

import { HomeReturnLink } from "./components/ui/HomeReturnLink";
import { useTranslations } from "./hooks/useTranslations";

export default function NotFound() {
  const { ui } = useTranslations();
  return (
    <main
      className="min-h-screen flex items-center justify-center p-8 bg-page text-ink"
      style={{ cursor: "auto" }}
    >
      <div className="max-w-[420px] w-full text-center">
        <div className="bento-glow rounded-3xl shadow-rest border border-black/10 dark:border-white/10 bg-gradient-to-br from-white/90 to-white/65 dark:from-white/[0.04] dark:to-white/[0.02] p-14 flex flex-col items-center gap-6 backdrop-blur-xl">
          <p className="font-black text-[clamp(4rem,15vw,6rem)] leading-none tracking-[-4px] text-ink">
            404
          </p>
          <h1 className="font-black text-[1.3rem] tracking-[-0.5px] text-ink">
            {ui.missingTitle}
          </h1>
          <p className="text-[13px] text-lead leading-[1.6] max-w-[300px]">
            {ui.missingDescription}
          </p>
          <HomeReturnLink />
          <code className="text-[10px] text-lead/50 font-mono">
            git checkout main
          </code>
        </div>
      </div>
    </main>
  );
}
