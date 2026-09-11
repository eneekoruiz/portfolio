import assert from "node:assert/strict";
import { TX } from "../app/data/translations";
import { UI_COPY } from "../app/data/interface-translations";
import { STUDIO_TX } from "../app/data/studio-translations";
import { PROJECTS_CONTENT } from "../app/data/projects";
import { LANG_LABELS, SKILLS } from "../app/lib/constants";
import type { Lang } from "../app/types";

const languages = Object.keys(LANG_LABELS) as Lang[];
const latin = new Set([
  "es",
  "en",
  "eu",
  "fr",
  "it",
  "de",
  "pt",
  "ca",
  "gl",
  "tr",
  "nl",
  "sv",
  "pl",
  "vi",
]);
const errors: string[] = [];
const fail = (path: string, reason: string) =>
  errors.push(`${path}: ${reason}`);

/** Validate actual key sets, every nested string and expected collection sizes. */
function compare(value: unknown, reference: unknown, path: string, lang: Lang) {
  if (typeof reference === "function") {
    if (typeof value !== "function") fail(path, "missing function");
    return;
  }
  if (typeof reference === "string") {
    if (typeof value !== "string" || !value.trim()) {
      fail(path, "missing text");
      return;
    }
    if (
      latin.has(lang) &&
      /[\p{Script=Cyrillic}\p{Script=Arabic}\p{Script=Devanagari}]/u.test(value)
    )
      fail(path, "unexpected writing system; review the translation");
    return;
  }
  if (Array.isArray(reference)) {
    if (!Array.isArray(value)) {
      fail(path, "missing array");
      return;
    }
    if (value.length !== reference.length)
      fail(
        path,
        `expected ${reference.length} entries, received ${value.length}`,
      );
    reference.forEach((item, i) =>
      compare(value[i], item, `${path}[${i}]`, lang),
    );
    return;
  }
  if (reference && typeof reference === "object") {
    if (!value || typeof value !== "object") {
      fail(path, "missing object");
      return;
    }
    const actual = value as Record<string, unknown>;
    const expected = reference as Record<string, unknown>;
    for (const key of Object.keys(actual))
      if (!(key in expected)) fail(path + "." + key, "unexpected key");
    for (const [key, item] of Object.entries(expected)) {
      if (key !== "icon") compare(actual[key], item, path + "." + key, lang);
    }
  }
}
for (const lang of languages) {
  compare(TX[lang], TX.es, `TX.${lang}`, lang);
  compare(UI_COPY[lang], UI_COPY.es, `UI.${lang}`, lang);
  compare(STUDIO_TX[lang], STUDIO_TX.es, `STUDIO.${lang}`, lang);
  if (TX[lang]?.skCats.length !== SKILLS.length)
    fail(lang, "technology category labels do not match the cards");
  if (TX[lang]?.hrefs.join() !== TX.es.hrefs.join())
    fail(lang, "navigation destinations differ");
  for (const greeting of TX[lang]?.times ?? []) {
    if (!TX[lang].greetingFn(greeting)?.trim())
      fail(lang, "empty generated greeting");
  }
  for (const [id, content] of Object.entries(PROJECTS_CONTENT)) {
    compare(content[lang], content.es, `PROJECT.${id}.${lang}`, lang);
  }
}
assert.equal(
  TX.ja.status.includes("採用枠"),
  false,
  "Japanese availability must not advertise hiring vacancies",
);
if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`FAIL: ${errors.length} structural or known-copy issues.`);
  process.exitCode = 1;
} else {
  console.log(
    `PASS: ${languages.length} locales; home, interface, studio and ${Object.keys(PROJECTS_CONTENT).length} project dictionaries have matching structures.`,
  );
  console.log(
    "This check does not certify linguistic accuracy. Browser coverage and editorial review are separate checks.",
  );
}
