import { pages } from "@/content";
import { CONTACT_TOPICS, isContactTopic } from "@/lib/forms/contact";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/render";

export const alt = pages.contact.meta.title;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return CONTACT_TOPICS.filter((t) => t !== "general").map((topic) => ({ topic }));
}

export default async function Image({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const copy = isContactTopic(topic) ? pages.contact.topics[topic] : pages.contact.topics.general;
  return renderOgImage({ eyebrow: copy.label, title: pages.contact.heading, subtitle: copy.intro });
}
