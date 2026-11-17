// Production build in two passes, so the proxy can ship each page's CSP hashes.
//
//   1. next build                      -> prerendered HTML
//   2. hash every page's inline scripts -> lib/security/csp-manifest.generated.json
//   3. next build                      -> same HTML, proxy now bundles the manifest
//   4. verify the final HTML matches the manifest, or fail the build
//   5. copy static assets beside the standalone server
//
// Both passes share one build ID and build year, which makes the HTML
// byte-identical (checked in step 4). Use `pnpm build`; a bare `next build`
// produces a site whose pages cannot hydrate under the CSP.

import { spawnSync } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import { randomUUID } from "node:crypto";

function run(cmd, args, env) {
  const result = spawnSync(cmd, args, { stdio: "inherit", env: { ...process.env, ...env } });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const env = {
  ALOLE_BUILD_ID:
    process.env.ALOLE_BUILD_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? randomUUID(),
  NEXT_PUBLIC_BUILD_YEAR: process.env.NEXT_PUBLIC_BUILD_YEAR ?? String(new Date().getUTCFullYear()),
};
const next = ["exec", "next", "build"];

run("node", ["scripts/csp-manifest.mjs", "init"], env);
console.log("\n— build pass 1 of 2: prerender pages —");
run("pnpm", next, env);
run("node", ["scripts/csp-manifest.mjs", "write"], env);
console.log("\n— build pass 2 of 2: bundle CSP manifest —");
run("pnpm", next, env);
run("node", ["scripts/csp-manifest.mjs", "verify"], env);

// The standalone server (Docker, e2e tests) serves static files from beside itself.
if (existsSync(".next/standalone")) {
  cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
  cpSync("public", ".next/standalone/public", { recursive: true });
  console.log("build: copied static assets into .next/standalone");
}
