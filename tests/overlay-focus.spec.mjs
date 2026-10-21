import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });
test.beforeEach(async ({ page }, info) => {
  if (info.project.name === "desktop")
    await page.setViewportSize({ width: 780, height: 900 });
  await page.addInitScript(() => localStorage.setItem("portfolio_lang", "es"));
});

test("closed menu is inert and rapid Escape returns focus to its visible trigger", async ({
  page,
}) => {
  await page.goto("/");
  const menu = page.locator('[aria-labelledby="mobile-menu-title"]');
  const trigger = page.getByRole("button", { name: "Abrir menú", exact: true });
  await expect(menu).toHaveAttribute("inert");
  await trigger.click();
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("inert");
  await expect(trigger).toBeFocused();
  await page.waitForTimeout(150);
  await expect(trigger).toBeFocused();
});

test("menu recaptures outside focus and keeps empty or hidden tab stops inside its container", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Abrir menú", exact: true });
  await trigger.click();
  const menu = page.locator('[aria-labelledby="mobile-menu-title"]');
  await expect(menu).toBeVisible();
  await trigger.evaluate((element) => element.focus());
  await expect(
    menu.getByRole("button", { name: "Cerrar", exact: true }),
  ).toBeFocused();
  await menu.evaluate((element) => {
    for (const item of element.querySelectorAll("button")) item.disabled = true;
    for (const item of element.querySelectorAll("a"))
      item.style.display = "none";
  });
  await page.keyboard.press("Tab");
  await expect(menu).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(menu).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("command shortcut replaces menu without stealing input focus or unlocking the page", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Abrir menú", exact: true });
  await trigger.click();
  const menu = page.locator('[aria-labelledby="mobile-menu-title"]');
  await expect(menu).toBeVisible();
  await page.keyboard.press("Control+k");
  const command = page.locator(".cmd-overlay");
  await expect(command).toBeVisible();
  await expect(menu).toHaveAttribute("inert");
  await expect(command.locator("input")).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("hidden");
  await page.keyboard.press("Tab");
  expect(
    await command.evaluate((element) =>
      element.contains(document.activeElement),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(command).toHaveCount(0);
  await expect(menu).toHaveAttribute("inert");
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .not.toBe("hidden");
  await expect(trigger).toBeFocused();
});
