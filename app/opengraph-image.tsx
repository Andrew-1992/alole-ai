import { company, site } from "@/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/render";

export const alt = site.tagline;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: `${company.category} · ${company.headquarters}`,
    title: site.tagline,
    subtitle: site.secondaryLine,
  });
}
