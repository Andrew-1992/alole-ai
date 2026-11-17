"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowIcon, PauseIcon, PlayIcon } from "@/components/ui/icons";
import type { Solutions } from "@/lib/schemas/content";

interface SolutionsDiagramProps {
  copy: Solutions["diagram"];
  caption: string;
  /** Panel colour: "surface" (white) on paper backgrounds, "paper" on white ones. */
  tone?: "surface" | "paper";
}

const STEP_MS = 2600;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** A connector arrow: points across on wide screens and down on phones. Lights up while work flows. */
function Connector({ live }: { live: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center py-1 transition-colors duration-300 lg:px-2 lg:py-0 ${
        live ? "text-accent" : "text-muted"
      }`}
    >
      <ArrowIcon size={20} className={`rotate-90 lg:rotate-0 ${live ? "diagram-flow" : ""}`} />
    </div>
  );
}

/**
 * Interactive diagram: an organisation's existing systems connect to an AI
 * layer, which does the work. Choosing a system lights up its path to the
 * result. Until someone chooses, it steps through the systems on its own
 * (not under reduced motion, not off screen, and with a pause button).
 *
 * Without JavaScript it renders as a plain, readable diagram.
 */
export function SolutionsDiagram({ copy, caption, tone = "surface" }: SolutionsDiagramProps) {
  const [active, setActive] = useState<number | null>(null);
  const [autoplay, setAutoplay] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION);
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), {
      threshold: 0.3,
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const running = autoplay && !reducedMotion && visible;
  const count = copy.systems.length;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setActive((i) => (i === null ? 0 : (i + 1) % count)), STEP_MS);
    return () => window.clearInterval(timer);
  }, [running, count]);

  function choose(index: number) {
    setAutoplay(false);
    setActive(index);
    const system = copy.systems[index];
    const outcome = system ? copy.outcomes[system.outcome] : undefined;
    if (system && outcome) {
      setAnnouncement(copy.announce.replace("{system}", system.name).replace("{outcome}", outcome));
    }
  }

  const activeOutcome = active === null ? null : (copy.systems[active]?.outcome ?? null);
  const live = active !== null;
  const panel = tone === "surface" ? "bg-surface shadow-sm" : "bg-paper";
  const itemBase = tone === "surface" ? "bg-paper" : "bg-surface";
  const itemClass = (on: boolean) =>
    `w-full rounded-lg border px-3.5 py-2.5 text-start text-small transition-[border-color,background-color,color,translate] duration-300 ${
      on ? "border-accent bg-accent/10 text-ink lg:translate-x-1" : `border-line ${itemBase}`
    }`;

  return (
    <figure ref={rootRef} className="flex flex-col gap-3">
      <p className="sr-only">{copy.alt}</p>
      <div
        className={`grid items-center gap-2 rounded-2xl p-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,0.9fr)_auto_minmax(0,1fr)] lg:p-6 ${panel}`}
      >
        <div className="flex flex-col gap-2">
          <p className="text-[0.75rem] font-medium text-muted">{copy.systemsLabel}</p>
          <ul className="flex flex-col gap-2">
            {copy.systems.map((system, i) => (
              <li key={system.name}>
                <button
                  type="button"
                  aria-pressed={active === i}
                  onClick={() => choose(i)}
                  className={`${itemClass(active === i)} cursor-pointer hover:border-ink/40`}
                >
                  {system.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <Connector live={live} />
        <div
          className={`flex flex-col gap-2 rounded-xl bg-ink p-4 text-on-ink transition-shadow duration-300 ${
            live ? "shadow-[0_0_0_6px_color-mix(in_oklab,var(--accent)_25%,transparent)]" : ""
          }`}
        >
          <span
            aria-hidden="true"
            className={`size-2.5 rounded-full bg-accent ${live && !reducedMotion ? "animate-pulse" : ""}`}
          />
          <p className="text-h3 font-medium">{copy.coreLabel}</p>
          <p className="text-small text-on-ink/75">{copy.coreDetail}</p>
        </div>
        <Connector live={live} />
        <div className="flex flex-col gap-2">
          <p className="text-[0.75rem] font-medium text-muted">{copy.outcomesLabel}</p>
          <ul className="flex flex-col gap-2">
            {copy.outcomes.map((outcome, i) => (
              <li key={outcome} className={itemClass(activeOutcome === i)}>
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <figcaption className="text-label text-muted">{caption}</figcaption>
        <div className="js-only flex items-center gap-3">
          <p className="text-small text-muted">{copy.hint}</p>
          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setAutoplay((on) => !on)}
              aria-label={autoplay ? copy.pauseLabel : copy.playLabel}
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink/[0.06] text-ink transition-colors hover:bg-ink/[0.12]"
            >
              {autoplay ? <PauseIcon /> : <PlayIcon />}
            </button>
          )}
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </figure>
  );
}
