import type { z } from "zod";
import type { illustrationsSchema } from "@/lib/schemas/content";
import { TODO_COPY } from "./todo-copy";

/**
 * Text inside the stylised interface illustrations. These are labelled
 * "Illustrative" on the site. Fares and carriers are deliberately left as
 * placeholder bars: we never invent prices, airlines or customers.
 */
export const illustrations = {
  yaude: {
    alt: TODO_COPY("Illustration: Yaude AI drafts a social media post announcing a shop's weekend opening hours and waits for approval."),
    label: "Yaude AI · drafting a social post",
    task: TODO_COPY("draft social post"),
    request: TODO_COPY("Post our new weekend opening hours."),
    draft: TODO_COPY("We're now open Saturdays and Sundays, 9am to 6pm. Same shop, more time to visit."),
    schedule: "Schedule: Sat 9:00",
    approve: "Approve",
  },
  bluckflies: {
    alt: TODO_COPY("Illustration: BluckFlies searches flights from Juba to Nairobi, compares three options and suggests the morning flight."),
    label: "BluckFlies · flight search",
    task: TODO_COPY("search JUB → NBO"),
    route: "JUB → NBO",
    routeDetail: "Juba to Nairobi · 1 adult",
    options: ["Morning · direct", "Afternoon · direct", "Evening · 1 stop"],
    bestFit: "Best fit",
    reply: TODO_COPY("The morning flight fits your meeting. Book it?"),
  },
  kodip: {
    alt: TODO_COPY("Illustration: Kodip AI writes a typed table component from a requirement and checks it step by step."),
    label: "Kodip AI · generating a component",
    task: TODO_COPY("generate component"),
    code: "type Props = { orders: Order[] };\n\nexport function OrdersTable({ orders }: Props) {\n  if (orders.length === 0) return <EmptyState />;\n  return <Table rows={orders} />;\n}",
    steps: ["Requirements read", "Component written", "Checking types"],
  },
  manas: {
    alt: TODO_COPY("Illustration: Manas AI explains percentages to an adult learner, then asks a quick question and marks the answer correct."),
    label: "Manas AI · explaining a lesson",
    task: TODO_COPY("explain a lesson"),
    lessonTitle: TODO_COPY("Lesson 3 · Percentages"),
    explanation: TODO_COPY("20% means 20 out of every 100. So 20% of 500 is 5 groups of 20, which is 100."),
    question: TODO_COPY("Quick check: what is 10% of 300?"),
    options: ["3", "30", "300"],
    correctIndex: 1,
    correctLabel: "Correct",
  },
} satisfies z.input<typeof illustrationsSchema>;
