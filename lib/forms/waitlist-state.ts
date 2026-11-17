/**
 * Waitlist form state shared by the server action and the form component.
 * Zod-free so it can be imported by client code.
 */

export const HONEYPOT_FIELD = "website";

export type WaitlistFieldError = "email_required" | "email_invalid" | "name_too_long" | "interests_invalid";

export type WaitlistState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "invalid";
      fieldErrors: Partial<Record<"email" | "name" | "interests", WaitlistFieldError>>;
      /** Echoed back so a no-JS re-render keeps what the user typed. */
      values: { email: string; name: string; interests: string[] };
    }
  | { status: "rate_limited" }
  | { status: "error" };

export const initialWaitlistState: WaitlistState = { status: "idle" };
