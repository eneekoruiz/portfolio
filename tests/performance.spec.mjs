import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
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

test("first visit shows content without an intro or GitHub request", async ({
  page,
}, info) => {
  let github = 0;
  const errors = [];
  const resourceErrors = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/github/")) github++;
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (/violat.*Content Security Policy|Refused to/i.test(message.text()))
      resourceErrors.push(message.text());
  });
  page.on("response", (response) => {
    if (
      response.status() >= 400 &&
      /\.(woff2|webp|png|svg|webm)(\?|$)/.test(response.url())
    )
      resourceErrors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/");
  await expect(page.locator("#hero h1")).toBeVisible();
  await expect(page.locator('#hero a[href="#work"]')).toBeVisible();
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.locator(".identity-splash, #preloader")).toHaveCount(0);
  await page.waitForTimeout(1500);
  expect(github).toBe(0);
  const result = await page.evaluate(() => ({
    viewport: innerWidth,
    width: document.documentElement.scrollWidth,
    contact: !!document.querySelector('a[href^="mailto:"]'),
    sections: [...document.querySelectorAll("main > section")].map((e) => e.id),
    ttfb: performance.getEntriesByType("navigation")[0].responseStart,
    domReady:
      performance.getEntriesByType("navigation")[0].domContentLoadedEventEnd,
  }));
  expect(result.width).toBeLessThanOrEqual(page.viewportSize().width + 1);
  expect(result.sections.slice(0, 3)).toEqual(["hero", "expertise", "work"]);
  expect(result.contact).toBe(true);
  expect(errors).toEqual([]);
  expect(resourceErrors).toEqual([]);
  await info.attach("local-navigation", {
    body: JSON.stringify(result),
    contentType: "application/json",
  });
  await info.attach("local-resources", {
    body: JSON.stringify(
      await page.evaluate(() =>
        performance.getEntriesByType("resource").map((entry) => ({
          url: entry.name.replace(location.origin, ""),
          bytes: entry.transferSize,
          duration: Math.round(entry.duration),
        })),
      ),
    ),
    contentType: "application/json",
  });
  await page.screenshot({ path: info.outputPath("hero.png") });
});

test("lightweight and reduced motion never allocate a WebGL canvas or fetch hidden video", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const videos = [];
  page.on("request", (r) => {
    if (r.url().endsWith("memoji.webm")) videos.push(r.url());
  });
  // A stored opt-in must not override the operating system accessibility preference.
  await page.addInitScript(() =>
    localStorage.setItem("portfolio-motion-enabled", "true"),
  );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await page.waitForTimeout(1500);
  await expect(page.locator(".materia-canvas canvas")).toHaveCount(0);
  await expect(page.locator("[data-dna-static]")).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.getAnimations().filter((a) => a.playState === "running")
          .length,
    ),
  ).toBe(0);
  expect(videos).toHaveLength(0);
  await expect(page.locator("main > header")).toBeVisible();
  const bounds = await page.locator("main > header").boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(
    page.viewportSize().width + 1,
  );
});

test("mobile stays static while modest desktop keeps lightweight motion and readable skills", async ({
  page,
}, info) => {
  const modestDesktop = info.project.name === "desktop";
  if (modestDesktop)
    await page.addInitScript(() =>
      Object.defineProperty(navigator, "deviceMemory", {
        get: () => 2,
        configurable: true,
      }),
    );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute(
    "data-motion",
    modestDesktop ? "on" : "off",
  );
  await expect(page.locator(".materia-canvas canvas")).toHaveCount(0);
  await expect(page.locator("[data-dna-static]")).toBeVisible();
  if (modestDesktop) {
    const rung = page.locator("[data-dna-static] line").first();
    await expect(rung).toBeVisible();
    const startingX = await rung.getAttribute("x1");
    await expect.poll(() => rung.getAttribute("x1")).not.toBe(startingX);
  }
  const skills = page.locator("#skills");
  await skills.scrollIntoViewIfNeeded();
  if (!modestDesktop)
    await expect(skills.locator("[data-orbit-active]")).toHaveCount(0);
  for (const text of ["Python", "Java", "Node.js", "React", "TypeScript"])
    await expect(skills.getByText(text, { exact: true })).toBeVisible();
  if (modestDesktop) {
    await page.goto("/work/ana-peluquera");
    const studio = page.locator('[data-studio-screen="cinematic"]');
    await expect(studio).toBeVisible();
    await expect(studio).toHaveCSS("transform-style", "preserve-3d");
  }
});

