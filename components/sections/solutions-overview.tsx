import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { prefetchFor } from "@/lib/prefetch";
import type { NavLink, Solutions } from "@/lib/schemas/content";
import { SectionHeader } from "./section-header";

interface SolutionsOverviewProps {
  heading: string;
  intro: string;
  cta: NavLink;
  services: Solutions["services"];
  exampleLabel: string;
}

/** Home-page summary of the Solutions business line: one card per service. */
export function SolutionsOverview({ heading, intro, cta, services, exampleLabel }: SolutionsOverviewProps) {
  return (
    <section aria-labelledby="solutions-heading" className="py-20 lg:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeader
          id="solutions-heading"
          heading={heading}
          intro={intro}
          action={
            <ButtonLink href={cta.href} prefetch={prefetchFor(cta.href)}>
              {cta.label}
              <ArrowIcon size={16} />
            </ButtonLink>
          }
        />
        <ul data-reveal-group className="grid gap-4 md:grid-cols-3">
          {services.map((service, i) => (
            <li key={service.id} className="flex">
              <Link
                href={`/solutions#${service.id}`}
                prefetch={prefetchFor("/solutions")}
                className="lift group flex w-full flex-col gap-10 rounded-xl bg-surface p-7 lg:p-8"
              >
                <span className="flex items-center justify-between">
                  <span aria-hidden="true" className="tabular-nums text-small text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex size-9 items-center justify-center rounded-full bg-ink/[0.06] text-ink transition-colors group-hover:bg-ink group-hover:text-on-ink"
                  >
                    <ArrowIcon size={16} />
                  </span>
                </span>
                <span className="mt-auto flex flex-col gap-2">
                  <span className="text-h3 font-medium">{service.name}</span>
                  <span className="text-muted">{service.summary}</span>
                  <span className="mt-2 border-t border-line pt-3 text-small text-muted">
                    <span className="font-medium text-ink-soft">{exampleLabel}:</span> {service.example}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
