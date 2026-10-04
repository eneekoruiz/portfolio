import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const projectRoutes = [
  {
    id: "ana-peluquera",
    github: "https://github.com/eneekoruiz/ana-peluquera",
    live: "https://agpeluqueria.vercel.app",
  },
  {
    id: "who-are-ya-backend",
    github: "https://github.com/eneekoruiz/who-are-ya-backend",
    source: "// players.controller.js — MongoDB Filter Engine",
  },
  {
    id: "rides24ofiziala",
    github: "https://github.com/eneekoruiz/rides24ofiziala",
    source: "// RideService.java — JAX-WS Atomic Seat Lock",
  },
  {
    id: "spotshare-parking",
    github: "https://github.com/eneekoruiz/spotshare-parking",
    source: "// parking.service.ts — Optimistic Locking",
  },
  { id: "pke-web", github: "https://github.com/eneekoruiz/pke-web" },
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("portfolio_lang", "es");
    Object.defineProperty(navigator, "hardwareConcurrency", {
      get: () => 16,
      configurable: true,
    });
    Object.defineProperty(navigator, "deviceMemory", {
      get: () => 8,
      configurable: true,
    });
  });
});

async function expectSettledHero(page) {
  const heading = page.locator("#hero h1");
  await expect(heading).toBeVisible();
  await expect(heading.locator(".kinetic-type")).toHaveCount(2);
  await expect(heading.locator(".kinetic-type").nth(0)).toContainText("Eneko");
  await expect(heading.locator(".kinetic-type").nth(1)).toContainText("Ruiz.");
  await expect
    .poll(() =>
      heading.evaluate((element) => {
        const glyphs = [...element.querySelectorAll("[data-kinetic-char]")];
        return (
          glyphs.length > 0 &&
          glyphs.every(
            (glyph) =>
              Number(getComputedStyle(glyph).opacity) >= 0.99 &&
              !glyph.style.willChange,
          )
        );
      }),
    )
    .toBe(true);
  await page.evaluate(() => document.fonts.ready);
  const loadedFonts = await heading.evaluate((element) => {
    const families = [
      getComputedStyle(element).fontFamily,
      getComputedStyle(document.querySelector(".hero-introduction p"))
        .fontFamily,
    ].map((family) => family.split(",")[0].trim());
    return families.map((family) => document.fonts.check(`800 32px ${family}`));
  });
  expect(loadedFonts).toEqual([true, true]);
  const bounds = await heading.boundingBox();
  expect(bounds?.width).toBeGreaterThan(0);
  expect(bounds?.height).toBeGreaterThan(0);
}

async function observeSceneContinuity(page) {
  await page.evaluate(() => {
    window.__sceneContinuity?.observer?.disconnect();
    window.__sceneContinuity = { gap: false, rendered: false, observer: null };
    const inspect = () => {
      const dna = document.querySelector("[data-dna-static]");
      const renderer = document.querySelector("canvas[data-materia-renderer]");
      if (!dna && !renderer) window.__sceneContinuity.gap = true;
      if (renderer) window.__sceneContinuity.rendered = true;
    };
    const observer = new MutationObserver(inspect);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-materia-renderer"],
    });
    window.__sceneContinuity.observer = observer;
    inspect();
  });
}

async function expectSceneContinuity(page, rendererExpected) {
  const readState = () =>
    page.evaluate((needsRenderer) => {
      const state = window.__sceneContinuity;
      const dna = document.querySelector("[data-dna-static]");
      const renderer = document.querySelector("canvas[data-materia-renderer]");
      const degradedAnimatedFallback = document.querySelector(
        '.materia-canvas[data-scene-degraded="true"] [data-dna-static][data-dna-animated="true"]',
      );
      return {
        ok:
          !state.gap &&
          (needsRenderer
            ? state.rendered || !!degradedAnimatedFallback
            : !!dna && !renderer),
        gap: state.gap,
        rendered: state.rendered,
        width: document.documentElement.clientWidth,
        canvas: !!renderer,
        dna: !!dna,
        degraded: !!document.querySelector(
          '.materia-canvas[data-scene-degraded="true"]',
        ),
        animatedFallback: !!degradedAnimatedFallback,
        motion: document.documentElement.getAttribute("data-motion"),
      };
    }, rendererExpected);
  try {
    await expect
      .poll(async () => (await readState()).ok, {
        timeout: 20000,
        message: "DNA SVG remains until the first rendered WebGL frame",
      })
      .toBe(true);
  } catch (error) {
    throw new Error(
      `${error.message}\nFinal scene continuity state: ${JSON.stringify(await readState())}`,
    );
  }
  expect((await readState()).gap).toBe(false);
}

