import { expect, test } from "@playwright/test";
import { PAGES } from "./pages";

test.describe("pages and links", () => {
  for (const path of PAGES) {
    test(`${path} renders with one h1, a unique title and a canonical URL`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/Alole/);
      expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toMatch(/^https?:\/\//);
      expect(await page.locator('meta[property="og:image"]').count()).toBeGreaterThan(0);
    });
  }

  test("titles are unique across indexable pages", async ({ page }) => {
    const titles = new Map<string, string>();
    for (const path of PAGES.filter((p) => !p.startsWith("/contact/"))) {
      await page.goto(path);
      const title = await page.title();
      expect(titles.has(title), `duplicate title "${title}" on ${path} and ${titles.get(title)}`).toBe(false);
      titles.set(title, path);
    }
  });

  test("no broken internal links or assets anywhere on the site", async ({ page, request }) => {
    const seen = new Set<string>();
    for (const path of PAGES) {
      await page.goto(path);
      const hrefs = await page.$$eval("a[href], img[src], link[rel=icon][href]", (els) =>
        els.map((el) => el.getAttribute("href") ?? el.getAttribute("src") ?? ""),
      );
      for (const href of hrefs) {
        if (!href.startsWith("/") || href.startsWith("//")) continue;
        seen.add(href.split("#")[0] || "/");
      }
    }
    for (const href of seen) {
      const res = await request.get(href);
      expect(res.status(), `${href} returned ${res.status()}`).toBe(200);
    }
    expect(seen.size).toBeGreaterThan(15);
  });

  test("unknown pages return a 404 with links home and to solutions", async ({ page }) => {
    for (const path of ["/does-not-exist", "/contact/not-a-topic", "/contact/product-enquiry"]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
      await expect(page.getByRole("link", { name: "Go to the home page" })).toBeVisible();
      await expect(page.getByRole("main").getByRole("link", { name: /products/i })).toHaveCount(0);
      await expect(page.getByRole("main").getByRole("link", { name: "See our solutions" })).toBeVisible();
    }
  });

  test("sitemap and robots use absolute URLs from SITE_URL", async ({ request }) => {
    // SITE_URL is read at build time, so compare against the URLs the build wrote.
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] ?? "");
    expect(urls).toHaveLength(8);
    expect(urls).toContain(`${new URL(urls[0] ?? "").origin}/solutions`);
    const origin = new URL(urls[0] ?? "").origin;
    expect(urls.some((u) => u.includes("/products"))).toBe(false);
    expect(sitemap).not.toContain("/contact/press");
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain(`Sitemap: ${origin}/sitemap.xml`);
  });

  test("old product links redirect permanently to the solutions page", async ({ request }) => {
    for (const path of ["/products", "/products/bluckflies"]) {
      const res = await request.get(path, { maxRedirects: 0 });
      expect(res.status(), path).toBe(308);
      expect(res.headers().location, path).toMatch(/\/solutions$/);
    }
  });

  test("structured data is valid JSON and lists only the organisation and site", async ({ page }) => {
    await page.goto("/");
    const blocks = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => e.textContent ?? ""));
    const types = blocks.map((b) => (JSON.parse(b) as { "@type": string })["@type"]);
    expect(types).toEqual(["Organization", "WebSite"]);
  });

  test("the header solutions menu works with the keyboard and closes on Escape", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const toggle = page.getByLabel("Show solutions");
    await toggle.click();
    const agents = page.getByRole("banner").getByRole("link", { name: /Custom AI agents/ });
    await expect(agents).toBeVisible();
    await expect(agents).toHaveAttribute("href", "/solutions#custom-agent");
    await page.keyboard.press("Escape");
    await expect(agents).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test("client-side navigation keeps working under the CSP", async ({ page }) => {
    const violations: string[] = [];
    page.on("console", (m) => {
      if (/Content Security Policy/i.test(m.text())) violations.push(m.text());
    });
    await page.goto("/");
    await page.getByRole("main").getByRole("link", { name: /AI automation/ }).first().click();
    await expect(page).toHaveURL(/\/solutions#automation$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("AI built into how your organisation works.");
    await page.getByRole("contentinfo").getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("heading", { level: 2, name: "Leadership" })).toBeVisible();
    expect(violations).toEqual([]);
  });

  test("Start a project leads to the enquiry form with Client project chosen", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/about");
    await page.getByRole("banner").getByRole("link", { name: "Start a project" }).click();
    await expect(page).toHaveURL(/\/contact\/client-project$/);
    await expect(page.getByLabel("Topic")).toHaveValue("client-project");
    await expect(page.getByLabel(/Service of interest/)).toBeVisible();
  });

  test("the company is not presented as registered while registration is pending", async ({ page }) => {
    for (const path of ["/", "/press", "/about"]) {
      await page.goto(path);
      await expect(page.locator("body")).not.toContainText("Company Limited");
    }
    await expect(page.getByRole("contentinfo")).toContainText("Alole, Juba, South Sudan");
  });

  test("the footer links the phone number and hides unset contact options", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "+211 980 268 376" })).toHaveAttribute("href", "tel:+211980268376");
    await expect(footer.getByRole("link", { name: "Chat on WhatsApp" })).toHaveCount(0);
    await expect(footer.locator('a[href^="mailto:"]')).toHaveCount(0);
  });

  test("the solutions page explains the services and process", async ({ page }) => {
    await page.goto("/solutions");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("AI built into how your organisation works.");
    for (const name of ["AI automation", "AI integration", "Custom AI agents"]) {
      await expect(page.getByRole("heading", { level: 3, name })).toBeVisible();
    }
    for (const step of ["Discover", "Design", "Build", "Support"]) {
      await expect(page.getByRole("heading", { level: 3, name: step })).toBeVisible();
    }
    await expect(page.getByRole("button", { name: "Customer messages" })).toBeVisible();
    await expect(page.getByText("Illustrative").first()).toBeVisible();
    await expect(page.locator("#start-a-project").getByLabel("Topic")).toHaveValue("client-project");
    // Case studies stay hidden until real, approved ones exist.
    await expect(page.locator("#case-studies")).toHaveCount(0);
  });
});

