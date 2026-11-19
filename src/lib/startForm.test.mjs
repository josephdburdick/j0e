import assert from "node:assert/strict"
import { test } from "node:test"

import {
  buildEmail,
  emptyAnswers,
  normalizeLink,
  oneLine,
  stepsFor,
  validateAll,
  validateStep,
  viaFrom,
  withIntent,
} from "./startForm.ts"

const answers = (overrides = {}) => ({ ...emptyAnswers(), ...overrides })

const product = answers({
  intent: "product",
  details: {
    stage: "Designs are ready",
    timeline: "In 1 to 3 months",
    budget: "$5k to $15k",
  },
  message: "A booking app for climbing gyms.",
  link: "https://cragline.example",
  name: "Dana Ruiz",
  email: "dana@cragline.example",
  company: "Cragline",
  via: "hero",
})

test("stepsFor skips details for other", () => {
  assert.deepEqual(stepsFor("other"), ["intent", "message", "contact"])
  assert.deepEqual(stepsFor("product"), [
    "intent",
    "details",
    "message",
    "contact",
  ])
  assert.deepEqual(stepsFor(null), ["intent", "details", "message", "contact"])
})

test("withIntent clears details only when the intent changes", () => {
  const picked = answers({
    intent: "product",
    details: { stage: "Just an idea" },
  })
  assert.deepEqual(withIntent(picked, "contract").details, {})
  assert.equal(withIntent(picked, "contract").intent, "contract")
  assert.deepEqual(withIntent(picked, "product").details, {
    stage: "Just an idea",
  })
})

test("validateStep details requires every group", () => {
  const partial = answers({
    intent: "contract",
    details: { hours: "Full time" },
  })
  assert.ok(validateStep("details", partial).details)
  const full = answers({
    intent: "contract",
    details: {
      hours: "Full time",
      length: "3 to 6 months",
      timeline: "Right away",
    },
  })
  assert.deepEqual(validateStep("details", full), {})
})

test("validateStep message requires text within the limit", () => {
  assert.ok(validateStep("message", answers({ message: "   " })).message)
  assert.ok(
    validateStep("message", answers({ message: "x".repeat(5001) })).message,
  )
  assert.deepEqual(
    validateStep("message", answers({ message: "x".repeat(5000) })),
    {},
  )
})

test("validateStep message rejects a link that isn't http", () => {
  const bad = answers({ message: "hi", link: "javascript:alert(1)" })
  assert.ok(validateStep("message", bad).link)
})

test("validateStep contact requires name and a valid email", () => {
  const ok = answers({ name: "Dana", email: "dana@x.co" })
  assert.deepEqual(validateStep("contact", ok), {})
  assert.ok(
    validateStep("contact", answers({ name: "Dana", email: "nope" })).email,
  )
  assert.ok(
    validateStep("contact", answers({ name: "", email: "d@x.co" })).name,
  )
})

test("validateAll accepts a complete product inquiry", () => {
  assert.deepEqual(validateAll(product), {})
})

test("validateAll rejects unknown detail keys and options", () => {
  const extraKey = {
    ...product,
    details: { ...product.details, hacked: "x" },
  }
  assert.ok(validateAll(extraKey).details)
  const badOption = {
    ...product,
    details: { ...product.details, stage: "Not an option" },
  }
  assert.ok(validateAll(badOption).details)
  assert.ok(validateAll({ ...product, intent: "nope" }).intent)
})

test("normalizeLink adds a scheme and refuses other protocols", () => {
  assert.equal(normalizeLink("example.com"), "https://example.com")
  assert.equal(normalizeLink("http://x.co/a?b"), "http://x.co/a?b")
  assert.equal(normalizeLink(""), "")
  assert.equal(normalizeLink("javascript:alert(1)"), null)
})

test("viaFrom reads only allowlisted tags", () => {
  assert.equal(viaFrom("?from=hero"), "hero")
  assert.equal(viaFrom("?from=present-day"), "present-day")
  assert.equal(viaFrom("?from=evil"), null)
  assert.equal(viaFrom(""), null)
})

test("oneLine strips line breaks", () => {
  assert.equal(oneLine("Dana\r\nBcc: x@y.z"), "Dana Bcc: x@y.z")
})

test("buildEmail subject includes budget and company when present", () => {
  assert.equal(
    buildEmail(product).subject,
    "[j0e.me] Build a new product · $5k to $15k · Cragline",
  )
  const contract = answers({
    intent: "contract",
    details: {
      hours: "Part time",
      length: "Under 3 months",
      timeline: "Right away",
    },
    message: "hi",
    name: "Sam",
    email: "sam@x.co",
  })
  assert.equal(
    buildEmail(contract).subject,
    "[j0e.me] Join your team on contract",
  )
})

test("buildEmail text lists answers in step order and skips empties", () => {
  const labels = buildEmail(product)
    .text.split("\n")
    .filter((line) => /^[A-Z][a-z]+:/.test(line))
    .map((line) => line.split(":")[0])
  assert.deepEqual(labels, [
    "Wants",
    "Stage",
    "Start",
    "Budget",
    "Message",
    "Link",
    "Name",
    "Email",
    "Company",
    "Via",
  ])
  const bare = buildEmail({ ...product, link: "", company: "", via: null }).text
  assert.doesNotMatch(bare, /^(Link|Company|Via):/m)
})

test("buildEmail escapes visitor text in the html body", () => {
  const { html } = buildEmail({ ...product, message: "<script>x</script>" })
  assert.match(html, /&lt;script&gt;/)
  assert.doesNotMatch(html, /<script>/)
})

test("buildEmail keeps line breaks out of headers", () => {
  const sneaky = { ...product, name: "Dana\r\nBcc: x@y.z", company: "A\nB" }
  const { subject, replyTo } = buildEmail(sneaky)
  assert.doesNotMatch(subject, /[\r\n]/)
  assert.doesNotMatch(replyTo.name, /[\r\n]/)
  assert.deepEqual(replyTo, {
    email: "dana@cragline.example",
    name: "Dana Bcc: x@y.z",
  })
})

test("toAnswers coerces untrusted input", async () => {
  const { toAnswers } = await import("./startForm.ts")
  const parsed = toAnswers({
    intent: "hack",
    details: { stage: 3 },
    message: ["x"],
    via: "evil",
  })
  assert.equal(parsed.intent, null)
  assert.deepEqual(parsed.details, { stage: "" })
  assert.equal(parsed.message, "")
  assert.equal(parsed.via, null)
  assert.equal(toAnswers(null).name, "")
})
