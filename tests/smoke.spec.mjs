import { test, expect } from "@playwright/test";

// Behaviour only: nothing here depends on how the page looks.
test.use({ reducedMotion: "reduce" });
// Motion paused for the visit: these specs check content, not the opening.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("portfolio-motion-enabled", "false"));
});

test("home loads without errors and every chapter exists", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  for (const id of ["hero", "work", "contact"]) await expect(page.locator(`#${id}`)).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("Eneko Ruiz");
  expect(errors).toEqual([]);
});

test("a project card opens its page and Back returns to the home", async ({ page }) => {
  await page.goto("/");
  const link = page.locator(".work-card-link").first();
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await expect(page).toHaveURL(/\/work\//);
  await expect(page.locator("h1").first()).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/(#.*)?$/);
  await expect(page.locator("#work")).toHaveCount(1);
});

test("no chapter is taller than the screen (single-page sections)", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(600);
  const tall = await page.evaluate(() =>
    [...document.querySelectorAll("section.chapter")]
      .filter((el) => el.id !== "work" && el.id !== "github")
      .map((el) => ({ id: el.id, h: el.getBoundingClientRect().height }))
      .filter((s) => s.h > innerHeight + 2),
  );
  expect(tall).toEqual([]);
});

test("no sideways overflow of the page", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(400);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(over).toBeLessThanOrEqual(1);
});
