"use client"

import {
  type Answers,
  type Errors,
  type Field,
  GROUPS_FOR,
  type Intent,
  type StepId,
  emptyAnswers,
  stepsFor,
  validateStep,
  viaFrom,
  withIntent,
} from "@/lib/startForm"
import { useEffect, useRef, useState } from "react"

import { submitInquiry } from "./submit"

export type Failure = "turnstile" | "send" | null

const STEP_OF: Record<Field, StepId> = {
  intent: "intent",
  details: "details",
  message: "message",
  link: "message",
  name: "contact",
  email: "contact",
  company: "contact",
}

export default function useStartForm() {
  const [answers, setAnswers] = useState<Answers>(emptyAnswers)
  const [stepIndex, setStepIndex] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [failure, setFailure] = useState<Failure>(null)
  const [token, setToken] = useState<string | null>(null)
  const [turnstileKey, setTurnstileKey] = useState(0)
  const [errorFocus, setErrorFocus] = useState(0)
  const inFlight = useRef(false)
  const honeypot = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const via = viaFrom(location.search)
    if (via) setAnswers((current) => ({ ...current, via }))
  }, [])

  const steps = stepsFor(answers.intent)
  const step = steps[stepIndex]

  function update(field: "message" | "link" | "name" | "email" | "company") {
    return (value: string) => {
      setAnswers((current) => ({ ...current, [field]: value }))
      setErrors(({ [field]: _cleared, ...rest }) => rest)
    }
  }

  function pickIntent(intent: Intent) {
    setAnswers((current) => withIntent(current, intent))
    setErrors({})
    setStepIndex(1)
  }

  function pickDetail(key: string, value: string) {
    const details = { ...answers.details, [key]: value }
    setAnswers({ ...answers, details })
    const complete =
      answers.intent && GROUPS_FOR[answers.intent].every((k) => details[k])
    if (complete) setErrors(({ details: _cleared, ...rest }) => rest)
  }

  function back() {
    setErrors({})
    setFailure(null)
    setStepIndex((index) => Math.max(0, index - 1))
  }

  async function send() {
    if (inFlight.current) return
    if (!token) {
      setFailure("turnstile")
      return
    }
    inFlight.current = true
    setSending(true)
    setFailure(null)
    const result = await submitInquiry({
      answers,
      token,
      website: honeypot.current?.value ?? "",
    })
    inFlight.current = false
    setSending(false)
    if (result.ok) {
      setSent(true)
      return
    }

    // Turnstile tokens are single-use, so any failed attempt needs a new one.
    setToken(null)
    setTurnstileKey((key) => key + 1)

    if (result.error === "invalid" && result.fields) {
      const fields = result.fields
      setErrors(fields)
      setErrorFocus((n) => n + 1)
      const first = steps.findIndex((s) =>
        (Object.keys(fields) as Field[]).some((f) => STEP_OF[f] === s),
      )
      if (first > -1) setStepIndex(first)
      return
    }
    setFailure(result.error === "turnstile" ? "turnstile" : "send")
  }

  async function next() {
    if (step === "intent") return
    const stepErrors = validateStep(step, answers)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      setErrorFocus((n) => n + 1)
      return
    }
    setErrors({})
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1)
      return
    }
    await send()
  }

  return {
    answers,
    steps,
    step,
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
  }
}
