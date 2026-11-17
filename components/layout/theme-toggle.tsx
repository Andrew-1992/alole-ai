"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/ui/icons";
import { THEME_STORAGE_KEY, isThemeChoice, type ThemeChoice } from "@/lib/theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function readTheme(): ThemeChoice {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (isThemeChoice(explicit)) return explicit;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(DARK_QUERY);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  media.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
  };
}

interface ThemeToggleProps {
  toDarkLabel: string;
  toLightLabel: string;
}

/**
 * Switches between light and dark and remembers the choice.
 * Hidden without JavaScript (it could not work), where the system theme applies.
 */
export function ThemeToggle({ toDarkLabel, toLightLabel }: ThemeToggleProps) {
  // Server snapshot is null: the button renders a neutral label until hydrated.
  const theme = useSyncExternalStore<ThemeChoice | null>(subscribe, readTheme, () => null);
  const next: ThemeChoice = theme === "dark" ? "light" : "dark";

  function toggle() {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the change still applies for this page.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={next === "dark" ? toDarkLabel : toLightLabel}
      className="js-only inline-flex size-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink"
    >
      {/* Icons follow CSS theme state, so they are right even before hydration. */}
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </button>
  );
}
