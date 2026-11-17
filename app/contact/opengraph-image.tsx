import { pages } from "@/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/render";

export const alt = pages.contact.heading;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: pages.contact.meta.title,
    title: pages.contact.heading,
    subtitle: pages.contact.topics.general.intro,
  });
}
