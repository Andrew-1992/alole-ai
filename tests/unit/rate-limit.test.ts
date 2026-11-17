import { describe, expect, it } from "vitest";
import { MemoryRateLimiter, checkLimits } from "@/lib/rate-limit/limiter";

describe("MemoryRateLimiter", () => {
  it("allows up to the limit within a window, then blocks", async () => {
    let now = 0;
    const limiter = new MemoryRateLimiter(() => now);
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await limiter.consume("k", 3, 1000));
    expect(results.map((r) => r.allowed)).toEqual([true, true, true, false]);
    expect(results[3]?.retryAfterMs).toBe(1000);
    now = 400;
    expect((await limiter.consume("k", 3, 1000)).retryAfterMs).toBe(600);
  });

  it("starts a fresh window once the old one expires", async () => {
    let now = 0;
    const limiter = new MemoryRateLimiter(() => now);
    for (let i = 0; i < 3; i++) await limiter.consume("k", 3, 1000);
    now = 1000;
    expect((await limiter.consume("k", 3, 1000)).allowed).toBe(true);
  });

  it("keeps keys independent", async () => {
    const limiter = new MemoryRateLimiter(() => 0);
    await limiter.consume("a", 1, 1000);
    expect((await limiter.consume("a", 1, 1000)).allowed).toBe(false);
    expect((await limiter.consume("b", 1, 1000)).allowed).toBe(true);
  });

  it("drops expired windows so memory stays bounded", async () => {
    let now = 0;
    const limiter = new MemoryRateLimiter(() => now);
    for (let i = 0; i < 100; i++) await limiter.consume(`k${i}`, 1, 1000);
    now = 120_000;
    await limiter.consume("fresh", 1, 1000);
    // @ts-expect-error inspecting private state in a test
    expect((limiter.windows as Map<string, unknown>).size).toBe(1);
  });
});

describe("checkLimits", () => {
  it("blocks if any rule is exceeded and reports the longest wait", async () => {
    const limiter = new MemoryRateLimiter(() => 0);
    const rules = [
      { key: "ip", rule: { limit: 5, windowMs: 1000 } },
      { key: "email", rule: { limit: 1, windowMs: 5000 } },
    ];
    expect((await checkLimits(limiter, rules)).allowed).toBe(true);
    const blocked = await checkLimits(limiter, rules);
    expect(blocked).toEqual({ allowed: false, retryAfterMs: 5000 });
  });
});
