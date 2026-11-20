import assert from "node:assert/strict"
import { test } from "node:test"

import { emptyAnswers } from "../../lib/startForm.ts"
import { submitInquiry } from "./submit.ts"

const body = { answers: emptyAnswers(), token: "tok", website: "" }

test("posts JSON to /api/start", async () => {
  let call
  await submitInquiry(body, async (url, init) => {
    call = { url, init }
    return Response.json({ ok: true })
  })
  assert.equal(call.url, "/api/start")
  assert.equal(call.init.method, "POST")
  assert.equal(call.init.headers["content-type"], "application/json")
  assert.deepEqual(JSON.parse(call.init.body), body)
})

test("maps responses to results", async () => {
  const respond = (status, json) => async () => Response.json(json, { status })
  assert.deepEqual(await submitInquiry(body, respond(200, { ok: true })), {
    ok: true,
  })
  const fields = { email: "Add an email" }
  assert.deepEqual(
    await submitInquiry(
      body,
      respond(400, { ok: false, error: "invalid", fields }),
    ),
    { ok: false, error: "invalid", fields },
  )
  assert.deepEqual(
    await submitInquiry(body, respond(403, { ok: false, error: "turnstile" })),
    { ok: false, error: "turnstile" },
  )
  assert.deepEqual(
    await submitInquiry(body, respond(502, { ok: false, error: "send" })),
    { ok: false, error: "send" },
  )
})

test("a thrown fetch or unreadable body is a network error", async () => {
  assert.deepEqual(
    await submitInquiry(body, async () => {
      throw new TypeError("offline")
    }),
    { ok: false, error: "network" },
  )
  assert.deepEqual(
    await submitInquiry(
      body,
      async () => new Response("<html>", { status: 500 }),
    ),
    { ok: false, error: "network" },
  )
})
