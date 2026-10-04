import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });
test.beforeEach(async ({ page }) => {
  await page.route("**/api/github/repos?**", (route) =>
    route.fulfill({ json: [] }),
  );
});

test("editorial composition remains readable and usable in both themes", async ({
  page,
}, info) => {
  const errors = [];
  const assets = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (
      response.status() >= 400 &&
      /\.(woff2|webp|jpg|svg|webm)(\?|$)/.test(response.url())
    )
      assets.push(response.url());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  for (const theme of ["light", "dark"]) {
    await page.evaluate((value) => {
      document.documentElement.classList.toggle("dark", value === "dark");
      document.documentElement.classList.toggle("light", value === "light");
    }, theme);
    for (const id of ["hero", "expertise", "work", "about", "contact"]) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(page.viewportSize().width + 1);
      for (const heading of await section.locator("h1,h2,h3").all()) {
        const dimensions = await heading.evaluate((element) => ({
          scroll: element.scrollWidth,
          width: element.clientWidth,
        }));
        expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.width + 2);
      }
      if (id === "expertise" && page.viewportSize().width >= 640) {
        const baselines = await section
          .locator("h3")
          .evaluateAll((headings) =>
            headings.map((heading) => heading.getBoundingClientRect().top),
          );
        expect(Math.max(...baselines) - Math.min(...baselines)).toBeLessThan(2);
      }
      await section.screenshot({ path: info.outputPath(`${id}-${theme}.png`) });
    }
  }
  const row = page.locator('[data-materia-surface="rides24ofiziala"]');
  const toggle = row.locator("button[aria-expanded]");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(row.locator('[role="region"]')).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  const tabs = row.locator('[role="tab"]');
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".contact-email")).toHaveAttribute(
    "href",
    "mailto:eneekoruiz@gmail.com",
  );
  await expect(page.locator('#contact a[href="/curriculum"]')).toHaveCount(1);
  expect(errors).toEqual([]);
  expect(assets).toEqual([]);
});

test("long labels and RTL preserve the editorial grid without overflow", async ({
  page,
}) => {
  for (const lang of ["de", "ar"]) {
    await page.addInitScript(
      (value) => localStorage.setItem("portfolio_lang", value),
      lang,
    );
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("html")).toHaveAttribute(
      "dir",
      lang === "ar" ? "rtl" : "ltr",
    );
    for (const id of ["hero", "expertise", "work", "about", "contact"]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(page.viewportSize().width + 1);
    }
  }
});
