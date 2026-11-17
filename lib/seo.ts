import type { Metadata } from "next";
import { isRegistered } from "@/lib/company";
import type { Company, Site } from "@/lib/schemas/content";

/**
 * Per-page metadata in one place: title, description, canonical URL and the
 * matching Open Graph / Twitter fields. Relative URLs resolve against
 * metadataBase (SITE_URL) set in the root layout. OG images come from each
 * route's opengraph-image file.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  noindex?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", siteName: "Alole", locale: "en" },
    twitter: { card: "summary_large_image", title, description },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(company: Company, site: Site, siteUrl: string): JsonLd {
  const sameAs = company.social.map((s) => s.url).filter((u) => u !== "");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.brandName,
    url: siteUrl,
    logo: `${siteUrl}/press/alole-mark.png`,
    description: site.positioning,
    slogan: site.tagline,
    telephone: company.phone.replace(/\s+/g, ""),
    address: {
      "@type": "PostalAddress",
      addressLocality: company.headquartersCity,
      addressCountry: company.headquartersCountryCode,
    },
    founder: { "@type": "Person", name: company.founder.name, jobTitle: company.founder.title },
    ...(isRegistered(company) ? { legalName: company.legalName } : {}),
    ...(company.email ? { email: company.email } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteJsonLd(company: Company, siteUrl: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.brandName,
    url: siteUrl,
    inLanguage: "en",
  };
}

/** Serialises JSON-LD safely for an inline <script> (no "</script>" breakout). */
export function jsonLdString(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
