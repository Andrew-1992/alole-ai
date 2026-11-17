# Alole website

The official website for Alole, an applied AI company in Juba, South Sudan, building AI agents, AI automation and AI integration for organisations. The primary conversion is **Start a project**.

Next.js 16 (App Router, Cache Components) · TypeScript (strict) · Tailwind CSS 4 · Zod · Resend · Redis (optional).

Every content page is prerendered at build time. The site works without JavaScript, including both forms.

---

## Contents

1. [Quick start](#quick-start)
2. [Scripts](#scripts)
3. [Environment variables](#environment-variables)
4. [Editing content](#editing-content)
5. [Design system](#design-system)
6. [The logo](#the-logo)
7. [How the forms work](#how-the-forms-work)
8. [Email setup (Resend, SPF, DKIM, DMARC)](#email-setup)
9. [Security headers and the Content Security Policy](#security-headers-and-the-content-security-policy)
10. [Deploying on Vercel](#deploying-on-vercel)
11. [Self-hosting with Docker](#self-hosting-with-docker)
12. [Testing and CI](#testing-and-ci)
13. [Project structure](#project-structure)
14. [Launch checklist](#launch-checklist)

---

## Quick start

Requirements: Node.js 22 (see `.nvmrc`) and pnpm 10 (`corepack enable` installs the version pinned in `package.json`).

```bash
corepack enable
pnpm install
cp .env.example .env.local     # SITE_URL is the only required value for local work
pnpm dev                       # http://localhost:3000
```

In development the forms use stand-ins: no email is sent (sends are logged without contents), signups are kept in memory, and rate limits are per process.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server. |
| `pnpm build` | Production build in two passes, so pages can carry CSP hashes (see [below](#security-headers-and-the-content-security-policy)). **Always build with this**, not `next build`. |
| `pnpm start` | Serves a production build (`next start`). |
| `pnpm lint` | ESLint. |
| `pnpm typecheck` | Generates route types, then `tsc --noEmit`. |
| `pnpm test:unit` | Unit and integration tests (Vitest). |
| `pnpm test:e2e` | Playwright tests against the production build. Run `pnpm build` first. |

## Environment variables

All variables are validated with Zod. `.env.example` lists them with placeholders. Never commit real values.

**Build time**

| Variable | Required | Notes |
| --- | --- | --- |
| `SITE_URL` | Yes | Public origin, no trailing slash, e.g. `https://aloleai.com` in production. Written into canonical URLs, the sitemap and Open Graph tags. Changing it needs a rebuild. |
| `ALOLE_BUILD_ID` | No | Fixed build ID. Defaults to the Git commit on Vercel and GitHub Actions, otherwise a random ID. |

**Runtime** (checked when the server starts; it refuses to start if invalid)

| Variable | Production | Notes |
| --- | --- | --- |
| `APP_ENV` | optional | `production` (default when `NODE_ENV=production`), `test` or `development`. `test` allows the in-memory stand-ins; use it only for CI. |
| `RESEND_API_KEY` | required | Resend API key with sending and contacts access. |
| `EMAIL_FROM` | required | Sender, e.g. `Alole <hello@aloleai.example>`, on your verified domain. |
| `CONTACT_INBOX` | required | Where contact form messages are delivered. |
| `REDIS_URL` | required* | `redis://` or `rediss://` URL for the shared rate limiter. |
| `RATE_LIMIT_STORE` | optional | `redis` (default in production) or `memory`. *Set `memory` only for a single self-hosted instance; then `REDIS_URL` is not needed. |
| `EMAIL_PROVIDER` | optional | Override the defaults (`resend` in production, `console`/`memory` elsewhere). Production rejects the stand-ins. |

## Editing content

All copy, navigation, links and flags live in typed modules under `content/`. Components contain no copy. Every module is validated with Zod when the site builds, so a mistake fails the build with a clear message instead of reaching visitors.

| File | Contents |
| --- | --- |
| `content/company.ts` | Company facts: legal name, registration status, headquarters, founder, team, phone, WhatsApp, email, response time, social links. |
| `content/site.ts` | Tagline, secondary line, positioning statement, meta description, feature flags. |
| `content/solutions.ts` | The `/solutions` page: services and examples, how we work, who we work with, case studies, the illustrative diagram. |
| `content/home.ts` | Home page sections and FAQ. |
| `content/pages.ts` | All other pages, form copy, legal text and confirmation emails. |
| `content/navigation.ts` | Header and footer links. |
| `content/ui.ts` | Shared interface strings (buttons, labels, errors). |

**Unsupplied copy.** Copy the brief gave is used word for word. Anything Alole still has to write is wrapped in `TODO_COPY("...")` (from `content/todo-copy.ts`): the site renders the draft text, and the marker makes it searchable. Run `pnpm copy:todo` to regenerate `TODO-COPY.md`, the full list with file and line. Replace each `TODO_COPY("draft")` with the final string before launch; the list should be empty.

The build also enforces the brand rules: the name must be written `Alole`; banned words (revolutionary, game-changing, cutting-edge, unleash, seamless, leverage, next-generation, empower, synergy) are rejected; and any claim that Alole trains or owns its own foundation models or AI infrastructure fails the build. Alole builds on leading AI models; it does not train them.

**Focus.** The site presents three services only: AI agents, AI automation and AI integration (`content/solutions.ts`). The earlier product pages and waitlist were removed; `/products` and `/products/<slug>` redirect permanently to `/solutions` (`next.config.ts`).

**Feature flags** in `content/site.ts`:

- `showTeam`: shows the Team section on About, using `company.team`. It stays hidden while the list is empty. The founder always appears under Leadership, from `company.founder`.
- `showJobListings`: shows roles from `pages.careers.jobs`. It stays hidden while the list is empty.
- `showCaseStudies`: shows case studies on `/solutions`, from `solutions.caseStudies.items`. Off by default; it stays hidden while the list is empty. Publish only real, approved client work.
- `cookielessAnalytics`: enables Vercel Web Analytics, which sets no cookies. It only works on Vercel. Update the privacy page before enabling it. Only two things are tracked: page views, and enquiry form submissions with their topic, via `lib/analytics.ts`. No names, addresses or message text are ever sent. Custom events need a Vercel Pro or Enterprise plan; on Hobby only page views are recorded.

**Company registration.** The legal name is "Alole AI Limited" (`company.legalName`). Until `company.registrationStatus` in `content/company.ts` is `"registered"`, the site never states or implies registration: the footer reads "Alole, Juba, South Sudan", the press boilerplate drops the bracketed legal name, and structured data omits `legalName`. Changing the status to `"registered"` turns all three on.

**Contact details.** `company.phone` (shown in the footer and on Contact as a `tel:` link) is required. `company.whatsapp` and `company.email` are hidden while empty; set them in international format and a valid address to show them.

**Social links.** Add entries to `company.social` with `https://` links. Empty links are hidden.

**Text direction.** Layouts use logical CSS properties (`ms-`, `ps-`, `start-`), and arrows flip in right-to-left text. To add Arabic later, add translated content modules and set `lang`/`dir` on `<html>`.

## Design system

All visual values are tokens in `app/globals.css`, switched per theme; components use only the Tailwind utilities that read them.

- **Colour** (after the Oberon palette): warm paper `#F2F0EE`, white cards, ink `#171717`, warm greys, and signal orange. `--accent` (`#ED4F00`) is for fills, dots, the "AI" in the logo and focus rings; text uses `--accent-ink` (`#B83D00`), because the bright orange is below 4.5:1 for small text. Dark theme: `#171717` background, `#202020` cards, orange `#FF6A1A`.
- **Type** (after openai.com): one sans family, Instrument Sans, for everything. Headlines are medium weight (500) with tight tracking (about −0.03em on display sizes, −0.027em on page titles); body text is 17px with a 1.65 line height and −0.01em tracking; buttons and navigation are 14px medium. Labels above headings (`.eyebrow`) are sentence case, 14px medium, muted. There are no serif or monospace labels; a system monospace is used only for code. OpenAI's own typeface (OpenAI Sans) is proprietary and is not used. Instrument Sans is licensed under the SIL Open Font License and served from `app/fonts/`.
- **Buttons** (in the manner of OpenAI): pills. `primary` is solid ink for the main action, `secondary` a hairline outline, `ghost` a soft tint; `inverse` and `inverse-ghost` sit on dark panels.
- **Cards**: borderless. Service, FAQ and form cards are white panels with large radii. Sections are separated by space rather than rules on the home page; inner pages keep hairline rules.
- **Section headers**: `SectionHeader` (serif heading and intro on the left, one action on the right).

## The logo

The logo is a mark (one continuous rounded line forming a lowercase "a", turned on its corner) beside the name "Alole" (Instrument Sans 600, outlined to SVG paths). The mark takes the brand accent; the name takes the text colour. All of it lives in `components/ui/logo.tsx`:

- `<Logo>`: mark and name, used in the header and footer.
- `NAME_PATH`, `MARK_PATH`, `MARK_TRANSFORM`, `markShapes()` and `logoShapes()`: the raw artwork, also used by the generated social images.

The same artwork is in `app/icon.svg` (favicon: orange mark on an ink tile), `app/apple-icon.png` (180×180) and `public/press/` (`alole-logo-light`, `alole-logo-dark` and `alole-mark`, as SVG and PNG). To change the logo, update the paths in `logo.tsx`, then regenerate those files from the same paths so they match. Keep the hex values in `content/pages.ts` (press colours) in step with `app/globals.css`; a unit test checks them. Run `pnpm build`; the social images pick up the new artwork automatically.

Instrument Sans is licensed under the SIL Open Font License, which permits use in a logo.

## How the forms work

The enquiry form is a real HTML `<form>` bound to a Server Action. Without JavaScript the browser posts the form and the server renders the result into the page. With JavaScript the form updates in place.

**Enquiry** (`lib/contact/`), on `/contact`, `/contact/<topic>` and the bottom of `/solutions`:

- **Topics:** Client project, General, Partnership, Press, Careers. "Start a project" links to `/contact/client-project`, and `/solutions` opens with Client project selected.
- **Client project fields:** organisation is required; service of interest and timeline are optional. With JavaScript, service and timeline appear only when Client project is chosen. Without JavaScript every field shows, and the project fields are marked optional. There is no budget field.
- **Delivery:** the message goes by email to `CONTACT_INBOX`, with Reply-To set to the sender. The subject starts with the topic's prefix from `content/pages.ts` (`[Project]`, `[General]`, `[Partnership]`, `[Press]`, `[Careers]`), so the inbox can filter on it, e.g. `[Project] Juba Bakery: Ana Lado`.
- **Confirmation:** the sender gets a fixed-text confirmation.

**Confirmations never include user-entered text.** So the form cannot be used to send arbitrary content to third parties.

**Abuse protection:**
- Server-side validation with length limits.
- A honeypot field. Bots get a fake success, and nothing is stored or sent.
- Rate limits per IP and per email address:

| Form | Per IP | Per email |
| --- | --- | --- |
| Contact | 5 per 10 minutes | 3 per hour |

Email addresses are hashed before being used as rate-limit keys. Counters expire within an hour.

**Rate limiter implementations** (`lib/rate-limit/`):

| | `MemoryRateLimiter` | `RedisRateLimiter` |
| --- | --- | --- |
| Where counters live | In the server process | In Redis, shared by all instances |
| Survives restarts | No | Yes |
| Use for | Development, tests, **one** self-hosted container | Vercel and any multi-instance or serverless hosting |
| If storage fails | n/a | Fails open (allows the request, logs the error) so an outage doesn't block real people |

On serverless hosting, every instance has its own memory. A memory limiter there would let an attacker multiply the limits, which is why production defaults to Redis.

**Client IP.** Rate limits read the first `X-Forwarded-For` address, or `X-Real-IP`. Vercel sets these correctly. When self-hosting, your reverse proxy must set them and overwrite any value sent by the client. Otherwise per-IP limits can be bypassed.

**Errors and logging.** Errors are logged as JSON with an event name and error type only. Form contents and addresses are never logged, and provider errors never reach the browser.

## Email setup

1. Create a Resend account and add your sending domain (e.g. `aloleai.example`).
2. Add the DNS records Resend shows you:
   - **SPF:** the TXT record authorising Resend to send for your domain (or its return-path subdomain).
   - **DKIM:** the TXT/CNAME records with Resend's public keys.
   - **DMARC:** a TXT record at `_dmarc.aloleai.example`. Start with `v=DMARC1; p=none; rua=mailto:dmarc@aloleai.example`, check the reports, then move to `p=quarantine` and later `p=reject`.
3. Wait until Resend shows the domain as verified, then set `EMAIL_FROM` to an address on it.
4. Create an API key with sending access, and set it as `RESEND_API_KEY`.

## Security headers and the Content Security Policy

All responses get HSTS (two years, subdomains), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY` and `Cross-Origin-Opener-Policy`. These are set in `next.config.ts`. Add HSTS `preload` only after submitting the domain to hstspreload.org.

**The page CSP allows no `'unsafe-inline'` for scripts, and every page stays static.** Next.js puts its page data in inline `<script>` tags. Rather than nonces, which would force every page to render per request, the site works like this:

1. `pnpm build` (`scripts/build.mjs`) runs `next build`.
2. `scripts/csp-manifest.mjs` hashes each prerendered page's inline scripts into `lib/security/csp-manifest.generated.json`.
3. A second `next build` bundles that manifest into `proxy.ts`. Both passes share a build ID and build year, so the HTML is byte-identical.
4. The build **fails** if the final HTML doesn't match the manifest.
5. At request time, `proxy.ts` sends each page's CSP with exactly its own hashes. Unknown paths are rewritten to the prerendered 404 page, so nothing renders at request time with scripts the manifest hasn't seen.

Notes:

- Styles use `'unsafe-inline'`, which React style attributes and the self-hosted font need. The brief's requirement covers scripts only.
- A form submitted without JavaScript returns a page with no inline-script allowance. It is fully readable, which is all a no-JS visitor needs.
- `next dev` uses a relaxed policy, because development tooling needs `eval`.
- The self-hosted server must listen on all interfaces (the Docker image sets `HOSTNAME=0.0.0.0`). Bound only to `127.0.0.1`, the proxy's 404 rewrite fails with a 500.

## Deploying on Vercel

1. Import the repository. The framework preset is Next.js and the build command is `pnpm build` (from `package.json`). **Do not** change the build command to `next build`.
2. Set the environment variables (production and preview): `SITE_URL` plus the runtime variables above. For `REDIS_URL`, any Redis provider works, such as Upstash Redis over `rediss://`.
3. Add your domain and point DNS at Vercel.
4. Deploy, then check the [launch checklist](#launch-checklist).

## Self-hosting with Docker

```bash
docker build --build-arg SITE_URL=https://aloleai.example -t excepai-web .
docker run -d --name excepai-web --restart unless-stopped \
  --env-file .env.production -p 127.0.0.1:3000:3000 excepai-web
```

The image is built in stages on `node:22-alpine`. It runs the standalone server as a non-root user, and its `HEALTHCHECK` calls `GET /api/health`.

Put a reverse proxy in front of it (Caddy, nginx). The proxy should:
- terminate TLS;
- set `X-Forwarded-For` and `X-Forwarded-Proto` and overwrite any client-supplied values;
- forward the `Host` header;
- expose only ports 80 and 443 on the server.

Use Redis for rate limits if you run more than one container. With exactly one container, `RATE_LIMIT_STORE=memory` is acceptable.

## Testing and CI

- **Unit and integration** (`tests/unit`, `tests/integration`):
  - content and brand-rule validation;
  - Zod schemas and normalisation;
  - deduplication;
  - the rate limiter;
  - CSP building;
  - environment validation;
  - both form services, covering valid input, duplicates, invalid input, the honeypot, per-IP and per-email limits, and provider failure.
- **End to end** (`tests/e2e`, against the production build):
  - every page renders with one h1, a canonical URL and an OG image;
  - no broken internal links;
  - 404 handling;
  - the CSP has no violations and every page hydrates under it;
  - axe checks on every page in light and dark;
  - keyboard behaviour;
  - the menu and contact form on a phone, with and without JavaScript.
- **CI** (`.github/workflows/ci.yml`) runs on every push and pull request: install, lint, type check, tests, build, Playwright, Lighthouse, and a Docker image build.
- **Lighthouse** (`lighthouserc.json`) runs on the home page, `/about` and `/solutions`, on mobile settings, three runs each. Every page must score at least 90 for performance, 95 for accessibility and best practices, and 100 for SEO. The home page also has size budgets: at most 150 KB of script and 500 KB in total, transferred.
- **Prefetching and the script budget.** Next.js prefetches a linked page's code when the link scrolls into view. `/contact` and `/solutions` embed the enquiry form, so above-the-fold links to them set `prefetch={prefetchFor(href)}` (`lib/prefetch.ts`), which skips the prefetch. Without that, the form's code loads on the home page and breaks the script budget. Use the helper for any new link to those pages near the top of a page.
- **E2E client IPs.** Each Playwright test sends its own `X-Forwarded-For` address (`tests/e2e/fixtures.ts`), so the per-IP rate limits behave as they would for separate visitors. Import `test` and `expect` from `./fixtures` in any spec that submits a form.

## Project structure

```
app/                  routes, metadata files (OG images, sitemap, robots), API health check
components/ui         primitives (button, logo, icons, badges)
components/layout     header, footer, theme toggle
components/sections   page sections
components/forms      enquiry form (client component)
components/illustrations  the illustrative solutions diagram
content/              all copy and configuration (typed, validated)
lib/                  schemas, env, form services, email, rate limiter, CSP, SEO
proxy.ts              per-page CSP and 404 rewrites
scripts/              two-pass build and CSP manifest
public/press          downloadable logo files
tests/                unit, integration, e2e
```

## Launch checklist

The site must not go to production until every item is done:

- [ ] **Logo**: trademark search done for the mark; press files checked.
- [ ] **Domain and `SITE_URL`**: domain registered, DNS pointed, `SITE_URL` set, site rebuilt.
- [ ] **Email**: Resend account; sending domain verified with SPF, DKIM and DMARC; API key set; a test contact message received.
- [ ] **Legal**: privacy policy and terms completed by legal counsel (search the site for "[To be completed by legal counsel]").
- [ ] **Copy**: every `TODO_COPY` item written or approved (`pnpm copy:todo`, then check `TODO-COPY.md` is empty).
- [ ] **Founder**: spelling of "Omol Andrew Einstein" and the title "Founder" confirmed in `content/company.ts`.
- [ ] **Contact details**: phone number confirmed; WhatsApp number and public email set, or confirmed launching without them.
- [ ] **Social links**: added in `content/company.ts`, or confirmed launching without them.
- [ ] **Redis**: `REDIS_URL` set (or a single-instance self-host with `RATE_LIMIT_STORE=memory`).
- [ ] **Company status**: `registrationStatus` left as `pending` until Alole AI Limited is registered; then set it to `registered` and rebuild.
- [ ] **Final checks**: CI green on the release commit; HTTPS working with no mixed content; the response headers checked on the live domain.
#   a l o l e - a i  
 