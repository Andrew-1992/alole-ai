import { expect, test } from "./fixtures";

/** Unique address per run so repeat submissions don't trip the per-email limit. */
const email = (tag: string) => `e2e-${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`;

test.describe("on a phone, with JavaScript", () => {
  test("the mobile menu opens and links to every section", async ({ page }) => {
    await page.goto("/");
    await page.locator("summary", { hasText: "Menu" }).click();
    const menu = page.locator("details[open] nav");
    await expect(menu.getByRole("link", { name: "Solutions", exact: true })).toBeVisible();
    await expect(menu.getByRole("link", { name: /Custom AI agents/ })).toBeVisible();
    await menu.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("all page content is readable", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText("Your workflows, run by AI agents.");
    for (const item of ["Customer messages", "AI layer", "Replies drafted"]) {
      await expect(page.getByText(item, { exact: true }).first()).toBeVisible();
    }
    // Controls that need JavaScript are hidden rather than broken.
    await expect(page.getByRole("button", { name: /theme/ })).toBeHidden();
  });

  test("the menu still opens as a plain list of links", async ({ page }) => {
    await page.goto("/");
    await page.locator("summary", { hasText: "Menu" }).click();
    await expect(page.locator("details[open] nav a")).toHaveCount(9);
  });

  test("the desktop solutions menu opens natively and links to every service", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" }).first();
    await nav.getByLabel("Show solutions").click();
    await expect(nav.getByRole("link", { name: "All solutions" })).toHaveAttribute("href", "/solutions");
    for (const id of ["custom-agent", "automation", "integration"]) {
      await expect(nav.locator(`a[href="/solutions#${id}"]`)).toBeVisible();
    }
  });

  test("the service picker is replaced by a link to compare services", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "See all services" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Customers get answers/ })).toBeHidden();
  });

  test("the contact form submits with its topic preselected", async ({ page }) => {
    await page.goto("/contact/press");
    await expect(page.getByLabel("Topic")).toHaveValue("press");
    await page.getByLabel("Name").fill("Ana Lado");
    await page.getByLabel("Email").fill(email("contact"));
    await page.getByLabel("Message").fill("Could we interview your founder next week?");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toHaveText(/your message is on its way/);
  });

  test("the enquiry form shows every field and still requires an organisation for client projects", async ({
    page,
  }) => {
    await page.goto("/contact");
    // Project fields are visible (and optional) because they cannot follow the topic without JavaScript.
    await expect(page.getByLabel(/Service of interest/)).toBeVisible();
    await expect(page.getByLabel(/Timeline/)).toBeVisible();
    await expect(page.getByText("(required for client projects)")).toBeVisible();

    await page.getByLabel("Topic").selectOption("client-project");
    await page.getByLabel("Name").fill("Ana Lado");
    await page.getByLabel("Email").fill(email("project"));
    await page.getByLabel(/Service of interest/).selectOption("integration");
    await page.getByLabel("Message").fill("We want an assistant inside our customer system.");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Enter your organisation's name for a client project.")).toBeVisible();
    await expect(page.getByLabel(/Service of interest/)).toHaveValue("integration");

    await page.getByLabel(/^Organisation/).fill("Juba Bakery");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toHaveText(/your message is on its way/);
  });
});
