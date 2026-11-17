import { z } from "zod";
import { CONTACT_TOPICS, PROJECT_SERVICES, PROJECT_TIMELINES } from "@/lib/forms/options";

/** Schemas for page copy in content/pages.ts (validated in content/index.ts). */

const nonEmpty = z.string().trim().min(1);
const meta = z.object({ title: nonEmpty.max(70), description: nonEmpty.max(160) });
const titled = z.object({ title: nonEmpty, body: nonEmpty });

export type { ContactTopic, ProjectService, ProjectTimeline } from "@/lib/forms/options";

export const contactTopicSchema = z.enum(CONTACT_TOPICS);
export const projectServiceSchema = z.enum(PROJECT_SERVICES);
export const projectTimelineSchema = z.enum(PROJECT_TIMELINES);

export const aboutPageSchema = z.object({
  meta,
  heading: nonEmpty,
  story: z.array(nonEmpty).min(2).max(3),
  whatWeAreHeading: nonEmpty,
  whatWeAre: nonEmpty,
  /** What Alole builds: agents, automation and integration. */
  businessLines: z.array(titled).length(3),
  missionHeading: nonEmpty,
  mission: nonEmpty,
  visionHeading: nonEmpty,
  vision: nonEmpty,
  valuesHeading: nonEmpty,
  values: z.array(titled).min(1),
  leadershipHeading: nonEmpty,
  teamHeading: nonEmpty,
  headquartersHeading: nonEmpty,
});

export const jobSchema = z.object({
  title: nonEmpty,
  location: nonEmpty,
  type: nonEmpty,
  summary: nonEmpty,
});

export const careersPageSchema = z.object({
  meta,
  heading: nonEmpty,
  intro: nonEmpty,
  valuesHeading: nonEmpty,
  values: z.array(titled).min(1),
  openingsHeading: nonEmpty,
  /** Shown only when site.features.showJobListings is true and this list is non-empty. */
  jobs: z.array(jobSchema),
  noOpenings: nonEmpty,
  cta: nonEmpty,
});

export const pressPageSchema = z.object({
  meta,
  heading: nonEmpty,
  intro: nonEmpty,
  oneLineHeading: nonEmpty,
  oneLine: nonEmpty.max(200),
  boilerplateHeading: nonEmpty,
  /** Word for word from the brief. The legal name is shown only once registered (see lib/company.ts). */
  boilerplate: nonEmpty,
  assetsHeading: nonEmpty,
  assetsNote: nonEmpty,
  assets: z.array(
    z.object({
      label: nonEmpty,
      files: z.array(
        z.object({ format: z.enum(["SVG", "PNG"]), href: z.string().regex(/^\/press\/[a-z0-9-]+\.(svg|png)$/) }),
      ),
      /** Background to preview the asset on. */
      surface: z.enum(["light", "dark"]),
    }),
  ),
  colorsHeading: nonEmpty,
  colors: z.array(z.object({ name: nonEmpty, hex: z.string().regex(/^#[0-9A-F]{6}$/), use: nonEmpty })),
  contactHeading: nonEmpty,
  contactBody: nonEmpty,
  contactCta: nonEmpty,
});

export const contactPageSchema = z.object({
  meta,
  heading: nonEmpty,
  locationHeading: nonEmpty,
  phoneHeading: nonEmpty,
  whatsappHeading: nonEmpty,
  whatsappLabel: nonEmpty,
  emailHeading: nonEmpty,
  responseHeading: nonEmpty,
  topics: z.record(
    contactTopicSchema,
    z.object({
      label: nonEmpty,
      intro: nonEmpty,
      /** Prefix for the subject of the email the team receives, e.g. "[Project]". */
      subjectPrefix: z.string().regex(/^\[[A-Za-z ]{2,20}\]$/),
    }),
  ),
  form: z.object({
    nameLabel: nonEmpty,
    emailLabel: nonEmpty,
    organisationLabel: nonEmpty,
    optionalSuffix: nonEmpty,
    /** Shown without JavaScript, when the label cannot follow the chosen topic. */
    organisationProjectSuffix: nonEmpty,
    topicLabel: nonEmpty,
    serviceLabel: nonEmpty,
    timelineLabel: nonEmpty,
    choosePlaceholder: nonEmpty,
    projectFieldsNote: nonEmpty,
    services: z.record(projectServiceSchema, nonEmpty),
    timelines: z.record(projectTimelineSchema, nonEmpty),
    messageLabel: nonEmpty,
    messageHint: nonEmpty,
    privacyNote: nonEmpty.includes("{privacy}"),
    privacyLinkText: nonEmpty,
    submit: nonEmpty,
    submitting: nonEmpty,
    success: nonEmpty,
    errorSummary: nonEmpty,
    serverError: nonEmpty,
    rateLimited: nonEmpty,
    honeypotLabel: nonEmpty,
    fieldErrors: z.object({
      name_required: nonEmpty,
      name_too_long: nonEmpty,
      email_required: nonEmpty,
      email_invalid: nonEmpty,
      organisation_required: nonEmpty,
      organisation_too_long: nonEmpty,
      topic_invalid: nonEmpty,
      service_invalid: nonEmpty,
      timeline_invalid: nonEmpty,
      message_too_short: nonEmpty,
      message_too_long: nonEmpty,
    }),
  }),
});
export type ContactPageCopy = z.infer<typeof contactPageSchema>;

const legalSection = z.object({
  heading: nonEmpty,
  paragraphs: z.array(nonEmpty).default([]),
  /** Optional table rows, e.g. what each form collects. */
  table: z
    .object({
      columns: z.array(nonEmpty).min(2),
      rows: z.array(z.array(nonEmpty).min(2)),
    })
    .optional(),
  list: z.array(nonEmpty).optional(),
});

export const legalPageSchema = z.object({
  meta,
  heading: nonEmpty,
  status: nonEmpty,
  intro: nonEmpty,
  sections: z.array(legalSection).min(1),
});

/** Placeholder until client accounts exist: no form, nothing collected. */
export const signInPageSchema = z.object({
  meta,
  eyebrow: nonEmpty,
  heading: nonEmpty,
  body: nonEmpty,
  primaryCta: z.object({ label: nonEmpty, href: z.string().regex(/^\/[a-z0-9\-/#]*$/) }),
  secondaryCta: z.object({ label: nonEmpty, href: z.string().regex(/^\/[a-z0-9\-/#]*$/) }),
});

export const notFoundSchema = z.object({
  meta,
  code: nonEmpty,
  heading: nonEmpty,
  body: nonEmpty,
  homeCta: nonEmpty,
  solutionsCta: nonEmpty,
});

export const emailCopySchema = z.object({
  contactConfirmation: z.object({ subject: nonEmpty, lines: z.array(nonEmpty).min(1) }),
  signoff: nonEmpty,
});

export const pagesSchema = z.object({
  about: aboutPageSchema,
  careers: careersPageSchema,
  press: pressPageSchema,
  contact: contactPageSchema,
  privacy: legalPageSchema,
  terms: legalPageSchema,
  signIn: signInPageSchema,
  notFound: notFoundSchema,
  emails: emailCopySchema,
});
export type Pages = z.infer<typeof pagesSchema>;
