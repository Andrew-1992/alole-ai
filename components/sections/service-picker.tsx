"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/ui/icons";
import { buttonClasses } from "@/components/ui/button";
import type { ProjectTimeline } from "@/lib/forms/options";
import type { Home, ServiceId, Solutions } from "@/lib/schemas/content";

interface ServicePickerProps {
  copy: Home["picker"];
  services: Solutions["services"];
  /** Enquiry page the result links to, with the answers in the URL hash. */
  projectHref: string;
}

/**
 * The goal (first answer) decides the suggestion; where the work happens
 * (second answer) adds a second service worth a look when it differs.
 * Nothing is stored or sent: the answers only pre-fill the enquiry form
 * through the link's URL hash.
 */
export function suggestServices(answers: readonly ServiceId[]): { main?: ServiceId; also?: ServiceId } {
  const [main, second] = answers;
  return { main, also: second !== undefined && second !== main ? second : undefined };
}

export function ServicePicker({ copy, services, projectHref }: ServicePickerProps) {
  const [answers, setAnswers] = useState<ServiceId[]>([]);
  const [timeline, setTimeline] = useState<ProjectTimeline | null>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  const total = copy.questions.length + 1;
  const step = answers.length < copy.questions.length ? answers.length : timeline === null ? copy.questions.length : total;
  const done = step === total;

  // After an answer, move focus to the new step so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (moved.current) stepRef.current?.focus();
  }, [step]);

  function answer(service: ServiceId) {
    moved.current = true;
    setAnswers((xs) => [...xs, service]);
  }
  function chooseTimeline(value: ProjectTimeline) {
    moved.current = true;
    setTimeline(value);
  }
  function back() {
    moved.current = true;
    if (timeline !== null) setTimeline(null);
    else setAnswers((xs) => xs.slice(0, -1));
  }
  function restart() {
    moved.current = true;
    setAnswers([]);
    setTimeline(null);
  }

  const picked = suggestServices(answers);
  const suggestion = done ? services.find((s) => s.id === picked.main) : undefined;
  const also = done ? services.find((s) => s.id === picked.also) : undefined;
  const question = copy.questions[step];
  const progress = copy.progress.replace("{current}", String(Math.min(step + 1, total))).replace("{total}", String(total));
  const option =
    "lift group flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border border-line bg-paper px-5 py-4 text-start font-medium transition-colors hover:border-ink/40";

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-surface p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-4 text-small text-muted">
        <span aria-hidden={done} className={done ? "flex items-center gap-2 text-accent-ink" : undefined}>
          {done && <span className="size-2 rounded-full bg-accent" />}
          {done ? copy.resultLabel : progress}
        </span>
        {step > 0 && !done && (
          <button type="button" onClick={back} className="cursor-pointer rounded-full font-medium text-ink hover:underline">
            {copy.back}
          </button>
        )}
      </div>
      <div aria-hidden="true" className="h-1 overflow-hidden rounded-full bg-ink/[0.06]">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: `${(Math.min(step, total) / total) * 100}%` }}
        />
      </div>

      <div key={step} ref={stepRef} tabIndex={-1} className="picker-step flex flex-col gap-4 focus:outline-none">
        {question && (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-h3 font-medium">{question.legend}</legend>
            {question.options.map((o) => (
              <button key={o.label} type="button" onClick={() => answer(o.service)} className={option}>
                {o.label}
                <ArrowIcon size={16} className="nudge-icon shrink-0 text-muted transition-transform" />
              </button>
            ))}
          </fieldset>
        )}

        {!question && !done && (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-h3 font-medium">{copy.timeline.legend}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {copy.timeline.options.map((o) => (
                <button key={o.value} type="button" onClick={() => chooseTimeline(o.value)} className={option}>
                  {o.label}
                  <ArrowIcon size={16} className="nudge-icon shrink-0 text-muted transition-transform" />
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {suggestion && timeline && (
          <div role="status" className="flex flex-col gap-4">
            <p className="font-display text-h2">
              <span className="sr-only">{copy.resultLabel}: </span>
              {suggestion.name}
            </p>
            <p className="text-muted">{suggestion.summary}</p>
            <p className="text-small text-muted">{suggestion.example}</p>
            {also && (
              <p className="rounded-xl bg-paper px-4 py-3 text-small">
                <span className="font-medium">{copy.alsoLabel}:</span> {also.name}. {also.summary}
              </p>
            )}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <Link
                href={`${projectHref}#service=${suggestion.id}&timeline=${timeline}`}
                prefetch={false}
                className={buttonClasses("primary", "lg")}
              >
                {copy.resultCta}
                <ArrowIcon size={16} />
              </Link>
              <button type="button" onClick={restart} className={buttonClasses("secondary", "lg", "cursor-pointer")}>
                {copy.restart}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