test("optional activity loads on approach and failure preserves featured work and contact", async ({
  page,
}, info) => {
  let calls = 0;
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.__activityObserverEvents = [];
    const NativeObserver = window.IntersectionObserver;
    window.IntersectionObserver = class extends NativeObserver {
      constructor(callback, options) {
        super((entries, observer) => {
          for (const entry of entries) {
            if (entry.target.id === "github")
              window.__activityObserverEvents.push({
                near: entry.isIntersecting,
                connected: entry.target.isConnected,
                visibility: document.visibilityState,
                top: entry.boundingClientRect.top,
                bottom: entry.boundingClientRect.bottom,
              });
          }
          callback(entries, observer);
        }, options);
      }
    };
  });
  await page.route("**/api/github/repos?**", async (route) => {
    calls++;
    await route.fulfill({ status: 503, body: "{}" });
  });
  await page.goto("/");
  expect(calls).toBe(0);
  await page.locator("#github").scrollIntoViewIfNeeded();
  try {
    await expect.poll(() => calls).toBe(1);
  } catch (error) {
    await info.attach("activity-observer-diagnostic", {
      body: JSON.stringify({
        calls,
        errors,
        page: await page.evaluate(() => ({
          visibility: document.visibilityState,
          observerEvents: window.__activityObserverEvents,
          sections: [...document.querySelectorAll("#github")].map(
            (section) => ({
              connected: section.isConnected,
              rect: section.getBoundingClientRect().toJSON(),
            }),
          ),
        })),
      }),
      contentType: "application/json",
    });
    throw error;
  }
  await expect(
    page.locator('#github a[href="https://github.com/eneekoruiz"]').first(),
  ).toBeVisible();
  await expect(page.locator("[data-project-title]")).toHaveCount(5);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(
    page.locator('#contact a[href^="mailto:"]').first(),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("content and contact survive disabled JavaScript", async ({
  browser,
}, info) => {
  const profile = info.project.use;
  const context = await browser.newContext({
    baseURL: profile.baseURL,
    viewport: profile.viewport,
    isMobile: profile.isMobile,
    hasTouch: profile.hasTouch,
    userAgent: profile.userAgent,
    deviceScaleFactor: profile.deviceScaleFactor,
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(page.locator("#hero h1")).toBeVisible();
    expect(
      await page
        .locator("body")
        .evaluate((body) => getComputedStyle(body).cursor),
    ).not.toBe("none");
    await expect(page.locator("[data-project-title]")).toHaveCount(5);
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(
      page.locator('#contact a[href^="mailto:"]').first(),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});

test("project accordion, route and native back remain usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const button = page.locator("#btn-ana-peluquera");
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page
    .locator('#panel-ana-peluquera a[href="/work/ana-peluquera"]')
    .click();
  await expect(page).toHaveURL(/\/work\/ana-peluquera$/);
  await expect(
    page.locator('[data-project-visual][data-preview-kind="capture"]').first(),
  ).toBeVisible();
  await page.goBack();
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.locator("#btn-ana-peluquera")).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});

test("desktop scene stops drawing when its hero leaves the viewport", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.addInitScript(() => {
    window.__draws = 0;
    for (const name of [
      "drawArrays",
      "drawElements",
      "drawArraysInstanced",
      "drawElementsInstanced",
    ]) {
      const original = WebGL2RenderingContext.prototype[name];
      WebGL2RenderingContext.prototype[name] = function (...args) {
        window.__draws++;
        return original.apply(this, args);
      };
    }
  });
  await page.goto("/");
  await expect(page.locator(".materia-canvas canvas")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.__draws))
    .toBeGreaterThan(0);
  // Visibility pauses an existing scene instead of destroying and re-baking it.
  const canvas = await page.locator(".materia-canvas canvas").elementHandle();
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  const degraded =
    (await page
      .locator(".materia-canvas")
      .getAttribute("data-scene-degraded")) === "true";
  if (degraded) {
    // A slow software GPU may legitimately release the scene during this check.
    await expect(page.locator(".materia-canvas canvas")).toHaveCount(0);
    await expect(page.locator("[data-dna-static]")).toBeVisible();
  } else
    expect(await canvas.evaluate((element) => element.isConnected)).toBe(true);
  await page.evaluate(() => {
    delete document.visibilityState;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  if (!degraded)
    expect(
      await canvas.evaluate(
        (element) =>
          element === document.querySelector(".materia-canvas canvas"),
      ),
    ).toBe(true);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator(".materia-canvas")).toHaveAttribute(
    "data-scene-active",
    "false",
  );
  await page.waitForTimeout(700);
  const draws = await page.evaluate(() => window.__draws);
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => window.__draws)).toBe(draws);
  await page.locator("[data-motion-toggle]").click();
  await expect(page.locator(".materia-canvas canvas")).toHaveCount(0);
});

