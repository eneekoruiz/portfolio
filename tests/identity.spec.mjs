import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (window.top !== window) return;
    sessionStorage.setItem("hasSeenIntro", "true");
    localStorage.setItem("portfolio_lang", "es");
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 16 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
    window.__kineticMotionSeen = false;
    new MutationObserver((records) => {
      for (const record of records) {
        if (
          record.target instanceof HTMLElement &&
          record.target.matches(
            "[data-kinetic-interactive] [data-kinetic-char]",
          ) &&
          record.target.style.transform.includes("rotateX(")
        )
          window.__kineticMotionSeen = true;
      }
    }).observe(document, {
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });
  });
});

test("technology cards keep moving pills, pause without jumping and support drag", async ({
  page,
}, info) => {
  await page.goto("/");
  const card = page.locator("[data-skill-card]").first();
  await card.scrollIntoViewIfNeeded();
  const orbit = card.locator("[data-orbit-active]");
  await expect(orbit).toBeVisible();
  const pill = orbit.locator("[data-orbit-pill]").first();
  const initial = await pill.getAttribute("style");
  await expect.poll(() => pill.getAttribute("style")).not.toBe(initial);
  await card.getByRole("button", { name: "Pausar Backend" }).click();
  await expect(
    card.getByRole("button", { name: "Reanudar Backend" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(async () => {
      const first = await pill.getAttribute("style");
      await page.waitForTimeout(120);
      return (await pill.getAttribute("style")) === first;
    })
    .toBe(true);
  const paused = await pill.getAttribute("style");
  const box = await orbit.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 65, box.y + box.height / 2, {
    steps: 8,
  });
  await page.mouse.up();
  await expect.poll(() => pill.getAttribute("style")).not.toBe(paused);
  await page.screenshot({ path: info.outputPath("technology-orbits.png") });
});

test("hero unveils on touch and pointer letters recover after interrupted hover", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect
    .poll(() => page.evaluate(() => window.__kineticMotionSeen))
    .toBe(true);
  if (info.project.name === "desktop") {
    const letter = page.locator("#hero [data-kinetic-char]").first();
    await expect
      .poll(() => letter.evaluate((el) => el.style.willChange))
      .toBe("");
    const resting = await letter.getAttribute("style");
    await letter.hover();
    await expect.poll(() => letter.getAttribute("style")).not.toBe(resting);
    await page.mouse.move(3, 3);
    await expect.poll(() => letter.getAttribute("style")).toBe(resting);
  }
  await page.screenshot({ path: info.outputPath("hero-identity.png") });
});

test("lite mode retains rendered DNA and reduced motion retains a static silhouette", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/?lite=1");
  await expect(
    page.locator('canvas[data-materia-renderer="direct"]'),
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("canvas[data-materia-renderer]")).toHaveCount(0);
  await expect(page.locator("[data-dna-static]")).toBeVisible();
  await expect(page.locator("[data-orbit-active]")).toHaveCount(0);
  const card = page.locator("[data-skill-card]").first();
  await card.scrollIntoViewIfNeeded();
  for (const pill of await card.locator("[data-orbit-pill]").all())
    await expect(pill).toBeVisible();
  expect(errors).toEqual([]);
});

test("project opens into a reversible 3D studio scroll journey", async ({
  page,
}, info) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const row = page.locator('[data-materia-surface="ana-peluquera"]');
  await row.locator("button").click();
  if (info.project.name === "desktop") {
    await row.getByRole("link", { name: "Explorar proyecto" }).hover();
    await expect(page.locator("#project-preview-follower")).toBeVisible();
  }
  await row.getByRole("link", { name: "Explorar proyecto" }).click();
  await expect(page).toHaveURL(/\/work\/ana-peluquera/);
  await expect(page.locator("html")).not.toHaveAttribute("data-umbral");
  const screen = page.locator('[data-studio-screen="cinematic"]');
  await expect(screen).toHaveCount(1);
  await expect(page.locator("[data-project-atmosphere]")).toHaveCount(1);
  await page.evaluate(() =>
    window.__lenis
      ? window.__lenis.scrollTo(innerHeight * 2.4, {
          immediate: true,
          force: true,
        })
      : window.scrollTo(0, innerHeight * 2.4),
  );
  await expect
    .poll(() => screen.evaluate((el) => Number(getComputedStyle(el).opacity)))
    .toBeGreaterThan(0.95);
  await expect
    .poll(() =>
      screen.evaluate((el) => el.getBoundingClientRect().width / innerWidth),
    )
    .toBeGreaterThan(0.7);
  await expect(
    screen
      .getByText("Entrar al Estudio", { exact: true })
      .filter({ visible: true }),
  ).toBeVisible();
  await expect(
    screen.getByRole("link", { name: "Ver proyecto en directo" }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath("studio-depth.png") });
  await page.evaluate(() =>
    window.__lenis
      ? window.__lenis.scrollTo(0, { immediate: true, force: true })
      : window.scrollTo(0, 0),
  );
  await expect
    .poll(() => screen.evaluate((el) => Number(getComputedStyle(el).opacity)))
    .toBeLessThan(0.05);
  expect(errors).toEqual([]);
});

test("restored philosophy navigation, particles and contact card springs", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(page.locator('a[href="#values"]').first()).toHaveCount(1);
  const values = page.locator("#values");
  await values.scrollIntoViewIfNeeded();
  await expect(values.locator("[data-bento-visual]")).toHaveCount(6);
  await expect(page.locator("[data-network-particles]")).toHaveCount(2);
  await page.screenshot({ path: info.outputPath("philosophy-bento.png") });
  const copy = page.getByRole("button", { name: "Copiar correo", exact: true });
  await copy.scrollIntoViewIfNeeded();
  if (info.project.name === "desktop") {
    const face = copy.locator("[data-contact-flip]");
    await page.mouse.move(2, 2);
    await expect
      .poll(() => face.evaluate((el) => el.style.willChange))
      .toBe("");
    await copy.hover();
    await expect
      .poll(() => face.evaluate((el) => el.style.transform))
      .toContain("rotateY(180deg)");
    await page.mouse.move(2, 2);
    await expect
      .poll(() => face.evaluate((el) => el.style.transform))
      .toContain("rotateY(0deg)");
  }
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.__copiedEmail = text;
        },
      },
    }),
  );
  await copy.click();
  await expect(page.locator('#contact [role="status"]')).toHaveText(
    "Correo copiado.",
  );
  expect(await page.evaluate(() => window.__copiedEmail)).toBe(
    "eneekoruiz@gmail.com",
  );
  await expect(
    page.locator('#hero [data-signature-link="cv"]'),
  ).toHaveAttribute("href", "/curriculum");
  await page.screenshot({ path: info.outputPath("contact-cards.png") });
});
