/**
 * Inline stroke icons. Decorative by default (aria-hidden); the surrounding
 * control provides the accessible name.
 */
interface IconProps {
  size?: number;
  className?: string;
}

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
} as const;

/** Arrow pointing in the inline direction; flips automatically in RTL. */
export function ArrowIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 16 16" className={`rtl:-scale-x-100 ${className ?? ""}`}>
      <path d="M3 8h9.5M8.5 4l4 4-4 4" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 12, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 12 12" className={className}>
      <path d="M3 4.5 6 7.5 9 4.5" />
    </svg>
  );
}

export function MenuIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 18 18" className={className}>
      <path d="M2.5 6h13M2.5 12h13" />
    </svg>
  );
}

export function CloseIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 18 18" className={className}>
      <path d="M4 4l10 10M14 4 4 14" />
    </svg>
  );
}

export function MoonIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export function SunIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </svg>
  );
}

export function PlusIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 16 16" className={className}>
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

export function PauseIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 14 14" className={className}>
      <path d="M4.5 3v8M9.5 3v8" />
    </svg>
  );
}

export function PlayIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 14 14" className={className}>
      <path d="M4 2.5v9l7.5-4.5z" />
    </svg>
  );
}
