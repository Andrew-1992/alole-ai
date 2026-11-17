/**
 * Marks copy that was not supplied in the brief and was written in the brand
 * voice, so it can be reviewed before launch. It returns the text unchanged.
 *
 * List every marked item with `pnpm copy:todo` (writes TODO-COPY.md).
 * Once a line is approved, remove the wrapper.
 */
export function TODO_COPY(text: string): string {
  return text;
}
