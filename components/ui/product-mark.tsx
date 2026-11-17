import type { ProductAccent, ProductStatus } from "@/lib/schemas/content";

/** Static class names so Tailwind can see every accent at build time. */
export const accentBg: Record<ProductAccent, string> = {
  yaude: "bg-yaude",
  bluckflies: "bg-bluckflies",
  kodip: "bg-kodip",
  manas: "bg-manas",
};

export const accentText: Record<ProductAccent, string> = {
  yaude: "text-yaude",
  bluckflies: "text-bluckflies",
  kodip: "text-kodip",
  manas: "text-manas",
};

export const accentBorder: Record<ProductAccent, string> = {
  yaude: "border-yaude",
  bluckflies: "border-bluckflies",
  kodip: "border-kodip",
  manas: "border-manas",
};

/** Soft tint of a product's accent, for card media tiles. Text on it stays ink. */
export const accentTint: Record<ProductAccent, string> = {
  yaude: "bg-yaude/12",
  bluckflies: "bg-bluckflies/12",
  kodip: "bg-kodip/12",
  manas: "bg-manas/14",
};

/** The "full stop" square in a product's accent colour. */
export function ProductMark({
  accent,
  size = 10,
  className = "",
}: {
  accent: ProductAccent;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 ${accentBg[accent]} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function StatusBadge({ status, label }: { status: ProductStatus; label: string }) {
  const live = status === "live";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-label font-medium whitespace-nowrap ${
        live ? "bg-ink text-on-ink" : "bg-surface/80 text-ink-soft"
      }`}
    >
      {label}
    </span>
  );
}
