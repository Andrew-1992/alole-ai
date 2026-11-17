import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { content } from "@/content";
import {
  companySchema,
  findBrandViolations,
  homeSchema,
} from "@/lib/schemas/content";
import {
  buildCsp,
  hashesForPath,
  isKnownPage,
  manifestKey,
} from "@/lib/security/csp";
import {
  companyLocationLine,
  telHref,
  whatsappHref,
  withRegistrationRules,
} from "@/lib/company";

describe("content config", () => {
  it("loads and validates (this is what the build does)", () => {
    expect(findBrandViolations(content)).toEqual([]);
  });

  it("uses the exact company name everywhere", () => {
    // Same rule the build applies: file paths and URLs may use lowercase "alole".
    const misspelt = findBrandViolations(content).filter((v) => v.rule === "name-spelling");
    expect(misspelt).toEqual([]);
    expect(JSON.stringify(content)).toContain("Alole");
  });

  it("flags misspelled names and banned words", () => {
    const v = findBrandViolations({
      a: "Welcome to ALOLE",
      b: "A seamless experience",
      c: "/company/alole",
      d: "Real synergy",
      e: "hello@alole.ai",
    });
    expect(v.map((x) => x.rule)).toEqual([
      "name-spelling",
      "banned-word",
      "banned-word",
    ]);
  });

  it("flags claims of training or owning AI models", () => {
    for (const text of [
      "We train our own models.",
      "Alole's proprietary foundation model",
      "Built on our own large language models",
      "It owns its AI infrastructure",
    ]) {
      expect(
        findBrandViolations(text).map((x) => x.rule),
        text,
      ).toContain("model-claim");
    }
    expect(findBrandViolations("No. We build on leading AI models.")).toEqual(
      [],
    );
  });

  it("focuses on agents, automation and integration, with no products or waitlist", () => {
    expect(content.home.hero.capabilities.map((c) => c.kind)).toEqual(["agents", "automation", "integration"]);
    expect(content.solutions.services.map((s) => s.id)).toEqual(["custom-agent", "automation", "integration"]);
    expect(content).not.toHaveProperty("products");
    const text = JSON.stringify(content);
    for (const name of ["Yaude", "BluckFlies", "Kodip", "Manas", "waitlist", "/products"])
      expect(text, name).not.toContain(name);
  });

  it("rejects a products capability card on the home hero", () => {
    const hero = content.home.hero;
    const withProducts = {
      ...content.home,
      hero: { ...hero, capabilities: [{ ...hero.capabilities[0], kind: "products" }, ...hero.capabilities.slice(1)] },
    };
    expect(homeSchema.safeParse(withProducts).success).toBe(false);
  });

  it("only accepts https social links, and empty to hide", () => {
    const bad = {
      ...content.company,
      social: [{ platform: "x", label: "X", url: "http://x.com/a" }],
    };
    expect(companySchema.safeParse(bad).success).toBe(false);
  });

  it("rejects a malformed phone number", () => {
    expect(
      companySchema.safeParse({ ...content.company, phone: "0980268376" })
        .success,
    ).toBe(false);
  });

  it("does not claim registration until configured", () => {
    const pending = {
      ...content.company,
      registrationStatus: "pending" as const,
    };
    const registered = {
      ...content.company,
      registrationStatus: "registered" as const,
    };
    expect(companyLocationLine(pending)).toBe("Alole, Juba, South Sudan");
    expect(companyLocationLine(registered)).toBe(
      "Alole AI Limited, Juba, South Sudan",
    );

    const boilerplate = content.pages.press.boilerplate;
    expect(boilerplate).toContain("(Alole AI Limited)");
    expect(withRegistrationRules(boilerplate, pending)).not.toContain(
      "Limited",
    );
    expect(withRegistrationRules(boilerplate, pending)).toMatch(
      /^Alole is an applied AI company/,
    );
    expect(withRegistrationRules(boilerplate, registered)).toBe(boilerplate);
  });

  it("builds phone and WhatsApp links from config", () => {
    expect(telHref("+211 980 268 376")).toBe("tel:+211980268376");
    expect(whatsappHref("")).toBeNull();
    expect(whatsappHref("+211 980 268 376")).toBe("https://wa.me/211980268376");
  });

  it("uses the brief's copy for the key lines", () => {
    expect(content.site.tagline).toBe("Practical AI for real lives.");
    expect(content.home.hero.title).toBe("Your workflows, run by AI agents.");
    expect(content.home.faq.items).toHaveLength(6);
    expect(content.home.why.items).toHaveLength(4);
    expect(content.solutions.process.steps.map((s) => s.title)).toEqual([
      "Discover",
      "Design",
      "Build",
      "Support",
    ]);
  });

  it("keeps press colour values in sync with the design tokens", () => {
    const css = readFileSync("app/globals.css", "utf8").toLowerCase();
    for (const c of content.pages.press.colors)
      expect(css).toContain(c.hex.toLowerCase());
  });
});

describe("content security policy", () => {
  const manifest = {
    buildId: "b",
    pages: { "/": ["AAA="], "/about": ["BBB="] },
    notFound: ["NNN="],
  };

  it("lists only hashes for scripts in production, never unsafe-inline", () => {
    const csp = buildCsp({
      scriptHashes: ["AAA="],
      development: false,
      upgradeInsecure: true,
    });
    expect(csp).toContain("script-src 'self' 'sha256-AAA='");
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("upgrade-insecure-requests");
  });

  it("maps paths to their page, and unknown paths to the 404 page", () => {
    expect(manifestKey("/about/")).toBe("/about");
    expect(hashesForPath(manifest, "/about/")).toEqual(["BBB="]);
    expect(hashesForPath(manifest, "/nope")).toEqual(["NNN="]);
  });

  it("knows which paths are real prerendered pages", () => {
    expect(isKnownPage(manifest, "/about/")).toBe(true);
    expect(isKnownPage(manifest, "/nope")).toBe(false);
    expect(
      isKnownPage(
        { ...manifest, pages: { "/careers/[slug]": [] } },
        "/careers/[slug]",
      ),
    ).toBe(false);
    expect(isKnownPage(manifest, "/constructor")).toBe(false);
  });
});

describe("service picker", () => {
  it("suggests the goal's service and adds the second answer when it differs", async () => {
    const { suggestServices } = await import("@/components/sections/service-picker");
    expect(suggestServices(["automation", "automation"])).toEqual({ main: "automation", also: undefined });
    expect(suggestServices(["custom-agent", "integration"])).toEqual({ main: "custom-agent", also: "integration" });
  });

  it("only offers options the enquiry form accepts", () => {
    const { picker } = content.home;
    expect(picker.timeline.options.map((o) => o.value)).toEqual([
      "exploring",
      "within-3-months",
      "3-6-months",
      "later",
    ]);
    for (const q of picker.questions)
      expect(new Set(q.options.map((o) => o.service))).toEqual(new Set(["custom-agent", "automation", "integration"]));
  });
});

describe("prefetchFor", () => {
  it("skips viewport prefetch only for pages that embed the enquiry form", async () => {
    const { prefetchFor } = await import("@/lib/prefetch");
    expect(prefetchFor("/contact")).toBe(false);
    expect(prefetchFor("/contact/client-project")).toBe(false);
    expect(prefetchFor("/solutions#custom-agent")).toBe(false);
    expect(prefetchFor("/press")).toBeUndefined();
    expect(prefetchFor("/contacts")).toBeUndefined();
    expect(prefetchFor("/about")).toBeUndefined();
  });
});