test("decorations pause outside their viewport and custom cursor releases native ownership", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await expect(page.locator("[data-floating-active]")).toHaveAttribute(
    "data-floating-active",
    "true",
  );
  await expect(page.locator("[data-marquee-active]")).toHaveAttribute(
    "data-marquee-active",
    "false",
  );
  await page.mouse.move(100, 120);
  await expect(page.locator("html")).toHaveClass(/has-custom-cursor/);
  await page.evaluate(() =>
    window.dispatchEvent(
      new PointerEvent("pointerout", { relatedTarget: document.body }),
    ),
  );
  await expect(page.locator("html")).toHaveClass(/has-custom-cursor/);
  await page.locator("[data-marquee-active]").scrollIntoViewIfNeeded();
  await page.mouse.move(1, 1);
  await expect(page.locator("[data-marquee-active]")).toHaveAttribute(
    "data-marquee-active",
    "true",
  );
  await expect(page.locator("[data-floating-active]")).toHaveAttribute(
    "data-floating-active",
    "false",
  );
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-marquee-active]")).toHaveAttribute(
    "data-marquee-active",
    "false",
  );
  expect(
    await page
      .locator(".portfolio-marquee-track")
      .evaluate((element) => getComputedStyle(element).animationPlayState),
  ).toBe("paused");
  await page.locator("[data-motion-toggle]").click();
  await expect(page.locator("html")).not.toHaveClass(/has-custom-cursor/);
  expect(
    await page
      .locator("body")
      .evaluate((body) => getComputedStyle(body).cursor),
  ).not.toBe("none");
});

test("project diagrams pause offscreen and hidden tabs preserve the reading position", async ({
  page,
}, info) => {
  await page.addInitScript(() => {
    window.__diagramDraws = 0;
    const clear = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.parentElement?.hasAttribute("data-distributed-active"))
        window.__diagramDraws++;
      return clear.apply(this, args);
    };
  });
  await page.goto("/work/rides24ofiziala");
  await expect(page.locator("iframe")).toHaveCount(0);
  const diagram = page.locator("[data-distributed-active]");
  await diagram.scrollIntoViewIfNeeded();
  const animated = info.project.name === "desktop";
  await expect(diagram).toHaveAttribute(
    "data-distributed-active",
    String(animated),
  );
  if (animated) {
    await expect(page.locator("[data-terrain-active]")).toHaveAttribute(
      "data-terrain-active",
      "false",
    );
    const position = await page.evaluate(() => scrollY);
    const height = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => "hidden",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect(diagram).toHaveAttribute("data-distributed-active", "false");
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => scrollY)).toBe(position);
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight),
    ).toBe(height);
    await page.evaluate(() => {
      delete document.visibilityState;
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect(diagram).toHaveAttribute("data-distributed-active", "true");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await diagram.scrollIntoViewIfNeeded();
  await expect(diagram).toHaveAttribute("data-distributed-active", "false");
  await page.waitForTimeout(500);
  const draws = await page.evaluate(() => window.__diagramDraws);
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => window.__diagramDraws)).toBe(draws);
});
