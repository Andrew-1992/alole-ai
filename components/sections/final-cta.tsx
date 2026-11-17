import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { prefetchFor } from "@/lib/prefetch";
import type { Home } from "@/lib/schemas/content";

/** Closing call to action: one dark panel, start a project or get in touch. */
export function FinalCta({ copy }: { copy: Home["finalCta"] }) {
  return (
    <div className="py-20 lg:py-28">
      <Container>
        <section
          data-reveal
          aria-labelledby="final-cta-heading"
          className="flex flex-col items-start gap-6 rounded-2xl bg-ink p-8 text-on-ink sm:p-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:p-16"
        >
          <div className="flex max-w-2xl flex-col gap-5">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-accent" />
            <h2 id="final-cta-heading" className="font-display text-h1 text-balance">
              {copy.heading}
            </h2>
            <p className="max-w-md text-lead text-on-ink/75">{copy.body}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">
            <ButtonLink
              href={copy.cta.href}
              prefetch={prefetchFor(copy.cta.href)}
              variant="inverse"
              size="lg"
              className="w-full sm:w-auto"
            >
              {copy.cta.label}
              <ArrowIcon />
            </ButtonLink>
            <ButtonLink
              href={copy.secondaryCta.href}
              prefetch={prefetchFor(copy.secondaryCta.href)}
              variant="inverse-ghost"
              size="lg"
              className="w-full sm:w-auto"
            >
              {copy.secondaryCta.label}
            </ButtonLink>
          </div>
        </section>
      </Container>
    </div>
  );
}
