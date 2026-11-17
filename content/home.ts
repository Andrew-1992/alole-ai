import type { z } from "zod";
import type { homeSchema } from "@/lib/schemas/content";
import { TODO_COPY } from "./todo-copy";

export const home = {
  meta: {
    title: "Alole | AI Agents for Business Workflows in South Sudan",
    description: TODO_COPY(
      "Alole builds AI agents, automations and integrations that run business workflows, for companies across South Sudan and beyond.",
    ),
  },
  hero: {
    title: "Your workflows, run by AI agents.",
    subtitle:
      "Alole builds practical AI agents, automations and integrations for businesses across South Sudan and beyond.",
    primaryCta: { label: "Start a project", href: "/contact/client-project" },
    secondaryCta: { label: TODO_COPY("See how it works"), href: "/solutions" },
    capabilitiesLabel: TODO_COPY("What Alole builds"),
    capabilities: [
      {
        kind: "agents",
        title: "AI agents",
        body: "Agents built for one organisation's specific process.",
        href: "/solutions#custom-agent",
      },
      {
        kind: "automation",
        title: "AI automation",
        body: "Workflows that take over repetitive, manual tasks.",
        href: "/solutions#automation",
      },
      {
        kind: "integration",
        title: "AI integration",
        body: "AI capabilities built into a client's existing software and data.",
        href: "/solutions#integration",
      },
    ],
  },
  howItWorks: {
    heading: TODO_COPY("AI that works inside your business."),
    intro: TODO_COPY(
      "We connect AI to the systems you already run, so routine work gets done without changing how your team operates.",
    ),
  },
  picker: {
    heading: TODO_COPY("Not sure where to start?"),
    intro: TODO_COPY("Answer three quick questions and we'll suggest where to start."),
    progress: TODO_COPY("Question {current} of {total}"),
    questions: [
      {
        legend: TODO_COPY("What would help your business most?"),
        options: [
          { label: TODO_COPY("Customers get answers and bookings faster"), service: "custom-agent" },
          { label: TODO_COPY("My team stops repeating the same tasks"), service: "automation" },
          { label: TODO_COPY("Our software and data work together"), service: "integration" },
        ],
      },
      {
        legend: TODO_COPY("Where does that work happen today?"),
        options: [
          { label: TODO_COPY("WhatsApp, phone calls and messages"), service: "custom-agent" },
          { label: TODO_COPY("Spreadsheets, paper forms and email"), service: "automation" },
          { label: TODO_COPY("Our own software or database"), service: "integration" },
        ],
      },
    ],
    timeline: {
      legend: TODO_COPY("When would you like to start?"),
      options: [
        { label: TODO_COPY("Just exploring"), value: "exploring" },
        { label: TODO_COPY("Within 3 months"), value: "within-3-months" },
        { label: TODO_COPY("In 3 to 6 months"), value: "3-6-months" },
        { label: TODO_COPY("Later"), value: "later" },
      ],
    },
    resultLabel: TODO_COPY("Our suggestion"),
    alsoLabel: TODO_COPY("Also worth a look"),
    resultCta: "Start a project",
    back: "Back",
    restart: TODO_COPY("Start over"),
    noScript: TODO_COPY("Compare our three services side by side to find the one that fits."),
    noScriptCta: { label: TODO_COPY("See all services"), href: "/solutions" },
  },
  solutions: {
    heading: "AI built into your organisation.",
    intro: "Custom AI automation and integration, built into how your organisation already works.",
    cta: { label: "Start a project", href: "/contact/client-project" },
  },
  why: {
    heading: "Why Alole",
    items: [
      {
        title: "Built for real conditions",
        body: "Mobile-first users, slow connections, local payment methods, multiple languages.",
      },
      { title: "Agents, not chatbots", body: "Our AI completes tasks end to end." },
      {
        title: TODO_COPY("Built into your tools"),
        body: TODO_COPY("We connect AI to the software, data and channels your team already uses."),
      },
      { title: "Underserved markets first", body: "We start where the gap between need and technology is widest." },
    ],
  },
  mission: {
    label: "Mission",
    statement: "We build practical AI for the people and businesses most technology overlooks.",
    founderLabel: TODO_COPY("Founded by"),
    storyCta: { label: TODO_COPY("Read our story"), href: "/about" },
  },
  faq: {
    heading: TODO_COPY("Questions"),
    items: [
      {
        question: "What is Alole?",
        answer:
          TODO_COPY(
            "An applied AI company based in Juba, South Sudan. We build AI agents, automations and integrations that run business workflows.",
          ),
      },
      {
        question: "Does Alole build its own AI models?",
        answer:
          TODO_COPY("No. We build on leading AI models and turn them into systems that complete real tasks."),
      },
      {
        question: TODO_COPY("What work can an AI agent take on?"),
        answer: TODO_COPY(
          "Routine work that follows a clear process: answering customer messages, taking bookings, processing documents, updating records and preparing reports.",
        ),
      },
      {
        question: "Can you build AI for my organisation?",
        answer:
          "Yes. We deliver AI automation, AI integration and custom agents. Start a project to tell us what you need.",
      },
      {
        question: "What makes Alole different?",
        answer:
          "Our AI completes real tasks end to end, and we design for local realities: mobile-first users, unreliable connectivity and local payment methods.",
      },
      {
        question: "How can I partner with Alole?",
        answer: "Use the contact form and choose “Partnership”.",
      },
    ],
  },
  finalCta: {
    heading: "Have a project in mind?",
    body: TODO_COPY("Tell us the problem you want solved. We'll reply with next steps."),
    cta: { label: "Start a project", href: "/contact/client-project" },
    secondaryCta: { label: TODO_COPY("Contact us"), href: "/contact" },
  },
} satisfies z.input<typeof homeSchema>;
