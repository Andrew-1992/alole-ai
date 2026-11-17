import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { LOGO_RATIO, LOGO_VIEW_BOX, logoShapes } from "@/components/ui/logo";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#171717";
const PAPER = "#F2F0EE";
const MUTED = "#5C5B5B";
const BRAND = "#ED4F00";

/**
 * Font files for Satori (it needs TTF, not WOFF2). Cached so the images count
 * as static under Cache Components and are rendered once, at build time.
 */
async function loadFontData(): Promise<[Uint8Array, Uint8Array]> {
  "use cache";
  cacheLife("max");
  const dir = join(process.cwd(), "lib", "og", "fonts");
  const [medium, semibold] = await Promise.all([
    readFile(join(dir, "InstrumentSans-500.ttf")),
    readFile(join(dir, "InstrumentSans-600.ttf")),
  ]);
  return [new Uint8Array(medium), new Uint8Array(semibold)];
}

/** Copies bytes into a standalone ArrayBuffer, the type Satori accepts. */
function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(copy).set(bytes);
  return copy;
}

async function fonts() {
  const [mediumBytes, semiboldBytes] = await loadFontData();
  return [
    { name: "Instrument Sans", data: toArrayBuffer(mediumBytes), weight: 500 as const, style: "normal" as const },
    { name: "Instrument Sans", data: toArrayBuffer(semiboldBytes), weight: 600 as const, style: "normal" as const },
  ];
}

interface OgImageProps {
  /** Small label above the title, e.g. "Applied AI · Juba". */
  eyebrow: string;
  title: string;
  subtitle?: string;
}

/** On-brand Open Graph image, rendered at build time for each page. */
export async function renderOgImage({ eyebrow, title, subtitle }: OgImageProps): Promise<ImageResponse> {
  const logoHeight = 48;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: PAPER,
          color: INK,
          fontFamily: "Instrument Sans",
        }}
      >
        <svg viewBox={LOGO_VIEW_BOX} width={Math.round(logoHeight * LOGO_RATIO)} height={logoHeight}>
          {logoShapes(INK, BRAND)}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, color: MUTED, fontWeight: 500 }}>
            <div style={{ width: 18, height: 18, background: BRAND }} />
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: title.length > 40 ? 76 : 96,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
            }}
          >
            {title}
          </div>
          {subtitle && <div style={{ fontSize: 34, color: MUTED, fontWeight: 500, maxWidth: 950 }}>{subtitle}</div>}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
