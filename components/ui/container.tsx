import type { ComponentProps } from "react";

/** Page-width container with the site's horizontal gutter. */
export function Container({ className = "", ...rest }: ComponentProps<"div">) {
  return <div className={`mx-auto w-full max-w-page px-5 sm:px-8 lg:px-16 ${className}`} {...rest} />;
}
