import type { Metadata } from "next";
import { SolutionsDiagram } from "@/components/illustrations/solutions-diagram";
import { SharedEnquiryForm } from "@/components/sections/contact-page";
import { SplitSection } from "@/components/sections/page-intro";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { site, solutions, ui } from "@/content";
import { pageMetadata } from "@/lib/seo";
import { AudienceList, ProcessSteps } from "@/components/sections/solutions-blocks";

const copy = solutions;

export const metadata: Metadata = pageMetadata({
  title: copy.meta.title,
  description: copy.meta.description,
  path: "/solutions",
});

export default function SolutionsPage() {
  const showCaseStudies = site.features.showCaseStudies && copy.caseStudies.items.length > 0;

  return (
    <>
      <section className="border-b border-line">
        <Container className="grid gap-12 pt-14 pb-14 sm:pt-20 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16 lg:pt-24 lg:pb-20">
          <div className="flex flex-col gap-6">
            <h1 className="font-display text-h1 text-balance lg:text-[4rem] lg:leading-[1.02]">{copy.hero.title}</h1>
            <p className="max-w-[36rem] text-lead text-muted">{copy.hero.subtitle}</p>
            <ButtonLink href={copy.hero.cta.href} size="lg" className="mt-2 w-fit">
              {copy.hero.cta.label}
            </ButtonLink>
          </div>
          <div className="flex items-center">
            <SolutionsDiagram copy={copy.diagram} caption={ui.illustrative} />
          </div>
        </Container>
      </section>

      <SplitSection id="services" heading={copy.servicesHeading}>
        <ul data-reveal-group className="flex flex-col border-t border-line">
          {copy.services.map((service) => (
            <li key={service.id} id={service.id} className="flex scroll-mt-24 gap-4 border-b border-line py-7">
              <span aria-hidden="true" className="mt-2.5 size-2.5 shrink-0 rounded-full bg-accent" />
              <div className="flex flex-col gap-2">
                <h3 className="text-h3 font-medium">{service.name}</h3>
                <p>{service.summary}</p>
                <p className="text-small text-muted">
                  <span className="font-medium text-ink-soft">{copy.exampleLabel}:</span> {service.example}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </SplitSection>

      <ProcessSteps id="process" copy={copy.process} className="border-b border-line" headingClassName="text-h2" />

      <AudienceList
        id="who-we-work-with"
        copy={copy.audience}
        className="border-b border-line"
        headingClassName="text-h2"
      />

      {showCaseStudies && (
        <SplitSection id="case-studies" heading={copy.caseStudies.heading}>
          <ul className="grid gap-4 sm:grid-cols-2">
            {copy.caseStudies.items.map((study) => (
              <li key={study.title} className="lift flex flex-col gap-2 rounded-xl bg-surface p-6">
                <p className="text-small text-muted">{study.organisation}</p>
                <h3 className="text-h3 font-medium">{study.title}</h3>
                <p className="text-muted">{study.summary}</p>
              </li>
            ))}
          </ul>
        </SplitSection>
      )}

      <section
        id="start-a-project"
        aria-labelledby="enquiry-heading"
        className="scroll-mt-24 py-16 lg:py-24"
      >
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-col gap-4">
            <h2 id="enquiry-heading" className="font-display text-h2">
              {copy.enquiry.heading}
            </h2>
            <p className="text-muted">{copy.enquiry.body}</p>
          </div>
          <SharedEnquiryForm topic="client-project" permalink="/solutions" />
        </Container>
      </section>
    </>
  );
}
