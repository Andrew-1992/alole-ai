# syntax=docker/dockerfile:1.7
#
# Multi-stage build for self-hosting. Produces a small image that runs the
# Next.js standalone server as a non-root user.
#
#   docker build --build-arg SITE_URL=https://aloleai.example -t excepai-web .
#   docker run --env-file .env.production -p 3000:3000 excepai-web
#
# SITE_URL is needed at build time: canonical URLs, the sitemap and OG image
# URLs are written into the static pages.

ARG NODE_VERSION=22.23.4

FROM node:${NODE_VERSION}-alpine AS base
RUN corepack enable
WORKDIR /app

# ---- dependencies (cached unless the lockfile changes) ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY scripts ./scripts
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---- build ----
FROM base AS build
ARG SITE_URL
ARG ALOLE_BUILD_ID
ENV NEXT_TELEMETRY_DISABLED=1 \
    SITE_URL=${SITE_URL} \
    ALOLE_BUILD_ID=${ALOLE_BUILD_ID}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN test -n "$SITE_URL" || (echo "Build arg SITE_URL is required" && exit 1) \
 && pnpm build

# ---- runtime ----
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

# The standalone output already contains .next/static and public (see scripts/build.mjs).
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/api/health" || exit 1

CMD ["node", "server.js"]
