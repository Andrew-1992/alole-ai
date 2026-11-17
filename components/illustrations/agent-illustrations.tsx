import type { Illustrations, ProductAccent } from "@/lib/schemas/content";
import { Bar, IllustrationFrame } from "./illustration-frame";

interface Props<K extends ProductAccent> {
  copy: Illustrations[K];
  caption: string;
  className?: string;
}

export function YaudeIllustration({ copy, caption, className }: Props<"yaude">) {
  return (
    <IllustrationFrame alt={copy.alt} label={copy.label} accent="yaude" caption={caption} className={className}>
      <p className="max-w-[80%] self-end rounded-md bg-surface-sunken px-3.5 py-2.5 text-small">{copy.request}</p>
      <div className="flex flex-col gap-2.5 rounded-md border border-line bg-paper p-4">
        <div className="flex items-center gap-2.5">
          <span className="size-7 rounded-full bg-line" />
          <Bar width="7rem" />
        </div>
        <p className="text-small">{copy.draft}</p>
        <span className="block h-20 rounded-sm bg-surface-sunken" />
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
        <span className="rounded-sm border border-line-strong px-3 py-2 text-small">{copy.schedule}</span>
        <span className="rounded-full bg-yaude px-3.5 py-2 text-small font-medium text-surface">{copy.approve}</span>
      </div>
    </IllustrationFrame>
  );
}

export function BluckFliesIllustration({ copy, caption, className }: Props<"bluckflies">) {
  return (
    <IllustrationFrame
      alt={copy.alt}
      label={copy.label}
      accent="bluckflies"
      caption={caption}
      className={className}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-h3 font-medium tracking-tight">{copy.route}</span>
        <span className="text-small text-muted">{copy.routeDetail}</span>
      </div>
      <ul className="flex flex-col gap-2">
        {copy.options.map((option, i) => (
          <li
            key={option}
            className={`flex items-center gap-3 rounded-md bg-paper px-3.5 py-3 ${
              i === 0 ? "border-[1.5px] border-bluckflies" : "border border-line"
            }`}
          >
            <span className="flex flex-1 flex-col gap-1.5">
              <span className="text-small font-medium">{option}</span>
              <Bar width={["5.5rem", "4.5rem", "6rem"][i] ?? "5rem"} />
            </span>
            {i === 0 && <span className="text-label font-medium text-bluckflies">{copy.bestFit}</span>}
            <Bar width="3.25rem" tone="strong" />
          </li>
        ))}
      </ul>
      <p className="mt-auto self-start rounded-md bg-surface-sunken px-3.5 py-2.5 text-small">{copy.reply}</p>
    </IllustrationFrame>
  );
}

export function KodipIllustration({ copy, caption, className }: Props<"kodip">) {
  return (
    <IllustrationFrame alt={copy.alt} label={copy.label} accent="kodip" caption={caption} className={className}>
      {/* Code is always shown left-to-right, whatever the page direction. */}
      <pre
        dir="ltr"
        className="overflow-hidden rounded-md bg-code p-3.5 font-mono text-[0.75rem] leading-relaxed whitespace-pre text-code-fg"
      >
        {copy.code}
      </pre>
      <ol className="flex flex-col gap-1.5 text-small">
        {copy.steps.map((step, i) => {
          const done = i < copy.steps.length - 1;
          return (
            <li key={step} className={`flex items-center gap-2 ${done ? "" : "text-muted"}`}>
              <span
                className={`size-2 ${done ? "bg-kodip" : "border-[1.5px] border-muted"}`}
                aria-hidden="true"
              />
              {step}
            </li>
          );
        })}
      </ol>
    </IllustrationFrame>
  );
}

export function ManasIllustration({ copy, caption, className }: Props<"manas">) {
  return (
    <IllustrationFrame alt={copy.alt} label={copy.label} accent="manas" caption={caption} className={className}>
      <span className="text-small text-muted">{copy.lessonTitle}</span>
      <p className="text-[0.9375rem]">{copy.explanation}</p>
      <div className="flex flex-col gap-2 rounded-md border border-line bg-paper p-3.5">
        <span className="text-small font-medium">{copy.question}</span>
        {copy.options.map((option, i) => {
          const correct = i === copy.correctIndex;
          return (
            <span
              key={option}
              className={`rounded-sm px-3 py-2 text-small ${
                correct ? "border-[1.5px] border-manas font-medium" : "border border-line"
              }`}
            >
              {correct ? `${option} · ${copy.correctLabel}` : option}
            </span>
          );
        })}
      </div>
    </IllustrationFrame>
  );
}
