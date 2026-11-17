import "server-only";
import Redis from "ioredis";
import { logError } from "@/lib/log";
import type { RateLimiter, RateLimitResult } from "./limiter";

/**
 * Redis-backed fixed window, shared by every server instance.
 *
 * INCR and PEXPIRE NX run in one MULTI, so the first hit starts the window and
 * later hits never extend it. If Redis is unreachable the limiter fails open
 * (the request is allowed and the error logged): a Redis outage should not stop
 * real people from contacting us, and the honeypot still filters simple bots.
 */
export class RedisRateLimiter implements RateLimiter {
  private readonly redis: Redis;

  constructor(url: string, private readonly prefix = "alole:rl:") {
    this.redis = new Redis(url, {
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      connectTimeout: 2_000,
      commandTimeout: 1_000,
    });
    // Connection errors surface per command; this keeps them out of the process log noise.
    this.redis.on("error", () => {});
  }

  async consume(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const fullKey = `${this.prefix}${key}`;
    try {
      if (this.redis.status === "wait" || this.redis.status === "end") await this.redis.connect();
      const result = await this.redis.multi().incr(fullKey).pexpire(fullKey, windowMs, "NX").pttl(fullKey).exec();
      const count = Number(result?.[0]?.[1] ?? 0);
      const ttl = Number(result?.[2]?.[1] ?? windowMs);
      return count <= limit ? { allowed: true, retryAfterMs: 0 } : { allowed: false, retryAfterMs: Math.max(ttl, 0) };
    } catch (error) {
      logError("rate_limit.redis_unavailable", error);
      return { allowed: true, retryAfterMs: 0 };
    }
  }
}
