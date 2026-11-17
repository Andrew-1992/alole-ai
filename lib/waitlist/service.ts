import type { EmailService } from "@/lib/email/service";
import { readWaitlistForm, waitlistSchema, type WaitlistFieldError, type WaitlistState } from "@/lib/forms/waitlist";
import { hashKey, type RequestContext } from "@/lib/forms/request-context";
import { checkLimits, type RateLimiter, type RateLimitRule } from "@/lib/rate-limit/limiter";
import type { WaitlistStore } from "./store";

export const WAITLIST_LIMITS = {
  perIp: { limit: 10, windowMs: 10 * 60_000 },
  perEmail: { limit: 3, windowMs: 60 * 60_000 },
} satisfies Record<string, RateLimitRule>;

export interface WaitlistDeps {
  store: WaitlistStore;
  email: EmailService;
  limiter: RateLimiter;
  productSlugs: readonly [string, ...string[]];
  /** Fixed confirmation. Contains no user-entered text by design. */
  confirmation: { subject: string; text: string };
  /** Logs without personal data. */
  logError: (event: string, error: unknown) => void;
}

/**
 * Handles one waitlist submission. Framework-free so it can be tested directly;
 * the Server Action is a thin wrapper.
 *
 * Order: per-IP limit, honeypot, validation, per-email limit, store, then a
 * confirmation email for new subscribers only.
 */
export async function handleWaitlistSubmission(
  formData: FormData,
  context: RequestContext,
  deps: WaitlistDeps,
): Promise<WaitlistState> {
  const ipCheck = await checkLimits(deps.limiter, [{ key: `waitlist:ip:${context.ip}`, rule: WAITLIST_LIMITS.perIp }]);
  if (!ipCheck.allowed) return { status: "rate_limited" };

  const { raw, honeypot } = readWaitlistForm(formData);

  // Bots fill every field. Report success so they learn nothing; store nothing.
  if (honeypot.trim() !== "") return { status: "success" };

  const parsed = waitlistSchema(deps.productSlugs).safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Extract<WaitlistState, { status: "invalid" }>["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if ((field === "email" || field === "name" || field === "interests") && !fieldErrors[field]) {
        fieldErrors[field] = issue.message as WaitlistFieldError;
      }
    }
    return {
      status: "invalid",
      fieldErrors,
      values: {
        email: raw.email.slice(0, 254),
        name: raw.name.slice(0, 100),
        interests: raw.interests.filter((s) => deps.productSlugs.includes(s)),
      },
    };
  }

  const { email, name, interests } = parsed.data;
  const emailCheck = await checkLimits(deps.limiter, [
    { key: `waitlist:email:${hashKey(email)}`, rule: WAITLIST_LIMITS.perEmail },
  ]);
  if (!emailCheck.allowed) return { status: "rate_limited" };

  let outcome: "created" | "updated";
  try {
    ({ outcome } = await deps.store.upsert({ email, interests, ...(name === undefined ? {} : { name }) }));
  } catch (error) {
    deps.logError("waitlist.store_failed", error);
    return { status: "error" };
  }

  // Confirm new signups only, so repeat submissions can't be used to send mail.
  if (outcome === "created") {
    try {
      await deps.email.send({
        to: email,
        subject: deps.confirmation.subject,
        text: deps.confirmation.text,
        idempotencyKey: `waitlist-confirm/${hashKey(email)}`,
      });
    } catch (error) {
      // The signup itself succeeded; a missing confirmation is not worth failing it.
      deps.logError("waitlist.confirmation_failed", error);
    }
  }
  return { status: "success" };
}
