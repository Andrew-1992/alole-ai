"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * Copyright year. The server renders the build year (so pages stay fully
 * static and their CSP hashes never change at runtime); the browser swaps in
 * the current year after hydration. Without JavaScript the build year shows,
 * which is correct until the first redeploy of a new year.
 */
export function CopyrightYear({ buildYear }: { buildYear: number }) {
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => buildYear,
  );
  return <>{year}</>;
}
