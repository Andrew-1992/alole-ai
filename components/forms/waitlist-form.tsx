"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef } from "react";
import { buttonClasses } from "@/components/ui/button";
import { joinWaitlist } from "@/lib/actions/waitlist";
import { trackFormSubmission } from "@/lib/analytics";
import { HONEYPOT_FIELD, initialWaitlistState, type WaitlistState } from "@/lib/forms/waitlist-state";
import type { Ui } from "@/lib/schemas/content";

interface WaitlistFormProps {
  copy: Ui["waitlist"];
  products: { slug: string; name: string }[];
  /** Products ticked by default, e.g. the current product page. */
  preselected?: string[];
  privacyHref: string;
  /**
   * URL of the page holding the form. Before JavaScript loads (or without it),
   * the browser posts here and the server renders the result into the page.
   */
  permalink: string;
}

/**
 * Waitlist signup. A real <form> bound to a Server Action, so it submits
 * without JavaScript; with JavaScript it updates in place.
 */
export function WaitlistForm({ copy, products, preselected = [], privacyHref, permalink }: WaitlistFormProps) {
  const [state, formAction, pending] = useActionState<WaitlistState, FormData>(
    joinWaitlist,
    initialWaitlistState,
    permalink,
  );
  const id = useId();
  const statusRef = useRef<HTMLDivElement>(null);

  // Move focus to the outcome so keyboard and screen-reader users hear it.
  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
    if (state.status === "success") trackFormSubmission("waitlist");
  }, [state]);

  const invalid = state.status === "invalid" ? state : null;
  const values = invalid?.values;
  const checked = new Set(values?.interests ?? preselected);

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="flex items-start gap-3 rounded-xl bg-surface p-6 text-body focus:outline-none"
      >
        <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 rounded-full bg-accent" />
        <p>{copy.success}</p>
      </div>
    );
  }

  const errorText =
    state.status === "invalid"
      ? copy.errorSummary
      : state.status === "rate_limited"
        ? copy.rateLimited
        : state.status === "error"
          ? copy.serverError
          : "";

  const fieldError = (field: "email" | "name" | "interests") => {
    const code = invalid?.fieldErrors[field];
    return code ? copy.fieldErrors[code] : undefined;
  };
  const emailError = fieldError("email");
  const nameError = fieldError("name");
  const interestsError = fieldError("interests");

  const inputClass = (hasError: boolean) =>
    `h-12 w-full rounded-md border bg-surface px-3.5 text-body text-ink placeholder:text-muted/80 transition-colors focus:border-ink ${
      hasError ? "border-danger" : "border-line-strong"
    }`;

  return (
    <form action={formAction} noValidate className="relative flex flex-col gap-6" aria-describedby={`${id}-status`}>
      <div ref={statusRef} tabIndex={-1} id={`${id}-status`} aria-live="polite" className="focus:outline-none">
        {errorText && (
          <p className="rounded-md border border-danger px-4 py-3 text-small text-danger" role="alert">
            {errorText}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-email`} className="text-small font-medium">
            {copy.emailLabel}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={254}
            defaultValue={values?.email ?? ""}
            placeholder={copy.emailPlaceholder}
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? `${id}-email-error` : undefined}
            className={inputClass(Boolean(emailError))}
          />
          {emailError && (
            <p id={`${id}-email-error`} className="text-small text-danger">
              {emailError}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-name`} className="text-small font-medium">
            {copy.nameLabel} <span className="font-normal text-muted">{copy.optionalSuffix}</span>
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            defaultValue={values?.name ?? ""}
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? `${id}-name-error` : undefined}
            className={inputClass(Boolean(nameError))}
          />
          {nameError && (
            <p id={`${id}-name-error`} className="text-small text-danger">
              {nameError}
            </p>
          )}
        </div>
      </div>

      <fieldset
        className="flex flex-col gap-3"
        aria-describedby={interestsError ? `${id}-interests-error` : undefined}
      >
        <legend className="mb-3 text-small font-medium">{copy.interestsLegend}</legend>
        <div className="flex flex-wrap gap-2">
          {products.map((product) => (
            <label
              key={product.slug}
              className="relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line-strong px-4 text-small font-medium transition-colors hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-on-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
            >
              <input
                type="checkbox"
                name="interests"
                value={product.slug}
                defaultChecked={checked.has(product.slug)}
                className="peer sr-only"
              />
              {product.name}
            </label>
          ))}
        </div>
        {interestsError && (
          <p id={`${id}-interests-error`} className="text-small text-danger">
            {interestsError}
          </p>
        )}
      </fieldset>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-hp`}>{copy.honeypotLabel}</label>
        <input id={`${id}-hp`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <button type="submit" disabled={pending} className={buttonClasses("primary", "lg", "sm:w-auto")}>
          {pending ? copy.submitting : copy.submit}
        </button>
        <p className="text-small text-muted">
          {copy.consent}{" "}
          <Link href={privacyHref} className="rounded-sm text-ink underline underline-offset-2 hover:text-accent-ink">
            {copy.privacyLinkText}
          </Link>
        </p>
      </div>
    </form>
  );
}
