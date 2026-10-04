import { test, expect } from "@playwright/test";

const viewports = [
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 935, height: 800 },
  { width: 1440, height: 700 },
];
const samples = [0, 0.1, 0.25, 0.5, 0.72, 0.92];

async function setScroll(page, y) {
  await page.evaluate((target) => {
    if (window.__lenis)
      window.__lenis.scrollTo(target, { immediate: true, force: true });
    else window.scrollTo(0, target);
  }, y);
}

async function readTransitionGeometry(page) {
  return page.evaluate(() => {
    const hero = document.querySelector("[data-umbral-destination]");
    const spacer = hero?.parentElement;
    if (!hero || !spacer?.classList.contains("pin-spacer")) return null;

    const bounds = (element) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      let opacity = 1;
      let current = element;
      while (current instanceof HTMLElement) {
        const style = getComputedStyle(current);
        opacity *= Number(style.opacity);
        if (style.display === "none" || style.visibility === "hidden")
          return null;
        current = current.parentElement;
      }
      if (rect.width <= 0 || rect.height <= 0 || opacity < 0.05) return null;
      return {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        opacity,
      };
    };

    const intro = [
      ...hero.querySelectorAll(
        '[data-hero-role="intro-content"] h1, [data-hero-role="intro-content"] > p, [data-hero-role="intro-content"] > div:last-child',
      ),
    ];
    const nav = document.querySelector("header.fixed.top-6");
    const screen = hero.querySelector('[data-studio-screen="cinematic"]');
    const hud = hero.querySelector('[data-hero-role="scroll-hint-rail"]');
    const pinRect = spacer.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();

    return {
      progress: Number(hero.dataset.studioProgress ?? 0),
      phase: hero.dataset.studioPhase,
      scrollY,
      viewport: { width: innerWidth, height: innerHeight },
      spacer: {
        height: pinRect.height,
        scrollHeight: spacer.scrollHeight,
        heroHeight: heroRect.height,
        documentTop: pinRect.top + scrollY,
        range: Math.max(pinRect.height, spacer.scrollHeight) - heroRect.height,
      },
      boxes: [
        ...intro.map((element, index) => ({
          name: `intro-${index}`,
          rect: bounds(element),
        })),
        { name: "studio-screen", rect: bounds(screen) },
        { name: "scroll-hud", rect: bounds(hud) },
        { name: "project-nav", rect: bounds(nav) },
      ].filter((box) => box.rect),
    };
  });
}

function expectContainedAndUncovered(geometry, label) {
  const visibleBoxes = geometry.boxes;
  for (const box of visibleBoxes) {
    expect(box.rect.left, `${label} ${box.name} left`).toBeGreaterThanOrEqual(
      -1,
    );
    expect(box.rect.right, `${label} ${box.name} right`).toBeLessThanOrEqual(
      geometry.viewport.width + 1,
    );
    expect(box.rect.top, `${label} ${box.name} top`).toBeGreaterThanOrEqual(-1);
    expect(box.rect.bottom, `${label} ${box.name} bottom`).toBeLessThanOrEqual(
      geometry.viewport.height + 1,
    );
  }

  const overlaps = [];
  for (let i = 0; i < visibleBoxes.length; i++) {
    for (let j = i + 1; j < visibleBoxes.length; j++) {
      const a = visibleBoxes[i];
      const b = visibleBoxes[j];
      if (
        Math.min(a.rect.right, b.rect.right) -
          Math.max(a.rect.left, b.rect.left) >
          1 &&
        Math.min(a.rect.bottom, b.rect.bottom) -
          Math.max(a.rect.top, b.rect.top) >
          1
      )
        overlaps.push(`${a.name}/${b.name}`);
    }
  }
  expect(overlaps, `${label} visible transition overlap`).toEqual([]);
}

