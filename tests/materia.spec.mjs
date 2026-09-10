import { test as base, expect } from "@playwright/test";

const test = base.extend({
  consoleErrors: [
    async ({ page }, use) => {
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await use(errors);
      expect(errors, "No client errors or failed shader compilation").toEqual(
        [],
      );
    },
    { auto: true },
  ],
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (window.top !== window) return;
    sessionStorage.setItem("hasSeenIntro", "true");
    localStorage.setItem("portfolio_lang", "es");
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 16 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
  });
});

async function home(page) {
  await page.goto("/");
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.locator("#hero h1")).toHaveText("EnekoEnekoRuiz.Ruiz.");
  if (
    !(await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ))
  ) {
    await expect(
      page.locator(".materia-canvas canvas[data-materia-renderer]"),
    ).toBeVisible();
  }
}

async function openFirstProject(page) {
  const row = page.locator('[data-materia-surface="ana-peluquera"]');
  await row.locator("button").click();
  await expect(row.locator("button")).toHaveAttribute("aria-expanded", "true");
  await expect(
    row.getByRole("link", { name: "Explorar proyecto" }),
  ).toBeVisible();
  return row;
}

test("readable hero, local variable font and bounded layout", async ({
  page,
}, testInfo) => {
  await home(page);
  await expect
    .poll(() =>
      page.evaluate(() => document.fonts.check('850 90px "Materia Sans"')),
    )
    .toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await expect(
    page.locator("#hero").getByRole("link", { name: "Ver proyectos" }),
  ).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("hero.png") });
});

test("accordion survives repeated reversals and closes its focusable content", async ({
  page,
}, testInfo) => {
  await home(page);
  const row = await openFirstProject(page);
  for (let i = 0; i < 5; i++) await row.locator("button").click();
  await expect(row.locator("button")).toHaveAttribute("aria-expanded", "false");
  await expect(row.locator("[data-project-body]")).toHaveAttribute("inert", "");
  await expect
    .poll(() =>
      row
        .locator("[data-project-body]")
        .evaluate((el) => el.getBoundingClientRect().height),
    )
    .toBe(0);
  await row.locator("button").click();
  await expect(
    row.getByRole("link", { name: "Explorar proyecto" }),
  ).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("expanded-project.png") });
});

test("project navigation keeps the document and the canvas; browser Back restores the row", async ({
  page,
}, testInfo) => {
  await home(page);
  const row = await openFirstProject(page);
  await page.evaluate(() => {
    window.__auditDocument = "persistent";
    window.__auditCanvas = document.querySelector(".materia-canvas canvas");
  });
  await row.getByRole("link", { name: "Explorar proyecto" }).click();
  await expect(page).toHaveURL(/\/work\/ana-peluquera$/);
  await expect(page.locator("[data-umbral-destination] h1")).toHaveText(
    "AG Beauty Salon",
  );
  await expect(page.locator(".umbral-surface")).toBeHidden();
  expect(await page.evaluate(() => window.__auditDocument)).toBe("persistent");
  expect(
    await page.evaluate(
      () =>
        window.__auditCanvas ===
        document.querySelector(".materia-canvas canvas"),
    ),
  ).toBe(true);
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .not.toBe("hidden");
  await page.screenshot({ path: testInfo.outputPath("detail.png") });
  await page.goBack();
  await expect(page.locator("#btn-ana-peluquera")).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await expect(
    page
      .locator("#panel-ana-peluquera")
      .getByRole("link", { name: "Explorar proyecto" }),
  ).toBeVisible();
});

test("Spanish and English controls update together", async ({ page }) => {
  await home(page);
  await page.getByRole("button", { name: /^Idioma:/ }).click();
  await page.getByRole("menuitem", { name: "English", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.locator("#hero").getByRole("link", { name: "See work" }),
  ).toBeVisible();
  const row = page.locator('[data-materia-surface="ana-peluquera"]');
  await row.locator("button").click();
  await expect(
    row.getByRole("link", { name: "Explore project" }),
  ).toBeVisible();
  await expect(row.getByText("From concept to production")).toBeVisible();
});

test("reduced motion renders readable text and immediate project navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await home(page);
  await expect(page.locator(".materia-canvas canvas")).toHaveCount(0);
  const row = await openFirstProject(page);
  await row.getByRole("link", { name: "Explorar proyecto" }).click();
  await expect(page).toHaveURL(/\/work\/ana-peluquera$/);
  await expect(page.locator(".umbral-surface")).toBeHidden();
  await expect(page.locator(".materia-canvas canvas")).toHaveCount(0);
  await expect(
    page.locator('iframe[src="https://agpeluqueria.vercel.app"]'),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Ver proyecto en directo", exact: true }),
  ).toHaveAttribute("href", /agpeluqueria\.vercel\.app/);
});

test("native fallback works without View Transitions", async ({ page }) => {
  await page.addInitScript(() => {
    document.startViewTransition = undefined;
  });
  await home(page);
  const row = await openFirstProject(page);
  await row.getByRole("link", { name: "Explorar proyecto" }).click();
  await expect(page).toHaveURL(/\/work\/ana-peluquera$/);
  await expect(page.locator(".umbral-surface")).toBeHidden();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .not.toBe("hidden");
});

test("rapid pointer exits never hide the project action", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Precise pointer interaction");
  await home(page);
  const row = await openFirstProject(page);
  const action = row.getByRole("link", { name: "Explorar proyecto" });
  for (let i = 0; i < 3; i++) {
    await action.hover();
    await page.mouse.move(1, 1);
  }
  await expect(action).toHaveCSS("opacity", "1");
  await expect
    .poll(() =>
      action.evaluate(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a,
      ),
    )
    .toBeCloseTo(1, 2);
  await action.click();
  await expect(page).toHaveURL(/\/work\/ana-peluquera$/);
});

test("Escape during an expanding project releases navigation locks", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Mobile uses immediate navigation");
  await home(page);
  const row = await openFirstProject(page);
  await row.getByRole("link", { name: "Explorar proyecto" }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator(".umbral-surface")).toBeHidden();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .not.toBe("hidden");
});

test("dark theme and animation preference keep content readable", async ({
  page,
}, testInfo) => {
  await home(page);
  await page.getByRole("button", { name: "Cambiar tema", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-transition",
    "eclipse",
  );
  await page.screenshot({ path: testInfo.outputPath("hero-dark.png") });
  await page
    .getByRole("button", { name: "Pausar animación de fondo", exact: true })
    .click();
  await expect(page.locator(".materia-canvas canvas")).toHaveCount(0);
  await expect(page.locator("#main-content")).toBeVisible();
  const row = await openFirstProject(page);
  await row.getByRole("link", { name: "Explorar proyecto" }).click();
  await expect(page).toHaveURL(/\/work\/ana-peluquera$/);
  await expect(page.locator(".umbral-surface")).toBeHidden();
});

test("first visit with reduced motion reaches readable content", async ({
  browser,
}, testInfo) => {
  const profile = testInfo.project.use;
  const context = await browser.newContext({
    viewport: profile.viewport,
    isMobile: profile.isMobile,
    hasTouch: profile.hasTouch,
    userAgent: profile.userAgent,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    await page.goto("http://localhost:3100/");
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(page.locator("#hero h1")).toHaveText("EnekoEnekoRuiz.Ruiz.");
    await expect(page.locator(".materia-canvas canvas")).toHaveCount(0);
    expect(errors).toEqual([]);
  } finally {
    await context.close();
  }
});
