import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageIntro, SplitSection } from "@/components/sections/page-intro";
import { ButtonLink } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";
import { pages, site } from "@/content";

const copy = pages.careers;

export const metadata: Metadata = pageMetadata({
  title: copy.meta.title,
  description: copy.meta.description,
  path: "/careers",
});

export default function CareersPage() {
  const showJobs = site.features.showJobListings && copy.jobs.length > 0;

  return (
    <>
      <PageIntro heading={copy.heading} intro={copy.intro}>
        <div className="pt-2">
          <ButtonLink href="/contact/careers" size="lg">
            {copy.cta}
            <ArrowIcon />
          </ButtonLink>
        </div>
      </PageIntro>

      <SplitSection id="values" heading={copy.valuesHeading}>
        <ul data-reveal-group className="grid gap-3 sm:grid-cols-2">
          {copy.values.map((v) => (
            <li key={v.title} className="lift flex flex-col gap-2 rounded-xl bg-surface p-6 lg:p-8">
              <h3 className="text-h3 font-medium">{v.title}</h3>
              <p className="text-muted">{v.body}</p>
            </li>
          ))}
        </ul>
      </SplitSection>

      <SplitSection id="openings" heading={copy.openingsHeading} className="border-b-0">
        {showJobs ? (
          <ul className="flex flex-col border-t border-line">
            {copy.jobs.map((job) => (
              <li key={job.title} className="flex flex-col gap-1 border-b border-line py-5">
                <h3 className="text-h3 font-medium">{job.title}</h3>
                <p className="text-small text-muted">
                  {job.location} · {job.type}
                </p>
                <p className="pt-2">{job.summary}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lead text-muted">{copy.noOpenings}</p>
        )}
      </SplitSection>
    </>
  );
}
