/**
 * Values fixed at build time and exposed by next.config.ts through `env`.
 * Reading them never touches the clock during prerendering, so pages stay
 * byte-identical between builds of the same commit (required by the CSP hashes).
 */
export const BUILD_YEAR: number = Number(process.env.NEXT_PUBLIC_BUILD_YEAR) || 2026;
