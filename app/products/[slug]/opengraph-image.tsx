import { getProduct, products } from "@/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og/render";

export const alt = "Alole product";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug) ?? products[0];
  if (!product) throw new Error("No products configured");
  return renderOgImage({
    eyebrow: product.agentType,
    title: product.name,
    subtitle: product.promise,
    accent: product.accent,
  });
}
