"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { sendContactMessage } from "@/lib/actions/contact";
import { trackFormSubmission } from "@/lib/analytics";
import { initialContactState, type ContactField, type ContactState } from "@/lib/forms/contact-state";
import { CLIENT_PROJECT, PROJECT_SERVICES, PROJECT_TIMELINES } from "@/lib/forms/options";
import type { ContactTopic, Pages } from "@/lib/schemas/pages";

interface EnquiryFormProps {
  copy: Pages["contact"]["form"];
  topics: { value: ContactTopic; label: string }[];
  defaultTopic: ContactTopic;
  privacyHref: string;
  /** Page URL the form posts to before (or without) JavaScript. */
  permalink: string;
}

/**
 * The shared enquiry form (Contact, Solutions). A real <form> bound to a
 * Server Action, so it works without JavaScript.
 *
 * Client-project fields (service, timeline) show only for that topic once
 * JavaScript runs. Without JavaScript every field shows, the project fields
 * are marked optional, and the server ignores them for other topics.
 */
export function EnquiryForm({ copy, topics, defaultTopic, privacyHref, permalink }: EnquiryFormProps) {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    sendContactMessage,
    initialContactState,
    permalink,
  );
  const invalid = state.status === "invalid" ? state : null;
  const values = invalid?.values;
  const echoedTopic = topics.find((t) => t.value === values?.topic)?.value;
  const [topic, setTopic] = useState<ContactTopic>(echoedTopic ?? defaultTopic);
  const id = useId();
  const statusRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const timelineRef = useRef<HTMLSelectElement>(null);
  const isProject = topic === CLIENT_PROJECT;

  // Pre-fill from the home page's service picker, which links to the Client
  // project form with "#service=automation&timeline=later". Read once on mount;
  // values are checked against the allowed options. The selects are
  // uncontrolled, so later choices are never overwritten.
  useEffect(() => {
    if (values) return;
    const params = new URLSearchParams(window.location.hash.slice(1));
    const service = params.get("service");
    const timeline = params.get("timeline");
    const validService = service !== null && (PROJECT_SERVICES as readonly string[]).includes(service);
    const validTimeline = timeline !== null && (PROJECT_TIMELINES as readonly string[]).includes(timeline);
    if (!validService && !validTimeline) return;
    if (validService && serviceRef.current) serviceRef.current.value = service;
    if (validTimeline && timelineRef.current) timelineRef.current.value = timeline;
  }, [values]);

  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
    if (state.status === "success") trackFormSubmission("enquiry", state.topic);
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="flex items-start gap-3 rounded-xl bg-surface p-6 focus:outline-none"
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

  const errorFor = (field: ContactField) => {
    const code = invalid?.fieldErrors[field];
    return code ? copy.fieldErrors[code] : undefined;
  };
  const describe = (field: ContactField, extra?: string) =>
    [errorFor(field) ? `${id}-${field}-error` : undefined, extra].filter(Boolean).join(" ") || undefined;
  const control = (field: ContactField) =>
    `w-full rounded-md border bg-surface px-3.5 text-body text-ink transition-colors focus:border-ink ${
      errorFor(field) ? "border-danger" : "border-line-strong"
    }`;
  const fieldErrorNode = (field: ContactField) => {
    const text = errorFor(field);
    return text ? (
      <p id={`${id}-${field}-error`} className="text-small text-danger">
        {text}
      </p>
    ) : null;
  };
  const label = "text-small font-medium";
  const suffix = "font-normal text-muted";

  const [noteBefore = "", noteAfter = ""] = copy.privacyNote.split("{privacy}");

  return (
    <form action={formAction} noValidate className="relative flex flex-col gap-6">
      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="focus:outline-none">
        {errorText && (
          <p className="rounded-md border border-danger px-4 py-3 text-small text-danger" role="alert">
            {errorText}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-name`} className={label}>
            {copy.nameLabel}
          </label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            defaultValue={values?.name ?? ""}
            aria-invalid={errorFor("name") ? true : undefined}
            aria-describedby={describe("name")}
            className={`h-12 ${control("name")}`}
          />
          {fieldErrorNode("name")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-email`} className={label}>
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
            aria-invalid={errorFor("email") ? true : undefined}
            aria-describedby={describe("email")}
            className={`h-12 ${control("email")}`}
          />
          {fieldErrorNode("email")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-topic`} className={label}>
            {copy.topicLabel}
          </label>
          <select
            id={`${id}-topic`}
            name="topic"
            value={topic}
            onChange={(e) => {
              const next = topics.find((t) => t.value === e.target.value);
              if (next) setTopic(next.value);
            }}
            aria-invalid={errorFor("topic") ? true : undefined}
            aria-describedby={describe("topic")}
            className={`h-12 appearance-auto ${control("topic")}`}
          >
            {topics.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {fieldErrorNode("topic")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-organisation`} className={label}>
            {copy.organisationLabel}{" "}
            <span className={`no-js-only ${suffix}`}>{copy.organisationProjectSuffix}</span>
            {!isProject && <span className={`js-only ${suffix}`}>{copy.optionalSuffix}</span>}
          </label>
          <input
            id={`${id}-organisation`}
            name="organisation"
            autoComplete="organization"
            maxLength={150}
            defaultValue={values?.organisation ?? ""}
            aria-required={isProject ? true : undefined}
            aria-invalid={errorFor("organisation") ? true : undefined}
            aria-describedby={describe("organisation")}
            className={`h-12 ${control("organisation")}`}
          />
          {fieldErrorNode("organisation")}
        </div>
      </div>

      {/* Client-project details. Hidden by CSS for other topics once JavaScript runs. */}
      <fieldset data-project-fields data-active={isProject ? "" : undefined} className="min-w-0">
        <legend className="no-js-only mb-3 text-small text-muted">{copy.projectFieldsNote}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-service`} className={label}>
            {copy.serviceLabel} <span className={suffix}>{copy.optionalSuffix}</span>
          </label>
          <select
            id={`${id}-service`}
            ref={serviceRef}
            name="service"
            defaultValue={values?.service ?? ""}
            aria-invalid={errorFor("service") ? true : undefined}
            aria-describedby={describe("service")}
            className={`h-12 appearance-auto ${control("service")}`}
          >
            <option value="">{copy.choosePlaceholder}</option>
            {PROJECT_SERVICES.map((value) => (
              <option key={value} value={value}>
                {copy.services[value]}
              </option>
            ))}
          </select>
          {fieldErrorNode("service")}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-timeline`} className={label}>
            {copy.timelineLabel} <span className={suffix}>{copy.optionalSuffix}</span>
          </label>
          <select
            id={`${id}-timeline`}
            ref={timelineRef}
            name="timeline"
            defaultValue={values?.timeline ?? ""}
            aria-invalid={errorFor("timeline") ? true : undefined}
            aria-describedby={describe("timeline")}
            className={`h-12 appearance-auto ${control("timeline")}`}
          >
            <option value="">{copy.choosePlaceholder}</option>
            {PROJECT_TIMELINES.map((value) => (
              <option key={value} value={value}>
                {copy.timelines[value]}
              </option>
            ))}
          </select>
          {fieldErrorNode("timeline")}
        </div>
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-message`} className={label}>
          {copy.messageLabel}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={7}
          maxLength={5000}
          defaultValue={values?.message ?? ""}
          aria-invalid={errorFor("message") ? true : undefined}
          aria-describedby={describe("message", `${id}-message-hint`)}
          className={`py-3 ${control("message")}`}
        />
        <p id={`${id}-message-hint`} className="text-small text-muted">
          {copy.messageHint}
        </p>
        {fieldErrorNode("message")}
      </div>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-hp`}>{copy.honeypotLabel}</label>
        <input id={`${id}-hp`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <button type="submit" disabled={pending} className={buttonClasses("primary", "lg")}>
          {pending ? copy.submitting : copy.submit}
        </button>
        <p className="text-small text-muted">
          {noteBefore}
          <Link href={privacyHref} className="rounded-sm text-ink underline underline-offset-2 hover:text-accent-ink">
            {copy.privacyLinkText}
          </Link>
          {noteAfter}
        </p>
      </div>
    </form>
  );
}
