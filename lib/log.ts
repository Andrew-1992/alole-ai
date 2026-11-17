/**
 * Structured logging without personal data. Only event names, error types and
 * provider error codes are written; never form contents, names or addresses.
 */

export type LogFields = Record<string, string | number | boolean | undefined>;

export function logEvent(level: "info" | "warn" | "error", event: string, fields: LogFields = {}): void {
  const line = JSON.stringify({ level, event, ...fields });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
}

/** Describes an error by type only. Messages can echo user input, so they are dropped. */
export function errorKind(error: unknown): string {
  if (error instanceof Error) return error.name;
  return typeof error;
}

export function logError(event: string, error: unknown, fields: LogFields = {}): void {
  logEvent("error", event, { ...fields, kind: errorKind(error) });
}
