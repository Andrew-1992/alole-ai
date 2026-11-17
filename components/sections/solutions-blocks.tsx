import { Container } from "@/components/ui/container";
import { AudienceGlyph } from "@/components/ui/glyphs";
import type { Solutions } from "@/lib/schemas/content";

/**
 * Blocks shared by the home page and /solutions, so the copy lives once in
 * content/solutions.ts. `id` keeps heading ids unique per page.
 */

export function ProcessSteps({
  id,
  copy,
  className = "",
  headingClassName = "text-h1",
}: {
  id: string;
  copy: Solutions["process"];
  className?: string;
  headingClassName?: string;
}) {
  return (
    <section aria-labelledby={id} className={`py-16 lg:py-24 ${className}`}>
      <Container className="flex flex-col gap-10">
        <h2 id={id} className={`font-display ${headingClassName}`}>
          {copy.heading}
        </h2>
        <ol data-reveal-group className="grid gap-0 lg:grid-cols-4 lg:gap-6">
          {copy.steps.map((step, i) => (
            <li
              key={step.title}
              className="group relative flex flex-col gap-2 border-s border-line ps-6 pb-8 last:pb-0 lg:border-s-0 lg:border-t lg:ps-0 lg:pt-6 lg:pb-0"
            >
              <span
                aria-hidden="true"
                className="absolute -start-[5px] top-1.5 size-2.5 rounded-full bg-accent transition-[scale] duration-200 group-hover:scale-150 lg:start-0 lg:-top-[5px]"
              />
              <span className="tabular-nums text-small text-muted">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-h3 font-medium">{step.title}</h3>
              <p className="text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export function AudienceList({
  id,
  copy,
  className = "",
  headingClassName = "text-h1",
  tileClassName = "bg-surface",
}: {
  id: string;
  copy: Solutions["audience"];
  className?: string;
  headingClassName?: string;
  /** Tile background: white on the page, paper inside a white band. */
  tileClassName?: string;
}) {
  return (
    <section aria-labelledby={id} className={`py-16 lg:py-24 ${className}`}>
      <Container className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <h2 id={id} className={`font-display ${headingClassName}`}>
          {copy.heading}
        </h2>
        <ul data-reveal-group className="grid gap-3 sm:grid-cols-3">
          {copy.items.map((item, i) => (
            <li
              key={item}
              className={`lift group flex min-h-40 flex-col justify-between gap-6 rounded-xl p-6 ${tileClassName}`}
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-ink/[0.06] text-ink transition-colors duration-200 group-hover:bg-accent group-hover:text-on-accent">
                <AudienceGlyph index={i} size={22} />
              </span>
              <span className="text-lead font-medium">{item}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
