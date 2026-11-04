import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

const letters = (page) =>
  page.locator(".hero-name [data-shock-line]:visible [data-char]");

test("the welcome has its own screen and is blown open into the hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".overture")).toBeVisible();
  // Nothing of the poster shows through the welcome screen.
  const covered = await page.evaluate(() => {
    const overture = document.querySelector(".overture");
    const rect = overture.getBoundingClientRect();
    return rect.width >= innerWidth && rect.height >= innerHeight;
  });
  expect(covered).toBe(true);
  // At the instant of the blast the name is not there yet: the fireworks uncover it.
  const atBlast = await page.evaluate(
    () =>
      new Promise((resolve) => {
        window.addEventListener(
          "overture-impact",
          () => {
            const chars = [...document.querySelectorAll(".hero-name [data-shock-line] [data-char]")]
              .filter((c) => c.offsetParent);
            resolve(chars.map((c) => Number(getComputedStyle(c).opacity)));
          },
          { once: true },
        );
      }),
  );
  expect(atBlast.length).toBeGreaterThan(5);
  expect(Math.max(...atBlast)).toBe(0);
  // Then the opening finishes by itself and leaves the full name.
  await expect(page.locator("#hero")).not.toHaveAttribute("data-cinematic", "", { timeout: 20000 });
  await expect(page.locator(".overture")).toHaveCount(0);
  const after = await letters(page).evaluateAll((chars) =>
    chars.map((c) => Number(getComputedStyle(c).opacity)),
  );
  expect(Math.min(...after)).toBe(1);
});

test("any key skips straight to the finished hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".overture")).toBeVisible();
  await page.waitForTimeout(400);
  await page.keyboard.press("Escape");
  await expect(page.locator("#hero")).not.toHaveAttribute("data-cinematic", "", { timeout: 5000 });
  await expect(page.locator(".overture")).toHaveCount(0);
  const after = await letters(page).evaluateAll((chars) =>
    chars.map((c) => Number(getComputedStyle(c).opacity)),
  );
  expect(Math.min(...after)).toBe(1);
  await expect(page.locator("#hero .hero-actions")).toBeVisible();
});

test("the name spans the whole measure at this size", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Escape");
  await expect(page.locator("#hero")).not.toHaveAttribute("data-cinematic", "", { timeout: 5000 });
  await page.waitForTimeout(500);
  const fit = await page.evaluate(() => {
    const lines = [...document.querySelectorAll(".hero-name [data-shock-line]")].filter((l) => l.offsetParent);
    const box = document.querySelector(".hero-name").getBoundingClientRect();
    return lines.map((l) => ({ line: l.getBoundingClientRect().width, box: box.width, right: l.getBoundingClientRect().right }));
  });
  expect(fit.length).toBeGreaterThan(0);
  for (const line of fit) {
    expect(line.line).toBeGreaterThan(line.box * 0.94);
    expect(line.right).toBeLessThanOrEqual(page.viewportSize().width + 1);
  }
});

test("the OS reduced-motion flag still plays the opening", async ({ browser }) => {
  // Windows' "best performance" profile reports reduce; it must not pause the site.
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".overture")).toBeVisible();
  await expect(page.locator("[data-motion-toggle]")).toHaveAttribute("aria-pressed", "true");
  await context.close();
});

test("motion paused for the visit gets the poster at once, without the opening", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript(() => sessionStorage.setItem("portfolio-motion-enabled", "false"));
  await page.goto("/");
  await expect(page.locator(".overture")).toBeHidden();
  await expect(page.locator("#hero")).not.toHaveAttribute("data-cinematic", "", { timeout: 5000 });
  const after = await letters(page).evaluateAll((chars) =>
    chars.map((c) => Number(getComputedStyle(c).opacity)),
  );
  expect(Math.min(...after)).toBe(1);
  await context.close();
});
