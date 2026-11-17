import type { z } from "zod";
import type { solutionsSchema } from "@/lib/schemas/content";
import { TODO_COPY } from "./todo-copy";

/** AI solutions: custom automation, integration and agents for organisations. */
export const solutions = {
  meta: {
    title: "Solutions",
    description: TODO_COPY(
      "Custom AI automation, AI integration and AI agents, built into how your organisation already works. Start a project with Alole.",
    ),
  },
  hero: {
    title: "AI built into how your organisation works.",
    subtitle:
      "We scope each project around a specific business problem and deliver it as a working system, not a report.",
    cta: { label: "Start a project", href: "/solutions#start-a-project" },
  },
  servicesHeading: TODO_COPY("What we build"),
  exampleLabel: "Example",
  services: [
    {
      id: "custom-agent",
      name: "Custom AI agents",
      summary: "Agents built for one organisation's specific process.",
      example: "An agent that handles bookings, intake or follow-ups for a single business.",
    },
    {
      id: "automation",
      name: "AI automation",
      summary: "Workflows that take over repetitive, manual tasks.",
      example: "Processing incoming documents, answering routine customer messages, preparing reports.",
    },
    {
      id: "integration",
      name: "AI integration",
      summary: "AI capabilities built into a client's existing software and data.",
      example: "Adding an AI assistant to a company's customer system or internal tools.",
    },
  ],
  diagram: {
    alt: TODO_COPY(
      "Illustration: an organisation's existing systems (customer messages, documents, internal tools and payments) connect to an AI layer built by Alole, which drafts replies, updates records and prepares reports.",
    ),
    systemsLabel: TODO_COPY("Your existing systems"),
    systems: [
      { name: TODO_COPY("Customer messages"), outcome: 0 },
      { name: TODO_COPY("Documents"), outcome: 1 },
      { name: TODO_COPY("Internal tools"), outcome: 1 },
      { name: TODO_COPY("Payments and accounts"), outcome: 2 },
    ],
    coreLabel: TODO_COPY("AI layer"),
    coreDetail: TODO_COPY("Built by Alole on leading AI models"),
    outcomesLabel: TODO_COPY("Work done"),
    outcomes: [TODO_COPY("Replies drafted"), TODO_COPY("Records updated"), TODO_COPY("Reports prepared")],
    hint: TODO_COPY("Tap a system to see the work the AI layer turns it into."),
    pauseLabel: "Pause demo",
    playLabel: "Play demo",
    announce: TODO_COPY("{system}. Result: {outcome}."),
  },
  process: {
    heading: "How we work",
    steps: [
      { title: "Discover", body: "Understand the problem and data." },
      { title: "Design", body: "Agree the solution, scope and success measures." },
      { title: "Build", body: "Deliver a working system in stages." },
      { title: "Support", body: "Monitor, improve and maintain." },
    ],
  },
  audience: {
    heading: "Who we work with",
    items: ["Businesses", "NGOs and development organisations", "Public institutions"],
  },
  caseStudies: {
    heading: TODO_COPY("Case studies"),
    items: [],
  },
  enquiry: {
    heading: "Start a project",
    body: TODO_COPY(
      "Tell us the problem you want solved and how your organisation works today. We'll reply with next steps.",
    ),
  },
} satisfies z.input<typeof solutionsSchema>;
