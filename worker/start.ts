import {
  type Answers,
  type Errors,
  LIMITS,
  SENDER,
  buildEmail,
  toAnswers,
  validateAll,
} from "../src/lib/startForm.ts"

type EmailAddress = { email: string; name: string }

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
  EMAIL: {
    send(message: {
      from: EmailAddress
      to: string
      replyTo: EmailAddress
      subject: string
      text: string
      html: string
    }): Promise<{ messageId: string }>
  }
  CONTACT_TO: string
  TURNSTILE_SECRET: string
}

/** `website` is a honeypot: people never see it, so any value means a bot. */
export type StartRequest = { answers: Answers; token: string; website?: string }

export type StartResponse =
  | { ok: true }
  | {
      ok: false
      error: "invalid" | "origin" | "turnstile" | "send"
      fields?: Errors
    }

const ORIGINS = ["https://j0e.me", "https://www.j0e.me"]
const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

const reply = (status: number, body: StartResponse) =>
  Response.json(body, { status })

// Same-origin also covers `wrangler dev`, which rewrites both the URL and Origin.
function originAllowed(request: Request) {
  const origin = request.headers.get("Origin") ?? ""
  return ORIGINS.includes(origin) || origin === new URL(request.url).origin
}

async function verifyTurnstile(
  token: string,
  request: Request,
  env: Env,
  fetchImpl: typeof fetch,
) {
  const form = new FormData()
  form.append("secret", env.TURNSTILE_SECRET)
  form.append("response", token)
  const ip = request.headers.get("CF-Connecting-IP")
  if (ip) form.append("remoteip", ip)
  try {
    const response = await fetchImpl(SITEVERIFY, { method: "POST", body: form })
    const result = (await response.json()) as { success?: boolean }
    return result.success === true
  } catch {
    return false
  }
}

export async function handleStart(
  request: Request,
  env: Env,
  fetchImpl: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } })
  }
  if (!originAllowed(request)) {
    return reply(403, { ok: false, error: "origin" })
  }

  const declared = Number(request.headers.get("content-length") ?? 0)
  if (declared > LIMITS.body) return reply(400, { ok: false, error: "invalid" })
  const raw = await request.text()
  if (new TextEncoder().encode(raw).length > LIMITS.body) {
    return reply(400, { ok: false, error: "invalid" })
  }

  let body: Partial<Record<keyof StartRequest, unknown>>
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") throw new Error("not an object")
    body = parsed as typeof body
  } catch {
    return reply(400, { ok: false, error: "invalid" })
  }

  // Bots that fill the honeypot get the same answer as people, so they don't retry.
  if (typeof body.website === "string" && body.website.trim()) {
    return reply(200, { ok: true })
  }

  const token = typeof body.token === "string" ? body.token : ""
  if (!token || !(await verifyTurnstile(token, request, env, fetchImpl))) {
    return reply(403, { ok: false, error: "turnstile" })
  }

  const answers = toAnswers(body.answers)
  const fields = validateAll(answers)
  if (Object.keys(fields).length > 0) {
    return reply(400, { ok: false, error: "invalid", fields })
  }

  const email = buildEmail(answers)
  try {
    await env.EMAIL.send({
      from: SENDER,
      to: env.CONTACT_TO,
      replyTo: email.replyTo,
      subject: email.subject,
      text: email.text,
      html: email.html,
    })
  } catch (error) {
    console.error(
      "start: send failed",
      (error as { code?: string })?.code ?? "unknown",
    )
    return reply(502, { ok: false, error: "send" })
  }

  return reply(200, { ok: true })
}
