import "server-only";
import { z } from "zod";

/**
 * Runtime configuration for the contact form backend, validated once on first use and
 * at server start (instrumentation.ts). Kept separate from lib/env.ts so a
 * build does not need production secrets.
 *
 * APP_ENV:
 *   production   real email provider and a shared (Redis) rate limiter required,
 *                unless RATE_LIMIT_STORE=memory is set explicitly for a single
 *                self-hosted instance
 *   test         console email and in-memory limiter allowed (CI, Playwright)
 *   development  defaults to console email and the in-memory limiter
 */

const emailAddress = z.email();
/** "Name <address@domain>" or a bare address. */
const fromAddress = z
  .string()
  .trim()
  .refine((v) => {
    const match = /^(?:[^<>]+<([^<>]+)>|([^<>\s]+))$/.exec(v);
    const address = match?.[1] ?? match?.[2];
    return address !== undefined && emailAddress.safeParse(address).success;
  }, "must be an email address, optionally as \"Name <address>\"");

const schema = z
  .object({
    APP_ENV: z.enum(["development", "test", "production"]),
    EMAIL_PROVIDER: z.enum(["resend", "console"]),
    RESEND_API_KEY: z.string().trim().min(1).optional(),
    EMAIL_FROM: fromAddress,
    CONTACT_INBOX: emailAddress,
    RATE_LIMIT_STORE: z.enum(["redis", "memory"]),
    REDIS_URL: z.url({ protocol: /^rediss?$/ }).optional(),
  })
  .superRefine((env, ctx) => {
    const need = (key: keyof typeof env, why: string) => {
      if (!env[key]) ctx.addIssue({ code: "custom", path: [key], message: `required ${why}` });
    };
    if (env.EMAIL_PROVIDER === "resend") need("RESEND_API_KEY", "for Resend");
    if (env.RATE_LIMIT_STORE === "redis") need("REDIS_URL", "when RATE_LIMIT_STORE=redis");
    if (env.APP_ENV === "production") {
      if (env.EMAIL_PROVIDER !== "resend")
        ctx.addIssue({ code: "custom", path: ["EMAIL_PROVIDER"], message: "must be resend in production" });
    }
  });

export type ServerEnv = z.infer<typeof schema>;

/** Applies defaults by environment, then validates. Exported for tests. */
export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const appEnv = source.APP_ENV ?? (source.NODE_ENV === "production" ? "production" : "development");
  const relaxed = appEnv !== "production";
  const result = schema.safeParse({
    APP_ENV: appEnv,
    EMAIL_PROVIDER: source.EMAIL_PROVIDER ?? (relaxed ? "console" : "resend"),
    RESEND_API_KEY: source.RESEND_API_KEY || undefined,
    EMAIL_FROM: source.EMAIL_FROM ?? (relaxed ? "Alole <hello@example.com>" : undefined),
    CONTACT_INBOX: source.CONTACT_INBOX ?? (relaxed ? "inbox@example.com" : undefined),
    RATE_LIMIT_STORE: source.RATE_LIMIT_STORE ?? (relaxed ? "memory" : "redis"),
    REDIS_URL: source.REDIS_URL || undefined,
  });
  if (!result.success) {
    // Names only: never print values, some are secrets.
    const issues = result.error.issues.map((i) => `  ${i.path.join(".") || "(env)"}: ${i.message}`).join("\n");
    throw new Error(`Invalid server environment:\n${issues}\nSee .env.example and README.`);
  }
  return result.data;
}

let cached: ServerEnv | undefined;

export function serverEnv(): ServerEnv {
  cached ??= parseServerEnv(process.env);
  return cached;
}
