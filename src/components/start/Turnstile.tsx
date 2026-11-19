"use client"

import { useEffect, useRef } from "react"

/** Cloudflare's always-pass test key until the real widget exists. */
export const TURNSTILE_SITE_KEY = "1x00000000000000000000AA"

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

type TurnstileApi = {
  render(element: HTMLElement, options: Record<string, unknown>): string
  remove(widgetId: string): void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let loading: Promise<TurnstileApi> | null = null

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () =>
      window.turnstile ? resolve(window.turnstile) : reject()
    script.onerror = () => {
      loading = null
      reject(new Error("Turnstile failed to load"))
    }
    document.head.appendChild(script)
  })
  return loading
}

/** Changing `resetKey` replaces the widget, which issues a fresh token. */
export default function Turnstile({
  onToken,
  resetKey,
}: {
  onToken: (token: string | null) => void
  resetKey: number
}) {
  const container = useRef<HTMLDivElement>(null)
  const latestOnToken = useRef(onToken)

  useEffect(() => {
    latestOnToken.current = onToken
  }, [onToken])

  useEffect(() => {
    let widgetId: string | undefined
    let cancelled = false
    const report = (token: string | null) => latestOnToken.current(token)

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !container.current) return
        widgetId = turnstile.render(container.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "auto",
          callback: (token: string) => report(token),
          "expired-callback": () => report(null),
          "error-callback": () => report(null),
        })
      })
      .catch(() => report(null))

    return () => {
      cancelled = true
      if (widgetId) window.turnstile?.remove(widgetId)
    }
  }, [resetKey])

  return <div ref={container} className="min-h-[65px]" />
}
