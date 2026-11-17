import { expect, test } from "@playwright/test";
import { PAGES } from "./pages";

test.describe("security headers and CSP", () => {
  test("every page sends a strict script policy and the standard headers", async ({ request }) => {
    for (const path of PAGES) {
      const res = await request.get(path);
      const headers = res.headers();
      const csp = headers["content-security-policy"] ?? "";
      const scriptSrc = csp.split(";").find((d) => d.trim().startsWith("script-src")) ?? "";
      expect(scriptSrc, path).toContain("'sha256-");
      expect(scriptSrc, path).not.toContain("unsafe-inline");
      expect(scriptSrc, path).not.toContain("unsafe-eval");
      expect(csp, path).toContain("frame-ancestors 'none'");
      expect(headers["strict-transport-security"], path).toContain("max-age=");
      expect(headers["x-content-type-options"], path).toBe("nosniff");
      expect(headers["referrer-policy"], path).toBe("strict-origin-when-cross-origin");
      expect(headers["permissions-policy"], path).toContain("camera=()");
      expect(headers["x-powered-by"], path).toBeUndefined();
    }
  });

  for (const path of PAGES) {
    test(`${path} hydrates under the CSP with no violations`, async ({ page }) => {
      const problems: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error") problems.push(m.text());
      });
      page.on("pageerror", (e) => problems.push(String(e)));
      await page.goto(path, { waitUntil: "networkidle" });
      // The theme toggle only responds once React has hydrated.
      const before = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
      await page.getByRole("button", { name: /Switch to (dark|light) theme/ }).click();
      await expect
        .poll(() => page.evaluate(() => document.documentElement.getAttribute("data-theme")))
        .not.toBe(before);
      expect(problems).toEqual([]);
    });
  }

  test("the API health check is locked down and uncached", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
    expect(res.headers()["content-security-policy"]).toContain("default-src 'none'");
    expect(res.headers()["cache-control"]).toContain("no-store");
  });

  test("the site cannot be framed", async ({ request }) => {
    const res = await request.get("/");
    expect(res.headers()["x-frame-options"]).toBe("DENY");
  });

  test("the theme choice persists without a flash of the wrong theme", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    // Inspect the document before any framework script runs.
    await page.route("**/_next/static/**/*.js", (route) => route.abort());
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.getAttribute("data-theme"))).toBe("dark");
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe("rgb(23, 23, 23)");
  });
});
