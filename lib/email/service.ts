import { logEvent } from "@/lib/log";

/** Outgoing email, plain text only. */
export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  /** Lets the provider drop accidental duplicates (e.g. retried requests). */
  idempotencyKey?: string;
}

export interface EmailService {
  send(message: EmailMessage): Promise<void>;
}

export class EmailSendError extends Error {
  override name = "EmailSendError";
  constructor(public readonly code: string) {
    super(`Email provider error: ${code}`);
  }
}

/**
 * Development and test stand-in: records sends instead of delivering them.
 * Logs only that an email would be sent, never the recipient or contents.
 */
export class ConsoleEmailService implements EmailService {
  readonly sent: EmailMessage[] = [];

  async send(message: EmailMessage): Promise<void> {
    this.sent.push(message);
    logEvent("info", "email.console_send", { subjectLength: message.subject.length });
  }
}
