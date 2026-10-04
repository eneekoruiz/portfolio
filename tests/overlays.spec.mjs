import { test, expect } from "@playwright/test";
import { UI_COPY } from "../app/data/interface-translations.ts";
import { COMMAND_COPY } from "../app/data/command-translations.ts";

test.use({ reducedMotion: "reduce" });
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("portfolio_lang", "es"));
});

test("security headers reach pages and invalid API responses", async ({
  page,
  request,
}) => {
  const response = await page.goto("/");
  const headers = response.headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(headers["content-security-policy"]).toMatch(/script-src[^;]*'nonce-/);
  const invalid = await request.get("/api/github/repos?per_page=12junk");
  expect(invalid.status()).toBe(400);
  expect(invalid.headers()["cache-control"]).toBe("no-store");
  expect(invalid.headers()["x-content-type-options"]).toBe("nosniff");
});

test("command palette restores inline styles and focus through rapid close and reopen", async ({
  page,
}, info) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const trigger = page
    .locator("header")
    .getByRole("button", { name: UI_COPY.es.search, exact: true });
  await page.evaluate(() => {
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "7px";
    document.body.style.touchAction = "pan-y";
  });
  const height = await page.evaluate(() => document.body.scrollHeight);
  await trigger.click();
  const palette = page.locator(".cmd-overlay");
  const input = palette.getByRole("searchbox");
  await expect(input).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  expect(await page.evaluate(() => document.body.scrollHeight)).toBe(height);
  expect(await palette.evaluate((el) => getComputedStyle(el).opacity)).toBe(
    "1",
  );
  await input.fill("not-a-section");
  await expect(
    palette.getByText(COMMAND_COPY.es.noResults, { exact: true }).last(),
  ).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await input.fill("");
  await page.keyboard.press("Escape");
  await expect(palette).toHaveCount(0);
  await expect(trigger).toBeFocused();
  for (let index = 0; index < 3; index++) {
    await page.keyboard.press("Control+k");
    await expect(input).toBeFocused();
    await page.keyboard.press("Escape");
  }
  await expect
    .poll(() =>
      page.evaluate(() => ({
        overflow: document.body.style.overflow,
        padding: document.body.style.paddingRight,
        touch: document.body.style.touchAction,
        height: document.body.style.height,
      })),
    )
    .toEqual({ overflow: "auto", padding: "7px", touch: "pan-y", height: "" });
  await expect(trigger).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await trigger.click();
  await expect(input).toBeFocused();
  await page.screenshot({ path: info.outputPath("command-palette.png") });
});

test("command navigation moves focus after unlocking and localizes empty search", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  const palette = page.locator(".cmd-overlay");
  const input = palette.getByRole("searchbox");
  await expect(input).toBeFocused();
  await input.fill("contacto");
  await page.keyboard.press("Enter");
  await expect(palette).toHaveCount(0);
  await expect(page.locator("#contact")).toBeFocused();
  await expect(page).toHaveURL(/#contact$/);
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("");
  for (const lang of ["en", "eu", "ar", "ja"]) {
    await page.keyboard.press("Control+k");
    await expect(input).toBeFocused();
    await input.fill(
      lang === "en"
        ? "english"
        : lang === "eu"
          ? "euskera"
          : lang === "ar"
            ? "عربية"
            : "日本語",
    );
    await page.keyboard.press("Enter");
    await expect(palette).toHaveCount(0);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await page.keyboard.press("Control+k");
    await expect(input).toBeFocused();
    await input.fill("zzzz-invalid");
    await expect(
      palette.getByText(COMMAND_COPY[lang].noResults, { exact: true }).last(),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await page.keyboard.press("Escape");
  }
});

test.describe("background work behind a dialog", () => {
  test.use({ reducedMotion: "no-preference" });
  test("command pauses actual WebGL draws and resumes the same canvas", async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== "desktop",
      "Fine-pointer WebGL rendering coverage.",
    );
    await page.addInitScript(() => {
      localStorage.setItem("portfolio-motion-enabled", "true");
      Object.defineProperty(navigator, "hardwareConcurrency", {
        get: () => 16,
      });
      Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
      window.__overlayDraws = 0;
      for (const context of [
        window.WebGLRenderingContext,
        window.WebGL2RenderingContext,
      ]) {
        if (!context) continue;
        for (const name of [
          "drawArrays",
          "drawElements",
          "drawArraysInstanced",
          "drawElementsInstanced",
        ]) {
          const original = context.prototype[name];
          if (!original) continue;
          context.prototype[name] = function (...args) {
            window.__overlayDraws++;
            return original.apply(this, args);
          };
        }
      }
    });
    await page.goto("/");
    const scene = page.locator(".materia-canvas");
    await expect
      .poll(() => page.evaluate(() => window.__overlayDraws))
      .toBeGreaterThan(0);
    const canvas = await scene.locator("canvas").elementHandle();
    expect(canvas).not.toBeNull();
    await page.keyboard.press("Control+k");
    await expect(page.locator(".cmd-overlay input")).toBeFocused();
    await expect(scene).toHaveAttribute("data-scene-active", "false");
    await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
    // Drain the render already scheduled before the shared policy changed.
    await page.waitForTimeout(250);
    const paused = await page.evaluate(() => window.__overlayDraws);
    await page.waitForTimeout(350);
    expect(await page.evaluate(() => window.__overlayDraws)).toBe(paused);
    expect(await canvas.evaluate((element) => element.isConnected)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(page.locator(".cmd-overlay")).toHaveCount(0);
    await expect(scene).toHaveAttribute("data-scene-active", "true");
    await expect
      .poll(() => page.evaluate(() => window.__overlayDraws))
      .toBeGreaterThan(paused);
    expect(
      await scene
        .locator("canvas")
        .evaluate((element, original) => element === original, canvas),
    ).toBe(true);
  });
});