test("the home page sections follow the agreed order", async ({ page }) => {
  await page.goto("/");
  const headings = await page.locator("main h2").allTextContents();
  expect(headings.map((h) => h.trim())).toEqual([
    "AI that works inside your business.",
    "AI built into your organisation.",
    "Not sure where to start?",
    "How we work",
    "Who we work with",
    "Why Alole",
    "Mission",
    "Questions",
    "Have a project in mind?",
  ]);
  await expect(page.getByRole("list", { name: "What Alole builds" }).getByRole("listitem")).toHaveCount(3);
  await expect(page.getByText("Omol Andrew Einstein")).toBeVisible();
});

test("the how-it-works diagram responds to a chosen system", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const documents = page.getByRole("button", { name: "Documents" });
  await documents.click();
  await expect(documents).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Customer messages" })).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByText("Documents. Result: Records updated.")).toBeAttached();
});

test("the service picker suggests a service and pre-fills the enquiry form", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "My team stops repeating the same tasks" }).click();
  await expect(page.getByText("Question 2 of 3")).toBeVisible();
  await page.getByRole("button", { name: "Our own software or database" }).click();
  await page.getByRole("button", { name: "Within 3 months" }).click();
  const result = page.getByRole("status").filter({ hasText: "AI automation" });
  await expect(result).toContainText("AI automation");
  await expect(result).toContainText("Also worth a look: AI integration");
  await result.getByRole("link", { name: "Start a project" }).click();
  await expect(page).toHaveURL(/\/contact\/client-project#service=automation&timeline=within-3-months$/);
  await expect(page.getByLabel(/Service of interest/)).toHaveValue("automation");
  await expect(page.getByLabel(/Timeline/)).toHaveValue("within-3-months");
});

test("Sign in leads to an honest placeholder with no login form", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.getByRole("banner").getByRole("link", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Client sign-in is coming soon.");
  await expect(page.locator("input[type=password]")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
