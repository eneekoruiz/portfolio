import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

async function openReel(page) {
  await page.goto("/");
  await page.keyboard.press("Escape");
  const work = page.locator("#work");
  await expect(work).toHaveAttribute("data-reel", "pinned");
  return work;
}

async function runway(page) {
  return page.evaluate(() => {
    const el = document.querySelector(".projects-reel-runway");
    const top = el.getBoundingClientRect().top + scrollY;
    return { top, end: top + el.offsetHeight - innerHeight };
  });
}

async function reelState(page) {
  return page.evaluate(() => {
    const track = document.querySelector(".projects-reel");
    const stage = document.querySelector(".projects-reel-stage").getBoundingClientRect();
    const box = track.getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(track).paddingLeft);
    const lefts = [...track.children].map(
      (card) => card.getBoundingClientRect().left - box.left - pad,
    );
    return { stageTop: stage.top, lefts, free: track.dataset.free };
  });
}

test("the title shows once and is not part of the held stage", async ({ page }) => {
  await openReel(page);
  await expect(page.locator("#work-heading")).toContainText("Mis proyectos.");
  const inStage = await page.evaluate(
    () => !!document.querySelector(".projects-reel-stage h2"),
  );
  expect(inStage).toBe(false);
});

test("vertical scroll walks the first cards, then releases the page", async ({ page }) => {
  await openReel(page);
  const { top, end } = await runway(page);
  await page.evaluate((y) => scrollTo(0, y), top);
  for (let i = 0; i < 3; i++) await page.mouse.wheel(0, 120);
  await page.waitForTimeout(1200);

  const held = await reelState(page);
  // Stage is held in place while the track moves sideways.
  expect(Math.abs(held.stageTop)).toBeLessThan(2);
  // Snap: some card sits flush with the track, never halfway between two.
  expect(held.lefts.some((left) => Math.abs(left) < 3)).toBe(true);

  // Past the third card the page carries on; the reel stays on card three.
  await page.evaluate((y) => scrollTo(0, y + 400), end);
  await page.waitForTimeout(800);
  const released = await reelState(page);
  expect(released.stageTop).toBeLessThan(-100);
  expect(released.free).toBe("true");
  expect(Math.abs(released.lefts[2])).toBeLessThan(3);
});

test("the next arrow keeps going sideways once released", async ({ page }) => {
  await openReel(page);
  const { end } = await runway(page);
  await page.evaluate((y) => scrollTo(0, y), end);
  await page.waitForTimeout(800);
  await page.locator("[data-reel-next]").click();
  await expect
    .poll(async () => Math.abs((await reelState(page)).lefts[3]), { timeout: 8000 })
    .toBeLessThan(3);
});

test("every card is one glance: it fits the screen and its text never runs under another element", async ({
  page,
}) => {
  await openReel(page);
  const { top } = await runway(page);
  await page.evaluate((y) => scrollTo(0, y), top);
  const viewportHeight = page.viewportSize().height;
  const cards = await page.locator(".work-card").evaluateAll((items) =>
    items.map((card) => {
      const box = card.getBoundingClientRect();
      const copy = card.querySelector(".work-card-copy");
      const preview = card.querySelector(".work-card-visual").getBoundingClientRect();
      const action = card.querySelector(".work-card-action").getBoundingClientRect();
      const tech = card.querySelector(".work-card-tech");
      return {
        height: box.height,
        clipped: copy.scrollHeight - copy.clientHeight,
        previewHeight: preview.height,
        // Technologies are plain text, three at most.
        techCount: tech.textContent.split("·").length,
        links: card.querySelectorAll("a").length,
        actionInside: action.bottom <= box.bottom + 1,
      };
    }),
  );
  expect(cards).toHaveLength(8);
  for (const card of cards) {
    expect(card.height).toBeLessThanOrEqual(viewportHeight);
    expect(card.clipped).toBeLessThanOrEqual(1);
    expect(card.previewHeight).toBeGreaterThan(90);
    expect(card.techCount).toBeLessThanOrEqual(3);
    // The whole card is one link; "Details" is the only other control.
    expect(card.links).toBe(1);
    expect(card.actionInside).toBe(true);
  }
  await expect(page.locator(".work-card button")).toHaveCount(8);
});

test("details fold the preview away and show the story in the same space", async ({ page }) => {
  await openReel(page);
  const { top } = await runway(page);
  await page.evaluate((y) => scrollTo(0, y), top);
  const card = page.locator(".work-card").first();
  const before = await card.boundingBox();
  const toggle = card.locator(".work-card-details");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(card.locator(".work-card-story")).not.toHaveAttribute("inert", "");
  await expect(card.locator(".work-card-story h4, .work-card-story p").first()).toBeVisible();
  expect((await card.boundingBox()).height).toBeCloseTo(before.height, 0);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("motion and the opening are on by default, even with stale stored state", async ({
  page,
}) => {
  await page.addInitScript(() => {
    // What older builds left behind: a stored pause and a saved reel position.
    localStorage.setItem("portfolio-motion-enabled", "false");
    localStorage.setItem("lite", "1");
    sessionStorage.setItem(
      "projects_nav_state",
      JSON.stringify({ openIdx: 2, scrollY: 2400 }),
    );
  });
  // The welcome has its own screen, above everything, until it is blown open.
  const welcomeShows = () => expect(page.locator(".overture")).toBeVisible();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await welcomeShows();
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await welcomeShows();
});
