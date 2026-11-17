import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { ProductMark } from "@/components/ui/product-mark";
import { prefetchFor } from "@/lib/prefetch";
import type { Home, Product, Solutions } from "@/lib/schemas/content";
import type { Pages } from "@/lib/schemas/pages";
import { SectionHeader } from "./section-header";

interface WhatWeDoProps {
  copy: Home["whatWeDo"];
  /** [AI products, AI solutions], from pages.about.businessLines. */
  lines: Pages["about"]["businessLines"];
  products: Product[];
  services: Solutions["services"];
}

/** The two business lines side by side: the answer to "what does Alole do?". */
export function WhatWeDo({ copy, lines, products, services }: WhatWeDoProps) {
  const [productsLine, solutionsLine] = lines;
  return (
    <section aria-labelledby="what-we-do-heading" className="py-20 lg:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeader id="what-we-do-heading" heading={copy.heading} />
        <div className="grid gap-4 md:grid-cols-2">
          <article data-reveal className="flex flex-col gap-6 rounded-2xl bg-surface p-8 sm:p-10">
            <span aria-hidden="true" className="tabular-nums text-small text-muted">
              01
            </span>
            <h3 className="font-display text-h2">{productsLine.title}</h3>
            <p className="text-muted">{productsLine.body}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-small">
              {products.map((product) => (
                <li key={product.slug} className="flex items-center gap-2">
                  <ProductMark accent={product.accent} size={8} className="rounded-full" />
                  {product.name}
                </li>
              ))}
            </ul>
            <ButtonLink href={copy.productsCta.href} variant="secondary" className="mt-auto w-fit">
              {copy.productsCta.label}
              <ArrowIcon size={16} />
            </ButtonLink>
          </article>
          <article data-reveal className="flex flex-col gap-6 rounded-2xl bg-ink p-8 text-on-ink sm:p-10">
            <span aria-hidden="true" className="tabular-nums text-small text-on-ink/75">
              02
            </span>
            <h3 className="font-display text-h2">{solutionsLine.title}</h3>
            <p className="text-on-ink/75">{solutionsLine.body}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-small">
              {services.map((service) => (
                <li key={service.id} className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
                  {service.name}
                </li>
              ))}
            </ul>
            <ButtonLink
              href={copy.solutionsCta.href}
              prefetch={prefetchFor(copy.solutionsCta.href)}
              variant="inverse"
              className="mt-auto w-fit"
            >
              {copy.solutionsCta.label}
              <ArrowIcon size={16} />
            </ButtonLink>
          </article>
        </div>
      </Container>
    </section>
  );
}
