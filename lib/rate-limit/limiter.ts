/**
 * Fixed-window rate limiting behind a small interface.
 *
 * MemoryRateLimiter keeps counters in this process. Use it for development,
 * tests and a single self-hosted instance. Counters reset on restart and are
 * NOT shared between instances, so on serverless or multi-instance hosting each
 * instance enforces its own limit: use RedisRateLimiter there.
 */

export interface RateLimitResult {
  allowed: boolean;
  /** Milliseconds until the window resets (0 when allowed). */
  retryAfterMs: number;
}

export interface RateLimiter {
  /** Counts one hit against `key` and reports whether it is within `limit` for the window. */
  consume(key: string, limit: number, windowMs: number): Promise<RateLimitResult>;
}

export interface RateLimitRule {
  limit: number;
  windowMs: number;
}

export class MemoryRateLimiter implements RateLimiter {
  private readonly windows = new Map<string, { count: number; resetAt: number }>();
  private lastSweep = 0;

  constructor(private readonly now: () => number = Date.now) {}

  async consume(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const now = this.now();
    this.sweep(now);
    const current = this.windows.get(key);
    const entry = current && current.resetAt > now ? current : { count: 0, resetAt: now + windowMs };
    entry.count += 1;
    this.windows.set(key, entry);
    return entry.count <= limit ? { allowed: true, retryAfterMs: 0 } : { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  /** Drops expired windows at most once a minute so memory stays bounded. */
  private sweep(now: number): void {
    if (now - this.lastSweep < 60_000) return;
    this.lastSweep = now;
    for (const [key, entry] of this.windows) if (entry.resetAt <= now) this.windows.delete(key);
  }
}

/**
 * Applies several rules; all must pass. Every rule is counted even when an
 * earlier one fails, so a blocked client keeps its window busy.
 */
export async function checkLimits(
  limiter: RateLimiter,
  checks: { key: string; rule: RateLimitRule }[],
): Promise<RateLimitResult> {
  const results = await Promise.all(checks.map((c) => limiter.consume(c.key, c.rule.limit, c.rule.windowMs)));
  const blocked = results.filter((r) => !r.allowed);
  if (blocked.length === 0) return { allowed: true, retryAfterMs: 0 };
  return { allowed: false, retryAfterMs: Math.max(...blocked.map((r) => r.retryAfterMs)) };
}
