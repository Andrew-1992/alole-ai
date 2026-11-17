import type { z } from "zod";
import type { uiSchema } from "@/lib/schemas/content";

/**
 * Interface strings shared across pages. Kept here so components hold no copy.
 * Short control labels (Menu, Email, Skip to content) are not marked TODO_COPY;
 * sentences written for this site are.
 */
export const ui = {
  skipLink: "Skip to content",
  homeLinkLabel: "Alole home",
  mainNavLabel: "Main",
  solutionsMenuLabel: "Solutions",
  solutionsMenuToggle: "Show solutions",
  allSolutionsLabel: "All solutions",
  mobileMenuOpen: "Menu",
  mobileMenuClose: "Close menu",
  themeToDark: "Switch to dark theme",
  themeToLight: "Switch to light theme",
  illustrative: "Illustrative",
  footer: {
    solutionsHeading: "Solutions",
    companyHeading: "Company",
    legalHeading: "Legal",
    socialHeading: "Follow",
    contactHeading: "Contact",
    whatsappLabel: "Chat on WhatsApp",
    copyright: "© {year} Alole AI",
  },
} satisfies z.input<typeof uiSchema>;
