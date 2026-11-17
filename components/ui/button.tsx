import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "inverse-ghost" | "footer";
type Size = "md" | "lg";

/**
 * Pill buttons. Solid ink for the main action, a hairline outline for the
 * secondary one, and a soft tint for quiet actions.
 */
const variants: Record<Variant, string> = {
  primary: "bg-ink text-on-ink hover:bg-ink/85",
  secondary: "border border-line-strong bg-transparent text-ink hover:border-ink hover:bg-ink/[0.04]",
  ghost: "bg-ink/[0.06] text-ink hover:bg-ink/[0.1]",
  /** For use on dark (bg-ink) panels. */
  inverse: "bg-on-ink text-ink hover:bg-on-ink/85",
  /** Outline button for dark (bg-ink) panels. */
  "inverse-ghost": "border border-on-ink/25 text-on-ink hover:border-on-ink/60 hover:bg-on-ink/[0.06]",
  /** Outline button for the footer, which is dark in both themes. */
  footer: "border border-footer-ink/25 text-footer-ink hover:border-footer-ink/60 hover:bg-footer-ink/[0.06]",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-[0.875rem]",
  lg: "h-12 px-6 text-[0.9375rem]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className = ""): string {
  return [
    "btn inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap",
    "transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  ].join(" ");
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ variant, size, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

interface ButtonProps extends Omit<ComponentProps<"button">, "className"> {
  variant?: Variant;
  size?: Size;
  className?: string;
}

export function Button({ variant, size, className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...rest} />;
}
