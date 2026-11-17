import type { z } from "zod";
import type { productsSchema } from "@/lib/schemas/content";
import { TODO_COPY } from "./todo-copy";

/**
 * The four products. Order here is the order everywhere on the site.
 * Change `status` as each product moves toward launch. A product can only be
 * marked "live" once its `live` details (real URL etc.) are filled in.
 */
export const products = [
  {
    slug: "yaude-ai",
    name: "Yaude AI",
    agentType: "Marketing agent",
    domain: "Marketing",
    status: "in-development",
    accent: "yaude",
    promise: "Your marketing team, as an AI agent.",
    summary: TODO_COPY("Plans social posts, runs ad campaigns, sends email campaigns and improves search visibility."),
    description: TODO_COPY(
      "Yaude AI will handle the marketing work a small business rarely has time for. It plans and writes social posts, sets up and runs ad campaigns, sends email campaigns and helps people find you in search.",
    ),
    capabilities: [
      "Plans and creates social media posts",
      "Creates and runs ad campaigns",
      "Writes and sends email campaigns",
      "Improves search visibility (SEO)",
    ],
    audience: "Small and growing businesses that need marketing without a marketing team.",
  },
  {
    slug: "bluckflies",
    name: "BluckFlies",
    agentType: "Travel agent",
    domain: "Travel",
    status: "in-development",
    accent: "bluckflies",
    promise: "Book flights the easy way.",
    summary: TODO_COPY("Searches, compares and books local and international flights in one simple conversation."),
    description: TODO_COPY(
      "BluckFlies will find and book flights in a short conversation. Tell it where and when you need to go; it searches local and international options, compares them by price and schedule, and handles the booking.",
    ),
    capabilities: [
      "Searches local and international flights",
      "Compares options by price and schedule",
      "Handles booking in a simple conversation",
      "Designed for travel in and out of South Sudan",
    ],
    audience: "Travellers, businesses and organisations travelling in and out of South Sudan.",
  },
  {
    slug: "kodip-ai",
    name: "Kodip AI",
    agentType: "Coding agent",
    domain: "Software",
    status: "in-development",
    accent: "kodip",
    promise: "Enterprise software, built at speed.",
    summary: TODO_COPY("Turns requirements into secure, working web applications and internal tools."),
    description: TODO_COPY(
      "Kodip AI will turn written requirements into working software. It builds web applications and internal tools, follows secure and maintainable engineering practices, and helps development teams deliver faster.",
    ),
    capabilities: [
      "Turns requirements into working software",
      "Builds web applications and internal tools",
      "Follows secure, maintainable engineering practices",
      "Accelerates delivery for development teams",
    ],
    audience: "Companies, institutions and development teams that need custom software.",
  },
  {
    slug: "manas-ai",
    name: "Manas AI",
    agentType: "Tutor agent",
    domain: "Tutoring",
    status: "in-development",
    accent: "manas",
    promise: "A personal tutor for every adult learner.",
    summary: TODO_COPY("Personal lessons, quizzes and feedback for adult learners, any time, on a phone."),
    description: TODO_COPY(
      "Manas AI will teach at each learner's pace. It explains topics, sets quizzes and gives feedback, and it works on an ordinary phone whenever the learner has time.",
    ),
    capabilities: [
      "Personalised lessons at each learner's pace",
      "Explains, quizzes and gives feedback",
      "Available any time on a phone",
      "Built for adult learners across South Sudan",
    ],
    audience: "Adult students and professionals across South Sudan.",
  },
] satisfies z.input<typeof productsSchema>;
