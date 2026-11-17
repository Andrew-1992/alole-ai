import type { ContactTopic } from "./options";

/**
 * Enquiry form state shared by the server action and the form component.
 * Zod-free so it can be imported by client code.
 */

export type ContactFieldError =
  | "name_required"
  | "name_too_long"
  | "email_required"
  | "email_invalid"
  | "organisation_required"
  | "organisation_too_long"
  | "topic_invalid"
  | "service_invalid"
  | "timeline_invalid"
  | "message_too_short"
  | "message_too_long";

export type ContactField = "name" | "email" | "organisation" | "topic" | "service" | "timeline" | "message";
export const CONTACT_FIELDS: readonly ContactField[] = [
  "name",
  "email",
  "organisation",
  "topic",
  "service",
  "timeline",
  "message",
];

export type ContactState =
  | { status: "idle" }
  | { status: "success"; topic: ContactTopic }
  | {
      status: "invalid";
      fieldErrors: Partial<Record<ContactField, ContactFieldError>>;
      values: Record<ContactField, string>;
    }
  | { status: "rate_limited" }
  | { status: "error" };

export const initialContactState: ContactState = { status: "idle" };
