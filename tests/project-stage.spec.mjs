import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__LITE = true;
    localStorage.setItem("portfolio-motion-enabled", "true");
    localStorage.setItem("portfolio_lang", "es");
  });
  await page.route("**/api/github/repos?**", (route) =>
    route.fulfill({
      json: [
        {
          id: 998,
          name: "real-description",
          fork: false,
          description:
            "Descripción de repositorio visible también en ventanas estrechas.",
          html_url: "https://github.com/eneekoruiz/real-description",
          all_languages: ["TypeScript", "CSS", "HTML"],
          language: "TypeScript",
          size: 32,
          stargazers_count: 0,
          pushed_at: "2026-10-01T00:00:00Z",
        },
      ],
    }),
  );
});

test("each project owns a scroll stage with a visible direct action and reversible entry", async ({
  page,
}, info) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  const rows = page.locator("#work [data-materia-surface]");
  await expect(rows).toHaveCount(5);
  await expect(page.locator(".skill-orbit-help")).toHaveCount(0);
  for (const row of await rows.all()) {
    await expect(row).toHaveAttribute("data-project-stage", /active|entry/);
    const top = await row.evaluate(
      (e) => e.getBoundingClientRect().top + scrollY,
    );
    const scroll = async (y) =>
      page.evaluate(
        (target) =>
          window.__lenis
            ? window.__lenis.scrollTo(target, { immediate: true, force: true })
            : scrollTo(0, target),
        y,
      );
    await scroll(Math.max(0, top - page.viewportSize().height * 0.7));
    const entrance = await row.getAttribute("data-stage-progress");
    await scroll(top + 35);
    await expect
      .poll(() => row.getAttribute("data-stage-progress"))
      .not.toBe(entrance);
    await expect(row.locator(".work-project-action")).toBeInViewport();
    if ((await row.getAttribute("data-project-stage")) === "active") {
      expect((await row.boundingBox()).height).toBeGreaterThan(
        page.viewportSize().height,
      );
      const header = row.locator(".work-surface-header");
      const y = (await header.boundingBox()).y;
      await scroll(top + 75);
      expect(Math.abs((await header.boundingBox()).y - y)).toBeLessThan(3);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(page.viewportSize().width + 1);
    await page.screenshot({
      path: info.outputPath(
        `${await row.getAttribute("data-materia-surface")}-stage.png`,
      ),
    });
  }
  await page.locator("[data-motion-toggle]").click();
  await expect(page.locator("[data-project-stage]")).toHaveCount(0);
  for (const row of await rows.all())
    expect((await row.boundingBox()).height).toBeLessThan(520);
  expect(errors).toEqual([]);
});

test("repository descriptions respond to input type instead of viewport width", async ({
  page,
}, info) => {
  await page.goto("/");
  await page.locator("#github").scrollIntoViewIfNeeded();
  const row = page.locator("[data-repo-row]").first();
  await row.scrollIntoViewIfNeeded();
  if (info.project.name === "desktop") {
    await page.setViewportSize({ width: 700, height: 900 });
    await row.hover();
  } else {
    await row.click({ position: { x: 10, y: 15 } });
  }
  await expect(
    row.getByText(
      "Descripción de repositorio visible también en ventanas estrechas.",
    ),
  ).toBeVisible();
  await expect(row.getByText("TypeScript", { exact: true })).toBeVisible();
  await expect(row.getByText("CSS", { exact: true })).toBeVisible();
  await expect(row.getByText("HTML", { exact: true })).toBeVisible();
  await row.locator("a").first().focus();
  await expect(row.locator(".repo-description-panel > div")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
});

test("scroll studio navigation and Back preserve the document and collapsed scene", async ({
  page,
}) => {
  await page.goto("/");
  const row = page.locator('[data-materia-surface="ana-peluquera"]');
  await expect(row).toHaveAttribute("data-project-stage", /active|entry/);
  const top = await row.evaluate(
    (e) => e.getBoundingClientRect().top + scrollY,
  );
  await page.evaluate((target) => {
    window.__stageDocument = "preserved";
    window.__lenis
      ? window.__lenis.scrollTo(target, { immediate: true, force: true })
      : scrollTo(0, target);
  }, top + 35);
  const start = await page.evaluate(() => scrollY);
  await row.locator(".work-preview").click();
  await expect(page).toHaveURL(/\/work\/ana-peluquera$/);
  await expect(page.locator("[data-umbral-clone]")).toHaveCount(0);
  expect(await page.evaluate(() => window.__stageDocument)).toBe("preserved");
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(row).toHaveAttribute("data-expanded", "false");
  await expect(row).toHaveAttribute("data-project-stage", /active|entry/);
  await expect
    .poll(() => page.evaluate((saved) => Math.abs(scrollY - saved), start))
    .toBeLessThan(8);
  await expect(row.locator(".work-project-action")).toBeInViewport();
  expect(await page.evaluate(() => window.__stageDocument)).toBe("preserved");
  const details = row.getByRole("button", { name: "Detalles", exact: true });
  await details.click();
  await expect(row).toHaveAttribute("data-expanded", "true");
  await expect(row).not.toHaveAttribute("data-project-stage", /active|entry/);
  await expect(row.locator("[role=tabpanel]")).toBeVisible();
  expect(
    (await row.locator("[role=tabpanel]").boundingBox()).height,
  ).toBeLessThan(400);
  await details.click();
  await expect(row).toHaveAttribute("data-project-stage", /active|entry/);
  await page.setViewportSize({ width: page.viewportSize().width, height: 500 });
  await expect(page.locator('[data-project-stage="entry"]')).toHaveCount(5);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-project-stage]")).toHaveCount(0);
});
