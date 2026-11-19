export type Intent = "product" | "existing" | "system" | "contract" | "other"
export type StepId = "intent" | "details" | "message" | "contact"
export type Via = "hero" | "contact" | "now" | "links" | "present-day"

export type Answers = {
  intent: Intent | null
  details: Record<string, string>
  message: string
  link: string
  name: string
  email: string
  company: string
  via: Via | null
}

export type Field =
  | "intent"
  | "details"
  | "message"
  | "link"
  | "name"
  | "email"
  | "company"
export type Errors = Partial<Record<Field, string>>

type DetailGroup = {
  key: string
  label: string
  question: string
  options: string[]
}

export const INTENTS: { value: Intent; title: string; sub: string }[] = [
  {
    value: "product",
    title: "Build a new product",
    sub: "Take an idea all the way to a shipped app",
  },
  {
    value: "existing",
    title: "Improve an existing product",
    sub: "Features, fixes, performance, or a rebuild",
  },
  {
    value: "system",
    title: "Design system work",
    sub: "Tokens, components, and migrating onto them",
  },
  {
    value: "contract",
    title: "Join your team on contract",
    sub: "Embedded with your engineers",
  },
  {
    value: "other",
    title: "Something else",
    sub: "Advice, speaking, or just saying hello",
  },
]

export const DETAIL_GROUPS: Record<string, DetailGroup> = {
  stage: {
    key: "stage",
    label: "Stage",
    question: "Where is it now?",
    options: ["Just an idea", "Designs are ready", "A prototype exists"],
  },
  need: {
    key: "need",
    label: "Needs",
    question: "What does it need most?",
    options: ["New features", "Fixes and speed", "A redesign", "A rebuild"],
  },
  scope: {
    key: "scope",
    label: "Starting",
    question: "Where are you starting?",
    options: ["No system yet", "One that needs work", "Moving to a new one"],
  },
  hours: {
    key: "hours",
    label: "Hours",
    question: "How much of my time?",
    options: ["Full time", "Part time"],
  },
  length: {
    key: "length",
    label: "Length",
    question: "For how long?",
    options: ["Under 3 months", "3 to 6 months", "6 months or more"],
  },
  timeline: {
    key: "timeline",
    label: "Start",
    question: "When do you want to start?",
    options: [
      "Right away",
      "In 1 to 3 months",
      "Later this year",
      "Just exploring",
    ],
  },
  budget: {
    key: "budget",
    label: "Budget",
    question: "Rough budget",
    options: [
      "$1k to $5k",
      "$5k to $15k",
      "$15k to $40k",
      "$40k or more",
      "Not sure yet",
    ],
  },
}

export const GROUPS_FOR: Record<Intent, string[]> = {
  product: ["stage", "timeline", "budget"],
  existing: ["need", "timeline", "budget"],
  system: ["scope", "timeline", "budget"],
  contract: ["hours", "length", "timeline"],
  other: [],
}

export const PROMPTS: Record<Intent, string> = {
  product: "What are you building, and who is it for?",
  existing: "What's the product, and what's in the way?",
  system: "Tell me about the product and the team.",
  contract: "What's the team, and what would I work on?",
  other: "What's on your mind?",
}

export const STEP_NAMES: Record<StepId, string> = {
  intent: "What you need",
  details: "Details",
  message: "The project",
  contact: "Your info",
}

export function stepHeading(step: StepId, intent: Intent | null): string {
  if (step === "intent") return "What can I help with?"
  if (step === "details") return "A few quick details"
  if (step === "message")
    return intent === "other" ? "What's on your mind?" : "Tell me about it"
  return "Where should I reply?"
}

export const VIA_TAGS: Via[] = [
  "hero",
  "contact",
  "now",
  "links",
  "present-day",
]

export const LIMITS = {
  message: 5000,
  name: 200,
  email: 254,
  company: 200,
  link: 2000,
  body: 10240,
}

export const SENDER = { email: "form@present.day", name: "j0e.me" }
export const FALLBACK_EMAIL = "joe@present.day"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i

export function emptyAnswers(): Answers {
  return {
    intent: null,
    details: {},
    message: "",
    link: "",
    name: "",
    email: "",
    company: "",
    via: null,
  }
}

export function isIntent(value: unknown): value is Intent {
  return INTENTS.some((intent) => intent.value === value)
}

export function stepsFor(intent: Intent | null): StepId[] {
  return intent === "other"
    ? ["intent", "message", "contact"]
    : ["intent", "details", "message", "contact"]
}

export function withIntent(answers: Answers, intent: Intent): Answers {
  if (answers.intent === intent) return answers
  return { ...answers, intent, details: {} }
}

export function oneLine(value: string): string {
  return value
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Returns "" for an empty link, the link with `https://` added when it has no scheme, or null when it isn't an http(s) URL. */
export function normalizeLink(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return ""
  const candidate = SCHEME_RE.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const { protocol, hostname } = new URL(candidate)
    if (protocol !== "http:" && protocol !== "https:") return null
    if (!hostname.includes(".")) return null
    return candidate
  } catch {
    return null
  }
}

