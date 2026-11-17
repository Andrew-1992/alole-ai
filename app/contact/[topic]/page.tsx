import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ContactPage } from "@/components/sections/contact-page";
import { pages } from "@/content";
import { CONTACT_TOPICS, isContactTopic } from "@/lib/forms/contact";

/**
 * /contact/press, /contact/careers etc.: the contact page with that topic
 * preselected, prerendered so it works without JavaScript. "general" lives at
 * /contact itself.
 */
export function generateStaticParams() {
  return CONTACT_TOPICS.filter((t) => t !== "general").map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: PageProps<"/contact/[topic]">): Promise<Metadata> {
  const { topic } = await params;
  if (!isContactTopic(topic) || topic === "general") return {};
  // Variants of /contact: canonical points at the main page, and they are not indexed.
  return pageMetadata({
    title: `${pages.contact.meta.title}: ${pages.contact.topics[topic].label}`,
    description: pages.contact.meta.description,
    path: "/contact",
    noindex: true,
  });
}

export default async function ContactTopicPage({ params }: PageProps<"/contact/[topic]">) {
  const { topic } = await params;
  if (!isContactTopic(topic) || topic === "general") notFound();
  return <ContactPage topic={topic} permalink={`/contact/${topic}`} />;
}
