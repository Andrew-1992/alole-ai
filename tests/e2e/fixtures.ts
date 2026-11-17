import { createHash } from "node:crypto";
import { test as base } from "@playwright/test";

/**
 * Gives every test its own client IP (via X-Forwarded-For), as separate real
 * visitors would have. Without this, all tests share one address and the
 * per-IP form rate limits, correctly, start refusing submissions.
 */
export const test = base.extend({
  extraHTTPHeaders: async ({ extraHTTPHeaders }, provide, testInfo) => {
    const bytes = createHash("sha256").update(`${testInfo.testId}:${testInfo.retry}:${testInfo.project.name}`).digest();
    const ip = `10.${bytes[0] ?? 0}.${bytes[1] ?? 0}.${bytes[2] ?? 0}`;
    await provide({ ...extraHTTPHeaders, "x-forwarded-for": ip });
  },
});

export { expect } from "@playwright/test";
