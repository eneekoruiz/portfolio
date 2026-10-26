import { test, expect } from "@playwright/test";
import { UI_COPY } from "../app/data/interface-translations.ts";
import { LANG_LABELS } from "../app/lib/constants.ts";
import { TX } from "../app/data/translations.ts";
import { PROJECTS_CONTENT } from "../app/data/projects.ts";

test.use({ reducedMotion: "reduce" });
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (window.top !== window) return;
    sessionStorage.setItem("hasSeenIntro", "true");
    if (!localStorage.getItem("portfolio_lang"))
      localStorage.setItem("portfolio_lang", "es");
  });
});

async function language(page, lang) {
  await page.locator("[data-language-trigger]").click({ timeout: 20000 });
  const bounds = await page.locator("[data-language-picker]").boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(-1);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(
    page.viewportSize().width + 1,
  );
  await page.locator("[data-language-picker] input").fill(lang);
  await page.locator(`[role="option"]:has(bdi[lang="${lang}"])`).click();
  await expect(page.locator("html")).toHaveAttribute("lang", lang);
  await expect
    .poll(() => page.evaluate(() => visualViewport?.scale ?? 1))
    .toBe(1);
  expect(await page.evaluate(() => scrollX)).toBe(0);
}

test("navigation adapts to label width and restores full links when space returns", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Desktop navigation adapts before reaching the touch breakpoint.",
  );
  await page.goto("/");
  await expect(page.locator("header nav")).toBeVisible();
  await page.setViewportSize({ width: 780, height: 1000 });
  await expect(page.locator("header nav")).toBeHidden();
  await expect(
    page.getByRole("button", { name: UI_COPY.es.openMenu, exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator("header nav")).toBeVisible();
  await language(page, "ja");
  await expect(page.locator("header nav")).toBeHidden();
  await page
    .getByRole("button", { name: UI_COPY.ja.openMenu, exact: true })
    .click();
  const menu = page.getByRole("dialog");
  await expect(menu).toBeVisible();
  await menu.locator('a[href="#work"]').click();
  await expect(menu).toHaveCount(0);
  await expect(page.locator("#work")).toBeInViewport();
});

test("language search understands translated names and supports keyboard selection and Escape", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("[data-language-trigger]").click();
  const input = page.locator("[data-language-picker] input");
  await input.fill("japones");
  await expect(page.getByRole("option")).toHaveCount(1);
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("option")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await page.locator("[data-language-trigger]").click();
  await page.locator("[data-language-picker] input").fill("fr");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-language-picker]")).toHaveCount(0);
  await expect(page.locator("[data-language-trigger]")).toBeFocused();
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
});

test("touch main navigation keeps every chapter reachable without covering project details", async ({
  page,
}, info) => {
  test.skip(
    info.project.name === "desktop",
    "Touch and compact navigation profiles.",
  );
  await page.goto("/");
  await expect(page.locator("[data-reading-nav]")).toHaveCount(0);
  await page.evaluate(() => {
    window.__chapterDocument = "same-document";
  });
  for (const id of ["work", "about", "skills", "values", "contact"]) {
    const trigger = page.getByRole("button", {
      name: UI_COPY.es.openMenu,
      exact: true,
    });
    if (await trigger.isVisible()) {
      await trigger.click();
      const menu = page.getByRole("dialog");
      await expect(menu).toBeVisible();
      await menu.locator('a[href="#' + id + '"]').click();
      await expect(menu).toHaveCount(0);
    } else {
      await page.locator('header nav a[href="#' + id + '"]').click();
    }
    await expect(page.locator("#" + id)).toBeInViewport();
    expect(await page.evaluate(() => window.__chapterDocument)).toBe(
      "same-document",
    );
  }
  await expect(
    page.locator("#contact").getByRole("link", { name: "Escríbeme" }),
  ).toBeVisible();
});
