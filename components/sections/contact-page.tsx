import { EnquiryForm } from "@/components/forms/enquiry-form";
import { Container } from "@/components/ui/container";
import { company, pages } from "@/content";
import { telHref, whatsappHref } from "@/lib/company";
import { CONTACT_TOPICS } from "@/lib/forms/contact";
import type { ContactTopic } from "@/lib/schemas/pages";

const detailLink = "rounded-sm text-ink underline-offset-2 hover:text-accent-ink hover:underline";

/** The shared enquiry form with the topic list from content. */
export function SharedEnquiryForm({ topic, permalink }: { topic: ContactTopic; permalink: string }) {
  const copy = pages.contact;
  return (
    <EnquiryForm
      copy={copy.form}
      topics={CONTACT_TOPICS.map((value) => ({ value, label: copy.topics[value].label }))}
      defaultTopic={topic}
      privacyHref="/privacy"
      permalink={permalink}
    />
  );
}

/** Shared body of /contact and /contact/[topic]. */
export function ContactPage({ topic, permalink }: { topic: ContactTopic; permalink: string }) {
  const copy = pages.contact;
  const whatsapp = whatsappHref(company.whatsapp);
  return (
    <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          <h1 className="font-display text-h1">{copy.heading}</h1>
          <p className="text-lead text-muted">{copy.topics[topic].intro}</p>
        </div>
        <dl className="flex flex-col gap-5 border-t border-line pt-6">
          <div className="flex flex-col gap-1">
            <dt className="text-small font-medium">{copy.locationHeading}</dt>
            <dd className="text-muted">{company.headquarters}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-small font-medium">{copy.phoneHeading}</dt>
            <dd>
              <a href={telHref(company.phone)} className={detailLink}>
                {company.phone}
              </a>
            </dd>
          </div>
          {whatsapp && (
            <div className="flex flex-col gap-1">
              <dt className="text-small font-medium">{copy.whatsappHeading}</dt>
              <dd>
                <a href={whatsapp} rel="noopener noreferrer" className={detailLink}>
                  {copy.whatsappLabel}
                </a>
              </dd>
            </div>
          )}
          {company.email && (
            <div className="flex flex-col gap-1">
              <dt className="text-small font-medium">{copy.emailHeading}</dt>
              <dd>
                <a href={`mailto:${company.email}`} className={detailLink}>
                  {company.email}
                </a>
              </dd>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <dt className="text-small font-medium">{copy.responseHeading}</dt>
            <dd className="text-muted">{company.responseTime}</dd>
          </div>
        </dl>
      </div>
      <SharedEnquiryForm topic={topic} permalink={permalink} />
    </Container>
  );
}
