import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MARK_PATH, NAME_PATH } from "@/components/ui/logo";

const press = (file: string) => readFileSync(join(process.cwd(), "public/press", file), "utf8");

describe("logo files", () => {
  it("press-kit logos use the same artwork as the site logo", () => {
    for (const file of ["alole-logo-light.svg", "alole-logo-dark.svg"]) {
      expect(press(file), file).toContain(NAME_PATH);
      expect(press(file), file).toContain(MARK_PATH);
    }
    expect(press("alole-mark.svg")).toContain(MARK_PATH);
  });

  it("the favicon is the mark on a transparent background", () => {
    const icon = readFileSync(join(process.cwd(), "app/icon.svg"), "utf8");
    expect(icon).toContain(MARK_PATH);
    expect(icon).not.toContain("<rect");
  });
});
