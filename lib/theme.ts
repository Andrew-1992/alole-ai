/**
 * Theme handling shared by the pre-paint script and the toggle.
 *
 * No stored preference means "follow the system", which CSS handles on its own
 * (works without JavaScript). A stored choice is applied by THEME_SCRIPT before
 * first paint, so there is no flash of the wrong theme.
 */

export const THEME_STORAGE_KEY = "alole-theme";
export type ThemeChoice = "light" | "dark";

/**
 * Runs synchronously in <head>. Keep it tiny and dependency-free.
 * It is a fixed string, so its CSP hash is stable across builds.
 * It also marks <html> with `js` so JS-only controls can be shown.
 */
export const THEME_SCRIPT = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")d.setAttribute("data-theme",t)}catch(e){}})();`;

export function isThemeChoice(value: unknown): value is ThemeChoice {
  return value === "light" || value === "dark";
}
