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

test.beforeEach(async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Verify native popup navigation independently of the availability of the
  // deliberately fictitious destination repository on GitHub.
  await context.route(validRepository.html_url, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<title>Repository destination</title>",
    }),
  );
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

test("repository rows expose top technologies, hover and focus descriptions, and a native desktop link", async ({
  page,
}, info) => {
  await page.route("**/api/github/repos?**", (route) =>
    route.fulfill({
      json: [
        {
          ...validRepository,
          all_languages: ["TypeScript", "Python", "HTML", "CSS"],
        },
      ],
    }),
  );
  await page.goto("/");
  const activity = page.locator("#github");
  await activity.scrollIntoViewIfNeeded();
  const row = activity.locator("[data-repo-row]");
  const repoLink = row.getByRole("link", { name: validRepository.name });
  const description = row.locator(`#repo-description-${validRepository.id} p`);

  await expect(repoLink).toHaveAttribute("href", validRepository.html_url);
  await expect(repoLink).toHaveAttribute("target", "_blank");
  await expect(repoLink).toHaveAttribute("rel", "noopener noreferrer");
  await expect(row.getByText("TypeScript", { exact: true })).toBeVisible();
  await expect(row.getByText("Python", { exact: true })).toBeVisible();
  await expect(row.getByText("HTML", { exact: true })).toBeVisible();
  await expect(row.getByText("+1", { exact: true })).toBeVisible();

  if (info.project.name === "desktop") await row.hover();
  else await row.click({ position: { x: 8, y: 8 } });
  await expect(repoLink).toHaveAttribute("aria-expanded", "true");
  await expect(description).toHaveText(validRepository.description);
  if (info.project.name === "desktop") {
    await page.mouse.move(0, 0);
    await expect(repoLink).toHaveAttribute("aria-expanded", "false");
  }
  await repoLink.focus();
  await expect(repoLink).toHaveAttribute("aria-expanded", "true");
  await expect(description).toHaveText(validRepository.description);

  const popupPromise = page.waitForEvent("popup");
  await repoLink.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(validRepository.html_url);
  await popup.close();
});

test("touch rows disclose details on a row tap while the repository link stays navigable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/api/github/repos?**", (route) =>
    route.fulfill({
      json: [
        {
          ...validRepository,
          all_languages: ["TypeScript", "Python", "HTML", "CSS"],
        },
      ],
    }),
  );
  await page.goto("/");
  const activity = page.locator("#github");
  await activity.scrollIntoViewIfNeeded();
  const row = activity.locator("[data-repo-row]");
  const repoLink = row.getByRole("link", { name: validRepository.name });
  const description = row.locator(`#repo-description-${validRepository.id} p`);

  const rowBox = await row.boundingBox();
  expect(rowBox).not.toBeNull();
  await row.click({ position: { x: 8, y: 8 } });
  await expect(repoLink).toHaveAttribute("aria-expanded", "true");
  await expect(description).toHaveText(validRepository.description);

  const popupPromise = page.waitForEvent("popup");
  await repoLink.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(validRepository.html_url);
  await popup.close();
});
