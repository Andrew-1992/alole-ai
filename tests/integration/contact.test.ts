import { describe, expect, it } from "vitest";
import { CONTACT_LIMITS, contactNotification, handleContactSubmission } from "@/lib/contact/service";
import { ConsoleEmailService, type EmailMessage, type EmailService } from "@/lib/email/service";
import { FailingEmailService, contactDeps, formData } from "../helpers";

const ctx = { ip: "203.0.113.7" };
const valid = {
  name: "Ana Lado",
  email: "Ana@Example.com",
  organisation: "Juba Bakery",
  topic: "partnership",
  message: "We'd like to talk about an AI agent pilot.",
};
const project = {
  ...valid,
  topic: "client-project",
  service: "automation",
  timeline: "within-3-months",
  message: "We want incoming invoices read and entered automatically.",
};

describe("enquiry submission", () => {
  it("delivers to the inbox with reply-to set to the sender, then a fixed confirmation", async () => {
    const { deps, email } = contactDeps();
    const result = await handleContactSubmission(formData(valid), ctx, deps);
    expect(result).toEqual({ status: "success", topic: "partnership" });
    expect(email.sent).toHaveLength(2);
    const [notification, confirmation] = email.sent;
    expect(notification).toMatchObject({ to: "team@example.com", replyTo: "ana@example.com" });
    expect(notification?.text).toContain(valid.message);
    expect(confirmation).toMatchObject({ to: "ana@example.com", text: "Fixed confirmation text." });
  });

  it("never copies user-entered text into the confirmation sent to the submitter", async () => {
    const { deps, email } = contactDeps();
    await handleContactSubmission(
      formData({ ...valid, name: "Visit evil.example", message: "Buy now at evil.example please" }),
      ctx,
      deps,
    );
    const confirmation = email.sent.find((m) => m.to === "ana@example.com");
    expect(JSON.stringify(confirmation)).not.toContain("evil");
  });

  it.each([
    [{ name: "" }, "name", "name_required"],
    [{ email: "nope" }, "email", "email_invalid"],
    [{ organisation: "x".repeat(151) }, "organisation", "organisation_too_long"],
    [{ topic: "spam" }, "topic", "topic_invalid"],
    [{ message: "short" }, "message", "message_too_short"],
    [{ message: "x".repeat(5001) }, "message", "message_too_long"],
  ] as const)("rejects invalid input %#", async (patch, field, code) => {
    const { deps, email } = contactDeps();
    const result = await handleContactSubmission(formData({ ...valid, ...patch }), ctx, deps);
    expect(result.status).toBe("invalid");
    if (result.status === "invalid") expect(result.fieldErrors[field]).toBe(code);
    expect(email.sent).toHaveLength(0);
  });

  it("silently drops honeypot submissions", async () => {
    const { deps, email } = contactDeps();
    const result = await handleContactSubmission(formData({ ...valid, website: "x" }), ctx, deps);
    expect(result.status).toBe("success");
    expect(email.sent).toHaveLength(0);
  });

  it("limits submissions per IP", async () => {
    const { deps } = contactDeps();
    let last = "";
    for (let i = 0; i <= CONTACT_LIMITS.perIp.limit; i++) {
      last = (await handleContactSubmission(formData({ ...valid, email: `p${i}@example.com` }), ctx, deps)).status;
    }
    expect(last).toBe("rate_limited");
  });

  it("limits submissions per email address", async () => {
    const { deps } = contactDeps();
    let last = "";
    for (let i = 0; i <= CONTACT_LIMITS.perEmail.limit; i++) {
      last = (await handleContactSubmission(formData(valid), { ip: `198.51.100.${i}` }, deps)).status;
    }
    expect(last).toBe("rate_limited");
  });

  it("returns a generic error when delivery fails", async () => {
    const email = new FailingEmailService();
    const { deps } = contactDeps({ email });
    const result = await handleContactSubmission(formData(valid), ctx, deps);
    expect(result).toEqual({ status: "error" });
    expect(deps.logError).toHaveBeenCalledWith("contact.delivery_failed", expect.any(Error));
  });

  it("succeeds when only the confirmation fails", async () => {
    // Delivers the first message, fails the second.
    class FlakyEmail implements EmailService {
      readonly inner = new ConsoleEmailService();
      async send(m: EmailMessage) {
        if (this.inner.sent.length >= 1) throw new Error("down");
        await this.inner.send(m);
      }
    }
    const { deps } = contactDeps({ email: new FlakyEmail() });
    const result = await handleContactSubmission(formData(valid), ctx, deps);
    expect(result.status).toBe("success");
    expect(deps.logError).toHaveBeenCalledWith("contact.confirmation_failed", expect.any(Error));
  });
});

describe("client project enquiries", () => {
  it("includes service and timeline, and prefixes the subject by topic", async () => {
    const { deps, email } = contactDeps();
    const result = await handleContactSubmission(formData(project), ctx, deps);
    expect(result).toEqual({ status: "success", topic: "client-project" });
    const notification = email.sent[0];
    expect(notification?.subject).toBe("[Project] Juba Bakery: Ana Lado");
    expect(notification?.text).toContain("Service of interest: service:automation");
    expect(notification?.text).toContain("Timeline: timeline:within-3-months");
  });

  it("requires an organisation for a client project only", async () => {
    const { deps } = contactDeps();
    const result = await handleContactSubmission(formData({ ...project, organisation: "  " }), ctx, deps);
    expect(result.status).toBe("invalid");
    if (result.status === "invalid") expect(result.fieldErrors.organisation).toBe("organisation_required");

    const general = await handleContactSubmission(
      formData({ ...valid, topic: "general", organisation: "" }),
      { ip: "198.51.100.9" },
      deps,
    );
    expect(general.status).toBe("success");
  });

  it("treats service and timeline as optional", async () => {
    const { deps, email } = contactDeps();
    const result = await handleContactSubmission(formData({ ...project, service: "", timeline: "" }), ctx, deps);
    expect(result.status).toBe("success");
    expect(email.sent[0]?.text).toContain("Service of interest: (not given)");
  });

  it("rejects values outside the lists", async () => {
    const { deps } = contactDeps();
    const result = await handleContactSubmission(
      formData({ ...project, service: "budget-10k", timeline: "yesterday" }),
      ctx,
      deps,
    );
    expect(result.status).toBe("invalid");
    if (result.status === "invalid") {
      expect(result.fieldErrors.service).toBe("service_invalid");
      expect(result.fieldErrors.timeline).toBe("timeline_invalid");
    }
  });

  it("ignores project fields for other topics (they are visible without JavaScript)", async () => {
    const { deps, email } = contactDeps();
    await handleContactSubmission(formData({ ...project, topic: "press" }), ctx, deps);
    expect(email.sent[0]?.subject).toBe("[Other] Juba Bakery: Ana Lado");
    expect(email.sent[0]?.text).not.toContain("Service of interest");
  });

  it("keeps the subject on one line", () => {
    const n = contactNotification(
      {
        name: "Ana",
        email: "a@b.co",
        topic: "general",
        message: "Hello there team",
        organisation: undefined,
        service: undefined,
        timeline: undefined,
      },
      contactDeps().deps.labels,
    );
    expect(n.subject).toBe("[Other] Ana");
    expect(n.subject).not.toContain("\n");
  });
});
