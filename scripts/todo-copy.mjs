// Lists every piece of copy marked TODO_COPY(...) in content/, for review.
//
//   pnpm copy:todo          -> writes TODO-COPY.md and prints the count
//
// The marker is defined in content/todo-copy.ts.

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "content";
const MARKER = /TODO_COPY\(\s*("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)\s*,?\s*\)/g;

const rows = [];
for (const file of readdirSync(DIR).filter((f) => f.endsWith(".ts") && f !== "todo-copy.ts").sort()) {
  const source = readFileSync(join(DIR, file), "utf8");
  for (const match of source.matchAll(MARKER)) {
    const line = source.slice(0, match.index).split("\n").length;
    const literal = match[1] ?? "";
    // String literals in the content files are plain JSON-compatible strings.
    const text = literal.startsWith("`") ? literal.slice(1, -1) : JSON.parse(literal);
    rows.push({ where: `${DIR}/${file}:${line}`, text });
  }
}

const escape = (s) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
const md = [
  "# Copy awaiting review (TODO-COPY)",
  "",
  "Copy below was not supplied in the brief. It was written in the brand voice and is marked",
  "with `TODO_COPY(...)` in the content files. Approve or edit each item, then remove the wrapper.",
  "Regenerate this list with `pnpm copy:todo`.",
  "",
  `${rows.length} items.`,
  "",
  "| Where | Copy |",
  "| --- | --- |",
  ...rows.map((r) => `| \`${r.where}\` | ${escape(r.text)} |`),
  "",
].join("\n");

writeFileSync("TODO-COPY.md", md);
console.log(`copy: ${rows.length} TODO-COPY items -> TODO-COPY.md`);