export function viaFrom(search: string): Via | null {
  const tag = new URLSearchParams(search).get("from")
  return VIA_TAGS.find((via) => via === tag) ?? null
}

export function validateStep(step: StepId, answers: Answers): Errors {
  const errors: Errors = {}

  if (step === "intent" && !isIntent(answers.intent)) {
    errors.intent = "Pick what you need help with."
  }

  if (step === "details" && answers.intent) {
    const missing = GROUPS_FOR[answers.intent].some(
      (key) => !answers.details[key],
    )
    if (missing) errors.details = "Pick one answer in each row."
  }

  if (step === "message") {
    if (!answers.message.trim()) {
      errors.message = "Add a sentence or two so I know where to start."
    } else if (answers.message.length > LIMITS.message) {
      errors.message = "Keep it under 5,000 characters."
    }
    if (
      answers.link.length > LIMITS.link ||
      normalizeLink(answers.link) === null
    ) {
      errors.link =
        "That link doesn't look right. Try a full address like https://example.com."
    }
  }

  if (step === "contact") {
    if (!answers.name.trim()) errors.name = "Add your name."
    else if (answers.name.length > LIMITS.name)
      errors.name = "Keep your name under 200 characters."
    const email = answers.email.trim()
    if (!EMAIL_RE.test(email) || email.length > LIMITS.email) {
      errors.email = "Add an email I can reply to, like you@company.com."
    }
    if (answers.company.length > LIMITS.company) {
      errors.company = "Keep the company name under 200 characters."
    }
  }

  return errors
}

export function validateAll(answers: Answers): Errors {
  if (!isIntent(answers.intent)) return validateStep("intent", answers)

  const errors = stepsFor(answers.intent).reduce<Errors>(
    (all, step) => ({ ...all, ...validateStep(step, answers) }),
    {},
  )

  const allowed = GROUPS_FOR[answers.intent]
  const tampered = Object.entries(answers.details).some(
    ([key, value]) =>
      !allowed.includes(key) || !DETAIL_GROUPS[key].options.includes(value),
  )
  if (tampered) errors.details = "Pick one answer in each row."

  return errors
}

const str = (value: unknown) => (typeof value === "string" ? value : "")

/** Coerces untrusted JSON into Answers; anything malformed becomes empty so validateAll reports it. */
export function toAnswers(raw: unknown): Answers {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<
    string,
    unknown
  >
  const details =
    input.details && typeof input.details === "object"
      ? Object.fromEntries(
          Object.entries(input.details as Record<string, unknown>).map(
            ([key, value]) => [key, str(value)],
          ),
        )
      : {}
  return {
    intent: isIntent(input.intent) ? input.intent : null,
    details,
    message: str(input.message),
    link: str(input.link),
    name: str(input.name),
    email: str(input.email),
    company: str(input.company),
    via: VIA_TAGS.find((via) => via === input.via) ?? null,
  }
}

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ] as string,
  )

export function buildEmail(answers: Answers): {
  subject: string
  text: string
  html: string
  replyTo: { email: string; name: string }
} {
  const intent = INTENTS.find((option) => option.value === answers.intent)
  const groups = answers.intent ? GROUPS_FOR[answers.intent] : []
  const name = oneLine(answers.name)
  const company = oneLine(answers.company)
  const budget = groups.includes("budget") ? answers.details.budget : ""

  const subject = [
    `[j0e.me] ${intent?.title ?? "New inquiry"}`,
    budget,
    company,
  ]
    .filter(Boolean)
    .join(" · ")

  const before: [string, string][] = [
    ["Wants", intent?.title ?? ""],
    ...groups.map((key): [string, string] => [
      DETAIL_GROUPS[key].label,
      answers.details[key] ?? "",
    ]),
  ]
  const message = answers.message.trim()
  const after: [string, string][] = (
    [
      ["Link", normalizeLink(answers.link) ?? ""],
      ["Name", name],
      ["Email", answers.email.trim()],
      ["Company", company],
      ["Via", answers.via ?? ""],
    ] as [string, string][]
  ).filter(([, value]) => value)

  const lines = (pairs: [string, string][]) =>
    pairs.map(([label, value]) => `${label}: ${value}`).join("\n")
  const text = [lines(before), `Message:\n${message}`, lines(after)].join(
    "\n\n",
  )

  const rows = (pairs: [string, string][]) =>
    pairs
      .map(
        ([label, value]) =>
          `<p><strong>${label}</strong><br>${escapeHtml(value)}</p>`,
      )
      .join("")
  const html = `${rows(before)}<p><strong>Message</strong><br>${escapeHtml(
    message,
  ).replace(/\n/g, "<br>")}</p>${rows(after)}`

  return {
    subject,
    text,
    html,
    replyTo: { email: answers.email.trim(), name },
  }
}
