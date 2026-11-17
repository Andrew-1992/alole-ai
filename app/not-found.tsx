import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { pages } from "@/content";

const copy = pages.notFound;

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col justify-center gap-6 py-24 lg:py-32">
      <p className="flex items-center gap-2.5 tabular-nums text-small text-muted">
        <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
        {copy.code}
      </p>
      <h1 className="font-display max-w-[16ch] text-h1 lg:text-[4rem] lg:leading-[1.02]">{copy.heading}</h1>
      <p className="max-w-[36rem] text-lead text-muted">{copy.body}</p>
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <ButtonLink href="/" size="lg">
          {copy.homeCta}
        </ButtonLink>
        <ButtonLink href="/solutions" size="lg" variant="secondary">
          {copy.solutionsCta}
          <ArrowIcon />
        </ButtonLink>
      </div>
    </Container>
  );
}
