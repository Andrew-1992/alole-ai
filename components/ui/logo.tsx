/**
 * Alole logo: the mark (one continuous rounded line forming an "a", turned on
 * its corner) and the name "Alole" (Instrument Sans 600, outlined to paths).
 * The mark takes the brand accent; the name takes the text colour.
 *
 * Every usage on the site goes through this file: <Logo> in the header and
 * footer, and the exported shapes for the generated social images. The same
 * artwork is in app/icon.svg and public/press/.
 */

/** "Alole", Instrument Sans 600, cap height 720 units, tracking -0.02em. */
export const NAME_PATH =
  "M24 720 249 0H353L146 720ZM494 720 288 0H399L624 720ZM146 442H495V542H146ZM689 720V0H812V720ZM1127 730Q1053 730 997 696Q941 662 910 601.5Q879 541 879 463Q879 384 910 325Q941 266 997 233Q1053 200 1127 200Q1202 200 1258 233Q1314 266 1344.5 325Q1375 384 1375 463Q1375 541 1344 601.5Q1313 662 1257.5 696Q1202 730 1127 730ZM1127 632Q1163 632 1190 612Q1217 592 1232.5 554Q1248 516 1248 462Q1248 382 1214.5 340Q1181 298 1127 298Q1074 298 1040 340.5Q1006 383 1006 462Q1006 516 1021.5 554Q1037 592 1064.5 612Q1092 632 1127 632ZM1442 720V0H1565V720ZM1876 730Q1803 730 1748 696.5Q1693 663 1662.5 603Q1632 543 1632 464Q1632 385 1662.5 325.5Q1693 266 1748.5 233Q1804 200 1877 200Q1947 200 1997.5 231Q2048 262 2075 318.5Q2102 375 2102 454Q2102 467 2101.5 478Q2101 489 2099 500H1709V414H2011L1984 442Q1984 365 1955.5 328.5Q1927 292 1875 292Q1819 292 1787.5 336Q1756 380 1756 465Q1756 551 1787 594.5Q1818 638 1878 638Q1915 638 1940.5 620.5Q1966 603 1977 568H2091Q2071 642 2016 686Q1961 730 1876 730Z";
/** viewBox of the name alone (used for the footer signature). */
export const NAME_VIEW_BOX = "0 -60 2110 800";

/** The mark, drawn as a stroke in a 100-unit square, then turned 45°. */
export const MARK_PATH =
  "M30 10.5H78A12 12 0 0 1 90 22.5V78.5A12 12 0 0 1 78 90.5H22A12 12 0 0 1 10 78.5V62A12 12 0 0 1 22 50H70";
export const MARK_STROKE = 19.5;
/** The rounded end of the line (the path itself ends flat at the other end). */
export const MARK_CAP = { cx: 30, cy: 10.5, r: MARK_STROKE / 2 } as const;
/** Places the mark, turned, centred in a 120 × 120 box. */
export const MARK_TRANSFORM = "matrix(0.6 -0.6 0.6 0.6 -4.14 59.81)";
export const MARK_VIEW_BOX = "0 0 120 120";

/** The mark's shapes in one colour. Plain SVG, so it also works in the social-image renderer. */
export function markShapes(color: string) {
  return (
    <g transform={MARK_TRANSFORM}>
      <path d={MARK_PATH} fill="none" stroke={color} strokeWidth={MARK_STROKE} />
      <circle cx={MARK_CAP.cx} cy={MARK_CAP.cy} r={MARK_CAP.r} fill={color} />
    </g>
  );
}

/** Where the mark sits beside the name, in the name's units (cap height 720). */
const LOCKUP_MARK = "translate(-1160 -140) scale(8.3333)";
export const LOGO_VIEW_BOX = "-1070 -80 3175 880";
export const LOGO_RATIO = 3175 / 880;

/** Mark and name for an SVG renderer, in explicit colours. */
export function logoShapes(text: string, accent: string) {
  return (
    <>
      <g transform={LOCKUP_MARK}>{markShapes(accent)}</g>
      <path fill={text} d={NAME_PATH} />
    </>
  );
}

interface LogoProps {
  /** Rendered height in CSS pixels. Width follows the artwork's ratio. */
  height?: number;
  className?: string;
  /** Accessible name. Omit when a surrounding link already provides one. */
  title?: string;
}

/** The full logo: mark and name. */
export function Logo({ height = 22, className, title }: LogoProps) {
  const labelled = title !== undefined;
  return (
    <svg
      viewBox={LOGO_VIEW_BOX}
      height={height}
      width={Math.round(height * LOGO_RATIO)}
      className={className}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
    >
      <g transform={LOCKUP_MARK}>{markShapes("var(--accent)")}</g>
      <path fill="currentColor" d={NAME_PATH} />
    </svg>
  );
}
