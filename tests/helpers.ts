import { vi } from "vitest";
import type { ContactDeps } from "@/lib/contact/service";
import { ConsoleEmailService, type EmailMessage, type EmailService } from "@/lib/email/service";
import { MemoryRateLimiter, type RateLimiter } from "@/lib/rate-limit/limiter";

export function formData(fields: Record<string, string | string[]>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) {
    for (const item of Array.isArray(v) ? v : [v]) fd.append(k, item);
  }
  return fd;
}

/** An email service that fails every send, as a provider outage would. */
export class FailingEmailService implements EmailService {
  readonly attempted: EmailMessage[] = [];
  async send(message: EmailMessage): Promise<void> {
    this.attempted.push(message);
    throw new Error("provider down");
  }
}

export function contactDeps(overrides: Partial<ContactDeps> = {}) {
  const email = new ConsoleEmailService();
  const deps: ContactDeps = {
    email,
    limiter: new MemoryRateLimiter(),
    inbox: "team@example.com",
    labels: {
      topic: (t) => ({ label: t.toUpperCase(), subjectPrefix: t === "client-project" ? "[Project]" : "[Other]" }),
      service: (s) => `service:${s}`,
      timeline: (t) => `timeline:${t}`,
    },
    confirmation: { subject: "We received your message", text: "Fixed confirmation text." },
    logError: vi.fn(),
    ...overrides,
  };
  return { deps, email };
}

export type { RateLimiter };
