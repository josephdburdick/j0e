import type { StartRequest, StartResponse } from "../../../worker/start.ts"

export type SubmitResult =
  | { ok: true }
  | Extract<StartResponse, { ok: false }>
  | { ok: false; error: "network" }

export async function submitInquiry(
  body: StartRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<SubmitResult> {
  try {
    const response = await fetchImpl("/api/start", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })
    const result = (await response.json()) as StartResponse
    return result.ok ? { ok: true } : result
  } catch {
    return { ok: false, error: "network" }
  }
}
