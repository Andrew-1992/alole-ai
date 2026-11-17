import type { z } from "zod";
import type { companySchema } from "@/lib/schemas/content";
import { TODO_COPY } from "./todo-copy";

/**
 * Company settings. Validated at build time by content/index.ts.
 *
 * - registrationStatus: set to "registered" only once registration is
 *   complete. Until then the site never shows the legal name, and the footer
 *   reads "Alole, Juba, South Sudan".
 * - founder: confirm the spelling of the name and the title before launch.
 * - whatsapp: set only if the number is on WhatsApp ("+211 ..."). Empty hides it.
 * - email: empty hides all email links.
 * - social: empty url hides the link.
 */
export const company = {
  legalName: "Alole AI Limited",
  brandName: "Alole",
  category: "Applied AI",
  headquarters: "Juba, South Sudan",
  headquartersCity: "Juba",
  headquartersCountryCode: "SS",
  registrationStatus: "pending",
  founder: { name: "Omol Andrew Einstein", title: "Founder" },
  team: [],
  phone: "+211 980 268 376",
  whatsapp: "",
  email: "",
  responseTime: TODO_COPY("We aim to reply within two working days."),
  social: [
    { platform: "linkedin", label: "LinkedIn", url: "" },
    { platform: "x", label: "X", url: "" },
    { platform: "facebook", label: "Facebook", url: "" },
    { platform: "instagram", label: "Instagram", url: "" },
  ],
} satisfies z.input<typeof companySchema>;
