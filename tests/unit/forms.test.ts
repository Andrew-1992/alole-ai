import { describe, expect, it } from "vitest";
import { normaliseMessage } from "@/lib/forms/contact";
import { clientIpFrom, hashKey } from "@/lib/forms/request-context";
import { normaliseEmail, normaliseText } from "@/lib/forms/normalise";

describe("email normalisation", () => {
  it("trims, NFKC-normalises and lowercases", () => {
    expect(normaliseEmail("  Ana@Example.COM ")).toBe("ana@example.com");
    expect(normaliseEmail("ａｎａ@example.com")).toBe("ana@example.com");
  });
  it("keeps dots and plus tags (provider-specific; may be different people)", () => {
    expect(normaliseEmail("a.n.a+news@gmail.com")).toBe("a.n.a+news@gmail.com");
  });
});

describe("text normalisation", () => {
  it("collapses whitespace and removes control characters", () => {
    expect(normaliseText("  Ana \n\t Lado\u0007 ")).toBe("Ana Lado");
  });
  it("keeps paragraph breaks in messages but normalises line endings", () => {
    expect(normaliseMessage("Hello\r\n\r\n\r\n\r\nWorld  \u0000")).toBe("Hello\n\nWorld");
  });
});

describe("request context", () => {
  const h = (values: Record<string, string>) => ({ get: (k: string) => values[k] ?? null });
  it("takes the first X-Forwarded-For address", () => {
    expect(clientIpFrom(h({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }))).toBe("203.0.113.7");
  });
  it("falls back to X-Real-IP, then unknown", () => {
    expect(clientIpFrom(h({ "x-real-ip": "2001:db8::1" }))).toBe("2001:db8::1");
    expect(clientIpFrom(h({}))).toBe("unknown");
  });
  it("rejects header values that are not IP-shaped", () => {
    expect(clientIpFrom(h({ "x-forwarded-for": "evil:key\nINJECT" }))).toBe("unknown");
  });
  it("hashes keys one way and consistently", () => {
    expect(hashKey("a@b.co")).toBe(hashKey("a@b.co"));
    expect(hashKey("a@b.co")).not.toContain("a@b.co");
  });
});
