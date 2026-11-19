"use client"

import {
  DETAIL_GROUPS,
  FALLBACK_EMAIL,
  GROUPS_FOR,
  INTENTS,
  PROMPTS,
  firstInvalidField,
  stepHeading,
} from "@/lib/startForm"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import StepList from "./StepList"
import Turnstile from "./Turnstile"
import useStartForm from "./useStartForm"

const KEYS = ["A", "B", "C", "D", "E"]

const inputClass =
  "w-full rounded-none border border-line bg-surface px-3.5 py-3 text-ink placeholder:text-dim hover:border-dim focus:border-brand focus:shadow-[inset_0_0_0_1px_var(--brand)] focus:outline-none aria-[invalid=true]:border-danger"

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-sm text-danger">
      {message}
    </p>
  )
}

function TextField({
  id,
  label,
  optional,
  error,
  multiline,
  ...input
}: {
  id: string
  label: string
  optional?: boolean
  error?: string
  multiline?: boolean
  value: string
  onChange: (value: string) => void
  type?: string
  autoComplete?: string
  placeholder?: string
}) {
  const shared = {
    id,
    value: input.value,
    placeholder: input.placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    className: inputClass,
  }
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-[15px] font-semibold">
        {label}
        {optional && <span className="font-normal text-dim"> (optional)</span>}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={6}
          className={cn(shared.className, "resize-y")}
          onChange={(event) => input.onChange(event.target.value)}
        />
      ) : (
        <input
          {...shared}
          type={input.type ?? "text"}
          autoComplete={input.autoComplete}
          onChange={(event) => input.onChange(event.target.value)}
        />
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const text = useRef<HTMLSpanElement>(null)

  async function copy() {
    try {
      await navigator.clipboard.writeText(FALLBACK_EMAIL)
      setCopied(true)
    } catch {
      const selection = window.getSelection()
      if (!selection || !text.current) return
      const range = document.createRange()
      range.selectNodeContents(text.current)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      <span ref={text} className="font-semibold text-ink">
        {FALLBACK_EMAIL}
      </span>
      <button
        type="button"
        onClick={copy}
        className="label text-[11px] text-brand underline underline-offset-4 hover:text-ink"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  )
}

export default function StartForm() {
  const {
    answers,
    step,
    steps,
    stepIndex,
    errors,
    sending,
    sent,
    failure,
    turnstileKey,
    errorFocus,
    honeypot,
    setToken,
    update,
    pickIntent,
    pickDetail,
    back,
    next,
  } = useStartForm()
  const heading = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)
  const firstName = answers.name.trim().split(/\s+/)[0]

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    heading.current?.focus()
  }, [stepIndex, sent])

  useEffect(() => {
    if (errorFocus === 0) return
    const field = firstInvalidField(errors)
    if (field === "details") {
      document
        .querySelector<HTMLButtonElement>(
          "fieldset button:not([aria-pressed=true])",
        )
        ?.focus()
    } else if (field) {
      document.getElementById(`start-${field}`)?.focus()
    }
    // Only a fresh validation failure should move focus, not every error edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorFocus])

  useEffect(() => {
    if (step !== "intent" || sent) return
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement
      if (target.closest("input, textarea, select, [contenteditable]")) return
      const index = KEYS.indexOf(event.key.toUpperCase())
      if (index === -1) return
      event.preventDefault()
      pickIntent(INTENTS[index].value)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [step, sent, pickIntent])

  if (sent) {
    return (
      <div className="grid gap-8 py-12 md:grid-cols-[190px_minmax(0,1fr)] md:gap-16 md:py-20">
        <StepList steps={steps} current={stepIndex} done />
        <div role="status" className="flex max-w-[620px] flex-col gap-5">
          <span
            aria-hidden="true"
            className="grid h-11 w-11 place-items-center bg-brand text-on-brand"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10.5l4 4 8-9"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="square"
              />
            </svg>
          </span>
          <h1
            ref={heading}
            tabIndex={-1}
            className="display text-[clamp(32px,4.6vw,56px)] leading-none tracking-[-0.02em] outline-none"
          >
            Thanks, {firstName}.
          </h1>
          <p className="max-w-[46ch] text-lg text-dim">
            Your note is in my inbox. I reply to every one within two business
            days, at {answers.email.trim()}.
          </p>
          <Link href="/" className="text-link self-start">
            Back to j0e.me
          </Link>
        </div>
      </div>
    )
  }

  const last = stepIndex === steps.length - 1

  return (
    <div className="grid gap-8 py-12 md:grid-cols-[190px_minmax(0,1fr)] md:gap-16 md:py-20">
      <StepList steps={steps} current={stepIndex} done={false} />
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          next()
        }}
        className="flex min-w-0 max-w-[620px] flex-col gap-6"
      >
        <p className="label text-dim" aria-live="polite">
          Start a project{" "}
          <span aria-hidden="true" className="text-brand">
            /
          </span>{" "}
          Step {stepIndex + 1} of {steps.length}
        </p>
        <h1
          ref={heading}
          tabIndex={-1}
          className="display text-balance text-[clamp(32px,4.6vw,56px)] leading-none tracking-[-0.02em] outline-none"
        >
          {stepHeading(step, answers.intent)}
        </h1>

        {step === "intent" && (
          <>
            <p className="-mt-2 text-lg text-dim">
              I&rsquo;ll ask two or three quick things, then you can tell me the
              rest in your own words.
            </p>
            <div
              role="group"
              aria-label="What can I help with?"
              className="grid gap-2"
            >
              {INTENTS.map((intent, index) => (
                <button
                  key={intent.value}
                  type="button"
                  aria-pressed={answers.intent === intent.value}
                  onClick={() => pickIntent(intent.value)}
                  className="group grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3.5 gap-y-0.5 border border-line bg-surface px-4 py-3.5 text-left transition-colors hover:border-ink aria-pressed:border-brand aria-pressed:shadow-[inset_0_0_0_1px_var(--brand)]"
                >
                  <span
                    aria-hidden="true"
                    className="row-span-2 grid h-[26px] w-[26px] place-items-center self-center border border-line font-mono text-xs text-dim group-aria-pressed:border-brand group-aria-pressed:bg-brand group-aria-pressed:text-on-brand"
                  >
                    {KEYS[index]}
                  </span>
                  <span className="font-semibold">{intent.title}</span>
                  <span className="col-start-2 text-sm text-dim">
                    {intent.sub}
                  </span>
                </button>
              ))}
            </div>
            <p className="label hidden text-[11px] text-dim md:block">
              Press A to E to choose
            </p>
          </>
        )}

        {step === "details" && answers.intent && (
          <>
            {GROUPS_FOR[answers.intent].map((key) => {
              const group = DETAIL_GROUPS[key]
              return (
                <fieldset key={key} className="flex flex-col gap-2.5">
                  <legend className="label mb-2.5 text-dim">
                    {group.question}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={answers.details[key] === option}
                        onClick={() => pickDetail(key, option)}
                        className="border border-line bg-surface px-3.5 py-2 text-[15px] transition-colors hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )
            })}
            {errors.details && (
              <p role="alert" className="text-sm text-danger">
                {errors.details}
              </p>
            )}
          </>
        )}

        {step === "message" && answers.intent && (
          <>
            <TextField
              id="start-message"
              label={PROMPTS[answers.intent]}
              multiline
              placeholder="A few sentences is plenty."
              value={answers.message}
              onChange={update("message")}
              error={errors.message}
            />
            <TextField
              id="start-link"
              label="Link"
              optional
              type="url"
              autoComplete="url"
              placeholder="Site, deck, or Figma file"
              value={answers.link}
              onChange={update("link")}
              error={errors.link}
            />
          </>
        )}

        {step === "contact" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="start-name"
                label="Your name"
                autoComplete="name"
                value={answers.name}
                onChange={update("name")}
                error={errors.name}
              />
              <TextField
                id="start-email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={answers.email}
                onChange={update("email")}
                error={errors.email}
              />
            </div>
            <TextField
              id="start-company"
              label="Company"
              optional
              autoComplete="organization"
              value={answers.company}
              onChange={update("company")}
              error={errors.company}
            />
            <div aria-hidden="true" className="absolute -left-[9999px]">
              <label htmlFor="start-leave-empty">Leave this empty</label>
              <input
                ref={honeypot}
                id="start-leave-empty"
                name="leave-empty"
                tabIndex={-1}
                autoComplete="off"
                data-1p-ignore
                data-lpignore="true"
              />
            </div>
            <Turnstile onToken={setToken} resetKey={turnstileKey} />
          </>
        )}

        {failure && (
          <div
            role="alert"
            className="flex flex-col gap-1 border-l-[3px] border-danger bg-sunk px-4 py-3 text-[15px]"
          >
            <p className="font-semibold text-ink">
              {failure === "turnstile"
                ? "The spam check didn’t finish. Give it a second and try again."
                : "That didn’t send. Try again, or email me at the address below."}
            </p>
            <CopyEmail />
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-1">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={back}
              className="px-1.5 py-3.5 font-semibold underline underline-offset-4 hover:text-brand"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          {step !== "intent" && (
            <button
              type="submit"
              disabled={sending}
              className="bg-brand px-6 py-[15px] font-semibold text-on-brand transition-colors hover:bg-ink hover:text-paper disabled:cursor-wait disabled:opacity-60"
            >
              {last ? (sending ? "Sending…" : "Send to Joe") : "Continue"}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