test("hero reading areas and portrait plate stay clear at supported widths and themes", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "This test sets its own viewport sizes.",
  );
  const pageErrors = [];
  const screenshots = "scratch/continuity-20261004/after";
  await mkdir(screenshots, { recursive: true });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/");
  await expect(page.locator("canvas[data-materia-renderer]")).toBeVisible();

  for (const viewport of [
    { width: 375, height: 667 },
    { width: 768, height: 1024 },
    { width: 1440, height: 1000 },
    { width: 1440, height: 700 },
  ]) {
    await observeSceneContinuity(page);
    await page.setViewportSize(viewport);
    await expectSceneContinuity(page, viewport.width >= 768);
    for (const theme of ["light", "dark"]) {
      await page.evaluate((value) => {
        document.documentElement.classList.toggle("dark", value === "dark");
        document.documentElement.classList.toggle("light", value === "light");
      }, theme);
      await expectSettledHero(page);

      const layout = await page.evaluate(() => {
        const selectors = {
          heading: "#hero h1",
          introduction: ".hero-introduction",
          plate: ".hero-identity-plate",
          portrait: ".hero-portrait-frame",
          footer: "#hero > div:last-child",
          topLabel: ".hero-identity-plate > div:first-child",
          bottomLabel: ".hero-identity-plate > div:last-child",
          technologies: "[data-floating-active]",
        };
        const read = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          const visible =
            rect.width > 0 &&
            rect.height > 0 &&
            getComputedStyle(element).display !== "none" &&
            getComputedStyle(element).visibility !== "hidden";
          return {
            visible,
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
          };
        };
        return {
          viewportWidth: document.documentElement.clientWidth,
          boxes: Object.fromEntries(
            Object.entries(selectors).map(([key, selector]) => [
              key,
              read(selector),
            ]),
          ),
          motion: document.documentElement.getAttribute("data-motion"),
          canvas: !!document.querySelector("canvas[data-materia-renderer]"),
          dna: !!document.querySelector("[data-dna-static]"),
        };
      });

      expect(
        layout.boxes.heading?.visible,
        `${viewport.width}/${theme} heading`,
      ).toBe(true);
      expect(
        layout.boxes.introduction?.visible,
        `${viewport.width}/${theme} introduction`,
      ).toBe(true);
      expect(
        layout.boxes.footer?.visible,
        `${viewport.width}/${theme} hero actions`,
      ).toBe(true);
      expect(
        layout.canvas || layout.dna,
        `${viewport.width}/${theme} DNA scene`,
      ).toBe(true);

      const activeAreas = [
        "heading",
        "introduction",
        "plate",
        "footer",
        "technologies",
      ]
        .filter((name) => layout.boxes[name]?.visible)
        .map((name) => ({ name, ...layout.boxes[name] }));
      for (const area of activeAreas) {
        expect(
          area.left,
          `${viewport.width}/${theme} ${area.name} left edge`,
        ).toBeGreaterThanOrEqual(-1);
        expect(
          area.right,
          `${viewport.width}/${theme} ${area.name} right edge`,
        ).toBeLessThanOrEqual(layout.viewportWidth + 1);
      }
      const overlaps = [];
      for (let i = 0; i < activeAreas.length; i++) {
        for (let j = i + 1; j < activeAreas.length; j++) {
          const a = activeAreas[i];
          const b = activeAreas[j];
          if (
            Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
            Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1
          )
            overlaps.push(`${a.name}/${b.name}`);
        }
      }
      expect(
        overlaps,
        `${viewport.width}x${viewport.height} ${theme} hero overlaps`,
      ).toEqual([]);

      const { plate, portrait, topLabel, bottomLabel } = layout.boxes;
      if (plate?.visible) {
        expect(portrait?.visible, `${viewport.width}/${theme} portrait`).toBe(
          true,
        );
        expect(portrait.left).toBeGreaterThanOrEqual(plate.left - 1);
        expect(portrait.right).toBeLessThanOrEqual(plate.right + 1);
        expect(portrait.top).toBeGreaterThanOrEqual(plate.top - 1);
        expect(portrait.bottom).toBeLessThanOrEqual(plate.bottom + 1);
        for (const [labelName, label] of [
          ["top", topLabel],
          ["bottom", bottomLabel],
        ]) {
          expect(
            label?.visible,
            `${viewport.width}/${theme} ${labelName} plate label`,
          ).toBe(true);
          const intersectionWidth =
            Math.min(portrait.right, label.right) -
            Math.max(portrait.left, label.left);
          const intersectionHeight =
            Math.min(portrait.bottom, label.bottom) -
            Math.max(portrait.top, label.top);
          expect(
            intersectionWidth > 1 && intersectionHeight > 1,
            `${viewport.width}/${theme} portrait overlaps ${labelName} plate label`,
          ).toBe(false);
        }
      }

      await page.locator("#hero").screenshot({
        path: `${screenshots}/${viewport.width}-${viewport.height}-${theme}-hero.png`,
      });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.locator("#expertise").screenshot({
        path: `${screenshots}/${viewport.width}-${viewport.height}-${theme}-expertise.png`,
      });
      await page.locator("#about").scrollIntoViewIfNeeded();
      const metricBoxes = await page
        .locator("#about dt, #about dd")
        .evaluateAll((elements) =>
          elements
            .filter((element) => element.textContent?.trim())
            .map((element) => ({
              text: element.textContent.trim(),
              clientWidth: element.clientWidth,
              scrollWidth: element.scrollWidth,
            })),
        );
      for (const metric of metricBoxes)
        expect(
          metric.scrollWidth,
          `${viewport.width}/${theme} About metric text: ${metric.text}`,
        ).toBeLessThanOrEqual(metric.clientWidth + 1);
      await page.evaluate(() => window.scrollTo(0, 0));
    }
  }
  expect(pageErrors).toEqual([]);
});

