/**
 * Where waitlist subscribers are kept.
 *
 * The production implementation (the email provider's contacts feature) is
 * added with the form backends. Every implementation must deduplicate by
 * normalised email: a repeat signup merges interests instead of adding a
 * second subscriber.
 */

export interface WaitlistSubscriber {
  /** Already normalised (see normaliseEmail). */
  email: string;
  name?: string;
  interests: string[];
}

export type UpsertResult = { outcome: "created" } | { outcome: "updated" };

export interface WaitlistStore {
  upsert(subscriber: WaitlistSubscriber): Promise<UpsertResult>;
}

/** Merges a repeat signup into an existing record. Pure; shared by all stores. */
export function mergeSubscriber(existing: WaitlistSubscriber, incoming: WaitlistSubscriber): WaitlistSubscriber {
  const name = incoming.name ?? existing.name;
  return {
    email: existing.email,
    ...(name === undefined ? {} : { name }),
    interests: [...new Set([...existing.interests, ...incoming.interests])],
  };
}

/**
 * In-memory store for development and tests. Data is lost on restart and is
 * not shared between server instances: never use it in production.
 */
export class MemoryWaitlistStore implements WaitlistStore {
  private readonly records = new Map<string, WaitlistSubscriber>();

  async upsert(subscriber: WaitlistSubscriber): Promise<UpsertResult> {
    const existing = this.records.get(subscriber.email);
    if (existing) {
      this.records.set(subscriber.email, mergeSubscriber(existing, subscriber));
      return { outcome: "updated" };
    }
    this.records.set(subscriber.email, { ...subscriber, interests: [...new Set(subscriber.interests)] });
    return { outcome: "created" };
  }

  /** Test helper. */
  get(email: string): WaitlistSubscriber | undefined {
    return this.records.get(email);
  }

  get size(): number {
    return this.records.size;
  }
}
