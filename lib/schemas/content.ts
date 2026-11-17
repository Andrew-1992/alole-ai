import { z } from "zod";
import { PROJECT_TIMELINES } from "@/lib/forms/options";

/**
 * Schemas for everything under `content/`.
 * `content/index.ts` parses the raw modules with these at import time, so an
 * invalid config fails `next build` (and the unit tests) instead of shipping.
 */

const nonEmpty = z.string().trim().min(1);
/** Internal paths only; external links are modelled separately. */
const internalHref = z.string().regex(/^\/[a-z0-9\-/#?=&]*$/, "must be an internal path");

const socialPlatformSchema = z.enum(["linkedin", "x", "facebook", "instagram", "youtube", "github"]);

/** Optional internal image (in /public) with real dimensions, for next/image. */
const imageSchema = z.object({
  src: z.string().regex(/^\/[a-z0-9\-/]+\.(?:jpg|jpeg|png|webp|avif)$/, "must be a file in /public"),
  alt: nonEmpty,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const personSchema = z.object({
  name: nonEmpty,
  title: nonEmpty,
  bio: z.string().trim().optional(),
  photo: imageSchema.optional(),
});
export type Person = z.infer<typeof personSchema>;

export const companySchema = z.object({
  legalName: nonEmpty,
  brandName: z.literal("Alole"),
  category: nonEmpty,
  headquarters: nonEmpty,
  /** Parts of the headquarters, for structured data. */
  headquartersCity: nonEmpty,
  headquartersCountryCode: z.string().regex(/^[A-Z]{2}$/),
  registrationStatus: z.enum(["pending", "registered"]),
  founder: personSchema,
  /** Other team members. Shown only when site.features.showTeam is true. */
  team: z.array(personSchema),
  /** International format, spaces allowed: "+211 980 268 376". */
  phone: z.string().regex(/^\+[0-9][0-9 ]{6,18}[0-9]$/, "use international format, e.g. +211 980 268 376"),
  /** Empty hides WhatsApp. International format, only if the number is on WhatsApp. */
  whatsapp: z.union([z.literal(""), z.string().regex(/^\+[0-9][0-9 ]{6,18}[0-9]$/)]),
  /** Empty hides email links. */
  email: z.union([z.literal(""), z.email()]),
  responseTime: nonEmpty,
  social: z.array(
    z.object({
      platform: socialPlatformSchema,
      label: nonEmpty,
      /** Empty string hides the link. */
      url: z.union([z.literal(""), z.url({ protocol: /^https$/ })]),
    }),
  ),
});
export type Company = z.infer<typeof companySchema>;

export const siteSchema = z.object({
  tagline: nonEmpty,
  secondaryLine: nonEmpty,
  positioning: nonEmpty,
  /** Default meta description. */
  description: nonEmpty.max(160),
  features: z.object({
    showTeam: z.boolean(),
    showJobListings: z.boolean(),
    showCaseStudies: z.boolean(),
    cookielessAnalytics: z.boolean(),
  }),
});
export type Site = z.infer<typeof siteSchema>;

export const navLinkSchema = z.object({ label: nonEmpty, href: internalHref });
export type NavLink = z.infer<typeof navLinkSchema>;

export const navigationSchema = z.object({
  primary: z.array(navLinkSchema),
  projectCta: navLinkSchema,
  /** Client sign-in. Points at a placeholder page until accounts exist. */
  signInCta: navLinkSchema,
  footer: z.object({
    company: z.array(navLinkSchema),
    legal: z.array(navLinkSchema),
  }),
});
export type Navigation = z.infer<typeof navigationSchema>;

export const faqItemSchema = z.object({ question: nonEmpty, answer: nonEmpty });

const titledSchema = z.object({ title: nonEmpty, body: nonEmpty });

export const homeSchema = z.object({
  meta: z.object({ title: nonEmpty, description: nonEmpty.max(160) }),
  hero: z.object({
    title: nonEmpty,
    subtitle: nonEmpty,
    primaryCta: navLinkSchema,
    secondaryCta: navLinkSchema,
    /** Accessible name for the list of capabilities under the hero. */
    capabilitiesLabel: nonEmpty,
    /** What Alole builds, one card each, in this order. */
    capabilities: z
      .array(
        z.object({
          kind: z.enum(["agents", "automation", "integration"]),
          title: nonEmpty,
          body: nonEmpty,
          href: z.string().regex(/^\/[^\s]*$/),
        }),
      )
      .length(3),
  }),
  /** "Which service fits?" quiz. Answers score services; the last question sets the timeline. */
  picker: z.object({
    heading: nonEmpty,
    intro: nonEmpty,
    progress: nonEmpty.includes("{current}").includes("{total}"),
    questions: z
      .array(
        z.object({
          legend: nonEmpty,
          options: z
            .array(z.object({ label: nonEmpty, service: z.enum(["automation", "integration", "custom-agent"]) }))
            .length(3),
        }),
      )
      .length(2),
    timeline: z.object({
      legend: nonEmpty,
      options: z.array(z.object({ label: nonEmpty, value: z.enum(PROJECT_TIMELINES) })).length(PROJECT_TIMELINES.length),
    }),
    resultLabel: nonEmpty,
    /** Second service, shown when the two answers point at different services. */
    alsoLabel: nonEmpty,
    resultCta: nonEmpty,
    back: nonEmpty,
    restart: nonEmpty,
    /** Shown instead of the quiz without JavaScript. */
    noScript: nonEmpty,
    noScriptCta: navLinkSchema,
  }),
  /** Heading beside the solutions diagram (diagram copy comes from solutions.diagram). */
  howItWorks: z.object({ heading: nonEmpty, intro: nonEmpty }),
  solutions: z.object({ heading: nonEmpty, intro: nonEmpty, cta: navLinkSchema }),
  why: z.object({
    heading: nonEmpty,
    items: z.array(titledSchema).length(4),
  }),
  /** The founder's name and title come from company.founder. */
  mission: z.object({ label: nonEmpty, statement: nonEmpty, founderLabel: nonEmpty, storyCta: navLinkSchema }),
  faq: z.object({ heading: nonEmpty, items: z.array(faqItemSchema).length(6) }),
  finalCta: z.object({ heading: nonEmpty, body: nonEmpty, cta: navLinkSchema, secondaryCta: navLinkSchema }),
});
export type Home = z.infer<typeof homeSchema>;

export const uiSchema = z.object({
  skipLink: nonEmpty,
  homeLinkLabel: nonEmpty,
  mainNavLabel: nonEmpty,
  solutionsMenuLabel: nonEmpty,
  solutionsMenuToggle: nonEmpty,
  allSolutionsLabel: nonEmpty,
  mobileMenuOpen: nonEmpty,
  mobileMenuClose: nonEmpty,
  themeToDark: nonEmpty,
  themeToLight: nonEmpty,
  illustrative: nonEmpty,
  footer: z.object({
    solutionsHeading: nonEmpty,
    companyHeading: nonEmpty,
    legalHeading: nonEmpty,
    socialHeading: nonEmpty,
    contactHeading: nonEmpty,
    whatsappLabel: nonEmpty,
    copyright: nonEmpty.includes("{year}"),
  }),
});
export type Ui = z.infer<typeof uiSchema>;

/* Solutions: custom AI work for organisations. */
export const serviceIdSchema = z.enum(["automation", "integration", "custom-agent"]);
export type ServiceId = z.infer<typeof serviceIdSchema>;

export const solutionsSchema = z.object({
  meta: z.object({ title: nonEmpty, description: nonEmpty.max(160) }),
  hero: z.object({ title: nonEmpty, subtitle: nonEmpty, cta: navLinkSchema }),
  servicesHeading: nonEmpty,
  exampleLabel: nonEmpty,
  services: z
    .array(z.object({ id: serviceIdSchema, name: nonEmpty, summary: nonEmpty, example: nonEmpty }))
    .length(3)
    .refine((xs) => new Set(xs.map((x) => x.id)).size === xs.length, { message: "service ids must be unique" }),
  diagram: z
    .object({
      alt: nonEmpty,
      systemsLabel: nonEmpty,
      /** Each system names the outcome (index into `outcomes`) the AI layer turns it into. */
      systems: z.array(z.object({ name: nonEmpty, outcome: z.number().int().min(0) })).min(3).max(5),
      coreLabel: nonEmpty,
      coreDetail: nonEmpty,
      outcomesLabel: nonEmpty,
      outcomes: z.array(nonEmpty).min(2).max(4),
      /** Shown once JavaScript runs: how to use the interactive diagram. */
      hint: nonEmpty,
      pauseLabel: nonEmpty,
      playLabel: nonEmpty,
      /** Screen-reader announcement when a system is chosen: "{system}" and "{outcome}". */
      announce: nonEmpty.includes("{system}").includes("{outcome}"),
    })
    .refine((d) => d.systems.every((s) => s.outcome < d.outcomes.length), {
      message: "every system's outcome must point at an entry in outcomes",
      path: ["systems"],
    }),
  process: z.object({
    heading: nonEmpty,
    steps: z.array(titledSchema).length(4),
  }),
  audience: z.object({ heading: nonEmpty, items: z.array(nonEmpty).min(1) }),
  caseStudies: z.object({
    heading: nonEmpty,
    /** Shown only when site.features.showCaseStudies is true. Real, approved work only. */
    items: z.array(z.object({ title: nonEmpty, organisation: nonEmpty, summary: nonEmpty })),
  }),
  enquiry: z.object({ heading: nonEmpty, body: nonEmpty }),
});
export type Solutions = z.infer<typeof solutionsSchema>;

/* ------------------------------------------------------------------ */
/* Brand rules, applied to every string in the content tree.           */
/* ------------------------------------------------------------------ */

/** Misspellings of the company name. "Alole" is the only valid form. */
const NAME_MISSPELLINGS = /\b(?:ALOLE|AloleAI|AloleAi|alole)\b/;
const BANNED_WORDS = [
  "revolutionary",
  "game-changing",
  "cutting-edge",
  "unleash",
  "seamless",
  "seamlessly",
  "leverage",
  "next-generation",
  "empower",
  "empowers",
  "empowering",
  "synergy",
  "synergies",
] as const;
const BANNED_WORD_PATTERN = new RegExp(`\\b(?:${BANNED_WORDS.join("|")})\\b`, "i");
/**
 * Alole builds on existing models; it must never claim to train or own them.
 * Matches first-person claims, so the FAQ question "Does Alole build its own
 * AI models?" (answered "No") is allowed.
 */
const MODEL_CLAIM_PATTERN =
  /\b(?:(?:train|trains|trained|training) (?:our|its) own|our own (?:foundation |large language |AI )?models?|proprietary (?:foundation |AI )?models?|own(?:s)? (?:the |its |our )?(?:AI )?infrastructure)\b/i;

export interface BrandViolation {
  path: string;
  value: string;
  rule: "name-spelling" | "banned-word" | "model-claim";
}

/** Walks any JSON-like value and reports brand-rule violations in its strings. */
export function findBrandViolations(value: unknown, path = "content"): BrandViolation[] {
  if (typeof value === "string") {
    // URLs, paths and email addresses may legitimately contain a lowercase
    // handle or domain (e.g. /company/alole, hello@alole.ai).
    if (/^(?:https?:\/\/|\/)/.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return [];
    const out: BrandViolation[] = [];
    if (NAME_MISSPELLINGS.test(value)) out.push({ path, value, rule: "name-spelling" });
    if (BANNED_WORD_PATTERN.test(value)) out.push({ path, value, rule: "banned-word" });
    if (MODEL_CLAIM_PATTERN.test(value)) out.push({ path, value, rule: "model-claim" });
    return out;
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => findBrandViolations(item, `${path}[${i}]`));
  }
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => findBrandViolations(v, `${path}.${k}`));
  }
  return [];
}
