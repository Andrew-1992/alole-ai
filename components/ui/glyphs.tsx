/**
 * Line icons for services and audiences. Decorative: every use sits next to
 * visible text that names the thing, so they are hidden from assistive tech.
 * Drawn on a 24-unit grid with a 1.5 stroke; colour follows `currentColor`.
 */

interface GlyphProps {
  size?: number;
  className?: string;
}

function Svg({ size = 24, className, children }: GlyphProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

/** Businesses (storefront). */
function Storefront(props: GlyphProps) {
  return (
    <Svg {...props}>
      <path d="M4 10v9.5h16V10" />
      <path d="M3 10h18l-1.6-5.5H4.6L3 10Z" />
      <path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <path d="M10 19.5v-5h4v5" />
    </Svg>
  );
}

/** NGOs and development organisations (people). */
function People(props: GlyphProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
      <circle cx="16.5" cy="9.5" r="2.5" />
      <path d="M15.5 14.6a4.5 4.5 0 0 1 5 4.9" />
    </Svg>
  );
}

/** Public institutions (columned building). */
function Institution(props: GlyphProps) {
  return (
    <Svg {...props}>
      <path d="M3 9.5 12 4l9 5.5H3Z" />
      <path d="M5.5 9.5v8M10 9.5v8M14 9.5v8M18.5 9.5v8" />
      <path d="M3.5 20h17" />
    </Svg>
  );
}

const AUDIENCE_GLYPHS = [Storefront, People, Institution];

/** Icon for the nth "Who we work with" item (businesses, NGOs, public institutions). */
export function AudienceGlyph({ index, ...props }: GlyphProps & { index: number }) {
  const Glyph = AUDIENCE_GLYPHS[index] ?? Storefront;
  return <Glyph {...props} />;
}

/** AI agents (an agent: a face with a signal). */
function Agent(props: GlyphProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="8" width="16" height="12" rx="4" />
      <path d="M12 8V4.5" />
      <circle cx="12" cy="3.5" r="1" />
      <path d="M9 13.5v1M15 13.5v1" />
      <path d="M10 17h4" />
    </Svg>
  );
}

/** AI automation (a loop that runs by itself). */
function Loop(props: GlyphProps) {
  return (
    <Svg {...props}>
      <path d="M20 12a8 8 0 0 1-13.7 5.6" />
      <path d="M4 12a8 8 0 0 1 13.7-5.6" />
      <path d="M17.5 3v3.6h-3.6" />
      <path d="M6.5 21v-3.6h3.6" />
    </Svg>
  );
}

/** AI integration (two systems joined). */
function Link2(props: GlyphProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
      <path d="M10 6.5h4.5a3 3 0 0 1 3 3V14" />
      <path d="M14 17.5H9.5a3 3 0 0 1-3-3V10" />
    </Svg>
  );
}

export type CapabilityKind = "agents" | "automation" | "integration";

const CAPABILITY_GLYPHS: Record<CapabilityKind, (props: GlyphProps) => React.ReactElement> = {
  agents: Agent,
  automation: Loop,
  integration: Link2,
};

export function CapabilityGlyph({ kind, ...props }: GlyphProps & { kind: CapabilityKind }) {
  const Glyph = CAPABILITY_GLYPHS[kind];
  return <Glyph {...props} />;
}

/** Glyph for a solutions service, by its id. */
export function ServiceGlyph({ id, ...props }: GlyphProps & { id: "automation" | "integration" | "custom-agent" }) {
  const kind: CapabilityKind = id === "custom-agent" ? "agents" : id;
  return <CapabilityGlyph kind={kind} {...props} />;
}
