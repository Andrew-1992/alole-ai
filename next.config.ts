import type { NextConfig } from "next";

/*
 * The CSP is hash-based (see scripts/build.mjs and proxy.ts), which needs
 * byte-identical HTML across the two build passes. So the build ID and build
 * year are fixed by the build script and passed in through the environment.
 */
const buildId = process.env.ALOLE_BUILD_ID;
const buildYear = process.env.NEXT_PUBLIC_BUILD_YEAR ?? String(new Date().getUTCFullYear());

/**
 * Headers for every response. The page Content-Security-Policy is set per
 * page by proxy.ts; non-page responses get a locked-down policy here.
 */
const securityHeaders = [
  // Two years. Add "; preload" only after submitting the domain to hstspreload.org.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), interest-cohort=()",
  },
  // Legacy fallback for frame-ancestors 'none'.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Self-contained server for the Docker image; ignored by Vercel.
  output: "standalone",
  // OG images are prerendered, but if one is ever regenerated at runtime it needs its fonts.
  outputFileTracingIncludes: { "/**/opengraph-image": ["./lib/og/fonts/*.ttf"] },
  ...(buildId ? { generateBuildId: async () => buildId } : {}),
  env: {
    NEXT_PUBLIC_BUILD_YEAR: buildYear,
  },
  /** The product pages were removed; old links go to the solutions page. */
  async redirects() {
    return [
      { source: "/products", destination: "/solutions", permanent: true },
      { source: "/products/:slug", destination: "/solutions", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/api/:path*",
        headers: [{ key: "Content-Security-Policy", value: "default-src 'none'; frame-ancestors 'none'" }],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
