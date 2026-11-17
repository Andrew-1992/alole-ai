import { connection } from "next/server";

/**
 * Liveness check for self-hosting (Docker HEALTHCHECK, load balancers).
 * Rendered per request so it reports on the running process, not a cached file.
 * It deliberately does not call external services: a provider outage should
 * not make the orchestrator restart a healthy web server.
 */
export async function GET(): Promise<Response> {
  await connection();
  return Response.json(
    { status: "ok" },
    { headers: { "Cache-Control": "no-store", "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'" } },
  );
}