test("cinematic studio stays clear through scroll progress and reverses into the static reduced-motion route", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "This test sets its own viewport sizes and uses the desktop browser context.",
  );

  await page.addInitScript(() => {
    window.__LITE = true;
    localStorage.setItem("lite", "1");
    localStorage.setItem("portfolio_lang", "es");
    localStorage.setItem("portfolio-motion-enabled", "true");
  });

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/work/ana-peluquera");

    const hero = page.locator("[data-umbral-destination='ana-peluquera']");
    const screen = page.locator('[data-studio-screen="cinematic"]');
    await expect(hero).toBeVisible();
    await expect(screen).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
    await expect(page.locator("canvas[data-materia-renderer]")).toHaveCount(0);
    await expect
      .poll(() =>
        page
          .locator('[data-hero-role="scroll-hint-rail"]')
          .evaluate((element) => Number(getComputedStyle(element).opacity)),
      )
      .toBeGreaterThan(0.95);
    await expect
      .poll(() =>
        hero.evaluate(
          (element) =>
            element.parentElement?.classList.contains("pin-spacer") ?? false,
        ),
      )
      .toBe(true);

    await setScroll(page, 0);
    await expect
      .poll(async () => (await readTransitionGeometry(page))?.progress)
      .toBeLessThan(0.01);

    for (const progress of samples) {
      const initial = await readTransitionGeometry(page);
      expect(
        initial,
        `${viewport.width}x${viewport.height} pin geometry`,
      ).not.toBeNull();
      expect(initial.boxes.some((box) => box.name === "project-nav")).toBe(
        true,
      );
      expect(initial.spacer.range).toBeGreaterThan(viewport.height);

      // ScrollTrigger's pin spacer carries the real scroll distance for this viewport.
      const targetY =
        initial.spacer.documentTop + initial.spacer.range * progress;
      await setScroll(page, targetY);
      await expect
        .poll(async () => (await readTransitionGeometry(page))?.progress, {
          timeout: 5000,
        })
        .toBeCloseTo(progress, 2);

      // Progress tracks the scroll immediately; the visible timeline scrubs over 0.8s.
      await page.waitForTimeout(1100);

      const geometry = await readTransitionGeometry(page);
      expect(geometry.phase, `${viewport.width}x${viewport.height} phase`).toBe(
        geometry.progress < 0.12
          ? "intro"
          : geometry.progress < 0.9
            ? "reveal"
            : "ready",
      );
      if (progress <= 0.1)
        expect(
          geometry.boxes.some((box) => box.name.startsWith("intro-")),
          `${viewport.width}x${viewport.height} intro remains visible`,
        ).toBe(true);
      if (progress >= 0.5 && progress < 0.9)
        expect(
          geometry.boxes.some((box) => box.name === "studio-screen"),
          `${viewport.width}x${viewport.height} studio frame is visible`,
        ).toBe(true);
      if (progress < 0.85)
        expect(
          geometry.boxes.some((box) => box.name === "scroll-hud"),
          `${viewport.width}x${viewport.height} scroll rail is visible`,
        ).toBe(true);
      expectContainedAndUncovered(
        geometry,
        `${viewport.width}x${viewport.height} @ ${progress}`,
      );
      if (progress === 0 || progress === 0.5 || progress === 0.72)
        await page.screenshot({
          path: info.outputPath(
            `${viewport.width}-${viewport.height}-${progress}-studio.png`,
          ),
        });
    }

    // Retrace the pinned section and ensure GSAP restores the opening state.
    for (const progress of [0.5, 0.1, 0]) {
      const state = await readTransitionGeometry(page);
      const targetY = state.spacer.documentTop + state.spacer.range * progress;
      await setScroll(page, targetY);
      await expect
        .poll(async () => (await readTransitionGeometry(page))?.progress, {
          timeout: 5000,
        })
        .toBeCloseTo(progress, 2);
      await page.waitForTimeout(1100);
      expectContainedAndUncovered(
        await readTransitionGeometry(page),
        `${viewport.width}x${viewport.height} reverse @ ${progress}`,
      );
    }
    await expect
      .poll(() =>
        screen.evaluate((element) => Number(getComputedStyle(element).opacity)),
      )
      .toBeLessThan(0.05);
  }

  // Reduced motion swaps the pinned cinematic screen for the readable static route.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect(page.locator('[data-studio-screen="cinematic"]')).toHaveCount(0);
  await expect(page.locator("canvas[data-materia-renderer]")).toHaveCount(0);
  const staticScreen = page.locator('[data-studio-screen="static"]');
  await staticScreen.scrollIntoViewIfNeeded();
  await expect(staticScreen).toBeVisible();
  await expect(
    staticScreen.getByRole("link", { name: "Abrir en otra pestaña" }),
  ).toHaveAttribute("href", "https://agpeluqueria.vercel.app");
  await expect(page.locator("iframe")).toHaveCount(0);
  // Localhost is deliberately outside the salon's framing policy. Its usable
  // reduced-motion fallback is a native external link, not a fullscreen embed.
  await expect(
    staticScreen.getByRole("link", { name: "Abrir en otra pestaña" }),
  ).toBeVisible();
  await expect(
    staticScreen.getByRole("link", { name: "Abrir en otra pestaña" }),
  ).toHaveAttribute("target", "_blank");
});
