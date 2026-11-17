import "server-only";
import type { Resend } from "resend";
import { EmailSendError, type EmailMessage, type EmailService } from "./service";

/** Sends plain-text email through Resend. Provider error details never reach the client. */
export class ResendEmailService implements EmailService {
  constructor(
    private readonly client: Resend,
    private readonly from: string,
  ) {}

  async send(message: EmailMessage): Promise<void> {
    const { error } = await this.client.emails.send(
      {
        from: this.from,
        to: message.to,
        subject: message.subject,
        text: message.text,
        ...(message.replyTo ? { replyTo: message.replyTo } : {}),
      },
      message.idempotencyKey ? { idempotencyKey: message.idempotencyKey } : undefined,
    );
    if (error) throw new EmailSendError(error.name);
  }
}
