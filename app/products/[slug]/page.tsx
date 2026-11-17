import type { Metadata } from "next";
import { env } from "@/lib/env";
import { jsonLdString, pageMetadata, productJsonLd } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WaitlistForm } from "@/components/forms/waitlist-form";
import { AgentIllustration } from "@/components/sections/agents-at-work";
import { ProductCard } from "@/components/sections/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ProductMark, StatusBadge } from "@/components/ui/product-mark";
import { format, getProduct, illustrations, navigation, pages, products, ui } from "@/content";

const copy = pages.product;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return pageMetadata({
    title: format(copy.metaTitle, { name: product.name }),
    description: `${product.promise} ${product.summary}`,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  // Unknown slugs are not prerendered and render the 404 page instead.
  if (!product) notFound();

  const others = products.filter((p) => p.slug !== product.slug);
  // Only emitted once the product is live with real details (never invented).
  const jsonLd = productJsonLd(product, env.SITE_URL);
  const [closingBefore = "", closingAfter = ""] = copy.closingLine.split("{cta}");

  return (
    <>
      <section className="border-b border-line">
        <Container className="flex flex-col gap-6 pt-12 pb-14 sm:pt-16 lg:pt-20 lg:pb-20">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-small text-muted">
              <li>
                <Link href="/products" className="rounded-sm hover:text-ink">
                  {copy.breadcrumbLabel}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">
                {product.name}
              </li>
            </ol>
          </nav>
          <p className="flex items-center gap-2.5 text-small font-medium text-muted">
            <ProductMark accent={product.accent} />
            {product.agentType}
          </p>
          <h1 className="font-display text-display">{product.name}</h1>
          <p className="max-w-[30ch] text-h2 font-medium tracking-tight text-balance">{product.promise}</p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <ButtonLink href="#waitlist" size="lg">
              {copy.heroCta}
            </ButtonLink>
            <StatusBadge status={product.status} label={ui.statusLabels[product.status]} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="capabilities" className="border-b border-line py-16 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-5">
              <h2 id="capabilities" className="font-display text-h2">
                {copy.whatItDoesHeading}
              </h2>
              <p className="text-muted">{product.description}</p>
              <ul className="flex flex-col border-t border-line">
                {product.capabilities.map((c) => (
                  <li key={c} className="flex items-start gap-3 border-b border-line py-4">
                    <ProductMark accent={product.accent} size={8} className="mt-2" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 rounded-xl bg-surface p-6">
              <h2 className="text-h3 font-medium">{copy.whoForHeading}</h2>
              <p className="text-muted">{product.audience}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="sr-only">{copy.illustrationHeading}</h2>
            <AgentIllustration
              accent={product.accent}
              illustrations={illustrations}
              caption={ui.illustrative}
              className="min-h-[26rem]"
            />
          </div>
        </Container>
      </section>

      <section id="waitlist" aria-labelledby="waitlist-heading" className="scroll-mt-24 border-b border-line py-16 lg:py-24">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-col gap-4">
            <h2 id="waitlist-heading" className="font-display text-h2 text-balance">
              {format(copy.waitlistHeading, { name: product.name })}
            </h2>
            <p className="text-muted">{format(copy.waitlistBody, { name: product.name })}</p>
          </div>
          <WaitlistForm
            copy={ui.waitlist}
            products={products.map((p) => ({ slug: p.slug, name: p.name }))}
            preselected={[product.slug]}
            privacyHref="/privacy"
            permalink={`/products/${product.slug}`}
          />
        </Container>
      </section>

      <section aria-labelledby="other-products" className="py-16 lg:py-24">
        <Container className="flex flex-col gap-8">
          <h2 id="other-products" className="font-display text-h2">
            {copy.otherProductsHeading}
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {others.map((p) => (
              <li key={p.slug} className="flex">
                <ProductCard
                  product={p}
                  statusLabel={ui.statusLabels[p.status]}
                  linkLabel={format(ui.exploreProduct, { name: p.name })}
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-label={navigation.projectCta.label} className="border-t border-line py-12">
        <Container>
          <p className="text-lead">
            {closingBefore}
            <Link
              href={navigation.projectCta.href}
              className="rounded-sm font-medium text-accent-ink underline underline-offset-4 hover:text-ink"
            >
              {navigation.projectCta.label}
            </Link>
            {closingAfter}
          </p>
        </Container>
      </section>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />}
    </>
  );
}
