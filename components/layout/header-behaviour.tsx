"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Progressive enhancement for the server-rendered header:
 * - marks the header compact once the page scrolls
 * - closes open <details> menus on Escape, outside click, and route change
 *
 * Without JavaScript the header still works: it stays full height and the
 * <details> menus open and close natively.
 */
export function HeaderBehaviour({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLElement>(null);
  const [compact, setCompact] = useState(false);
  const pathname = usePathname();

  // Compact on scroll, via a sentinel at the top of the page.
  useEffect(() => {
    const sentinel = document.getElementById("top-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setCompact(!entry.isIntersecting);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Close menus when the route changes (links inside the panels).
  useEffect(() => {
    ref.current?.querySelectorAll("details[open]").forEach((d) => d.removeAttribute("open"));
  }, [pathname]);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;

    function closeAll(except?: Element) {
      header?.querySelectorAll("details[open]").forEach((d) => {
        if (d !== except) d.removeAttribute("open");
      });
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const open = header?.querySelector<HTMLDetailsElement>("details[open]");
      if (!open) return;
      open.removeAttribute("open");
      open.querySelector<HTMLElement>("summary")?.focus();
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const inside = target instanceof Element ? target.closest("details") : null;
      closeAll(inside ?? undefined);
    }

    // A link inside a panel that points at the current page should also close it.
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (target instanceof Element && target.closest("details a")) closeAll();
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    header.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      header.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <header ref={ref} data-compact={compact ? "" : undefined} className={className}>
      {children}
    </header>
  );
}
