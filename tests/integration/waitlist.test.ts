import { describe, expect, it } from "vitest";
import { HONEYPOT_FIELD } from "@/lib/forms/waitlist";
import { WAITLIST_LIMITS, handleWaitlistSubmission } from "@/lib/waitlist/service";
import type { WaitlistStore } from "@/lib/waitlist/store";
import { FailingEmailService, formData, waitlistDeps } from "../helpers";

const ctx = { ip: "203.0.113.7" };

describe("waitlist submission", () => {
  it("stores a valid signup and sends one fixed confirmation", async () => {
    const { deps, store, email } = waitlistDeps();
    const result = await handleWaitlistSubmission(
      formData({ email: " Ana@Example.com ", name: " Ana ", interests: ["bluckflies"] }),
      ctx,
      deps,
    );
    expect(result).toEqual({ status: "success" });
    expect(store.get("ana@example.com")).toEqual({ email: "ana@example.com", name: "Ana", interests: ["bluckflies"] });
    expect(email.sent).toHaveLength(1);
    expect(email.sent[0]).toMatchObject({ to: "ana@example.com", text: "Fixed confirmation text." });
  });

  it("never puts user-entered text in the confirmation", async () => {
    const { deps, email } = waitlistDeps();
    const name = "Click http://evil.example now";
    await handleWaitlistSubmission(formData({ email: "victim@example.com", name }), ctx, deps);
    const sent = email.sent[0];
    expect(sent?.subject).not.toContain("evil");
    expect(sent?.text).not.toContain("evil");
  });

  it("merges a duplicate signup and does not send a second confirmation", async () => {
    const { deps, store, email } = waitlistDeps();
    await handleWaitlistSubmission(formData({ email: "ana@example.com", interests: ["bluckflies"] }), ctx, deps);
    const second = await handleWaitlistSubmission(
      formData({ email: "ANA@example.com", interests: ["kodip-ai", "bluckflies"] }),
      ctx,
      deps,
    );
    expect(second).toEqual({ status: "success" });
    expect(store.size).toBe(1);
    expect(store.get("ana@example.com")?.interests).toEqual(["bluckflies", "kodip-ai"]);
    expect(email.sent).toHaveLength(1);
  });

  it.each([
    [{ email: "" }, "email", "email_required"],
    [{ email: "not-an-email" }, "email", "email_invalid"],
    [{ email: `${"a".repeat(250)}@x.co` }, "email", "email_invalid"],
    [{ email: "a@b.co", name: "x".repeat(101) }, "name", "name_too_long"],
    [{ email: "a@b.co", interests: ["not-a-product"] }, "interests", "interests_invalid"],
  ] as const)("rejects invalid input %#", async (fields, field, code) => {
    const { deps, store } = waitlistDeps();
    const result = await handleWaitlistSubmission(formData(fields as Record<string, string | string[]>), ctx, deps);
    expect(result.status).toBe("invalid");
    if (result.status === "invalid") expect(result.fieldErrors[field]).toBe(code);
    expect(store.size).toBe(0);
  });

  it("echoes only known product slugs back after a validation error", async () => {
    const { deps } = waitlistDeps();
    const result = await handleWaitlistSubmission(
      formData({ email: "bad", interests: ["bluckflies", "<script>"] }),
      ctx,
      deps,
    );
    expect(result.status === "invalid" && result.values.interests).toEqual(["bluckflies"]);
  });

  it("silently accepts a honeypot submission without storing or emailing", async () => {
    const { deps, store, email } = waitlistDeps();
    const result = await handleWaitlistSubmission(
      formData({ email: "bot@spam.co", [HONEYPOT_FIELD]: "http://spam" }),
      ctx,
      deps,
    );
    expect(result).toEqual({ status: "success" });
    expect(store.size).toBe(0);
    expect(email.sent).toHaveLength(0);
  });

  it("limits submissions per IP address", async () => {
    const { deps } = waitlistDeps();
    const statuses: string[] = [];
    for (let i = 0; i <= WAITLIST_LIMITS.perIp.limit; i++) {
      const r = await handleWaitlistSubmission(formData({ email: `person${i}@example.com` }), ctx, deps);
      statuses.push(r.status);
    }
    expect(statuses.slice(0, -1).every((s) => s === "success")).toBe(true);
    expect(statuses.at(-1)).toBe("rate_limited");
    // A different IP is unaffected.
    const other = await handleWaitlistSubmission(formData({ email: "x@example.com" }), { ip: "198.51.100.1" }, deps);
    expect(other.status).toBe("success");
  });

  it("limits submissions per email address across IPs", async () => {
    const { deps } = waitlistDeps();
    const statuses: string[] = [];
    for (let i = 0; i <= WAITLIST_LIMITS.perEmail.limit; i++) {
      const r = await handleWaitlistSubmission(formData({ email: "same@example.com" }), { ip: `198.51.100.${i}` }, deps);
      statuses.push(r.status);
    }
    expect(statuses.at(-1)).toBe("rate_limited");
  });

  it("returns a generic error when the store fails, and logs no personal data", async () => {
    const failing: WaitlistStore = { upsert: () => Promise.reject(new Error("provider said ana@example.com")) };
    const { deps } = waitlistDeps({ store: failing });
    const result = await handleWaitlistSubmission(formData({ email: "ana@example.com" }), ctx, deps);
    expect(result).toEqual({ status: "error" });
    expect(deps.logError).toHaveBeenCalledWith("waitlist.store_failed", expect.any(Error));
  });

  it("still succeeds when only the confirmation email fails", async () => {
    const email = new FailingEmailService();
    const { deps, store } = waitlistDeps({ email });
    const result = await handleWaitlistSubmission(formData({ email: "ana@example.com" }), ctx, deps);
    expect(result).toEqual({ status: "success" });
    expect(store.size).toBe(1);
    expect(deps.logError).toHaveBeenCalledWith("waitlist.confirmation_failed", expect.any(Error));
  });
});
