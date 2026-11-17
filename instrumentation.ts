/**
 * Runs once when a server instance starts. Validates the runtime environment
 * so a misconfigured deployment fails at boot, not on the first form submission.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  // `next build` also loads this file; production secrets are not needed to build.
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  const { serverEnv } = await import("@/lib/server-env");
  serverEnv();
}
