import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (window.top !== window) return;
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

test("automatic technology orbits support keyboard and wheel, pause offscreen, and follow shared motion", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Orbit interaction coverage uses a fine pointer",
  );
  await page.addInitScript(() =>
    localStorage.setItem("portfolio-motion-enabled", "true"),
  );
  await page.goto("/");
  const card = page.locator("[data-skill-card]").first();
  await card.scrollIntoViewIfNeeded();
  const orbit = card.locator(".skill-orbit");
  await orbit.scrollIntoViewIfNeeded();
  await expect(orbit).toHaveAttribute("data-orbit-active", "true");
  const pill = orbit.locator("[data-orbit-pill]").first();
  await orbit.focus();
  // Focus temporarily stops automatic rotation so keyboard movement is clear.
  await expect
    .poll(async () => {
      const first = await pill.getAttribute("style");
      await page.waitForTimeout(120);
      return first === (await pill.getAttribute("style"));
    })
    .toBe(true);
  const focused = await pill.getAttribute("style");
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => pill.getAttribute("style")).not.toBe(focused);
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

  // Moving the orbit out of view stops its ticker and drops temporary layers.
  await page.locator("[data-motion-toggle]").focus();
  await page.evaluate(() =>
    window.__lenis
      ? window.__lenis.scrollTo(0, { immediate: true, force: true })
      : window.scrollTo(0, 0),
  );
  await expect
    .poll(() => pill.evaluate((element) => element.style.willChange))
    .toBe("");
  const offscreenStyle = await pill.getAttribute("style");
  await page.waitForTimeout(150);
  await expect(pill).toHaveAttribute("style", offscreenStyle);

  await orbit.scrollIntoViewIfNeeded();
  await expect.poll(() => pill.getAttribute("style")).not.toBe(offscreenStyle);
  await page.locator("[data-motion-toggle]").click();
  await expect(page.locator("[data-motion-toggle]")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await expect(page.locator("[data-orbit-active]")).toHaveCount(0);
  for (const chip of await card.locator("[data-orbit-pill]").all()) {
    await expect(chip).toBeVisible();
    await expect
      .poll(() => chip.evaluate((element) => element.style.cssText))
      .toBe("");
    await expect(chip).toHaveCSS("transform", "none");
    await expect(chip).toHaveCSS("opacity", "1");
  }
  await page.locator("[data-motion-toggle]").click();
  await expect(page.locator("[data-motion-toggle]")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(orbit).toHaveAttribute("data-orbit-active", "true");
});

test("contact magnet, letter lighting and project depth recover after interruption", async ({
  page,
}, info) => {
  await page.goto("/");
  const contact = page.locator("[data-magnetic-contact]");
  if (
    !(await page.evaluate(
      () => matchMedia("(hover: hover) and (pointer: fine)").matches,
    ))
  ) {
    await expect(contact).toHaveCSS("transform", "none");
    await contact.click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator("#contact")).toBeFocused();
    await expect(page.locator(".contact-email")).toBeVisible();
    return;
  }
  await contact.scrollIntoViewIfNeeded();
  const box = await contact.boundingBox();
  await contact.hover({ position: { x: box.width / 2, y: 2 } });
  await expect
    .poll(() =>
      contact.evaluate(
        (el) => new DOMMatrix(getComputedStyle(el).transform).m42,
      ),
    )
    .toBeLessThan(-0.5);
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
  await row.locator("button[aria-expanded]").click();
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
  const motionState = await page.evaluate(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = matchMedia(
      "(hover: none), (pointer: coarse), (max-width: 767px)",
    ).matches;
    return { reduced, lightweight: touch };
  });

  if (!motionState.reduced && !motionState.lightweight) {
    await expect(page.locator("canvas[data-materia-renderer]")).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => window.__helixShaders.length))
      .toBeGreaterThan(0);
    expect(
      await page.evaluate(() => window.__helixShaders.every(Boolean)),
    ).toBe(true);
  } else {
    await expect(page.locator("canvas[data-materia-renderer]")).toHaveCount(0);
    await expect(page.locator("[data-dna-static]")).toBeVisible();
  }
  await page.screenshot({ path: info.outputPath("living-dna.png") });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("canvas[data-materia-renderer]")).toHaveCount(0);
  await expect(page.locator("[data-dna-static]")).toBeVisible();
  await expect(page.locator("[data-orbit-active]")).toHaveCount(0);
  expect(errors).toEqual([]);
});
