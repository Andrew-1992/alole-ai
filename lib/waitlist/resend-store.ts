import "server-only";
import type { Resend } from "resend";
import { mergeSubscriber, type UpsertResult, type WaitlistStore, type WaitlistSubscriber } from "./store";

/** Custom contact property holding the comma-separated product slugs. Create it once in Resend. */
export const INTERESTS_PROPERTY = "interests";

export class WaitlistStoreError extends Error {
  override name = "WaitlistStoreError";
  constructor(public readonly code: string) {
    super(`Waitlist store error: ${code}`);
  }
}

function parseInterests(value: unknown): string[] {
  if (typeof value !== "string" || value === "") return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

/**
 * Stores waitlist subscribers as Resend contacts (contacts are global and keyed
 * by email), added to one waitlist segment. Launch emails are sent as Resend
 * Broadcasts to that segment, which include Resend's unsubscribe link; an
 * unsubscribed contact stays unsubscribed even if the address signs up again.
 */
export class ResendWaitlistStore implements WaitlistStore {
  constructor(
    private readonly client: Resend,
    private readonly segmentId: string,
  ) {}

  async upsert(subscriber: WaitlistSubscriber): Promise<UpsertResult> {
    const existing = await this.client.contacts.get({ email: subscriber.email });

    if (existing.error && existing.error.name !== "not_found") throw new WaitlistStoreError(existing.error.name);

    if (existing.data) {
      const current: WaitlistSubscriber = {
        email: subscriber.email,
        interests: parseInterests(existing.data.properties[INTERESTS_PROPERTY]?.value),
        ...(existing.data.first_name ? { name: existing.data.first_name } : {}),
      };
      await this.update(mergeSubscriber(current, subscriber));
      return { outcome: "updated" };
    }

    const created = await this.client.contacts.create({
      email: subscriber.email,
      ...(subscriber.name ? { firstName: subscriber.name } : {}),
      properties: { [INTERESTS_PROPERTY]: subscriber.interests.join(",") },
      segments: [{ id: this.segmentId }],
    });
    if (created.error) {
      // A parallel signup may have created the contact between our get and create.
      if (created.error.name === "validation_error" || created.error.statusCode === 409) {
        await this.update(subscriber);
        return { outcome: "updated" };
      }
      throw new WaitlistStoreError(created.error.name);
    }
    return { outcome: "created" };
  }

  private async update(subscriber: WaitlistSubscriber): Promise<void> {
    const updated = await this.client.contacts.update({
      email: subscriber.email,
      ...(subscriber.name ? { firstName: subscriber.name } : {}),
      properties: { [INTERESTS_PROPERTY]: subscriber.interests.join(",") },
    });
    if (updated.error) throw new WaitlistStoreError(updated.error.name);
    // Idempotent: makes sure the contact is in the waitlist segment.
    const added = await this.client.contacts.segments.add({ email: subscriber.email, segmentId: this.segmentId });
    if (added.error && added.error.statusCode !== 409) throw new WaitlistStoreError(added.error.name);
  }
}
