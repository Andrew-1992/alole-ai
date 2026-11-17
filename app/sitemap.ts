import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

/** Indexable pages only (contact topic variants are noindex). */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/solutions",
    "/about",
    "/careers",
    "/press",
    "/contact",
    "/privacy",
    "/terms",
  ];
  return paths.map((path) => ({
    url: `${env.SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path === "/solutions" ? 0.8 : 0.5,
  }));
}
