// Builds the CSP hash manifest from prerendered HTML in .next/server/app.
//
//   node scripts/csp-manifest.mjs write   -> writes lib/security/csp-manifest.generated.json
//   node scripts/csp-manifest.mjs verify  -> fails if the current build's HTML
//                                            differs from the bundled manifest
//   node scripts/csp-manifest.mjs init    -> writes an empty placeholder if missing
//
// See lib/security/csp.ts for why this exists.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";

const APP_DIR = join(".next", "server", "app");
const MANIFEST = join("lib", "security", "csp-manifest.generated.json");
const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function sha256(text) {
  return createHash("sha256").update(text, "utf8").digest("base64");
}

/** "index.html" -> "/", "contact/press.html" -> "/contact/press". */
function routeOf(file) {
  const rel = relative(APP_DIR, file).split(sep).join("/").replace(/\.html$/, "");
  if (rel === "index") return "/";
  return `/${rel.replace(/\/index$/, "")}`;
}

function collect() {
  if (!existsSync(APP_DIR)) throw new Error(`No build output at ${APP_DIR}. Run next build first.`);
  const buildId = readFileSync(join(".next", "BUILD_ID"), "utf8").trim();
  const pages = {};
  let notFound = [];
  for (const file of walk(APP_DIR).filter((f) => f.endsWith(".html")).sort()) {
    const html = readFileSync(file, "utf8");
    const hashes = [...new Set([...html.matchAll(INLINE_SCRIPT)].map((m) => sha256(m[1] ?? "")))].sort();
    const route = routeOf(file);
    if (route === "/_not-found") notFound = hashes;
    else if (route !== "/_global-error") pages[route] = hashes;
  }
  if (notFound.length === 0) throw new Error("No prerendered 404 page found.");
  return { buildId, pages, notFound };
}

const mode = process.argv[2];

if (mode === "init") {
  if (!existsSync(MANIFEST)) {
    mkdirSync(dirname(MANIFEST), { recursive: true });
    writeFileSync(MANIFEST, `${JSON.stringify({ buildId: "", pages: {}, notFound: [] }, null, 2)}\n`);
    console.log(`csp: wrote empty placeholder ${MANIFEST}`);
  }
} else if (mode === "write") {
  const manifest = collect();
  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`csp: hashed ${Object.keys(manifest.pages).length} pages -> ${MANIFEST}`);
} else if (mode === "verify") {
  const bundled = JSON.parse(readFileSync(MANIFEST, "utf8"));
  const current = collect();
  if (JSON.stringify(bundled) !== JSON.stringify(current)) {
    const changed = Object.keys({ ...bundled.pages, ...current.pages }).filter(
      (k) => JSON.stringify(bundled.pages[k]) !== JSON.stringify(current.pages[k]),
    );
    console.error("csp: the final build's inline scripts do not match the bundled manifest.");
    console.error(`csp: build id ${bundled.buildId} vs ${current.buildId}; pages differing: ${changed.join(", ") || "(404 or build id)"}`);
    console.error("csp: pages would fail to hydrate under the CSP. Is the build deterministic?");
    process.exit(1);
  }
  console.log(`csp: verified ${Object.keys(current.pages).length} pages against the bundled manifest`);
} else {
  console.error("usage: node scripts/csp-manifest.mjs <init|write|verify>");
  process.exit(2);
}
