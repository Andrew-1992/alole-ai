import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { pages } from "@/content";
import { prefetchFor } from "@/lib/prefetch";
import { pageMetadata } from "@/lib/seo";

const copy = pages.signIn;

export const metadata: Metadata = pageMetadata({
  title: copy.meta.title,
  description: copy.meta.description,
  path: "/sign-in",
  noindex: true,
});

/**
 * Placeholder for client sign-in. There are no accounts yet, so there is
 * deliberately no form: nothing that looks like it accepts a password.
 */
export default function SignInPage() {
  return (
    <Container className="flex flex-1 items-center justify-center py-20 lg:py-28">
      <section
        data-reveal
        className="flex w-full max-w-lg flex-col items-center gap-6 rounded-3xl border border-line bg-surface p-8 text-center shadow-sm sm:p-12"
      >
        <Logo height={36} className="text-ink" />
        <p className="flex items-center gap-2 text-small text-muted">
          <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-accent motion-reduce:animate-none" />
          {copy.eyebrow}
        </p>
        <h1 className="font-display text-h1 text-balance">{copy.heading}</h1>
        <p className="text-muted">{copy.body}</p>
        <div className="flex w-full flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
          <ButtonLink href={copy.primaryCta.href} prefetch={prefetchFor(copy.primaryCta.href)} size="lg">
            {copy.primaryCta.label}
            <ArrowIcon size={16} />
          </ButtonLink>
          <ButtonLink
            href={copy.secondaryCta.href}
            prefetch={prefetchFor(copy.secondaryCta.href)}
            size="lg"
            variant="secondary"
          >
            {copy.secondaryCta.label}
          </ButtonLink>
        </div>
      </section>
    </Container>
  );
}
