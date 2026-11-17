/**
 * Content Security Policy.
 *
 * Every page is prerendered at build time. Next.js inlines its React Server
 * Component payload as <script> tags, and we add one small theme script. Rather
 * than `'unsafe-inline'` or per-request nonces (which force dynamic rendering),
 * the build hashes each page's inline scripts into a manifest
 * (scripts/csp-manifest.mjs) and the proxy sends the matching hashes per page.
 *
 * Styles allow 'unsafe-inline': React style attributes and next/font's inline
 * @font-face need it, and the brief's requirement is scripts only.
 */

export interface CspManifest {
  /** Build that produced the manifest; checked against the running build. */
  buildId: string;
  /** Pathname ("/", "/about") -> sha256 hashes (base64) of that page's inline scripts. */
  pages: Record<string, string[]>;
  /** Hashes for the prerendered 404 page, used for any unknown path. */
  notFound: string[];
}

export interface CspOptions {
  /** Inline script hashes allowed on this response. */
  scriptHashes: readonly string[];
  /** `next dev` needs eval and unhashed inline scripts for its tooling. */
  development: boolean;
  /** Only add upgrade-insecure-requests when the site is served over HTTPS. */
  upgradeInsecure: boolean;
}

export function buildCsp({ scriptHashes, development, upgradeInsecure }: CspOptions): string {
  const scriptSrc = development
    ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
    : ["'self'", ...[...new Set(scriptHashes)].map((h) => `'sha256-${h}'`)];

  const directives: [string, string[]][] = [
    ["default-src", ["'self'"]],
    ["script-src", scriptSrc],
    ["style-src", ["'self'", "'unsafe-inline'"]],
    ["img-src", ["'self'", "data:", "blob:"]],
    ["font-src", ["'self'"]],
    ["connect-src", development ? ["'self'", "ws:", "wss:"] : ["'self'"]],
    ["manifest-src", ["'self'"]],
    ["media-src", ["'self'"]],
    ["worker-src", ["'none'"]],
    ["object-src", ["'none'"]],
    ["base-uri", ["'self'"]],
    ["form-action", ["'self'"]],
    ["frame-ancestors", ["'none'"]],
  ];
  if (upgradeInsecure) directives.push(["upgrade-insecure-requests", []]);

  return directives.map(([name, values]) => [name, ...values].join(" ")).join("; ");
}

/** Normalises a request pathname to a manifest key ("/about/" -> "/about"). */
export function manifestKey(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.replace(/\/+$/, "");
  return pathname;
}

/** True when the path is a page prerendered at build time (dynamic-route shells excluded). */
export function isKnownPage(manifest: CspManifest, pathname: string): boolean {
  const key = manifestKey(pathname);
  return !key.includes("[") && Object.hasOwn(manifest.pages, key);
}

/** Hashes for a request path: the page's own, or the 404 page's for unknown paths. */
export function hashesForPath(manifest: CspManifest, pathname: string): readonly string[] {
  return manifest.pages[manifestKey(pathname)] ?? manifest.notFound;
}
