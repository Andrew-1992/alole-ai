import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import { ProductGlyph } from "@/components/ui/glyphs";
import { StatusBadge, accentText, accentTint } from "@/components/ui/product-mark";
import type { Product } from "@/lib/schemas/content";

interface ProductCardProps {
  product: Product;
  statusLabel: string;
  linkLabel: string;
  headingLevel?: "h2" | "h3";
}

/**
 * Media card: a tinted tile on top, text below, no outer border. The whole
 * card is clickable through the link's stretched pseudo-element, while the
 * link text stays descriptive ("Explore Yaude AI").
 */
export function ProductCard({ product, statusLabel, linkLabel, headingLevel = "h3" }: ProductCardProps) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex w-full flex-col gap-5 rounded-xl has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-accent">
      <div
        className={`relative flex aspect-[16/9] flex-col sm:aspect-[4/3] justify-between overflow-hidden rounded-xl p-5 transition-transform duration-300 ease-out-soft group-hover:scale-[0.985] ${accentTint[product.accent]}`}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="eyebrow text-ink-soft">{product.agentType}</p>
          <StatusBadge status={product.status} label={statusLabel} />
        </div>
        <span
          className={`flex size-16 items-center justify-center rounded-2xl bg-surface/70 transition-transform duration-300 ease-out-soft group-hover:-translate-y-1 ${accentText[product.accent]}`}
        >
          <ProductGlyph accent={product.accent} size={32} />
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <Heading className="text-h3 font-medium">{product.name}</Heading>
        <p className="text-small text-muted">{product.summary}</p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-1 flex w-fit items-center gap-1.5 text-small font-medium text-ink after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:outline-none"
        >
          {linkLabel}
          <ArrowIcon
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
}
