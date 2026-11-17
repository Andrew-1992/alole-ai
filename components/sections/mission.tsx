import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import type { Home, Person } from "@/lib/schemas/content";

export function Mission({ copy, founder }: { copy: Home["mission"]; founder: Person }) {
  return (
    <section aria-labelledby="mission-label" className="py-24 lg:py-36">
      <Container className="flex flex-col items-center gap-8 text-center">
        <h2 id="mission-label" className="eyebrow flex items-center gap-2.5">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
          {copy.label}
        </h2>
        <p data-reveal className="font-display max-w-[24ch] text-h1 text-balance lg:text-[3.75rem] lg:leading-[1.08]">
          {copy.statement}
        </p>
        <div className="flex flex-col items-center gap-3 pt-2">
          <p className="text-muted">
            {copy.founderLabel} <span className="font-medium text-ink">{founder.name}</span>, {founder.title}
          </p>
          <Link
            href={copy.storyCta.href}
            className="group flex items-center gap-1.5 rounded-full text-small font-medium text-ink underline-offset-4 hover:underline"
          >
            {copy.storyCta.label}
            <ArrowIcon size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
