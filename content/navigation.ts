import type { z } from "zod";
import type { navigationSchema } from "@/lib/schemas/content";

/** Site navigation and calls to action. The Solutions menu lists content/solutions.ts services. */
export const navigation = {
  primary: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  /** Primary CTA site-wide: the enquiry form with topic "Client project". */
  projectCta: { label: "Start a project", href: "/contact/client-project" },
  signInCta: { label: "Sign in", href: "/sign-in" },
  footer: {
    company: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
} satisfies z.input<typeof navigationSchema>;
