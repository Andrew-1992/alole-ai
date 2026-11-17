import { z } from "zod";
import type { ContactFieldError } from "./contact-state";
import { CLIENT_PROJECT, CONTACT_TOPICS, PROJECT_SERVICES, PROJECT_TIMELINES } from "./options";
import { EMAIL_MAX, normaliseEmail, normaliseText } from "./normalise";

export const CONTACT_NAME_MAX = 100;
export const ORGANISATION_MAX = 150;
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 5000;
export {
  CLIENT_PROJECT,
  CONTACT_TOPICS,
  PROJECT_SERVICES,
  PROJECT_TIMELINES,
  isContactTopic,
  type ContactTopic,
} from "./options";
export {
  CONTACT_FIELDS,
  initialContactState,
  type ContactField,
  type ContactFieldError,
  type ContactState,
} from "./contact-state";

/**
 * Normalises a multi-line message: NFKC, CRLF -> LF, control characters
 * removed (newlines and tabs kept), trailing spaces trimmed, and runs of more
 * than two blank lines collapsed.
 */
export function normaliseMessage(raw: string): string {
  return raw
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** An optional select: "" means not chosen; anything else must be one of `values`. */
function optionalChoice<T extends string>(values: readonly T[], error: ContactFieldError) {
  const isValue = (v: string): v is T => (values as readonly string[]).includes(v);
  return z.string().transform((raw, ctx): T | undefined => {
    const value = raw.trim();
    if (value === "") return undefined;
    if (isValue(value)) return value;
    ctx.addIssue({ code: "custom", message: error });
    return z.NEVER;
  });
}

export const contactSchema = z
  .object({
    name: z
      .string()
      .transform(normaliseText)
      .pipe(z.string().min(1, { error: "name_required" }).max(CONTACT_NAME_MAX, { error: "name_too_long" })),
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
    organisation: z
      .string()
      .transform(normaliseText)
      .pipe(z.string().max(ORGANISATION_MAX, { error: "organisation_too_long" }))
      .transform((v) => (v === "" ? undefined : v)),
    topic: z.enum(CONTACT_TOPICS, { error: "topic_invalid" }),
    service: optionalChoice(PROJECT_SERVICES, "service_invalid"),
    timeline: optionalChoice(PROJECT_TIMELINES, "timeline_invalid"),
    message: z
      .string()
      .transform(normaliseMessage)
      .pipe(
        z.string().min(MESSAGE_MIN, { error: "message_too_short" }).max(MESSAGE_MAX, { error: "message_too_long" }),
      ),
  })
  .superRefine((input, ctx) => {
    if (input.topic === CLIENT_PROJECT && !input.organisation) {
      ctx.addIssue({ code: "custom", path: ["organisation"], message: "organisation_required" });
    }
  })
  // Project details only belong to client projects. Without JavaScript every
  // field is visible, so a visitor may fill them in for another topic.
  .transform((input) =>
    input.topic === CLIENT_PROJECT ? input : { ...input, service: undefined, timeline: undefined },
  );

export type ContactInput = z.infer<typeof contactSchema>;

export function readContactForm(formData: FormData) {
  const str = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  return {
    raw: {
      name: str("name"),
      email: str("email"),
      organisation: str("organisation"),
      topic: str("topic"),
      service: str("service"),
      timeline: str("timeline"),
      message: str("message"),
    },
    honeypot: str("website"),
  };
}
