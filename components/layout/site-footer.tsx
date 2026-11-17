import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { Logo, NAME_PATH, NAME_VIEW_BOX } from "@/components/ui/logo";
import { company, navigation, site, solutions, ui } from "@/content";
import { BUILD_YEAR } from "@/lib/build-info";
import { companyLocationLine, telHref, whatsappHref } from "@/lib/company";
import { prefetchFor } from "@/lib/prefetch";
import { CopyrightYear } from "./copyright-year";

const link = "rounded-sm text-footer-muted transition-colors hover:text-footer-ink";

function FooterColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-small font-medium text-footer-ink">{heading}</h2>
      <ul className="flex flex-col gap-2.5 text-small">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} prefetch={prefetchFor(item.href)} className={link}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Site footer: dark in both themes, with the name set large as a closing signature. */
export function SiteFooter() {
  const social = company.social.filter((s) => s.url !== "");
  const whatsapp = whatsappHref(company.whatsapp);
  const [before, after] = ui.footer.copyright.split("{year}");

  return (
    <footer className="relative mt-auto overflow-hidden bg-footer text-footer-ink">
      <Container className="relative flex flex-col gap-14 pt-16 pb-8 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <Link href="/" aria-label={ui.homeLinkLabel} className="w-fit rounded-md">
              <Logo height={42} />
            </Link>
            <p className="font-display max-w-sm text-h3 text-footer-ink">{site.tagline}</p>
            <p className="max-w-sm text-small text-footer-muted">{site.description}</p>
            <ButtonLink
              href={navigation.projectCta.href}
              prefetch={prefetchFor(navigation.projectCta.href)}
              variant="footer"
              className="w-fit"
            >
              {navigation.projectCta.label}
              <ArrowIcon size={14} />
            </ButtonLink>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            <FooterColumn
              heading={ui.footer.solutionsHeading}
              links={solutions.services.map((s) => ({ label: s.name, href: `/solutions#${s.id}` }))}
            />
            <FooterColumn heading={ui.footer.companyHeading} links={navigation.footer.company} />
            <div className="flex flex-col gap-4">
              <h2 className="text-small font-medium text-footer-ink">{ui.footer.contactHeading}</h2>
              <ul className="flex flex-col gap-2.5 text-small">
                <li>
                  <a href={telHref(company.phone)} className={link}>
                    {company.phone}
                  </a>
                </li>
                {whatsapp && (
                  <li>
                    <a href={whatsapp} rel="noopener noreferrer" className={link}>
                      {ui.footer.whatsappLabel}
                    </a>
                  </li>
                )}
                {company.email && (
                  <li>
                    <a href={`mailto:${company.email}`} className={link}>
                      {company.email}
                    </a>
                  </li>
                )}
                <li className="text-footer-muted">{companyLocationLine(company)}</li>
              </ul>
              {social.length > 0 && (
                <ul aria-label={ui.footer.socialHeading} className="flex flex-wrap gap-x-4 gap-y-2 text-small">
                  {social.map((s) => (
                    <li key={s.platform}>
                      <a href={s.url} rel="noopener noreferrer" className={link}>
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-footer-line pt-6 text-small text-footer-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            {before}
            <CopyrightYear buildYear={BUILD_YEAR} />
            {after}
          </p>
          <ul aria-label={ui.footer.legalHeading} className="flex flex-wrap gap-x-6 gap-y-2">
            {navigation.footer.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* The name, set large as a closing signature. Decorative. */}
      <Container className="pointer-events-none select-none" aria-hidden="true">
        {/* Shows the top 55% of the letters; the rest runs off the bottom edge. */}
        <div className="aspect-[2110/440] overflow-hidden">
          <svg viewBox={NAME_VIEW_BOX} className="block h-auto w-full text-footer-line" aria-hidden="true" focusable="false">
            <path fill="currentColor" d={NAME_PATH} />
          </svg>
        </div>
      </Container>
    </footer>
  );
}
