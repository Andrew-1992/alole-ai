/**
 * Cookieless analytics events (Vercel Web Analytics).
 *
 * The analytics script loads only when site.features.cookielessAnalytics is
 * on; otherwise `window.va` does not exist and these calls do nothing.
 * By design only two things are tracked: page views (automatic) and form
 * submissions by type. Never pass names, addresses or message text here.
 */

export type FormType = "enquiry";

export function trackFormSubmission(form: FormType, topic?: string): void {
  if (typeof window === "undefined") return;
  const va: unknown = Reflect.get(window, "va");
  if (typeof va !== "function") return;
  try {
    va("event", { name: "Form submitted", data: topic ? { form, topic } : { form } });
  } catch {
    // Analytics must never affect the form.
  }
}
