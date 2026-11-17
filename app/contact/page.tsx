import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ContactPage } from "@/components/sections/contact-page";
import { pages } from "@/content";

export const metadata: Metadata = pageMetadata({
  title: pages.contact.meta.title,
  description: pages.contact.meta.description,
  path: "/contact",
});

export default function Contact() {
  return <ContactPage topic="general" permalink="/contact" />;
}
