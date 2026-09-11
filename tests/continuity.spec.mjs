import { test, expect } from "@playwright/test";

test("404 retains its magnetic return link and native home navigation", async ({
  page,
}, info) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("hasSeenIntro", "true"),
  );
  const response = await page.goto("/visual-continuity-not-found");
  expect(response.status()).toBe(404);
  const link = page.getByRole("link", { name: "Volver al inicio" });
  await expect(link).toHaveAttribute("href", "/");
  if (info.project.name === "desktop") {
    await link.hover({ position: { x: 12, y: 12 } });
    await expect
      .poll(() =>
        link.evaluate(
          (el) => new DOMMatrix(getComputedStyle(el).transform).m41,
        ),
      )
      .toBeLessThan(-2);
    await page.mouse.move(2, 2);
    await expect
      .poll(() => link.evaluate((el) => el.style.willChange))
      .toBe("");
    expect(
      await link.evaluate(
        (el) => new DOMMatrix(getComputedStyle(el).transform).m41,
      ),
    ).toBe(0);
  }
  await link.click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("#hero h1")).toBeVisible();
});
