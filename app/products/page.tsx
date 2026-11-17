import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageIntro } from "@/components/sections/page-intro";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { ProductMark, StatusBadge } from "@/components/ui/product-mark";
import { format, pages, products, ui } from "@/content";

const copy = pages.products;

export const metadata: Metadata = pageMetadata({
  title: copy.meta.title,
  description: copy.meta.description,
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <PageIntro heading={copy.heading} intro={copy.intro} />
      <Container>
        <ul className="flex flex-col">
          {products.map((product) => (
            <li
              key={product.slug}
              data-reveal
              className="grid gap-8 border-b border-line py-14 last:border-b-0 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:py-20"
            >
              <div className="flex flex-col gap-4">
                <p className="flex items-center gap-2.5 text-small font-medium text-muted">
                  <ProductMark accent={product.accent} />
                  {product.agentType}
                </p>
                <h2 className="font-display text-h1">{product.name}</h2>
                <p className="text-lead">{product.promise}</p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <StatusBadge status={product.status} label={ui.statusLabels[product.status]} />
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex items-center gap-1.5 rounded-sm font-medium text-ink hover:text-accent-ink"
                  >
                    {format(ui.exploreProduct, { name: product.name })}
                    <ArrowIcon size={14} />
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <p className="text-muted">{product.description}</p>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-small font-medium">{copy.capabilitiesLabel}</h3>
                    <ul className="flex flex-col gap-2">
                      {product.capabilities.map((c) => (
                        <li key={c} className="flex items-start gap-3 text-small">
                          <ProductMark accent={product.accent} size={6} className="mt-2" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-small font-medium">{copy.audienceLabel}</h3>
                    <p className="text-small text-muted">{product.audience}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
