import type { Metadata } from "next";
import { PageIntro, SplitSection } from "@/components/sections/page-intro";
import { PersonCard } from "@/components/sections/person-card";
import { company, pages, site } from "@/content";
import { pageMetadata } from "@/lib/seo";

const copy = pages.about;

export const metadata: Metadata = pageMetadata({
  title: copy.meta.title,
  description: copy.meta.description,
  path: "/about",
});

export default function AboutPage() {
  const showTeam = site.features.showTeam && company.team.length > 0;

  return (
    <>
      <PageIntro heading={copy.heading}>
        <div className="flex max-w-[42rem] flex-col gap-5 pt-2 text-lead text-muted">
          {copy.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </PageIntro>

      <SplitSection id="what-we-are" heading={copy.whatWeAreHeading}>
        <div className="flex flex-col gap-6">
          <p className="text-lead">{copy.whatWeAre}</p>
          <ul data-reveal-group className="grid gap-3 md:grid-cols-3">
            {copy.businessLines.map((line) => (
              <li key={line.title} className="lift flex flex-col gap-2 rounded-xl bg-surface p-6 lg:p-8">
                <h3 className="text-h3 font-medium">{line.title}</h3>
                <p className="text-muted">{line.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </SplitSection>

      <SplitSection id="mission" heading={copy.missionHeading}>
        <p className="font-display max-w-[26ch] text-h2 text-balance">{copy.mission}</p>
      </SplitSection>

      <SplitSection id="vision" heading={copy.visionHeading}>
        <p className="font-display max-w-[26ch] text-h2 text-balance">{copy.vision}</p>
      </SplitSection>

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

      <SplitSection id="leadership" heading={copy.leadershipHeading}>
        <PersonCard person={company.founder} />
      </SplitSection>

      {showTeam && (
        <SplitSection id="team" heading={copy.teamHeading}>
          <ul className="grid gap-8 sm:grid-cols-2">
            {company.team.map((member) => (
              <li key={member.name}>
                <PersonCard person={member} />
              </li>
            ))}
          </ul>
        </SplitSection>
      )}

      <SplitSection id="headquarters" heading={copy.headquartersHeading} className="border-b-0">
        <p className="flex items-center gap-2.5 text-h3 font-medium">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-accent" />
          {company.headquarters}
        </p>
      </SplitSection>
    </>
  );
}
