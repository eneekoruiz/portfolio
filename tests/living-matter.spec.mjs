import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (window.top !== window) return;
    sessionStorage.setItem("hasSeenIntro", "true");
    localStorage.setItem("portfolio_lang", "es");
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 16 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
    window.__helixShaders = [];
    const prototype = WebGL2RenderingContext.prototype;
    const compile = prototype.compileShader;
    prototype.compileShader = function (shader) {
      compile.call(this, shader);
      if (this.getShaderSource(shader)?.includes("uHelixEnergy"))
        window.__helixShaders.push(
          this.getShaderParameter(shader, this.COMPILE_STATUS),
        );
    };
  });
});

test("wheel and keyboard explore paused technology orbits without trapping page scroll", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator("[data-skill-card]").first();
  await card.scrollIntoViewIfNeeded();
  await card.getByRole("button", { name: "Pausar Backend" }).click();
  const orbit = card.locator("[data-orbit-active]");
  const pill = orbit.locator("[data-orbit-pill]").first();
  await orbit.focus();
  const paused = await pill.getAttribute("style");
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => pill.getAttribute("style")).not.toBe(paused);
  await expect
    .poll(async () => {
      const first = await pill.getAttribute("style");
      await page.waitForTimeout(120);
      return first === (await pill.getAttribute("style"));
    })
    .toBe(true);
  const beforeWheel = await pill.getAttribute("style");
  const scroll = await page.evaluate(() => scrollY);
  await orbit.hover();
  await page.mouse.wheel(0, 160);
  await expect.poll(() => pill.getAttribute("style")).not.toBe(beforeWheel);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(scroll + 20);
  await expect(
    card.getByRole("button", { name: "Reanudar Backend" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("contact magnet, letter lighting and project depth recover after interruption", async ({
  page,
}, info) => {
  test.skip(
    info.project.name === "mobile",
    "Proximity lighting and magnetic attraction require a fine pointer.",
  );
  await page.goto("/");
  const contact = page.locator("[data-magnetic-contact]");
  await contact.scrollIntoViewIfNeeded();
  const box = await contact.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y - 70);
  await expect
    .poll(() =>
      contact.evaluate(
        (el) => new DOMMatrix(getComputedStyle(el).transform).m42,
      ),
    )
    .toBeLessThan(-3);
  await page.locator('#hero [data-signature-link="work"]').hover();
  await expect
    .poll(() => contact.evaluate((el) => el.style.willChange))
    .toBe("");
  expect(
    await contact.evaluate(
      (el) => new DOMMatrix(getComputedStyle(el).transform).m42,
    ),
  ).toBe(0);
  const name = page.locator("[data-kinetic-interactive]").first();
  await name.hover();
  await expect
    .poll(() =>
      name.evaluate((el) => Number(el.style.getPropertyValue("--type-light"))),
    )
    .toBeGreaterThan(0.8);
  await page.screenshot({ path: info.outputPath("name-light.png") });
  await page.mouse.move(2, 2);
  await expect
    .poll(() =>
      name.evaluate((el) => Number(el.style.getPropertyValue("--type-light"))),
    )
    .toBe(0);
  const row = page.locator('[data-materia-surface="ana-peluquera"]');
  await row.scrollIntoViewIfNeeded();
  const title = row.locator("[data-project-title]");
  await title.hover({ position: { x: 15, y: 20 } });
  await expect
    .poll(() =>
      row.evaluate((el) => Number(el.style.getPropertyValue("--work-energy"))),
    )
    .toBeGreaterThan(0.8);
  await row.dispatchEvent("pointercancel", { pointerType: "mouse" });
  await page.mouse.move(2, 2);
  await expect.poll(() => title.evaluate((el) => el.style.willChange)).toBe("");
  expect(await title.evaluate((el) => el.style.transform)).toContain(
    "rotateY(0deg)",
  );
  await row.locator("button").click();
  await page.screenshot({ path: info.outputPath("selected-work-depth.png") });
});

test("helix signal compiles in both render profiles and motion preferences release the GPU", async ({
  page,
}, info) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.locator("canvas[data-materia-renderer]")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.__helixShaders.length))
    .toBeGreaterThan(0);
  expect(await page.evaluate(() => window.__helixShaders.every(Boolean))).toBe(
    true,
  );
  await page.screenshot({ path: info.outputPath("living-dna.png") });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("canvas[data-materia-renderer]")).toHaveCount(0);
  await expect(page.locator("[data-dna-static]")).toBeVisible();
  await expect(page.locator("[data-orbit-active]")).toHaveCount(0);
  expect(errors).toEqual([]);
});
