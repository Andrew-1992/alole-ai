import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/sections/legal-page";
import { pages } from "@/content";

export const metadata: Metadata = pageMetadata({
  title: pages.terms.meta.title,
  description: pages.terms.meta.description,
  path: "/terms",
});

export default function TermsPage() {
  return <LegalPage copy={pages.terms} />;
}
