import {
  companySchema,
  findBrandViolations,
  homeSchema,
  navigationSchema,
  siteSchema,
  solutionsSchema,
  uiSchema,
} from "@/lib/schemas/content";
import { pagesSchema } from "@/lib/schemas/pages";
import { company as rawCompany } from "./company";
import { home as rawHome } from "./home";
import { navigation as rawNavigation } from "./navigation";
import { pages as rawPages } from "./pages";
import { site as rawSite } from "./site";
import { solutions as rawSolutions } from "./solutions";
import { ui as rawUi } from "./ui";

/**
 * Validated content. Parsing happens once at module load, which runs during
 * `next build`; any schema or brand-rule failure aborts the build.
 */
function loadContent() {
  const parsed = {
    company: companySchema.parse(rawCompany),
    site: siteSchema.parse(rawSite),
    navigation: navigationSchema.parse(rawNavigation),
    home: homeSchema.parse(rawHome),
    solutions: solutionsSchema.parse(rawSolutions),
    ui: uiSchema.parse(rawUi),
    pages: pagesSchema.parse(rawPages),
  };

  const violations = findBrandViolations(parsed);
  if (violations.length > 0) {
    const detail = violations.map((v) => `  ${v.rule} at ${v.path}: "${v.value}"`).join("\n");
    throw new Error(`Content breaks brand rules:\n${detail}`);
  }
  return parsed;
}

export const content = loadContent();
export const { company, site, navigation, home, solutions, ui, pages } = content;

/** Replaces `{key}` tokens in a content string. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
