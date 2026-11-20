import assert from "node:assert/strict"
import { test } from "node:test"

import { SENDER, buildEmail, emptyAnswers } from "../src/lib/startForm.ts"
import worker from "./index.ts"
import { handleStart } from "./start.ts"

const answers = {
  ...emptyAnswers(),
  intent: "contract",
  details: {
    hours: "Full time",
    length: "3 to 6 months",
    timeline: "Right away",
  },
  message: "Lead a component library migration.",
  link: "example.com",
  name: "Sam Okafor",
  email: "sam@shiftboard.example",
  company: "Shiftboard",
  via: "hero",
}

function setup({ verified = true, sendThrows = false, env: extra = {} } = {}) {
  const sent = []
  const verifyCalls = []
  const env = {
    CONTACT_TO: "inbox@private.example",
    TURNSTILE_SECRET: "secret",
    ASSETS: {
      fetch: async (request) =>
        new Response(`asset ${new URL(request.url).pathname}`),
    },
    EMAIL: {
      send: async (message) => {
        if (sendThrows) throw Object.assign(new Error("nope"), { code: "E_X" })
        sent.push(message)
        return { messageId: "m1" }
      },
    },
    ...extra,
  }
  const fetchImpl = async (url, init) => {
    verifyCalls.push({ url, body: Object.fromEntries(init.body) })
    return Response.json({ success: verified })
  }
  return { env, sent, verifyCalls, fetchImpl }
}

function post(body, { origin = "https://j0e.me", raw } = {}) {
  const headers = {
    "content-type": "application/json",
    "CF-Connecting-IP": "203.0.113.9",
  }
  if (origin) headers.Origin = origin
  return new Request("https://j0e.me/api/start", {
    method: "POST",
    headers,
    body: raw ?? JSON.stringify(body),
  })
}

const valid = { answers, token: "tok" }

test("rejects methods other than POST", async () => {
  const { env, fetchImpl } = setup()
  const response = await handleStart(
    new Request("https://j0e.me/api/start"),
    env,
    fetchImpl,
  )
  assert.equal(response.status, 405)
})

test("rejects other origins and a missing origin", async () => {
  const { env, fetchImpl, sent } = setup()
  for (const origin of ["https://evil.example", null]) {
    const response = await handleStart(post(valid, { origin }), env, fetchImpl)
    assert.equal(response.status, 403)
    assert.equal((await response.json()).error, "origin")
  }
  assert.equal(sent.length, 0)
})

test("allows www and same-origin requests", async () => {
  const www = setup()
  assert.equal(
    (
      await handleStart(
        post(valid, { origin: "https://www.j0e.me" }),
        www.env,
        www.fetchImpl,
      )
    ).status,
    200,
  )
  const local = (origin) =>
    new Request("http://localhost:8787/api/start", {
      method: "POST",
      headers: { "content-type": "application/json", Origin: origin },
      body: JSON.stringify(valid),
    })
  const same = setup()
  assert.equal(
    (
      await handleStart(
        local("http://localhost:8787"),
        same.env,
        same.fetchImpl,
      )
    ).status,
    200,
  )
  const cross = setup()
  assert.equal(
    (
      await handleStart(
        local("http://localhost:3000"),
        cross.env,
        cross.fetchImpl,
      )
    ).status,
    403,
  )
})

test("rejects oversized and malformed bodies", async () => {
  const { env, fetchImpl, sent } = setup()
  const big = await handleStart(
    post(null, { raw: "x".repeat(10241) }),
    env,
    fetchImpl,
  )
  assert.equal(big.status, 400)
  const broken = await handleStart(post(null, { raw: "{nope" }), env, fetchImpl)
  assert.equal(broken.status, 400)
  assert.equal(sent.length, 0)
})

test("a filled honeypot fakes success without sending or verifying", async () => {
  const { env, fetchImpl, sent, verifyCalls } = setup()
  const response = await handleStart(
    post({ ...valid, website: "x" }),
    env,
    fetchImpl,
  )
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(sent.length, 0)
  assert.equal(verifyCalls.length, 0)
})

test("a failed Turnstile check blocks the send", async () => {
  const { env, fetchImpl, sent, verifyCalls } = setup({ verified: false })
  const response = await handleStart(post(valid), env, fetchImpl)
  assert.equal(response.status, 403)
  assert.equal((await response.json()).error, "turnstile")
  assert.equal(sent.length, 0)
  assert.equal(
    verifyCalls[0].url,
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  )
  assert.deepEqual(verifyCalls[0].body, {
    secret: "secret",
    response: "tok",
    remoteip: "203.0.113.9",
  })
})

test("invalid answers are rejected without sending", async () => {
  for (const bad of [
    { ...answers, message: "x".repeat(6000) },
    { ...answers, details: { ...answers.details, hacked: "x" } },
  ]) {
    const { env, fetchImpl, sent } = setup()
    const response = await handleStart(
      post({ answers: bad, token: "tok" }),
      env,
      fetchImpl,
    )
    assert.equal(response.status, 400)
    const body = await response.json()
    assert.equal(body.error, "invalid")
    assert.ok(body.fields)
    assert.equal(sent.length, 0)
  }
})

test("valid answers send exactly one email to CONTACT_TO", async () => {
  const { env, fetchImpl, sent } = setup()
  const response = await handleStart(post(valid), env, fetchImpl)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true })
  assert.equal(sent.length, 1)
  const [message] = sent
  assert.equal(message.to, "inbox@private.example")
  assert.deepEqual(message.from, SENDER)
  assert.equal(message.replyTo.email, "sam@shiftboard.example")
  assert.equal(message.subject, buildEmail(answers).subject)
  assert.match(message.text, /Link: https:\/\/example\.com/)
})

test("a send failure answers 502", async () => {
  const { env, fetchImpl } = setup({ sendThrows: true })
  const response = await handleStart(post(valid), env, fetchImpl)
  assert.equal(response.status, 502)
  assert.equal((await response.json()).error, "send")
})

test("other paths fall through to static assets", async () => {
  const { env } = setup()
  const response = await worker.fetch(new Request("https://j0e.me/posts"), env)
  assert.equal(await response.text(), "asset /posts")
})

test("accepts a message at the limit in multi-byte characters", async () => {
  const { env, fetchImpl, sent } = setup()
  const wide = {
    ...answers,
    message: "日".repeat(5000),
    name: "名".repeat(200),
    company: "社".repeat(200),
  }
  const response = await handleStart(
    post({ answers: wide, token: "t".repeat(2048) }),
    env,
    fetchImpl,
  )
  assert.equal(response.status, 200)
  assert.equal(sent.length, 1)
})
