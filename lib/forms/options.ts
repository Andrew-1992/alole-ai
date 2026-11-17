/**
 * Enquiry form option values. Kept free of Zod so client components can
 * import them without shipping the validation library to the browser; the
 * Zod enums in lib/schemas/pages.ts are built from these arrays.
 */

/** Enquiry topics. "client-project" is the primary conversion (Start a project). */
export const CONTACT_TOPICS = [
  "client-project",
  "general",
  "partnership",
  "press",
  "careers",
] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const PROJECT_SERVICES = ["automation", "integration", "custom-agent", "not-sure"] as const;
export type ProjectService = (typeof PROJECT_SERVICES)[number];

export const PROJECT_TIMELINES = ["exploring", "within-3-months", "3-6-months", "later"] as const;
export type ProjectTimeline = (typeof PROJECT_TIMELINES)[number];

export const CLIENT_PROJECT: ContactTopic = "client-project";

export function isContactTopic(value: string): value is ContactTopic {
  return (CONTACT_TOPICS as readonly string[]).includes(value);
}