test("modest desktop animates the DNA fallback, pauses and resumes it, and keeps the CSS studio", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Modest desktop hardware profile.",
  );
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", {
      get: () => 4,
      configurable: true,
    });
    Object.defineProperty(navigator, "deviceMemory", {
      get: () => 4,
      configurable: true,
    });
    window.__dnaPathWrites = 0;
    new MutationObserver((records) => {
      window.__dnaPathWrites += records.filter(
        (record) =>
          record.attributeName === "d" &&
          record.target instanceof SVGPathElement &&
          record.target.closest("[data-dna-static]")?.querySelector("path") ===
            record.target,
      ).length;
    }).observe(document, {
      subtree: true,
      attributes: true,
      attributeFilter: ["d"],
    });
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await expect(page.locator("canvas[data-materia-renderer]")).toHaveCount(0);
  await expect(page.locator("[data-dna-static]")).toBeVisible();
  const rung = page.locator("[data-dna-static] line").first();
  await expect(rung).toBeVisible();
  await expect(page.locator("[data-dna-static]")).toHaveAttribute(
    "data-dna-animated",
    "true",
  );
  const initialX = await rung.getAttribute("x1");
  await expect.poll(() => rung.getAttribute("x1")).not.toBe(initialX);
  const beforePacingSample = await page.evaluate(() => window.__dnaPathWrites);
  await page.waitForTimeout(1000);
  const pacedWrites =
    (await page.evaluate(() => window.__dnaPathWrites)) - beforePacingSample;
  expect(pacedWrites).toBeGreaterThan(0);
  expect(pacedWrites).toBeLessThanOrEqual(20);

  const motionToggle = page.locator("[data-motion-toggle]");
  await motionToggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  const frozenX = await rung.getAttribute("x1");
  await page.waitForTimeout(250);
  await expect(rung).toHaveAttribute("x1", frozenX);
  await motionToggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  await expect.poll(() => rung.getAttribute("x1")).not.toBe(frozenX);

  await page.keyboard.press("Control+k");
  const command = page.locator(".cmd-overlay");
  await expect(command).toBeVisible();
  const overlayFrozenX = await rung.getAttribute("x1");
  await page.waitForTimeout(250);
  await expect(rung).toHaveAttribute("x1", overlayFrozenX);
  await page.keyboard.press("Escape");
  await expect(command).toHaveCount(0);
  await expect.poll(() => rung.getAttribute("x1")).not.toBe(overlayFrozenX);

  await page.locator("#about").scrollIntoViewIfNeeded();
  await expect(page.locator(".materia-canvas")).toHaveAttribute(
    "data-scene-active",
    "false",
  );
  await expect(page.locator("[data-dna-static]")).toHaveAttribute(
    "data-dna-animated",
    "false",
  );
  const offscreenFrozenX = await rung.getAttribute("x1");
  await page.waitForTimeout(250);
  await expect(rung).toHaveAttribute("x1", offscreenFrozenX);
  await page.locator("#hero").scrollIntoViewIfNeeded();
  await expect(page.locator(".materia-canvas")).toHaveAttribute(
    "data-scene-active",
    "true",
  );
  await expect(page.locator("[data-dna-static]")).toHaveAttribute(
    "data-dna-animated",
    "true",
  );
  await expect.poll(() => rung.getAttribute("x1")).not.toBe(offscreenFrozenX);

  await page.goto("/work/ana-peluquera");
  const studio = page.locator('[data-studio-screen="cinematic"]');
  await expect(studio).toBeVisible();
  await expect(studio).toHaveCSS("transform-style", "preserve-3d");
  await expect(
    page.locator("iframe[src*='localhost'], iframe[src*='127.0.0.1']"),
  ).toHaveCount(0);
});

