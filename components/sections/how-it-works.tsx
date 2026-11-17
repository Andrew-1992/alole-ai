import { SolutionsDiagram } from "@/components/illustrations/solutions-diagram";
import { Container } from "@/components/ui/container";
import type { Home, Solutions } from "@/lib/schemas/content";

interface HowItWorksProps {
  copy: Home["howItWorks"];
  diagram: Solutions["diagram"];
  caption: string;
}

/** Heading on the left, the systems → AI layer → work done diagram on the right. */
export function HowItWorks({ copy, diagram, caption }: HowItWorksProps) {
  return (
    <section aria-labelledby="how-it-works-heading" className="bg-surface py-20 lg:py-28">
      <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex max-w-xl flex-col gap-4">
          <h2 id="how-it-works-heading" className="font-display text-h1 text-balance">
            {copy.heading}
          </h2>
          <p className="text-lead text-pretty text-muted">{copy.intro}</p>
        </div>
        <SolutionsDiagram copy={diagram} caption={caption} tone="paper" />
      </Container>
    </section>
  );
}
