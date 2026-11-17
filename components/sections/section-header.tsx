import type { ReactNode } from "react";

interface SectionHeaderProps {
  id: string;
  heading: string;
  intro?: string;
  /** Small mono label above the heading. */
  eyebrow?: string;
  /** Action on the right on wide screens (a link or button). */
  action?: ReactNode;
}

/** Section title row: serif heading and intro on the left, one action on the right. */
export function SectionHeader({ id, heading, intro, eyebrow, action }: SectionHeaderProps) {
  return (
    <div data-reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
      <div className="flex max-w-2xl flex-col gap-4">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id} className="font-display text-h1 text-balance">
          {heading}
        </h2>
        {intro && <p className="text-lead text-pretty text-muted">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
