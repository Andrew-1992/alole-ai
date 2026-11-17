import type { ReactNode } from "react";
import type { ProductAccent } from "@/lib/schemas/content";
import { ProductMark } from "@/components/ui/product-mark";

interface IllustrationFrameProps {
  alt: string;
  label: string;
  accent: ProductAccent;
  caption: string;
  children: ReactNode;
  className?: string;
}

/**
 * Shared frame for the stylised interface illustrations.
 * The drawing is exposed to assistive tech as one image with a description
 * (role="img" makes its contents presentational), and every illustration is
 * captioned "Illustrative" so it is never mistaken for a real product screen.
 */
export function IllustrationFrame({ alt, label, accent, caption, children, className = "" }: IllustrationFrameProps) {
  return (
    <figure className={`flex flex-col gap-2 ${className}`}>
      <div
        role="img"
        aria-label={alt}
        className="flex min-h-full flex-1 flex-col gap-3.5 rounded-2xl bg-surface p-5 shadow-sm select-none sm:p-6"
      >
        <div className="flex items-center gap-2 text-[0.75rem] font-medium text-muted">
          <ProductMark accent={accent} size={8} />
          {label}
        </div>
        {children}
      </div>
      <figcaption className="text-label text-muted">{caption}</figcaption>
    </figure>
  );
}

/** A neutral placeholder bar standing in for data we do not invent. */
export function Bar({ width, tone = "line" }: { width: string; tone?: "line" | "strong" }) {
  return (
    <span
      className={`block h-2 rounded-full ${tone === "strong" ? "bg-line-strong" : "bg-line"}`}
      style={{ width }}
    />
  );
}
