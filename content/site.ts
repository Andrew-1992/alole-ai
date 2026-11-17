import type { z } from "zod";
import type { siteSchema } from "@/lib/schemas/content";

/** Brand lines and feature flags. Company details live in content/company.ts. */
export const site = {
  tagline: "AI agents that get work done.",
  secondaryLine: "Exceptional AI for everyday work.",
  positioning:
    "Alole is an applied AI company building AI agents and intelligent systems that do real work for people, businesses and institutions.",
  description:
    "Alole is an applied AI company building AI agents and intelligent systems that do real work for people, businesses and institutions.",
  features: {
    /** Team members beyond the founder (content/company.ts `team`). */
    showTeam: false,
    /** Job listings (content/pages.ts `careers.jobs`). */
    showJobListings: false,
    /** Case studies on /solutions (content/solutions.ts). Real, approved work only. */
    showCaseStudies: false,
    /** Vercel Web Analytics: cookieless page views and form submissions by type. */
    cookielessAnalytics: false,
  },
} satisfies z.input<typeof siteSchema>;
