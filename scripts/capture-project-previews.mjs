import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
const output = resolve("public/projects");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1365, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});
try {
  for (const [id, url] of [
    ["ana-peluquera", "https://agpeluqueria.vercel.app"],
  ]) {
    const page = await context.newPage();
    try {
      const response = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 45000,
      });
      if (!response?.ok()) throw Error("HTTP " + response?.status());
      await page.evaluate(() =>
        Promise.race([
          document.fonts.ready,
          new Promise((r) => setTimeout(r, 6000)),
        ]),
      );
      await page.waitForTimeout(2500);
      const necessary = page.getByRole("button", {
        name: "Solo necesarias",
        exact: true,
      });
      if (await necessary.isVisible()) await necessary.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: resolve(output, id + ".jpg"),
        type: "jpeg",
        quality: 85,
      });
      console.log(
        id,
        JSON.stringify({
          title: await page.title(),
          text: (await page.locator("body").innerText()).slice(0, 220),
        }),
      );
    } catch (error) {
      console.error(id, error.message);
    }
    await page.close();
  }
} finally {
  await browser.close();
}
