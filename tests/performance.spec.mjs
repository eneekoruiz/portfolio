import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", {
      get: () => 16,
      configurable: true,
    });
    Object.defineProperty(navigator, "deviceMemory", {
      get: () => 8,
      configurable: true,
    });
  });
});

test("first visit shows content without an intro or GitHub request", async ({
  page,
}, info) => {
  let github = 0;
  const errors = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/github/")) github++;
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("#hero h1")).toBeVisible();
  await expect(page.locator('#hero a[href="#work"]')).toBeVisible();
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.locator(".identity-splash, #preloader")).toHaveCount(0);
  await page.waitForTimeout(1500);
  expect(github).toBe(0);
  const result = await page.evaluate(() => ({
    viewport: innerWidth,
    width: document.documentElement.scrollWidth,
    contact: !!document.querySelector('a[href^="mailto:"]'),
    sections: [...document.querySelectorAll("main > section")].map((e) => e.id),
    ttfb: performance.getEntriesByType("navigation")[0].responseStart,
    domReady:
      performance.getEntriesByType("navigation")[0].domContentLoadedEventEnd,
  }));
  expect(result.width).toBeLessThanOrEqual(page.viewportSize().width + 1);
  expect(result.sections.slice(0, 2)).toEqual(["hero", "work"]);
  expect(result.contact).toBe(true);
  expect(errors).toEqual([]);
  await info.attach("local-navigation", {
    body: JSON.stringify(result),
    contentType: "application/json",
  });
  await page.screenshot({ path: info.outputPath("hero.png") });
});

test("lightweight and reduced motion never allocate a WebGL canvas or fetch hidden video", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const videos = [];
  page.on("request", (r) => {
    if (r.url().endsWith("memoji.webm")) videos.push(r.url());
  });
  // A stored opt-in must not override the operating system accessibility preference.
  await page.addInitScript(() =>
    localStorage.setItem("portfolio-motion-enabled", "true"),
  );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await page.waitForTimeout(1500);
  await expect(page.locator(".materia-canvas canvas")).toHaveCount(0);
  await expect(page.locator("[data-dna-static]")).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.getAnimations().filter((a) => a.playState === "running")
          .length,
    ),
  ).toBe(0);
  expect(videos).toHaveLength(0);
  await expect(page.locator("main > header")).toBeVisible();
  const bounds = await page.locator("main > header").boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(
    page.viewportSize().width + 1,
  );
});

test("mobile and modest devices start with static decoration and readable skills", async ({
  page,
}, info) => {
  if (info.project.name === "desktop")
    await page.addInitScript(() =>
      Object.defineProperty(navigator, "deviceMemory", {
        get: () => 2,
        configurable: true,
      }),
    );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect(page.locator(".materia-canvas canvas")).toHaveCount(0);
  const skills = page.locator("#skills");
  await skills.scrollIntoViewIfNeeded();
  await expect(skills.locator("[data-orbit-active]")).toHaveCount(0);
  for (const text of ["Python", "Java", "Node.js", "React", "TypeScript"])
    await expect(skills.getByText(text, { exact: true })).toBeVisible();
});

test("optional activity loads on approach and failure preserves featured work and contact", async ({
  page,
}) => {
  let calls = 0;
  await page.route("**/api/github/repos?**", async (route) => {
    calls++;
    await route.fulfill({ status: 503, body: "{}" });
  });
  await page.goto("/");
  expect(calls).toBe(0);
  await page.locator("#github").scrollIntoViewIfNeeded();
  await expect.poll(() => calls).toBe(1);
  await expect(
    page.locator('#github a[href="https://github.com/eneekoruiz"]').first(),
  ).toBeVisible();
  await expect(page.locator("[data-project-title]")).toHaveCount(5);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(
    page.locator('#contact a[href^="mailto:"]').first(),
  ).toBeVisible();
});

test("content and contact survive disabled JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:3100/");
  await expect(page.locator("#hero h1")).toBeVisible();
  await expect(page.locator("[data-project-title]")).toHaveCount(5);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(
    page.locator('#contact a[href^="mailto:"]').first(),
  ).toBeVisible();
  await context.close();
});

test("project accordion, route and native back remain usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const button = page.locator("#btn-ana-peluquera");
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page
    .locator('#panel-ana-peluquera a[href="/work/ana-peluquera"]')
    .click();
  await expect(page).toHaveURL(/\/work\/ana-peluquera$/);
  await expect(
    page.locator('[data-project-visual][data-preview-kind="capture"]').first(),
  ).toBeVisible();
  await page.goBack();
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.locator("#btn-ana-peluquera")).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});

test("desktop scene stops drawing when its hero leaves the viewport", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.addInitScript(() => {
    window.__draws = 0;
    for (const name of [
      "drawArrays",
      "drawElements",
      "drawArraysInstanced",
      "drawElementsInstanced",
    ]) {
      const original = WebGL2RenderingContext.prototype[name];
      WebGL2RenderingContext.prototype[name] = function (...args) {
        window.__draws++;
        return original.apply(this, args);
      };
    }
  });
  await page.goto("/");
  await expect(page.locator(".materia-canvas canvas")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.__draws))
    .toBeGreaterThan(0);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator(".materia-canvas")).toHaveAttribute(
    "data-scene-active",
    "false",
  );
  await page.waitForTimeout(700);
  const draws = await page.evaluate(() => window.__draws);
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => window.__draws)).toBe(draws);
  await page.locator("[data-motion-toggle]").click();
  await expect(page.locator(".materia-canvas canvas")).toHaveCount(0);
});
