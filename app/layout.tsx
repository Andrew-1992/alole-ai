import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { company, site, ui } from "@/content";
import { env } from "@/lib/env";
import { jsonLdString, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

/** Every route must be fully prerendered; the build fails if one is not. */
export const ensureStatic = "navigation";

const instrumentSans = localFont({
  src: "./fonts/InstrumentSans-Variable-latin.woff2",
  variable: "--font-instrument",
  display: "swap",
  weight: "400 700",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: {
    default: `${company.brandName}: ${site.tagline.replace(/\.$/, "")}`,
    template: `%s | ${company.brandName}`,
  },
  description: site.description,
  applicationName: company.brandName,
  openGraph: { siteName: company.brandName, type: "website", locale: "en" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f0ee" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The theme script sets `class` and `data-theme` on <html> before hydration.
    <html lang="en" data-scroll-behavior="smooth" dir="ltr" className={instrumentSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-paper text-ink">
        <div id="top-sentinel" aria-hidden="true" className="pointer-events-none absolute top-0 h-2 w-px" />
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-ink px-4 py-3 text-on-ink focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          {ui.skipLink}
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex flex-1 flex-col focus:outline-none">
          {children}
        </main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(organizationJsonLd(company, site, env.SITE_URL)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(websiteJsonLd(company, env.SITE_URL)) }}
        />
        {/* Vercel Web Analytics: cookieless, same-origin, off by default (content/site.ts).
            Only works on Vercel with Web Analytics enabled for the project. */}
        {site.features.cookielessAnalytics && <script defer src="/_vercel/insights/script.js" />}
      </body>
    </html>
  );
}
