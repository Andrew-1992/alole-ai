import {
  BluckFliesIllustration,
  KodipIllustration,
  ManasIllustration,
  YaudeIllustration,
} from "@/components/illustrations/agent-illustrations";
import { Container } from "@/components/ui/container";
import type { Home, Illustrations, Product, ProductAccent } from "@/lib/schemas/content";
import { AgentShowcase, type AgentShowcaseItem } from "./agent-showcase";
import { SectionHeader } from "./section-header";

interface AgentsAtWorkProps {
  copy: Home["agentInAction"];
  products: Product[];
  illustrations: Illustrations;
}

/** Renders the illustration for a product, by its accent key. */
export function AgentIllustration({
  accent,
  illustrations,
  caption,
  className,
}: {
  accent: ProductAccent;
  illustrations: Illustrations;
  caption: string;
  className?: string;
}) {
  switch (accent) {
    case "yaude":
      return <YaudeIllustration copy={illustrations.yaude} caption={caption} className={className} />;
    case "bluckflies":
      return <BluckFliesIllustration copy={illustrations.bluckflies} caption={caption} className={className} />;
    case "kodip":
      return <KodipIllustration copy={illustrations.kodip} caption={caption} className={className} />;
    case "manas":
      return <ManasIllustration copy={illustrations.manas} caption={caption} className={className} />;
  }
}

export function AgentsAtWork({ copy, products, illustrations }: AgentsAtWorkProps) {
  const items: AgentShowcaseItem[] = products.map((product) => ({
    key: product.slug,
    name: product.name,
    task: illustrations[product.accent].task,
    panel: (
      <AgentIllustration
        accent={product.accent}
        illustrations={illustrations}
        caption={copy.illustrativeLabel}
        className="h-full min-h-[25rem]"
      />
    ),
  }));

  return (
    <section aria-labelledby="agents-heading" className="py-20 lg:py-28">
      <Container className="flex flex-col gap-10">
        <SectionHeader id="agents-heading" heading={copy.heading} intro={copy.intro} />
        <AgentShowcase items={items} pauseLabel={copy.pauseLabel} playLabel={copy.playLabel} />
      </Container>
    </section>
  );
}
