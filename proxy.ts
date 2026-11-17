import { NextResponse, type NextRequest } from "next/server";
import { buildCsp, hashesForPath, isKnownPage, type CspManifest } from "@/lib/security/csp";
import manifest from "@/lib/security/csp-manifest.generated.json";

/**
 * Sends each page's Content Security Policy with the hashes of exactly the
 * inline scripts that page contains. Pages themselves stay static; this only
 * adds a response header. See lib/security/csp.ts.
 *
 * Unknown paths are rewritten to the prerendered 404 page. Without this, an
 * unknown slug such as /products/x would render at request time with inline
 * scripts the manifest has never seen, and the CSP would block them.
 */

const development = process.env.NODE_ENV === "development";
const upgradeInsecure = (process.env.SITE_URL ?? "").startsWith("https://");
const cspManifest: CspManifest = manifest;
/** Matches no route, so Next.js serves the prerendered not-found page with a 404 status. */
const NOT_FOUND_PATH = "/__not-found";

export function proxy(request: NextRequest): NextResponse {
  // GET/HEAD serve prerendered HTML, whose hashes we know. Other methods
  // (a no-JS form post rendering its result) get no inline-script allowance:
  // that page is readable without scripts, which is all a no-JS visitor needs.
  const servesPrerendered = request.method === "GET" || request.method === "HEAD";
  const { pathname } = request.nextUrl;
  const unknownPage = !development && servesPrerendered && !isKnownPage(cspManifest, pathname);

  const scriptHashes = servesPrerendered ? hashesForPath(cspManifest, pathname) : [];
  let response: NextResponse;
  if (unknownPage) {
    const url = request.nextUrl.clone();
    url.pathname = NOT_FOUND_PATH;
    url.search = "";
    response = NextResponse.rewrite(url);
  } else {
    response = NextResponse.next();
  }
  response.headers.set("Content-Security-Policy", buildCsp({ scriptHashes, development, upgradeInsecure }));
  return response;
}

export const config = {
  matcher: [
    {
      // Pages only: skip build assets, API routes, generated metadata images
      // and anything with a file extension (icons, sitemap.xml, robots.txt).
      source:
        "/((?!_next/static|_next/image|api/|(?:.*/)?(?:opengraph-image|twitter-image|icon|apple-icon)(?:/|$)|.*\\.[a-zA-Z0-9]+$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
