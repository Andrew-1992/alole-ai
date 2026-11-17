import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { NavLink, Product } from "@/lib/schemas/content";
import { ProductCard } from "./product-card";
import { SectionHeader } from "./section-header";

interface ProductGridProps {
  heading: string;
  intro: string;
  cta: NavLink;
  products: Product[];
  statusLabels: Record<Product["status"], string>;
  linkLabel: (product: Product) => string;
}

export function ProductGrid({ heading, intro, cta, products, statusLabels, linkLabel }: ProductGridProps) {
  return (
    <section id="products" aria-labelledby="products-heading" className="scroll-mt-24 py-20 lg:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeader
          id="products-heading"
          heading={heading}
          intro={intro}
          action={
            <ButtonLink href={cta.href} variant="secondary">
              {cta.label}
            </ButtonLink>
          }
        />
        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <li key={product.slug} data-reveal className="flex">
              <ProductCard
                product={product}
                statusLabel={statusLabels[product.status]}
                linkLabel={linkLabel(product)}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
