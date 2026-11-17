import type { z } from "zod";
import type { pagesSchema } from "@/lib/schemas/pages";
import { TODO_COPY } from "./todo-copy";

const COUNSEL = "[To be completed by legal counsel]";

export const pages = {
  about: {
    meta: {
      title: "About",
      description: TODO_COPY(
        "Alole is an applied AI company in Juba, South Sudan, building AI agents, automations and integrations for businesses and institutions.",
      ),
    },
    heading: TODO_COPY("Practical AI, built where it's needed."),
    story: [
      TODO_COPY(
        "Alole was founded in Juba to bring practical AI to the people and businesses that global technology companies overlook.",
      ),
      TODO_COPY(
        "Most AI products assume fast internet, desktop computers and international payment cards. Many of the people we build for have none of these. So we design for the conditions our customers actually live and work in.",
      ),
      TODO_COPY(
        "We are starting in South Sudan. From there we will grow across East Africa, the rest of the continent and global markets.",
      ),
    ],
    whatWeAreHeading: TODO_COPY("What we are"),
    whatWeAre: TODO_COPY("An applied AI company that builds three things for organisations."),
    businessLines: [
      {
        title: "AI agents",
        body: TODO_COPY("Agents built for one organisation's specific process, from bookings to intake and follow-ups."),
      },
      {
        title: "AI automation",
        body: TODO_COPY("Workflows that take over repetitive, manual tasks such as documents, routine messages and reports."),
      },
      {
        title: "AI integration",
        body: TODO_COPY("AI capabilities built into a client's existing software, data and channels."),
      },
    ],
    missionHeading: "Mission",
    mission:
      "To build practical AI that works for the people and businesses most technology overlooks: affordable, reliable and designed for local realities.",
    visionHeading: "Vision",
    vision:
      "An Africa where every business, institution and person can put world-class AI to work, built by Africans who understand the problems firsthand.",
    valuesHeading: "Values",
    values: [
      { title: "Excellence", body: TODO_COPY("Every system we build meets a world-class standard, wherever its users are.") },
      { title: "Trust", body: "We protect customer data and build secure systems by default." },
      { title: "Practicality", body: "We solve real problems people will pay to have solved." },
      { title: "Local insight, global ambition", body: "We build from Africa, for the world." },
    ],
    leadershipHeading: "Leadership",
    teamHeading: TODO_COPY("Team"),
    headquartersHeading: "Headquarters",
  },
  careers: {
    meta: {
      title: "Careers",
      description: TODO_COPY(
        "Alole is building a team in South Sudan. See what we value in people and how to get in touch.",
      ),
    },
    heading: "We're building a team in South Sudan.",
    intro: TODO_COPY(
      "We're looking for people who want to build useful AI for the places most technology overlooks. We have no open roles listed right now. If you'd like to be considered when we do, tell us about yourself.",
    ),
    valuesHeading: TODO_COPY("What we value in people"),
    values: [
      {
        title: TODO_COPY("You finish things"),
        body: TODO_COPY("Our agents complete tasks end to end. We work the same way."),
      },
      {
        title: TODO_COPY("You raise problems early"),
        body: TODO_COPY("Bad news shared early is worth more than good news shared late."),
      },
      {
        title: TODO_COPY("You care who uses it"),
        body: TODO_COPY("You think about the person on a slow connection with an old phone."),
      },
      {
        title: TODO_COPY("You keep learning"),
        body: TODO_COPY("The field moves fast. Curiosity matters more than any single skill."),
      },
    ],
    openingsHeading: TODO_COPY("Open roles"),
    jobs: [],
    noOpenings: TODO_COPY("No open roles right now."),
    cta: TODO_COPY("Tell us about yourself"),
  },
  press: {
    meta: {
      title: "Press",
      description: TODO_COPY(
        "Alole description, boilerplate, logo files and brand colours for journalists and partners.",
      ),
    },
    heading: "Press",
    intro: TODO_COPY("Everything you need to write about Alole. For interviews or questions, use the contact form."),
    oneLineHeading: TODO_COPY("In one line"),
    oneLine: TODO_COPY("Alole is an applied AI company building AI agents, automations and integrations for African businesses."),
    boilerplateHeading: "Boilerplate",
    boilerplate: TODO_COPY(
      "Alole (Alole AI Limited) is an applied AI company based in Juba, South Sudan. It builds AI agents, AI automation and AI integration that run business workflows: answering customers, taking bookings, processing documents, updating records and preparing reports, inside the tools organisations already use. Every system is designed for African realities and built to a world-class standard.",
    ),
    assetsHeading: TODO_COPY("Logo files"),
    assetsNote: TODO_COPY("Please keep clear space around the logo and don't recolour, rotate or stretch it."),
    assets: [
      {
        label: "Logo, for light backgrounds",
        surface: "light",
        files: [
          { format: "SVG", href: "/press/alole-logo-light.svg" },
          { format: "PNG", href: "/press/alole-logo-light.png" },
        ],
      },
      {
        label: "Logo, for dark backgrounds",
        surface: "dark",
        files: [
          { format: "SVG", href: "/press/alole-logo-dark.svg" },
          { format: "PNG", href: "/press/alole-logo-dark.png" },
        ],
      },
      {
        label: "Mark",
        surface: "light",
        files: [
          { format: "SVG", href: "/press/alole-mark.svg" },
          { format: "PNG", href: "/press/alole-mark.png" },
        ],
      },
    ],
    colorsHeading: TODO_COPY("Brand colours"),
    colors: [
      { name: "Ink", hex: "#171717", use: "Text and primary surfaces" },
      { name: "Paper", hex: "#F2F0EE", use: "Backgrounds" },
      { name: "Signal orange", hex: "#ED4F00", use: "Brand accent on light" },
      { name: "Signal orange (dark)", hex: "#FF6A1A", use: "Brand accent on dark" },
    ],
    contactHeading: TODO_COPY("Press contact"),
    contactBody: TODO_COPY(
      "For interviews, comment or anything not covered here, send us a message and choose “Press”.",
    ),
    contactCta: TODO_COPY("Contact the press team"),
  },
  contact: {
    meta: {
      title: "Contact",
      description: TODO_COPY(
        "Contact Alole about a client project, partnerships, press or careers.",
      ),
    },
    heading: TODO_COPY("Contact us"),
    locationHeading: "Location",
    phoneHeading: "Phone",
    whatsappHeading: "WhatsApp",
    whatsappLabel: "Chat on WhatsApp",
    emailHeading: "Email",
    responseHeading: TODO_COPY("Response time"),
    topics: {
      "client-project": {
        label: "Client project",
        intro: TODO_COPY(
          "Tell us the problem you want solved and how your organisation works today. We'll reply with next steps.",
        ),
        subjectPrefix: "[Project]",
      },
      general: {
        label: "General",
        intro: TODO_COPY("Tell us what you have in mind. A person reads every message."),
        subjectPrefix: "[General]",
      },
      partnership: {
        label: "Partnership",
        intro: TODO_COPY("Interested in partnering with Alole? Tell us about your organisation and idea."),
        subjectPrefix: "[Partnership]",
      },
      press: {
        label: "Press",
        intro: TODO_COPY("For interviews, comment or press materials, tell us about your story and deadline."),
        subjectPrefix: "[Press]",
      },
      careers: {
        label: "Careers",
        intro: TODO_COPY("Tell us about yourself and the kind of work you'd like to do with us."),
        subjectPrefix: "[Careers]",
      },
    },
    form: {
      nameLabel: "Name",
      emailLabel: "Email",
      organisationLabel: "Organisation",
      optionalSuffix: "(optional)",
      organisationProjectSuffix: TODO_COPY("(required for client projects)"),
      topicLabel: "Topic",
      serviceLabel: "Service of interest",
      timelineLabel: "Timeline",
      choosePlaceholder: TODO_COPY("Choose one"),
      projectFieldsNote: TODO_COPY("For client projects only."),
      services: {
        automation: "Automation",
        integration: "Integration",
        "custom-agent": "Custom agent",
        "not-sure": "Not sure",
      },
      timelines: {
        exploring: "Exploring",
        "within-3-months": "Within 3 months",
        "3-6-months": "3–6 months",
        later: "Later",
      },
      messageLabel: "Message",
      messageHint: TODO_COPY("Up to 5,000 characters."),
      privacyNote: TODO_COPY("We use these details only to reply to you. See our {privacy}."),
      privacyLinkText: "privacy policy",
      submit: TODO_COPY("Send message"),
      submitting: "Sending…",
      success: TODO_COPY("Thanks, your message is on its way. We've sent a short confirmation to your email."),
      errorSummary: TODO_COPY("Please check the highlighted fields."),
      serverError: TODO_COPY("Your message couldn't be sent. Please try again in a few minutes."),
      rateLimited: TODO_COPY("Too many messages. Please wait a few minutes and try again."),
      honeypotLabel: "Leave this field empty",
      fieldErrors: {
        name_required: TODO_COPY("Enter your name."),
        name_too_long: TODO_COPY("Use 100 characters or fewer for your name."),
        email_required: TODO_COPY("Enter your email address."),
        email_invalid: TODO_COPY("Enter an email address like name@example.com."),
        organisation_required: TODO_COPY("Enter your organisation's name for a client project."),
        organisation_too_long: TODO_COPY("Use 150 characters or fewer for your organisation."),
        topic_invalid: TODO_COPY("Choose a topic from the list."),
        service_invalid: TODO_COPY("Choose a service from the list."),
        timeline_invalid: TODO_COPY("Choose a timeline from the list."),
        message_too_short: TODO_COPY("Write a message of at least 10 characters."),
        message_too_long: TODO_COPY("Keep your message to 5,000 characters or fewer."),
      },
    },
  },
  privacy: {
    meta: {
      title: "Privacy policy",
      description: TODO_COPY(
        "What Alole collects through this website, why, where it is stored and how to unsubscribe or ask for deletion.",
      ),
    },
    heading: "Privacy policy",
    status: `Draft. ${COUNSEL}`,
    intro: TODO_COPY(
      "This page explains what this website collects, why, where it is kept and how to remove it. It describes how the site actually works today. Sections marked for legal counsel will be completed before launch.",
    ),
    sections: [
      {
        heading: "Who we are",
        paragraphs: ["Alole, Juba, South Sudan.", `Legal entity, registered address and data protection contact: ${COUNSEL}`],
      },
      {
        heading: "What each form collects",
        paragraphs: [],
        table: {
          columns: ["Form", "What we collect", "Why", "Where it is stored"],
          rows: [
            [
              "Enquiry",
              TODO_COPY(
                "Name, email address, organisation, topic and your message. For client projects, also the service you're interested in and your timeline, if you give them.",
              ),
              TODO_COPY("To read and reply to your enquiry, and to send one confirmation email."),
              TODO_COPY(
                "Delivered by email through our email provider (Resend) to the Alole team inbox. It is not added to any mailing list.",
              ),
            ],
          ],
        },
      },
      {
        heading: "Abuse prevention",
        paragraphs: [
          TODO_COPY(
            "To stop spam and automated abuse, the forms count recent submissions from each IP address and each email address. Email addresses are stored for this only as a one-way hash, never in readable form. These counters are deleted automatically after at most one hour.",
          ),
          TODO_COPY(
            "Our error logs record that a problem happened, never the contents of a form or an email address.",
          ),
        ],
      },
      {
        heading: "Cookies and tracking",
        paragraphs: [
          TODO_COPY("This website sets no cookies and uses no advertising or tracking scripts."),
          TODO_COPY(
            "If you switch between light and dark mode, your choice is saved in your browser's local storage on your own device. It is never sent to us.",
          ),
          TODO_COPY(
            "Links to WhatsApp or phone calls open other services, which have their own privacy policies.",
          ),
          `${TODO_COPY("Our hosting provider may keep standard server logs, such as IP addresses and requested pages, for security and operations. Hosting provider and log retention:")} ${COUNSEL}`,
        ],
      },
      {
        heading: "How to ask for access or deletion",
        paragraphs: [
          TODO_COPY(
            "Use the contact form, choose “General” and tell us what you would like us to do. We will delete any messages you sent us, or tell you what we hold.",
          ),
          `Response deadlines and identity checks: ${COUNSEL}`,
        ],
      },
      {
        heading: "How long we keep information",
        paragraphs: [`Retention period for enquiries: ${COUNSEL}`],
      },
      {
        heading: "International transfers",
        paragraphs: [
          TODO_COPY("Our email provider may process and store data outside South Sudan."),
          `Transfer safeguards: ${COUNSEL}`,
        ],
      },
      { heading: "Your rights and changes to this policy", paragraphs: [COUNSEL] },
    ],
  },
  terms: {
    meta: { title: "Terms of use", description: TODO_COPY("Terms of use for the Alole website.") },
    heading: "Terms of use",
    status: `Draft. ${COUNSEL}`,
    intro: TODO_COPY(
      "These terms will govern your use of this website. They will be completed by legal counsel before launch.",
    ),
    sections: [
      { heading: "Who we are", paragraphs: [`Alole, Juba, South Sudan. ${COUNSEL}`] },
      { heading: "Using this website", paragraphs: [COUNSEL] },
      {
        heading: "Services described on this site",
        paragraphs: [
          TODO_COPY(
            "Descriptions of our services explain what we build and may change. Illustrations are labelled and do not show real customers or data. Client projects are governed by a separate agreement.",
          ),
          COUNSEL,
        ],
      },
      { heading: "Intellectual property", paragraphs: [COUNSEL] },
      { heading: "Limitation of liability", paragraphs: [COUNSEL] },
      { heading: "Governing law", paragraphs: [COUNSEL] },
      { heading: "Changes to these terms", paragraphs: [COUNSEL] },
    ],
  },
  signIn: {
    meta: {
      title: "Sign in",
      description: TODO_COPY("Client accounts for Alole are coming soon. Contact us about a new or existing project."),
    },
    eyebrow: TODO_COPY("Client accounts"),
    heading: TODO_COPY("Client sign-in is coming soon."),
    body: TODO_COPY(
      "We're building a place where clients can follow their projects and manage their AI agents. Until it opens, contact us about any new or existing project and a person will reply.",
    ),
    primaryCta: { label: TODO_COPY("Contact us"), href: "/contact" },
    secondaryCta: { label: "Start a project", href: "/contact/client-project" },
  },
  notFound: {
    meta: { title: "Page not found", description: TODO_COPY("The page you were looking for doesn't exist.") },
    code: "404",
    heading: TODO_COPY("This page doesn't exist."),
    body: TODO_COPY("The link may be old, or the address may have a typo. These will get you back on track."),
    homeCta: TODO_COPY("Go to the home page"),
    solutionsCta: TODO_COPY("See our solutions"),
  },
  emails: {
    contactConfirmation: {
      subject: TODO_COPY("We received your message"),
      lines: [
        TODO_COPY("Thanks for contacting Alole. We've received your message and a person will read it."),
        TODO_COPY("If you didn't send a message through our website, you can ignore this email."),
      ],
    },
    signoff: "Alole, Juba, South Sudan",
  },
} satisfies z.input<typeof pagesSchema>;
