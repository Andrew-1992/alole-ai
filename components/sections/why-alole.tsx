import { Container } from "@/components/ui/container";
import type { Home } from "@/lib/schemas/content";
import { SectionHeader } from "./section-header";

export function WhyAlole({ copy }: { copy: Home["why"] }) {
  return (
    <section aria-labelledby="why-heading" className="py-20 lg:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeader id="why-heading" heading={copy.heading} />
        <ol data-reveal-group className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {copy.items.map((item, i) => (
            <li key={item.title} className="flex flex-col gap-3 border-t border-ink pt-5 transition-colors duration-300 hover:border-accent">
              <span aria-hidden="true" className="tabular-nums text-small text-accent-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[1.1875rem] leading-snug font-medium">{item.title}</h3>
              <p className="text-small text-muted">{item.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
