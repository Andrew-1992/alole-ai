import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { parseServerEnv } = await import("@/lib/server-env");

const production = {
  APP_ENV: "production",
  RESEND_API_KEY: "re_test",
  EMAIL_FROM: "Alole <hello@example.com>",
  CONTACT_INBOX: "team@example.com",
  REDIS_URL: "rediss://default:pw@redis.example.com:6379",
};

describe("server environment", () => {
  it("accepts a complete production configuration", () => {
    const env = parseServerEnv(production);
    expect(env).toMatchObject({ EMAIL_PROVIDER: "resend", RATE_LIMIT_STORE: "redis" });
  });

  it("requires Resend and Redis in production", () => {
    expect(() => parseServerEnv({ ...production, RESEND_API_KEY: "" })).toThrow(/RESEND_API_KEY/);
    expect(() => parseServerEnv({ ...production, REDIS_URL: "" })).toThrow(/REDIS_URL/);
  });

  it("refuses the console email provider in production", () => {
    expect(() => parseServerEnv({ ...production, EMAIL_PROVIDER: "console" })).toThrow(/EMAIL_PROVIDER/);
  });

  it("allows an explicit in-memory limiter for a single production instance", () => {
    expect(parseServerEnv({ ...production, REDIS_URL: "", RATE_LIMIT_STORE: "memory" }).RATE_LIMIT_STORE).toBe("memory");
  });

  it("defaults to local stand-ins outside production", () => {
    expect(parseServerEnv({ NODE_ENV: "development" })).toMatchObject({
      APP_ENV: "development",
      EMAIL_PROVIDER: "console",
      RATE_LIMIT_STORE: "memory",
    });
  });

  it("never echoes secret values in errors", () => {
    try {
      parseServerEnv({ ...production, REDIS_URL: "http://secret-host" });
    } catch (e) {
      expect(String(e)).not.toContain("secret-host");
    }
  });
});
