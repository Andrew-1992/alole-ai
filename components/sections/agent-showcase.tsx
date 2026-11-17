"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { PauseIcon, PlayIcon } from "@/components/ui/icons";

export interface AgentShowcaseItem {
  key: string;
  name: string;
  task: string;
  panel: ReactNode;
}

interface AgentShowcaseProps {
  items: AgentShowcaseItem[];
  pauseLabel: string;
  playLabel: string;
  /** Milliseconds each agent stays on screen while playing. */
  interval?: number;
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const REDUCED_DATA = "(prefers-reduced-data: reduce)";

/** True when the browser asks to save data (Save-Data / Data Saver, or prefers-reduced-data). */
function prefersDataSaving(): boolean {
  // navigator.connection is not in every browser or in TypeScript's DOM types.
  const connection: unknown = Reflect.get(navigator, "connection");
  const saveData =
    typeof connection === "object" && connection !== null && "saveData" in connection && connection.saveData === true;
  return saveData || window.matchMedia(REDUCED_DATA).matches;
}

/**
 * Cycles through the agent illustrations.
 *
 * - Timing comes from a CSS progress bar; its `animationend` advances to the
 *   next agent, so pausing the bar pauses the cycle with no timers to sync.
 * - Starts on a still frame under prefers-reduced-motion or when the browser
 *   asks to save data (Play still works), and pauses while off screen or in a
 *   background tab.
 * - Without JavaScript, CSS shows every panel at once (see globals.css).
 */
export function AgentShowcase({ items, pauseLabel, playLabel, interval = 5000 }: AgentShowcaseProps) {
  const [active, setActive] = useState(0);
  /** null = no explicit choice yet; then the default follows reduced-motion. */
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  /** Reduced motion or data saving: start on a still frame. */
  const [stillByDefault, setStillByDefault] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION);
    const update = () => setStillByDefault(media.matches || prefersDataSaving());
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? true), {
      threshold: 0.25,
    });
    observer.observe(root);
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Starts on a still frame when asked to; an explicit Play still works.
  const playing = userPlaying ?? !stillByDefault;
  const running = playing && visible;

  function select(index: number) {
    setActive((index + items.length) % items.length);
  }

  function onTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    let next: number | null = null;
    if (event.key === forward || event.key === "ArrowDown") next = index + 1;
    if (event.key === back || event.key === "ArrowUp") next = index - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    if (next === null) return;
    event.preventDefault();
    const target = (next + items.length) % items.length;
    select(target);
    // Choosing an agent is a deliberate action; stop auto-advancing.
    setUserPlaying(false);
    document.getElementById(`${baseId}-tab-${target}`)?.focus();
  }

  return (
    <div ref={rootRef} className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div className="js-only flex flex-col gap-4">
        <div role="tablist" aria-orientation="vertical" className="flex flex-col">
          {items.map((item, i) => {
            const selected = i === active;
            return (
              <button
                key={item.key}
                id={`${baseId}-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${i}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => {
                  select(i);
                  setUserPlaying(false);
                }}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className={`relative flex min-h-14 flex-col items-start gap-0.5 border-b border-line py-3 text-start transition-colors ${
                  selected ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                <span className="font-medium">{item.name}</span>
                <span className="tabular-nums text-label">{item.task}</span>
                {selected && (
                  <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 overflow-hidden bg-line">
                    <span
                      // Re-keyed so the bar restarts whenever the agent changes.
                      key={`${active}-${String(playing)}`}
                      className="agent-progress block h-full origin-left bg-accent rtl:origin-right"
                      data-running={running ? "" : undefined}
                      data-static={playing ? undefined : ""}
                      style={{ animationDuration: `${interval}ms` }}
                      onAnimationEnd={() => select(active + 1)}
                    />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setUserPlaying(!playing)}
          className="inline-flex h-10 w-fit items-center gap-2 rounded-full border border-line-strong px-4 text-small font-medium text-ink hover:border-ink"
          aria-pressed={!playing}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
          {playing ? pauseLabel : playLabel}
        </button>
      </div>

      <div className="agent-panels grid gap-6 sm:grid-cols-2 lg:block">
        {items.map((item, i) => (
          <div
            key={item.key}
            id={`${baseId}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${i}`}
            data-agent-panel
            data-active={i === active ? "" : undefined}
            className="h-full"
          >
            {item.panel}
          </div>
        ))}
      </div>
    </div>
  );
}
