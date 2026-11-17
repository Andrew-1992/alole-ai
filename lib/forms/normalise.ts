/**
 * Field normalisation shared by the form schemas. Zod-free.
 */

export const EMAIL_MAX = 254;

/**
 * Normalises an email address: trims, applies Unicode NFKC, and lowercases.
 * Lowercasing the local part is a deliberate choice: real mailboxes are
 * case-insensitive in practice, and it keeps rate-limit keys stable for
 * "Ana@x.com" and "ana@x.com". We do not strip dots or "+tags", because that
 * is provider-specific and can merge distinct people.
 */
export function normaliseEmail(raw: string): string {
  return raw.normalize("NFKC").trim().toLowerCase();
}

/** Collapses whitespace and strips control characters from free text. */
export function normaliseText(raw: string): string {
  return raw
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
