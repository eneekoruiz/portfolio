import { test, expect } from "@playwright/test";

const validRepository = {
  id: 1001,
  name: "boundary-valid-repository",
  description: "Valid repository",
  html_url: "https://github.com/eneekoruiz/boundary-valid-repository",
  language: "TypeScript",
  pushed_at: "2026-10-03T12:00:00Z",
  fork: false,
  size: 42,
  stargazers_count: 0,
  languages_url:
    "https://api.github.com/repos/eneekoruiz/boundary-valid-repository/languages",
  all_languages: ["TypeScript", "TypeScript", null, "", { name: "invalid" }],
};

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("malformed optional data preserves valid activity and deduplicates language chips", async ({
  page,
}) => {
  const errors = [];
  const keyWarnings = [];
  let calls = 0;
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (/same key|unique.*key/i.test(message.text()))
      keyWarnings.push(message.text());
  });
  await page.route("**/api/github/repos?**", async (route) => {
    calls++;
    await route.fulfill({
      json: [
        null,
        [],
        validRepository,
        validRepository,
        { ...validRepository, id: 1002, pushed_at: null },
        { ...validRepository, id: 1003, html_url: "javascript:alert(1)" },
        { ...validRepository, id: 1004, fork: true },
      ],
    });
  });
  await page.goto("/");
  expect(calls).toBe(0);
  const activity = page.locator("#github");
  await activity.scrollIntoViewIfNeeded();
  await expect(
    activity.getByText(validRepository.name, { exact: true }),
  ).toHaveCount(1);
  await expect(activity.getByText("TypeScript", { exact: true })).toHaveCount(
    1,
  );
  await expect(activity.getByText("1_repos", { exact: true })).toBeVisible();
  expect(calls).toBe(1);
  expect(errors).toEqual([]);
  expect(keyWarnings).toEqual([]);
});

test("malformed-only optional data shows offline fallback and keeps projects and contact usable", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/github/repos?**", (route) =>
    route.fulfill({ json: [null, { name: "invalid" }] }),
  );
  await page.goto("/");
  const activity = page.locator("#github");
  await activity.scrollIntoViewIfNeeded();
  await expect(activity.getByText("offline", { exact: true })).toBeVisible();
  await expect(
    activity.locator('a[href="https://github.com/eneekoruiz"]').first(),
  ).toBeVisible();
  await expect(page.locator("[data-project-title]")).toHaveCount(5);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(
    page.locator('#contact a[href^="mailto:"]').first(),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
