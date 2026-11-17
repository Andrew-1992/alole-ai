import { Container } from "@/components/ui/container";
import type { Pages } from "@/lib/schemas/pages";

const COUNSEL_MARK = "[To be completed by legal counsel]";

/** Highlights the counsel placeholder wherever it appears, so it can't be missed. */
function WithPlaceholders({ text }: { text: string }) {
  const parts = text.split(COUNSEL_MARK);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <mark className="rounded-sm bg-surface-sunken px-1 font-medium text-ink">{COUNSEL_MARK}</mark>
          )}
        </span>
      ))}
    </>
  );
}

export function LegalPage({ copy }: { copy: Pages["privacy"] }) {
  return (
    <Container className="py-14 sm:py-20">
      <article className="mx-auto flex max-w-prose flex-col gap-10">
        <header className="flex flex-col gap-4 border-b border-line pb-10">
          <p className="text-small text-muted">
            <WithPlaceholders text={copy.status} />
          </p>
          <h1 className="font-display text-h1">{copy.heading}</h1>
          <p className="text-lead text-muted">{copy.intro}</p>
        </header>
        {copy.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-4">
            <h2 className="text-h3 font-medium">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p}>
                <WithPlaceholders text={p} />
              </p>
            ))}
            {section.list && (
              <ul className="flex list-disc flex-col gap-2 ps-5">
                {section.list.map((item) => (
                  <li key={item}>
                    <WithPlaceholders text={item} />
                  </li>
                ))}
              </ul>
            )}
            {section.table && (
              <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[40rem] border-collapse text-start text-small">
                  <thead>
                    <tr>
                      {section.table.columns.map((c) => (
                        <th key={c} scope="col" className="border-b border-line-strong py-3 pe-4 text-start font-medium">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row.join("|")}>
                        {row.map((cell, i) =>
                          i === 0 ? (
                            <th key={cell} scope="row" className="border-b border-line py-3 pe-4 text-start align-top font-medium">
                              {cell}
                            </th>
                          ) : (
                            <td key={cell} className="border-b border-line py-3 pe-4 align-top text-muted">
                              {cell}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </article>
    </Container>
  );
}
