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
  await expect(page.locator("#work h2")).toHaveAttribute("aria-label", "Mis proyectos.");
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
  await page.waitForTimeout(900);
  const state = await reelState(page);
  expect(Math.abs(state.lefts[3])).toBeLessThan(3);
});

test("every card fits the screen, closed and with details open", async ({ page }) => {
  await openReel(page);
  const { top } = await runway(page);
  await page.evaluate((y) => scrollTo(0, y), top);
  const viewportHeight = page.viewportSize().height;
  const cards = page.locator(".projects-reel-item");
  const fits = async () =>
    cards.evaluateAll((items) =>
      items.map((card) => {
        const header = card.querySelector(".work-surface-header");
        const story = card.querySelector(".work-story").getBoundingClientRect();
        const actions = card
          .querySelector(".work-project-action")
          .getBoundingClientRect();
        return {
          height: card.getBoundingClientRect().height,
          overflow: header.scrollHeight - header.clientHeight,
          // The description never runs under the action buttons.
          overlap: story.bottom - actions.top,
        };
      }),
    );
  const closed = await fits();
  for (const card of closed) {
    expect(card.height).toBeLessThanOrEqual(viewportHeight);
    expect(card.overflow).toBeLessThanOrEqual(1);
    expect(card.overlap).toBeLessThanOrEqual(1);
  }
  await cards.first().locator("button[aria-expanded]").click();
  await page.waitForTimeout(600);
  const open = await fits();
  // Opening the details keeps the same footprint.
  expect(Math.round(open[0].height)).toBe(Math.round(closed[0].height));
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
  const welcomeShows = () =>
    expect
      .poll(() =>
        page.evaluate(() => {
          const el = document.querySelector("[data-cine-welcome]");
          return el ? Number(getComputedStyle(el).opacity) : 0;
        }),
      )
      .toBeGreaterThan(0.5);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await welcomeShows();
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await welcomeShows();
});
