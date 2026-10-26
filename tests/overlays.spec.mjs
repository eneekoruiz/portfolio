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

