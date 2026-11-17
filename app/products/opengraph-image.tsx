import { pages } from "@/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/render";

export const alt = pages.products.heading;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({ eyebrow: "Products", title: pages.products.heading, subtitle: "Yaude AI · BluckFlies · Kodip AI · Manas AI" });
}
