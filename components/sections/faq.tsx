import { Container } from "@/components/ui/container";
import { PlusIcon } from "@/components/ui/icons";
import type { Home } from "@/lib/schemas/content";

/** Native <details>/<summary>: keyboard and screen-reader accessible, no JavaScript. */
export function Faq({ copy }: { copy: Home["faq"] }) {
  return (
    <section aria-labelledby="faq-heading" className="py-20 lg:py-28">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <h2 id="faq-heading" className="font-display text-h1">
          {copy.heading}
        </h2>
        <div data-reveal-group className="flex flex-col gap-2">
          {copy.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl bg-surface px-6 transition-shadow duration-200 open:pb-1 open:shadow-sm hover:shadow-sm"
            >
              <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-4 text-[1.0625rem] font-medium">
                {item.question}
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-ink transition-[rotate,background-color,color] duration-200 group-open:rotate-45 group-open:bg-accent group-open:text-on-accent"
                >
                  <PlusIcon size={16} />
                </span>
              </summary>
              <p data-disclosure-body className="max-w-prose pb-5 text-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
