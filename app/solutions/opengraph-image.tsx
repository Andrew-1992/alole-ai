import { solutions } from "@/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/render";

export const alt = solutions.hero.title;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: solutions.meta.title,
    title: solutions.hero.title,
    subtitle: solutions.services.map((s) => s.name).join(" \u00b7 "),
  });
}
