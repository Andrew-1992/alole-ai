import type { Company } from "@/lib/schemas/content";

/**
 * Company display rules. Until registration is confirmed in config, the site
 * never names the legal entity or implies that it is registered.
 */

export function isRegistered(company: Company): boolean {
  return company.registrationStatus === "registered";
}

/** Footer line: "Alole, Juba, South Sudan" until registered, then the legal name. */
export function companyLocationLine(company: Company): string {
  return `${isRegistered(company) ? company.legalName : company.brandName}, ${company.headquarters}`;
}

/**
 * Removes " (Alole AI Limited)" from copy while registration is
 * pending, so word-for-word copy can stay in the content files.
 */
export function withRegistrationRules(text: string, company: Company): string {
  if (isRegistered(company)) return text;
  return text.split(` (${company.legalName})`).join("").split(company.legalName).join(company.brandName);
}

/** "+211 980 268 376" -> "tel:+211980268376". */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

/** "+211 980 268 376" -> "https://wa.me/211980268376", or null when WhatsApp is not configured. */
export function whatsappHref(whatsapp: string): string | null {
  if (!whatsapp) return null;
  return `https://wa.me/${whatsapp.replace(/\D/g, "")}`;
}
