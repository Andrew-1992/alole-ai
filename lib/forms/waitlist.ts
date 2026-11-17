import { z } from "zod";
import { HONEYPOT_FIELD } from "./waitlist-state";

export {
  HONEYPOT_FIELD,
  initialWaitlistState,
  type WaitlistFieldError,
  type WaitlistState,
} from "./waitlist-state";

/**
 * Waitlist form: schema, normalisation and the state shape shared by the
 * server action and the form component.
 */

export const EMAIL_MAX = 254;
export const NAME_MAX = 100;

/**
 * Normalises an email for storage and deduplication: trims, applies Unicode
 * NFKC, and lowercases. Lowercasing the local part is a deliberate choice:
 * real mailboxes are case-insensitive in practice, and it prevents
 * "Ana@x.com" and "ana@x.com" becoming two subscribers. We do not strip dots
 * or "+tags", because that is provider-specific and can merge distinct people.
 */
export function normaliseEmail(raw: string): string {
  return raw.normalize("NFKC").trim().toLowerCase();
}

/** Collapses whitespace and strips control characters from free text. */
export function normaliseText(raw: string): string {
  return raw
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Builds the schema against the current product slugs, so config drives validation. */
export function waitlistSchema(productSlugs: readonly [string, ...string[]]) {
  return z.object({
    email: z
      .string()
      .transform(normaliseEmail)
      .pipe(
        z
          .string()
          .min(1, { error: "email_required" })
          .max(EMAIL_MAX, { error: "email_invalid" })
          .pipe(z.email({ error: "email_invalid" })),
      ),
    name: z
      .string()
      .transform(normaliseText)
      .pipe(z.string().max(NAME_MAX, { error: "name_too_long" }))
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    interests: z
      .array(z.enum(productSlugs, { error: "interests_invalid" }))
      .max(productSlugs.length, { error: "interests_invalid" })
      .transform((xs) => [...new Set(xs)]),
  });
}

export type WaitlistInput = z.infer<ReturnType<typeof waitlistSchema>>;

/** Pulls the raw values out of submitted form data. Never throws. */
export function readWaitlistForm(formData: FormData) {
  const str = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  return {
    raw: {
      email: str("email"),
      name: str("name"),
      interests: formData.getAll("interests").filter((v): v is string => typeof v === "string"),
    },
    honeypot: str(HONEYPOT_FIELD),
  };
}
