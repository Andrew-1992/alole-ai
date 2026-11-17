import "server-only";
import { z } from "zod";

/**
 * Server environment, validated once on first import.
 * Only variables needed so far are declared; form and email variables are
 * added with the form backends.
 */
const envSchema = z.object({
  SITE_URL: z
    .url({ protocol: /^https?$/ })
    .transform((u) => u.replace(/\/+$/, ""))
    .describe("Public origin of the site, used for canonical URLs, sitemap and OG images."),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse({ SITE_URL: process.env.SITE_URL });
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid environment variables:\n${issues}\nSee .env.example.`);
  }
  return result.data;
}

export const env = loadEnv();
