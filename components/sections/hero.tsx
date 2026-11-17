import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CapabilityGlyph } from "@/components/ui/glyphs";
import { ArrowIcon } from "@/components/ui/icons";
import { prefetchFor } from "@/lib/prefetch";
import type { Home } from "@/lib/schemas/content";

/**
 * Home hero: what Alole is in one line, what it builds in one sentence, two
 * actions, then the three things it builds as cards (agents, automation,
 * integration). No JavaScript: the entrance and hover motion are CSS only.
 */
export function Hero({ copy }: { copy: Home["hero"] }) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Faint dot grid that fades out towards the edges. Decorative. */}
      <div
        aria-hidden="true"
        data-drift
        className="absolute inset-0 -z-10 bg-[radial-gradient(var(--line-strong)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)] opacity-70"
      />

      <Container className="flex flex-col items-center gap-7 pt-20 pb-14 text-center sm:pt-28 lg:pt-32 lg:pb-16">
        <h1 id="hero-title" className="font-display max-w-[15ch] text-display text-balance">
          {copy.title}
        </h1>
        <p data-rise className="max-w-[40rem] text-lead text-pretty text-muted [--rise-step:1]">
          {copy.subtitle}
        </p>
        <div data-rise className="[--rise-step:2] flex w-full flex-col items-center justify-center gap-3 pt-1 sm:w-auto sm:flex-row">
          <ButtonLink
            href={copy.primaryCta.href}
            size="lg"
            prefetch={prefetchFor(copy.primaryCta.href)}
            className="w-full sm:w-auto"
          >
            {copy.primaryCta.label}
            <ArrowIcon size={16} />
          </ButtonLink>
          <ButtonLink
            href={copy.secondaryCta.href}
            size="lg"
            variant="secondary"
            prefetch={prefetchFor(copy.secondaryCta.href)}
            className="w-full sm:w-auto"
          >
            {copy.secondaryCta.label}
          </ButtonLink>
        </div>
      </Container>

      <Container data-rise className="pb-20 [--rise-step:3] lg:pb-28">
        <ul
          aria-label={copy.capabilitiesLabel}
          className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-sm md:grid-cols-3"
        >
          {copy.capabilities.map((item) => (
            <li key={item.kind} className="bg-surface">
              <Link
                href={item.href}
                prefetch={prefetchFor(item.href)}
                className="group relative flex h-full items-start gap-4 p-5 text-start transition-colors hover:bg-surface-sunken/60 md:flex-col md:gap-5 md:p-6 lg:p-7"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent-ink transition-[background-color,color,scale] duration-200 group-hover:scale-105 group-hover:bg-accent group-hover:text-on-accent">
                  <CapabilityGlyph kind={item.kind} size={22} />
                </span>
                <ArrowIcon
                  size={16}
                  className="absolute top-7 right-6 hidden text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100 md:block lg:top-8 lg:right-7 rtl:right-auto rtl:left-6"
                />
                <span className="flex flex-col gap-1 md:gap-1.5">
                  <span className="text-[1.0625rem] font-medium text-ink">{item.title}</span>
                  <span className="text-small text-muted">{item.body}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
