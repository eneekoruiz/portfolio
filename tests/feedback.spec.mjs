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

test("projects expose their direct action before disclosure and keep the brief compact", async ({
  page,
}, info) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const rows = page.locator("#work [data-materia-surface]");
  await expect(rows).toHaveCount(5);
  for (const row of await rows.all()) {
    await row.scrollIntoViewIfNeeded();
    const action = row.locator(".work-project-action");
    const disclosure = row.locator("button[aria-expanded]");
    await expect(disclosure).toHaveAttribute("aria-expanded", "false");
    await expect(action).toBeVisible();
    await expect(action).toBeInViewport();
    const unobscured = await action.evaluate((anchor) => {
      const box = anchor.getBoundingClientRect();
      const target = document.elementFromPoint(
        box.left + box.width / 2,
        box.top + box.height / 2,
      );
      return target === anchor || anchor.contains(target);
    });
    expect(
      unobscured,
      "Direct project action must be clickable without an overlay",
    ).toBe(true);
    const closedHeight = await row.evaluate(
      (element) => element.getBoundingClientRect().height,
    );
    expect(closedHeight).toBeLessThan(520);
    await disclosure.click();
    await expect(disclosure).toHaveAttribute("aria-expanded", "true");
    const panel = row.locator("[data-project-body]");
    await expect(panel).toHaveAttribute("aria-hidden", "false");
    await expect(panel).toHaveCSS("height", /[1-9]/);
    expect(
      await panel.evaluate((element) => element.getBoundingClientRect().height),
    ).toBeLessThan(360);
    const tabs = row.getByRole("tab");
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(row.getByRole("tabpanel")).toBeVisible();
    await page.screenshot({
      path: info.outputPath(
        (await row.getAttribute("data-materia-surface")) + "-compact.png",
      ),
    });
    await disclosure.click();
  }
  expect(errors).toEqual([]);
});

test("DNA restores a project-colored strand on focus, hover and direct SPA navigation", async ({
  page,
}, info) => {
  await page.goto("/");
  const row = page.locator('[data-materia-surface="ana-peluquera"]');
  await row.scrollIntoViewIfNeeded();
  const accent = page.locator('[data-dna-strand="accent"]');
  const secondary = page.locator('[data-dna-strand="secondary"]');
  const action = row.locator(".work-project-action");
  await action.focus();
  await expect(accent).toHaveCSS("stroke", "rgb(255, 45, 120)");
  expect(
    await secondary.evaluate((el) => getComputedStyle(el).stroke),
  ).not.toBe("rgb(255, 45, 120)");
  await row.locator("button[aria-expanded]").focus();
  await expect(accent).toHaveCSS("stroke", "rgb(255, 45, 120)");
  if (info.project.name === "desktop") {
    await page.mouse.move(1, 1);
    await page.locator("body").click({ position: { x: 1, y: 1 } });
    await row.hover();
    await expect(accent).toHaveCSS("stroke", "rgb(255, 45, 120)");
  }
  const opacity = await page
    .locator(".materia-canvas")
    .evaluate((el) => Number(getComputedStyle(el).opacity));
  expect(opacity).toBeGreaterThanOrEqual(0.3);
  await page.evaluate(() => {
    window.__feedbackDocument = "same-document";
  });
  await action.click();
  await expect(page).toHaveURL(/\/work\/ana-peluquera$/);
  expect(await page.evaluate(() => window.__feedbackDocument)).toBe(
    "same-document",
  );
  await expect(accent).toHaveCSS("stroke", "rgb(255, 45, 120)");
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => window.__feedbackDocument)).toBe(
    "same-document",
  );
  await expect(
    page.locator('[data-materia-surface="ana-peluquera"] .work-project-action'),
  ).toBeVisible();
});
