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

test("all 20 languages reach project descriptions, technology labels, contact and shared controls", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const row = page.locator('[data-materia-surface="ana-peluquera"]');
  await row.locator("button[aria-expanded]").click();
  for (const lang of Object.keys(LANG_LABELS)) {
    await language(page, lang);
    await expect(page.locator('a[href="#main-content"]')).toHaveText(
      UI_COPY[lang].skip,
    );
    await expect(page.locator("[data-motion-toggle]")).toHaveAttribute(
      "aria-label",
      UI_COPY[lang].motionPause,
    );
    await expect(page.locator("[data-skill-card] h3")).toHaveText(
      TX[lang].skCats,
    );
    const navigation = page.locator("header nav");
    if ((await navigation.getAttribute("aria-hidden")) === "true") {
      await expect(
        page.getByRole("button", { name: UI_COPY[lang].openMenu, exact: true }),
      ).toBeVisible();
    } else {
      await expect(navigation).toBeVisible();
      expect((await navigation.boundingBox()).height).toBeLessThanOrEqual(44);
    }
    await expect(
      row.getByRole("link", { name: UI_COPY[lang].explore, exact: true }),
    ).toBeVisible();
    await expect(
      row.getByText(PROJECTS_CONTENT["ana-peluquera"][lang].objective, {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.locator("#contact").getByRole("link", { name: UI_COPY[lang].email }),
    ).toHaveAttribute("href", "mailto:eneekoruiz@gmail.com");
    await expect(page.locator("html")).toHaveAttribute(
      "dir",
      lang === "ar" ? "rtl" : "ltr",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      lang + " fits the viewport",
    ).toBe(true);
  }
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.locator('a[href="#main-content"]')).toHaveText(
    UI_COPY.vi.skip,
  );
  expect(errors).toEqual([]);
});

test("navigation adapts to label width and restores full links when space returns", async ({
  page,
}, info) => {
  test.skip(
    info.project.name === "mobile",
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

test("project decision lens reveals the brief, system and impact without leaving the row", async ({
  page,
}) => {
  await page.goto("/");
  const row = page.locator('[data-materia-surface="ana-peluquera"]');
  await row.locator("button[aria-expanded]").click();
  const lens = row.locator("[data-decision-lens]");
  await expect(lens).toBeVisible();
  await expect(lens.getByRole("tab")).toHaveCount(3);
  await expect(lens.locator("[data-lens-panel]")).toContainText(
    PROJECTS_CONTENT["ana-peluquera"].es.objective,
  );
  await lens.getByRole("tab").nth(1).click();
  await expect(lens.getByRole("tab").nth(1)).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(lens.locator("[data-lens-panel]")).toContainText(
    PROJECTS_CONTENT["ana-peluquera"].es.algorithmH,
  );
  await lens.getByRole("tab").nth(2).press("Enter");
  await expect(lens.locator("[data-lens-panel]")).toContainText(
    PROJECTS_CONTENT["ana-peluquera"].es.outcomeH,
  );
});

test("Arabic and Hindi keep connected words and Japanese headings fit narrow viewports", async ({
  page,
}, info) => {
  await page.goto("/");
  for (const lang of ["ar", "hi", "ja"]) {
    await language(page, lang);
    await page.locator("#skills h2").scrollIntoViewIfNeeded();
    if (lang !== "ja") {
      const words = await page
        .locator("#skills h2 [data-kinetic-char]")
        .allTextContents();
      expect(words.some((word) => Array.from(word).length > 2)).toBe(true);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await page.screenshot({
      path: info.outputPath("typography-" + lang + ".png"),
    });
  }
});

test("a genuine capture reaches the detail and PKE clearly has no preview", async ({
  page,
}, info) => {
  await page.goto("/");
  const row = page.locator('[data-materia-surface="ana-peluquera"]');
  await row.scrollIntoViewIfNeeded();
  const image = row.locator('[data-preview-kind="capture"] img');
  await expect
    .poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0))
    .toBe(true);
  await page.screenshot({ path: info.outputPath("selected-capture.png") });
  await row.locator("button[aria-expanded]").click();
  await row
    .getByRole("link", { name: "Explorar proyecto", exact: true })
    .click();
  await expect(
    page.locator("[data-umbral-destination] [data-preview-kind]"),
  ).toHaveAttribute("data-preview-kind", "capture");
  await page.goto("/work/pke-web");
  await expect(
    page.getByText("Sin previsualización por ahora", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.locator('iframe[src*="pke-web.vercel.app"]')).toHaveCount(
    0,
  );
});

test("saved language survives case studies and a missing-page return", async ({
  page,
}) => {
  await page.goto("/");
  await language(page, "fr");
  const row = page.locator('[data-materia-surface="ana-peluquera"]');
  await row.locator("button[aria-expanded]").click();
  await row
    .getByRole("link", { name: "Découvrir le projet", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(
    page.getByRole("link", {
      name: "Ouvrir dans un nouvel onglet",
      exact: true,
    }),
  ).toBeVisible();
  await page.goto("/missing-localized-page");
  await expect(
    page.getByRole("heading", { name: "Cette page s’est égarée." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Retour à l’accueil" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(page.locator("#hero")).toBeVisible();
});

test("touch reading map moves between chapters without hiding the contact route", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "mobile",
    "The reading map supplements collapsed touch navigation.",
  );
  await page.goto("/");
  await page
    .locator("#hero")
    .getByRole("link", { name: "Ver proyectos", exact: true })
    .click();
  const map = page.locator("[data-reading-nav]");
  await expect(map).toBeVisible();
  await expect(map).toContainText("04 / 06");
  await map.locator('a[href="#values"]').click();
  await expect(map).toContainText("05 / 06");
  await map.locator('a[href="#contact"]').click();
  await expect(map).toContainText("06 / 06");
  await expect(
    page.locator("#contact").getByRole("link", { name: "Escríbeme" }),
  ).toBeVisible();
});
