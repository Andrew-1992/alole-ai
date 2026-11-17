import type { Metadata } from "next";
import { PageIntro, SplitSection } from "@/components/sections/page-intro";
import { ButtonLink } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";
import { company, pages } from "@/content";
import { withRegistrationRules } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

const copy = pages.press;

export const metadata: Metadata = pageMetadata({
  title: copy.meta.title,
  description: copy.meta.description,
  path: "/press",
});

export default function PressPage() {
  return (
    <>
      <PageIntro heading={copy.heading} intro={copy.intro} />

      <SplitSection id="one-line" heading={copy.oneLineHeading}>
        <p className="max-w-prose text-lead">{copy.oneLine}</p>
      </SplitSection>

      <SplitSection id="boilerplate" heading={copy.boilerplateHeading}>
        {/* The legal name appears only once registration is confirmed in content/company.ts. */}
        <p className="max-w-prose">{withRegistrationRules(copy.boilerplate, company)}</p>
      </SplitSection>

      <SplitSection id="assets" heading={copy.assetsHeading}>
        <div className="flex flex-col gap-6">
          <ul className="grid gap-4 md:grid-cols-3">
            {copy.assets.map((asset) => {
              const preview = asset.files.find((f) => f.format === "SVG")?.href;
              return (
                <li key={asset.label} className="flex flex-col overflow-hidden rounded-xl bg-surface">
                  <div
                    className={`flex h-36 items-center justify-center p-6 ${
                      asset.surface === "dark" ? "bg-[#171717]" : "bg-[#f2f0ee]"
                    }`}
                  >
                    {/* Static preview of the exact file offered for download. */}
                    {preview && (
                      // eslint-disable-next-line @next/next/no-img-element -- SVG files served as-is for press use
                      <img src={preview} alt="" className="max-h-16 w-auto max-w-[80%]" />
                    )}
                  </div>
                  <div className="flex flex-col gap-3 border-t border-line bg-surface p-4">
                    <p className="text-small font-medium">{asset.label}</p>
                    <div className="flex gap-2">
                      {asset.files.map((file) => (
                        <a
                          key={file.href}
                          href={file.href}
                          download
                          className="inline-flex h-9 items-center rounded-full border border-line-strong px-3.5 text-small font-medium hover:border-ink"
                        >
                          {file.format}
                          <span className="sr-only">: {asset.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="text-small text-muted">{copy.assetsNote}</p>
        </div>
      </SplitSection>

      <SplitSection id="colours" heading={copy.colorsHeading}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.colors.map((c) => (
            <li key={c.hex} className="flex flex-col overflow-hidden rounded-xl bg-surface">
              <span aria-hidden="true" className="h-20" style={{ backgroundColor: c.hex }} />
              <div className="flex flex-col gap-1 bg-surface p-4">
                <p className="text-small font-medium">{c.name}</p>
                <p className="tabular-nums text-small">{c.hex}</p>
                <p className="text-label text-muted">{c.use}</p>
              </div>
            </li>
          ))}
        </ul>
      </SplitSection>

      <SplitSection id="press-contact" heading={copy.contactHeading} className="border-b-0">
        <div className="flex flex-col items-start gap-5">
          <p className="max-w-prose">{copy.contactBody}</p>
          <ButtonLink href="/contact/press" variant="secondary">
            {copy.contactCta}
            <ArrowIcon />
          </ButtonLink>
        </div>
      </SplitSection>
    </>
  );
}
