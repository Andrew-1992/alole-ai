import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ServiceGlyph } from "@/components/ui/glyphs";
import { ArrowIcon, ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { navigation, solutions, ui } from "@/content";
import { prefetchFor } from "@/lib/prefetch";
import { HeaderBehaviour } from "./header-behaviour";
import { ThemeToggle } from "./theme-toggle";

const navItem =
  "inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[0.9375rem] font-medium text-ink-soft transition-colors hover:bg-ink/[0.05] hover:text-ink";

/**
 * Site header: logo left, navigation centred, actions right (desktop);
 * logo and a full-height menu sheet (mobile). Menus are native <details>, so
 * the header works without JavaScript; HeaderBehaviour adds closing on
 * Escape / outside click and the border once the page scrolls.
 */
export function SiteHeader() {
  return (
    <HeaderBehaviour className="group/header sticky top-0 z-40 border-b border-transparent bg-paper/80 backdrop-blur-lg transition-colors data-[compact]:border-line supports-[not(backdrop-filter:blur(1px))]:bg-paper">
      <Container className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 lg:h-[4.5rem] lg:gap-8">
        <Link href="/" aria-label={ui.homeLinkLabel} className="flex items-center rounded-md text-ink">
          <Logo height={20} className="hidden sm:block" />
          <Logo height={18} className="sm:hidden" />
        </Link>

        {/* Desktop navigation, centred */}
        <nav aria-label={ui.mainNavLabel} className="hidden justify-center lg:flex">
          <ul className="flex items-center gap-0.5">
            <li className="relative">
              <details className="group/solutions">
                <summary aria-label={ui.solutionsMenuToggle} className={`${navItem} cursor-pointer`}>
                  {ui.solutionsMenuLabel}
                  <ChevronDownIcon className="text-muted transition-transform group-open/solutions:rotate-180" />
                </summary>
                <div data-menu-panel className="absolute start-1/2 top-full mt-3 w-[26rem] -translate-x-1/2 rounded-2xl border border-line bg-surface p-3 shadow-lg rtl:translate-x-1/2">
                  <ul className="flex flex-col gap-1">
                    {solutions.services.map((service) => (
                      <li key={service.id}>
                        <Link
                          href={`/solutions#${service.id}`}
                          prefetch={false}
                          className="group flex gap-3.5 rounded-xl p-3 transition-colors hover:bg-surface-sunken"
                        >
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-ink transition-colors group-hover:bg-accent group-hover:text-on-accent">
                            <ServiceGlyph id={service.id} size={20} />
                          </span>
                          <span className="flex flex-col gap-0.5">
                            <span className="font-medium text-ink">{service.name}</span>
                            <span className="text-small leading-snug text-muted">{service.summary}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex items-center justify-between gap-4 rounded-xl bg-surface-sunken px-4 py-3">
                    <Link
                      href="/solutions"
                      prefetch={false}
                      className="nudge flex items-center gap-1.5 text-small font-medium text-ink hover:underline"
                    >
                      {ui.allSolutionsLabel}
                      <ArrowIcon size={14} />
                    </Link>
                    <Link
                      href={navigation.projectCta.href}
                      prefetch={false}
                      className="text-small text-muted hover:text-ink"
                    >
                      {navigation.projectCta.label}
                    </Link>
                  </div>
                </div>
              </details>
            </li>
            {navigation.primary.map((link) => (
              <li key={link.href}>
                <Link href={link.href} prefetch={prefetchFor(link.href)} className={navItem}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-start-3 flex items-center justify-end gap-2">
          <ThemeToggle toDarkLabel={ui.themeToDark} toLightLabel={ui.themeToLight} />
          {/* Wrapped so `hidden` is not overridden by the link's own display. */}
          <div className="hidden lg:block">
            <Link href={navigation.signInCta.href} className={navItem}>
              {navigation.signInCta.label}
            </Link>
          </div>
          <div className="hidden sm:block">
            <ButtonLink href={navigation.projectCta.href} prefetch={prefetchFor(navigation.projectCta.href)}>
              {navigation.projectCta.label}
              <ArrowIcon size={14} />
            </ButtonLink>
          </div>

          {/* Mobile navigation: a native disclosure, so it works without JavaScript. */}
          <details className="group/mobile lg:hidden">
            <summary className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-ink/[0.06] text-ink">
              <span className="sr-only group-open/mobile:hidden">{ui.mobileMenuOpen}</span>
              <span className="sr-only hidden group-open/mobile:inline">{ui.mobileMenuClose}</span>
              <MenuIcon className="group-open/mobile:hidden" />
              <CloseIcon className="hidden group-open/mobile:block" />
            </summary>
            <div data-menu-panel className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-paper">
              <nav aria-label={ui.mainNavLabel}>
                <Container className="flex min-h-full flex-col gap-8 py-6">
                  <div className="flex flex-col gap-3">
                    <Link href="/solutions" prefetch={false} className="eyebrow w-fit hover:text-ink">
                      {ui.solutionsMenuLabel}
                    </Link>
                    <ul className="grid gap-2">
                      {solutions.services.map((service) => (
                        <li key={service.id}>
                          <Link
                            href={`/solutions#${service.id}`}
                            prefetch={false}
                            className="flex items-center gap-3 rounded-xl bg-surface p-3"
                          >
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent-ink">
                              <ServiceGlyph id={service.id} size={20} />
                            </span>
                            <span className="flex flex-col">
                              <span className="font-medium text-ink">{service.name}</span>
                              <span className="text-small text-muted">{service.summary}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ul className="flex flex-col">
                    {navigation.primary.map((link) => (
                      <li key={link.href} className="border-b border-line">
                        <Link
                          href={link.href}
                          prefetch={prefetchFor(link.href)}
                          className="flex items-center justify-between py-4 text-h3 font-medium text-ink"
                        >
                          {link.label}
                          <ArrowIcon size={18} className="text-muted" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-col gap-2 pb-4">
                    <ButtonLink
                      href={navigation.projectCta.href}
                      prefetch={prefetchFor(navigation.projectCta.href)}
                      size="lg"
                      className="w-full"
                    >
                      {navigation.projectCta.label}
                    </ButtonLink>
                    <ButtonLink href={navigation.signInCta.href} size="lg" variant="secondary" className="w-full">
                      {navigation.signInCta.label}
                    </ButtonLink>
                  </div>
                </Container>
              </nav>
            </div>
          </details>
        </div>
      </Container>
      {/* Reading progress along the header's bottom edge. Decorative. */}
      <div aria-hidden="true" className="scroll-progress pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
    </HeaderBehaviour>
  );
}
