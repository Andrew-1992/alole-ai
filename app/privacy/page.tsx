import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/sections/legal-page";
import { pages } from "@/content";

export const metadata: Metadata = pageMetadata({
  title: pages.privacy.meta.title,
  description: pages.privacy.meta.description,
  path: "/privacy",
});

export default function PrivacyPage() {
  return <LegalPage copy={pages.privacy} />;
}
