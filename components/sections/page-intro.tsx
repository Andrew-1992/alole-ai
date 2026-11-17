import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

interface PageIntroProps {
  heading: string;
  intro?: string;
  /** Small line above the heading (breadcrumb, label or status). */
  eyebrow?: ReactNode;
  children?: ReactNode;
}

/** Standard top-of-page block: one h1 per page, optional intro and extras. */
export function PageIntro({ heading, intro, eyebrow, children }: PageIntroProps) {
  return (
    <section className="border-b border-line">
      <Container className="flex flex-col gap-6 pt-14 pb-14 sm:pt-20 lg:pt-24 lg:pb-20">
        {eyebrow}
        <h1 className="font-display max-w-[18ch] text-h1 text-balance lg:text-[4rem] lg:leading-[1.02]">{heading}</h1>
        {intro && (
          <p data-rise className="max-w-[40rem] text-lead text-muted [--rise-step:1]">
            {intro}
          </p>
        )}
        {children && (
          <div data-rise className="[--rise-step:2]">
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}

/** A labelled content block with the heading in a side column on wide screens. */
export function SplitSection({
  id,
  heading,
  children,
  className = "",
}: {
  id: string;
  heading: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={`border-b border-line py-16 lg:py-24 ${className}`}>
      <Container className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
        <h2 id={id} className="font-display text-h2">
          {heading}
        </h2>
        <div>{children}</div>
      </Container>
    </section>
  );
}