test("salon studio expands and retracts cleanly through repeated scroll reversals", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Cinematic salon studio runs on desktop.",
  );
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/work/ana-peluquera");
  const screen = page.locator('[data-studio-screen="cinematic"]');
  await expect(screen).toHaveCount(1);
  await expect(
    page.locator("iframe[src*='localhost'], iframe[src*='127.0.0.1']"),
  ).toHaveCount(0);

  for (let reversal = 0; reversal < 2; reversal++) {
    await page.evaluate(() =>
      window.__lenis
        ? window.__lenis.scrollTo(innerHeight * 2.4, {
            immediate: true,
            force: true,
          })
        : window.scrollTo(0, innerHeight * 2.4),
    );
    await expect
      .poll(() =>
        screen.evaluate((element) => Number(getComputedStyle(element).opacity)),
      )
      .toBeGreaterThan(0.95);
    await expect
      .poll(() =>
        screen.evaluate(
          (element) => element.getBoundingClientRect().width / innerWidth,
        ),
      )
      .toBeGreaterThan(0.7);
    if (reversal === 0) {
      await mkdir("scratch/continuity-20261004/after", { recursive: true });
      await page.screenshot({
        path: "scratch/continuity-20261004/after/1440-dark-salon-studio.png",
      });
    }

    await page.evaluate(() =>
      window.__lenis
        ? window.__lenis.scrollTo(0, { immediate: true, force: true })
        : window.scrollTo(0, 0),
    );
    await expect
      .poll(() =>
        screen.evaluate((element) => Number(getComputedStyle(element).opacity)),
      )
      .toBeLessThan(0.05);
  }
  await expect(
    page.getByRole("link", { name: "Abrir en otra pestaña", exact: true }),
  ).toHaveAttribute("href", "https://agpeluqueria.vercel.app");
  await expect(
    page.getByRole("link", { name: "Abrir en otra pestaña", exact: true }),
  ).toHaveAttribute("target", "_blank");
  expect(errors).toEqual([]);
});

test("all five project routes keep their direct links native and avoid localhost embeds", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  for (const project of projectRoutes) {
    const row = page.locator(`[data-materia-surface="${project.id}"]`);
    await row.scrollIntoViewIfNeeded();
    const toggle = row.locator("button[aria-expanded]");
    if ((await toggle.getAttribute("aria-expanded")) !== "true")
      await toggle.click();
    const sourceLink = row.locator(`a[href="${project.github}"]`).first();
    await expect(sourceLink).toHaveAttribute("target", "_blank");
    await expect(sourceLink).toHaveAttribute("rel", /noopener/);
  }

  for (const project of projectRoutes) {
    await page.goto(`/work/${project.id}`);
    await expect(page).toHaveURL(new RegExp(`/work/${project.id}$`));
    const title = page.locator("[data-umbral-destination] h1");
    await expect(title).toBeVisible();
    await expect.poll(() => title.innerText()).not.toBe("");
    await expect(page.locator("iframe")).toHaveCount(0);
    const githubLink = page.locator(`a[href="${project.github}"]`).first();
    await expect(githubLink).toHaveAttribute("target", "_blank");
    await expect(githubLink).toHaveAttribute("rel", /noopener/);
    if (project.source) {
      const sourcePreview = page.locator(
        `[data-project-source="${project.id}"]`,
      );
      expect(await sourcePreview.count()).toBeGreaterThan(0);
      await expect(sourcePreview.first()).toBeVisible();
      for (const preview of await sourcePreview.all())
        await expect(preview).toContainText(project.source);
    }
    if (project.id === "ana-peluquera")
      await expect(
        page
          .locator('[data-project-visual][data-preview-kind="capture"]')
          .first(),
      ).toBeVisible();
    if (project.id === "pke-web")
      await expect(page.locator("[data-project-source]")).toHaveCount(0);
    if (project.id === "rides24ofiziala")
      await expect(page.locator("[data-studio-screen]")).toHaveCount(0);
    if (project.id === "pke-web")
      await expect(page.locator('iframe[src*="pke-web"]')).toHaveCount(0);

    const externalLinks = await page
      .locator('a[href^="https://"]')
      .evaluateAll((links) =>
        links.map((link) => ({
          href: link.href,
          target: link.target,
          rel: link.rel,
        })),
      );
    for (const link of externalLinks) {
      expect(
        link.target,
        `${project.id} external link target: ${link.href}`,
      ).toBe("_blank");
      expect(
        link.rel,
        `${project.id} external link rel: ${link.href}`,
      ).toContain("noopener");
    }
  }
  expect(errors).toEqual([]);
});
