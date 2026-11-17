import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PAGES } from "./pages";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

for (const scheme of ["light", "dark"] as const) {
  test.describe(`axe, ${scheme} theme`, () => {
    test.use({ colorScheme: scheme, reducedMotion: "reduce" });
    for (const path of [...PAGES, "/does-not-exist"]) {
      test(`${path} has no axe violations`, async ({ page }) => {
        await page.goto(path, { waitUntil: "networkidle" });
        const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
        expect(summary).toEqual([]);
      });
    }
  });
}

test.describe("keyboard", () => {
  test("skip link moves focus to the main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });
});

test.describe("contrast regressions", () => {
  for (const scheme of ["light", "dark"] as const) {
    test(`the closing Start a project button is readable (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto("/");
      const button = page.locator('section[aria-labelledby="final-cta-heading"]').getByRole("link", { name: "Start a project" });
      await expect(button).toBeVisible();
      const [color, background] = await button.evaluate((el) => {
        const style = getComputedStyle(el);
        return [style.color, style.backgroundColor];
      });
      expect(color).not.toBe(background);
    });
  }
});
