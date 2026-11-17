import { createHash } from "node:crypto";

/** What the form services need to know about the request, beyond the form itself. */
export interface RequestContext {
  /** Client IP, or "unknown" when the platform does not provide one. */
  ip: string;
}

/**
 * Picks the client IP from proxy headers. On Vercel these are set by the
 * platform. When self-hosting, the reverse proxy in front of the app MUST set
 * X-Forwarded-For (or X-Real-IP) and strip any client-supplied value, otherwise
 * clients can spoof it to dodge per-IP limits (see README).
 */
export function clientIpFrom(headers: { get(name: string): string | null }): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = headers.get("x-real-ip")?.trim();
  const ip = forwarded || real || "";
  // Keep keys short and safe whatever the header contains.
  return /^[0-9a-fA-F:.]{2,45}$/.test(ip) ? ip : "unknown";
}

/** One-way hash so rate-limit keys never hold a readable email address. */
export function hashKey(value: string): string {
  return createHash("sha256").update(value).digest("base64url").slice(0, 32);
}
