import { expect, test } from "./fixtures";

const email = (tag: string) => `${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`;

test.describe("enquiry form, with JavaScript", () => {
  test("validates, then sends a general enquiry", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByLabel("Topic")).toHaveValue("general");
    // Project fields only appear for client projects.
    await expect(page.getByLabel(/Service of interest/)).toBeHidden();
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Enter your name.")).toBeVisible();
    await expect(page.getByText("Write a message of at least 10 characters.")).toBeVisible();

    await page.getByLabel("Name").fill("Ana Lado");
    await page.getByLabel("Email").fill(email("general"));
    await page.getByLabel("Topic").selectOption("partnership");
    await page.getByLabel("Message").fill("We'd like to talk about an AI agent pilot for our shops.");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toHaveText(/your message is on its way/);
  });

  test("choosing Client project reveals the project fields and requires an organisation", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Topic").selectOption("client-project");
    const service = page.getByLabel(/Service of interest/);
    await expect(service).toBeVisible();
    await expect(page.getByLabel(/Timeline/)).toBeVisible();
    await expect(page.getByLabel(/^Organisation/)).toHaveAttribute("aria-required", "true");

    await page.getByLabel("Name").fill("Ana Lado");
    await page.getByLabel("Email").fill(email("project"));
    await service.selectOption("custom-agent");
    await page.getByLabel(/Timeline/).selectOption("3-6-months");
    await page.getByLabel("Message").fill("We need an agent to handle bookings and follow-ups.");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Enter your organisation's name for a client project.")).toBeVisible();

    await page.getByLabel(/^Organisation/).fill("Juba Bakery");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toHaveText(/your message is on its way/);
  });

  test("the solutions page form starts on Client project", async ({ page }) => {
    await page.goto("/solutions");
    await page.getByRole("main").getByRole("link", { name: "Start a project" }).first().click();
    await expect(page).toHaveURL(/#start-a-project$/);
    const form = page.locator("#start-a-project");
    await expect(form.getByLabel("Topic")).toHaveValue("client-project");
    await expect(form.getByLabel(/Service of interest/)).toBeVisible();
  });

  test("Careers and Press link to the enquiry form with their topic", async ({ page }) => {
    await page.goto("/careers");
    await page.getByRole("link", { name: "Tell us about yourself" }).click();
    await expect(page.getByLabel("Topic")).toHaveValue("careers");
    await page.goto("/press");
    await page.getByRole("link", { name: "Contact the press team" }).click();
    await expect(page.getByLabel("Topic")).toHaveValue("press");
  });
});
