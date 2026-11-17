import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { prefetchFor } from "@/lib/prefetch";
import type { Home, Solutions } from "@/lib/schemas/content";
import { ServicePicker } from "./service-picker";

interface ServicePickerSectionProps {
  copy: Home["picker"];
  services: Solutions["services"];
  projectHref: string;
}

/** "Not sure where to start?": the quiz with JavaScript, a link to compare services without it. */
export function ServicePickerSection({ copy, services, projectHref }: ServicePickerSectionProps) {
  return (
    <section aria-labelledby="picker-heading" className="pb-20 lg:pb-28">
      <Container className="grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div data-reveal className="flex max-w-xl flex-col gap-4 lg:sticky lg:top-28">
          <h2 id="picker-heading" className="font-display text-h1 text-balance">
            {copy.heading}
          </h2>
          <p className="text-lead text-pretty text-muted">{copy.intro}</p>
        </div>
        <div data-reveal>
          <div className="js-only">
            <ServicePicker copy={copy} services={services} projectHref={projectHref} />
          </div>
          <div className="no-js-only flex flex-col items-start gap-5 rounded-2xl bg-surface p-6 sm:p-8">
            <p className="text-muted">{copy.noScript}</p>
            <ButtonLink href={copy.noScriptCta.href} prefetch={prefetchFor(copy.noScriptCta.href)} variant="secondary">
              {copy.noScriptCta.label}
              <ArrowIcon size={16} />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
