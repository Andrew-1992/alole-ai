import type { Metadata } from "next";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Mission } from "@/components/sections/mission";
import { ServicePickerSection } from "@/components/sections/service-picker-section";
import { SolutionsOverview } from "@/components/sections/solutions-overview";
import { AudienceList, ProcessSteps } from "@/components/sections/solutions-blocks";
import { WhyAlole } from "@/components/sections/why-alole";
import { company, home, navigation, solutions, ui } from "@/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: home.meta.title,
  description: home.meta.description,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <Hero copy={home.hero} />
      <HowItWorks copy={home.howItWorks} diagram={solutions.diagram} caption={ui.illustrative} />
      <SolutionsOverview
        heading={home.solutions.heading}
        intro={home.solutions.intro}
        cta={home.solutions.cta}
        services={solutions.services}
        exampleLabel={solutions.exampleLabel}
      />
      <ServicePickerSection copy={home.picker} services={solutions.services} projectHref={navigation.projectCta.href} />
      {/* How we work and who we work with share one white band. */}
      <div className="bg-surface">
        <ProcessSteps id="home-process-heading" copy={solutions.process} className="pt-20 lg:pt-28" />
        <AudienceList
          id="home-audience-heading"
          copy={solutions.audience}
          className="pb-20 lg:pb-28"
          tileClassName="bg-paper"
        />
      </div>
      <WhyAlole copy={home.why} />
      <Mission copy={home.mission} founder={company.founder} />
      <Faq copy={home.faq} />
      <FinalCta copy={home.finalCta} />
    </>
  );
}
