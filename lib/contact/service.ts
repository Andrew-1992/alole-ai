import type { EmailService } from "@/lib/email/service";
import {
  CONTACT_FIELDS,
  contactSchema,
  isContactTopic,
  readContactForm,
  type ContactField,
  type ContactFieldError,
  type ContactInput,
  type ContactState,
} from "@/lib/forms/contact";
import { hashKey, type RequestContext } from "@/lib/forms/request-context";
import { checkLimits, type RateLimiter, type RateLimitRule } from "@/lib/rate-limit/limiter";
import type { ContactTopic, ProjectService, ProjectTimeline } from "@/lib/schemas/pages";

export const CONTACT_LIMITS = {
  perIp: { limit: 5, windowMs: 10 * 60_000 },
  perEmail: { limit: 3, windowMs: 60 * 60_000 },
} satisfies Record<string, RateLimitRule>;

/** Labels used in the email the team receives. */
export interface EnquiryLabels {
  topic: (topic: ContactTopic) => { label: string; subjectPrefix: string };
  service: (service: ProjectService) => string;
  timeline: (timeline: ProjectTimeline) => string;
}

export interface ContactDeps {
  email: EmailService;
  limiter: RateLimiter;
  inbox: string;
  labels: EnquiryLabels;
  /** Fixed confirmation. Contains no user-entered text by design. */
  confirmation: { subject: string; text: string };
  logError: (event: string, error: unknown) => void;
}

/**
 * The email delivered to the team inbox, e.g. subject "[Project] Juba Bakery: Ana Lado".
 * Replying goes to the submitter (reply-to is set by the caller).
 */
export function contactNotification(input: ContactInput, labels: EnquiryLabels): { subject: string; text: string } {
  const topic = labels.topic(input.topic);
  const who = input.organisation ? `${input.organisation}: ${input.name}` : input.name;
  const lines = [
    `Topic: ${topic.label}`,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Organisation: ${input.organisation ?? "(not given)"}`,
  ];
  if (input.topic === "client-project") {
    lines.push(`Service of interest: ${input.service ? labels.service(input.service) : "(not given)"}`);
    lines.push(`Timeline: ${input.timeline ? labels.timeline(input.timeline) : "(not given)"}`);
  }
  lines.push(
    "",
    input.message,
    "",
    "Sent from the enquiry form on the Alole website. Reply to this email to answer the sender.",
  );
  return { subject: `${topic.subjectPrefix} ${who}`.slice(0, 200), text: lines.join("\n") };
}

function isContactField(value: PropertyKey | undefined): value is ContactField {
  return typeof value === "string" && (CONTACT_FIELDS as readonly string[]).includes(value);
}

export async function handleContactSubmission(
  formData: FormData,
  context: RequestContext,
  deps: ContactDeps,
): Promise<ContactState> {
  const ipCheck = await checkLimits(deps.limiter, [{ key: `contact:ip:${context.ip}`, rule: CONTACT_LIMITS.perIp }]);
  if (!ipCheck.allowed) return { status: "rate_limited" };

  const { raw, honeypot } = readContactForm(formData);
  // Bots fill every field. Report success so they learn nothing; send nothing.
  if (honeypot.trim() !== "") return { status: "success", topic: isContactTopic(raw.topic) ? raw.topic : "general" };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Extract<ContactState, { status: "invalid" }>["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (isContactField(field) && !fieldErrors[field]) fieldErrors[field] = issue.message as ContactFieldError;
    }
    return {
      status: "invalid",
      fieldErrors,
      values: {
        name: raw.name.slice(0, 100),
        email: raw.email.slice(0, 254),
        organisation: raw.organisation.slice(0, 150),
        topic: raw.topic.slice(0, 40),
        service: raw.service.slice(0, 40),
        timeline: raw.timeline.slice(0, 40),
        message: raw.message.slice(0, 5000),
      },
    };
  }

  const input = parsed.data;
  const emailCheck = await checkLimits(deps.limiter, [
    { key: `contact:email:${hashKey(input.email)}`, rule: CONTACT_LIMITS.perEmail },
  ]);
  if (!emailCheck.allowed) return { status: "rate_limited" };

  const notification = contactNotification(input, deps.labels);
  try {
    await deps.email.send({ to: deps.inbox, replyTo: input.email, ...notification });
  } catch (error) {
    deps.logError("contact.delivery_failed", error);
    return { status: "error" };
  }

  try {
    await deps.email.send({ to: input.email, subject: deps.confirmation.subject, text: deps.confirmation.text });
  } catch (error) {
    deps.logError("contact.confirmation_failed", error);
  }
  return { status: "success", topic: input.topic };
}
