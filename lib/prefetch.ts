/**
 * Viewport prefetch policy for links.
 *
 * Next.js prefetches a linked page's code as soon as the link scrolls into
 * view. Pages that embed the enquiry form (/contact and /solutions) would then
 * pull the form's code into every page that links to them above the fold,
 * which pushes the home page past its 150 KB script budget (lighthouserc.json).
 * Those pages are static, so following such a link stays fast without it.
 *
 * Returns the value for <Link prefetch>: `false` to skip prefetching,
 * `undefined` to keep Next's default.
 */
const FORM_ROUTES = ["/contact", "/solutions"] as const;

export function prefetchFor(href: string): false | undefined {
  const path = href.split(/[?#]/, 1)[0] ?? href;
  return FORM_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`),
  )
    ? false
    : undefined;
}
