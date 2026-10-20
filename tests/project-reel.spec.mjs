import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

async function openReel(page) {
  await page.goto("/");
  await page.keyboard.press("Escape");
  const work = page.locator("#work");
  await expect(work).toHaveAttribute("data-reel", "pinned");
  return work;
}

test("vertical scroll pans the reel and settles on a card", async ({ page }) => {
  const work = await openReel(page);
  const top = await work.evaluate((el) => el.getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => scrollTo(0, y), top);
  for (let i = 0; i < 6; i++) await page.mouse.wheel(0, 150);
  await page.waitForTimeout(1200);

  const state = await page.evaluate(() => {
    const stage = document.querySelector(".projects-reel-stage").getBoundingClientRect();
    const viewport = document.querySelector(".projects-reel-viewport").getBoundingClientRect();
    const lefts = [...document.querySelectorAll(".projects-reel-item")].map(
      (card) => card.getBoundingClientRect().left - viewport.left,
    );
    return { stageTop: stage.top, lefts };
  });
  // Stage is held in place while the track moves sideways.
  expect(Math.abs(state.stageTop)).toBeLessThan(2);
  expect(state.lefts[0]).toBeLessThan(0);
  // Snap: some card sits flush with the viewport, never halfway between two.
  expect(state.lefts.some((left) => Math.abs(left) < 3)).toBe(true);
});

test("every card fits the screen, closed and with details open", async ({ page }) => {
  await openReel(page);
  const viewportHeight = page.viewportSize().height;
  const cards = page.locator(".projects-reel-item");
  const fits = async () =>
    cards.evaluateAll((items) =>
      items.map((card) => {
        const header = card.querySelector(".work-surface-header");
        return {
          height: card.getBoundingClientRect().height,
          overflow: header.scrollHeight - header.clientHeight,
        };
      }),
    );
  const closed = await fits();
  for (const card of closed) {
    expect(card.height).toBeLessThanOrEqual(viewportHeight);
    expect(card.overflow).toBeLessThanOrEqual(1);
  }
  await cards.first().locator("button[aria-expanded]").click();
  await page.waitForTimeout(600);
  const open = await fits();
  // Opening the details keeps the same footprint.
  expect(Math.round(open[0].height)).toBe(Math.round(closed[0].height));
});
