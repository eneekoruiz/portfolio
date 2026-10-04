import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Fine pointer interruption coverage.",
  );
  await page.addInitScript(() => {
    localStorage.setItem("portfolio_lang", "es");
    localStorage.setItem("portfolio-motion-enabled", "true");
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 16 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
  });
});

test("leaving an orbit mid-drag releases capture and preserves keyboard resume", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.locator("[data-skill-card]").first();
  await card.scrollIntoViewIfNeeded();
  await expect(page.locator("[data-motion-toggle]")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const orbit = card.locator("[data-orbit-active]");
  await expect(orbit).toBeVisible();
  await orbit.evaluate((element) => {
    element.addEventListener(
      "pointerdown",
      (event) => {
        window.__orbitPointer = event.pointerId;
      },
      { once: true },
    );
  });
  // The automatically rotating orbit must have its actual hitbox in view.
  await orbit.scrollIntoViewIfNeeded();
  await orbit.hover({ position: { x: 30, y: 30 } });
  await page.mouse.down();
  await expect
    .poll(() =>
      orbit.evaluate((element) =>
        element.hasPointerCapture(window.__orbitPointer),
      ),
    )
    .toBe(true);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      orbit.evaluate((element) =>
        element.hasPointerCapture(window.__orbitPointer),
      ),
    )
    .toBe(false);
  expect(
    await orbit
      .locator("[data-orbit-pill]")
      .evaluateAll((items) =>
        items.every((item) => item.style.willChange === ""),
      ),
  ).toBe(true);
  await page.mouse.up();
  await card.scrollIntoViewIfNeeded();
  await orbit.focus();
  const pill = card.locator("[data-orbit-pill]").first();
  const initial = await pill.getAttribute("style");
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => pill.getAttribute("style")).not.toBe(initial);
  await page.locator("[data-motion-toggle]").click();
  await expect(card.locator("[data-orbit-active]")).toHaveCount(0);
  await expect(pill).not.toHaveAttribute("style");
});

test("window blur clears hover and flip transforms without disabling later interaction", async ({
  page,
}) => {
  await page.goto("/");
  const contact = page.locator("[data-magnetic-contact]");
  await contact.hover({ position: { x: 12, y: 12 } });
  await expect
    .poll(() => contact.evaluate((element) => element.style.transform))
    .not.toBe("");
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect
    .poll(() => contact.evaluate((element) => element.style.transform))
    .toBe("");
  const copy = page.getByRole("button", { name: "Copiar correo", exact: true });
  await copy.scrollIntoViewIfNeeded();
  await copy.hover();
  const visual = copy.locator("[data-contact-flip]");
  await expect
    .poll(() => visual.evaluate((element) => element.style.transform))
    .toContain("rotateY(180deg)");
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect
    .poll(() => visual.evaluate((element) => element.style.transform))
    .toBe("");
  await page.mouse.move(2, 2);
  await copy.hover();
  await expect
    .poll(() => visual.evaluate((element) => element.style.transform))
    .toContain("rotateY(180deg)");
});
