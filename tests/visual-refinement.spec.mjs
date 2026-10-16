import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__LITE = true;
    localStorage.setItem("portfolio-motion-enabled", "false");
    localStorage.setItem("portfolio_lang", "es");
  });
  await page.route("**/api/github/repos?**", (route) =>
    route.fulfill({ json: [] }),
  );
});

test("compact sections keep metrics aligned, pills readable and contact actionable", async ({
  page,
  context,
}, info) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const metrics = await page.locator(".about-metric").evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect();
      return {
        top: box.top,
        height: box.height,
        overflow: element.scrollWidth > element.clientWidth + 1,
      };
    }),
  );
  expect(metrics).toHaveLength(3);
  expect(
    Math.max(...metrics.map((m) => m.top)) -
      Math.min(...metrics.map((m) => m.top)),
  ).toBeLessThan(2);
  expect(metrics.every((m) => !m.overflow && m.height < 140)).toBe(true);
  await expect(page.locator(".about-metric").first()).toHaveCSS(
    "border-radius",
    "0px",
  );
  await expect(page.locator("[data-skill-card]").first()).toHaveCSS(
    "border-radius",
    "0px",
  );
  await expect(page.locator(".work-surface").first()).toHaveCSS(
    "border-radius",
    "0px",
  );
  for (const id of ["about", "skills", "contact"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(page.viewportSize().width + 1);
    await page.screenshot({ path: info.outputPath(`${id}-compact.png`) });
  }
  const cards = page.locator("[data-skill-card]");
  for (const card of await cards.all()) {
    expect((await card.boundingBox()).height).toBeLessThan(260);
    for (const pill of await card.locator("[data-orbit-pill]").all())
      await expect(pill).toBeVisible();
  }
  if (page.viewportSize().width >= 1100) {
    const tops = await cards.evaluateAll((elements) =>
      elements.map((e) => e.getBoundingClientRect().top),
    );
    expect(
      Math.max(...tops.slice(0, 3)) - Math.min(...tops.slice(0, 3)),
    ).toBeLessThan(2);
    expect(Math.abs(tops[3] - tops[4])).toBeLessThan(2);
  }
  await page.locator("#contact button").click();
  await expect(page.locator('#contact [role="status"]')).toContainText(
    /copiad/i,
  );
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "eneekoruiz@gmail.com",
  );
  await expect(
    page.locator('#contact a[href="https://github.com/eneekoruiz"]'),
  ).toHaveAttribute("rel", "noopener noreferrer");
  expect(errors).toEqual([]);
});

test("helix keeps cinematic SVG motion beyond the hero and freezes on shared pause", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.locator("[data-motion-toggle]").click();
  const dna = page.locator("[data-dna-static]");
  await expect(dna).toHaveAttribute("data-dna-animated", "true");
  await page.locator("#skills").scrollIntoViewIfNeeded();
  const strand = dna.locator('[data-dna-strand="accent"]');
  const initial = await strand.getAttribute("d");
  await expect.poll(() => strand.getAttribute("d")).not.toBe(initial);
  const light = dna.locator("[data-dna-light]");
  const offset = await light.getAttribute("stroke-dashoffset");
  await expect
    .poll(() => light.getAttribute("stroke-dashoffset"))
    .not.toBe(offset);
  const updates = await strand.evaluate(async (element) => {
    let changes = 0;
    const observer = new MutationObserver((records) => {
      changes += records.filter((r) => r.attributeName === "d").length;
    });
    observer.observe(element, { attributes: true, attributeFilter: ["d"] });
    await new Promise((resolve) => setTimeout(resolve, 550));
    observer.disconnect();
    return changes;
  });
  expect(updates).toBeGreaterThan(2);
  expect(updates).toBeLessThanOrEqual(12);
  await page.locator("[data-motion-toggle]").click();
  await expect(dna).toHaveAttribute("data-dna-animated", "false");
  const stopped = await strand.getAttribute("d");
  await page.waitForTimeout(200);
  expect(await strand.getAttribute("d")).toBe(stopped);
  await expect(
    page.locator(".work-preview .project-plate-frame").first(),
  ).toHaveCSS("transform", "none");
});

test("project preview is a native SPA entry and Back restores the same document", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => (window.__refinementDocument = "preserved"));
  const preview = page.locator(
    '[data-materia-surface="ana-peluquera"] .work-preview',
  );
  await expect(preview).toHaveAttribute("href", "/work/ana-peluquera");
  await preview.scrollIntoViewIfNeeded();
  await preview.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/ana-peluquera$/);
  expect(await page.evaluate(() => window.__refinementDocument)).toBe(
    "preserved",
  );
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => window.__refinementDocument)).toBe(
    "preserved",
  );
  await expect(preview).toBeVisible();
});
