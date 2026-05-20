import { TX } from "../app/data/translations";
import { PROJECTS_CONTENT } from "../app/data/projects";
import { LANG_LABELS } from "../app/lib/constants";
import type { Lang } from "../app/types";

function runValidation() {
  console.log("🌐 Starting i18n Static Validation Audits...\n");

  let failed = false;
  const activeLangs = Object.keys(LANG_LABELS) as Lang[];

  console.log(
    `[INFO] Active Languages detected: ${activeLangs.join(", ")} (${activeLangs.length} total)\n`,
  );

  // 1. Check completeness of TX
  console.log(
    "🔎 Audit 1: Checking translations (app/data/translations.ts)...",
  );
  for (const lang of activeLangs) {
    if (!TX[lang]) {
      console.error(
        `❌ [ERROR] Language "${lang}" is in LANG_LABELS but missing in TX object!`,
      );
      failed = true;
      continue;
    }

    const tx = TX[lang];
    // Check every key is defined and not empty
    const keys = Object.keys(tx) as (keyof typeof tx)[];
    for (const key of keys) {
      const val = tx[key];
      if (val === undefined || val === null) {
        console.error(
          `❌ [ERROR] Language "${lang}": Key "${key}" is undefined or null!`,
        );
        failed = true;
      } else if (typeof val === "string" && val.trim() === "") {
        console.error(
          `❌ [ERROR] Language "${lang}": Key "${key}" has an empty string!`,
        );
        failed = true;
      } else if (Array.isArray(val) && val.length === 0) {
        console.error(
          `❌ [ERROR] Language "${lang}": Array key "${key}" is empty!`,
        );
        failed = true;
      }
    }

    // Language specific spelling & sanity audits
    const tagline = tx.tagline || "";
    const woLb = tx.woLb || "";
    const woH = tx.woH || "";
    const greeting = tx.greetingFn ? tx.greetingFn("Hello") : "";
    const abH = tx.abH || "";

    // Check for "Projetos" spelling leaks
    if ((lang === "ca" || lang === "gl") && woLb.includes("Projetos")) {
      console.error(
        `❌ [ERROR] Language "${lang}": Leaked spelling "Projetos" detected!`,
      );
      failed = true;
    }

    // Check for "babysitting" in Japanese
    if (lang === "ja" && JSON.stringify(tx).includes("babysitting")) {
      console.error(
        `❌ [ERROR] Japanese: "babysitting backend" absurdity detected in translations!`,
      );
      failed = true;
    }
  }

  // 2. Check no cross-language reference leakage for values (Philosophy)
  console.log(
    "🔎 Audit 2: Checking cross-language values leaks (Philosophy arrays)...",
  );
  const philosophyVals: Record<string, string[]> = {};
  for (const lang of activeLangs) {
    if (!TX[lang] || !TX[lang].vals) continue;
    // Map list of titles in philosophy values
    philosophyVals[lang] = TX[lang].vals.map((v) => v.t);
  }

  for (const langA of activeLangs) {
    for (const langB of activeLangs) {
      if (langA === langB) continue;

      const titlesA = philosophyVals[langA];
      const titlesB = philosophyVals[langB];
      if (!titlesA || !titlesB) continue;

      // Check for exact match indicating copy-paste leaks without translation
      let exactMatches = 0;
      for (let i = 0; i < titlesA.length; i++) {
        if (titlesA[i] === titlesB[i]) {
          exactMatches++;
        }
      }

      if (exactMatches === titlesA.length) {
        console.error(
          `❌ [ERROR] Language Leaks! Language "${langA}" and "${langB}" have identical philosophy value titles: [${titlesA.join(", ")}]`,
        );
        failed = true;
      }
    }
  }

  // 3. Check projects.ts alignment
  console.log(
    "🔎 Audit 3: Checking individual project translation alignment (app/data/projects.ts)...",
  );
  const projectIds = Object.keys(PROJECTS_CONTENT);
  for (const projId of projectIds) {
    const projTranslations = PROJECTS_CONTENT[projId];
    for (const lang of activeLangs) {
      if (!projTranslations[lang]) {
        console.error(
          `❌ [ERROR] Project "${projId}": Missing translation definition for active language "${lang}"!`,
        );
        failed = true;
        continue;
      }

      const content = projTranslations[lang]!;
      const fields: (keyof typeof content)[] = [
        "title",
        "subtitle",
        "role",
        "objective",
        "algorithmH",
        "algorithmP",
        "supabaseH",
        "supabaseP",
        "outcomeH",
        "outcomeP",
        "codeSpotlight",
        "techBadges",
      ];

      for (const field of fields) {
        const val = content[field];
        if (val === undefined || val === null) {
          console.error(
            `❌ [ERROR] Project "${projId}" (lang: ${lang}): Field "${field}" is missing!`,
          );
          failed = true;
        } else if (typeof val === "string" && val.trim() === "") {
          console.error(
            `❌ [ERROR] Project "${projId}" (lang: ${lang}): Field "${field}" is empty!`,
          );
          failed = true;
        } else if (Array.isArray(val) && val.length === 0) {
          console.error(
            `❌ [ERROR] Project "${projId}" (lang: ${lang}): Array field "${field}" is empty!`,
          );
          failed = true;
        }
      }
    }
  }

  if (failed) {
    console.log("\n🔴 i18n Audit Status: FAIL. Fix the listed errors above.");
    process.exit(1);
  } else {
    console.log(
      "\n🟢 i18n Audit Status: PASS! All active languages are 100% translated and aligned.",
    );
    process.exit(0);
  }
}

runValidation();
