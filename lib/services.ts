import "server-only";
import { Resend } from "resend";
import { pages } from "@/content";
import type { ContactDeps } from "@/lib/contact/service";
import { ResendEmailService } from "@/lib/email/resend";
import { ConsoleEmailService, type EmailService } from "@/lib/email/service";
import { logError } from "@/lib/log";
import { MemoryRateLimiter, type RateLimiter } from "@/lib/rate-limit/limiter";
import { RedisRateLimiter } from "@/lib/rate-limit/redis";
import { serverEnv } from "@/lib/server-env";

/**
 * Wires the contact form service to real or local implementations, chosen by
 * environment (lib/server-env.ts). Built once per server process.
 */

function emailText(lines: string[]): string {
  return [...lines, pages.emails.signoff].join("\n\n");
}

interface Services {
  email: EmailService;
  limiter: RateLimiter;
  inbox: string;
}

let services: Services | undefined;

function getServices(): Services {
  if (services) return services;
  const env = serverEnv();
  const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : undefined;

  const email: EmailService =
    env.EMAIL_PROVIDER === "resend" && resend ? new ResendEmailService(resend, env.EMAIL_FROM) : new ConsoleEmailService();
  const limiter: RateLimiter =
    env.RATE_LIMIT_STORE === "redis" && env.REDIS_URL ? new RedisRateLimiter(env.REDIS_URL) : new MemoryRateLimiter();

  services = { email, limiter, inbox: env.CONTACT_INBOX };
  return services;
}

export function contactDeps(): ContactDeps {
  const s = getServices();
  return {
    email: s.email,
    limiter: s.limiter,
    inbox: s.inbox,
    labels: {
      topic: (topic) => pages.contact.topics[topic],
      service: (service) => pages.contact.form.services[service],
      timeline: (timeline) => pages.contact.form.timelines[timeline],
    },
    confirmation: {
      subject: pages.emails.contactConfirmation.subject,
      text: emailText(pages.emails.contactConfirmation.lines),
    },
    logError,
  };
}
