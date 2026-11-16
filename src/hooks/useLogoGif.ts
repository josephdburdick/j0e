import { useEffect, useState } from "react"

const LOGO_GIF_INDEX_SESSION_KEY = "j0e.logo.gif.index"

function pickRandomIndex(length: number, exclude?: number): number {
  if (length <= 1) return 0
  const randomUint = new Uint32Array(1)
  window.crypto.getRandomValues(randomUint)
  const candidate = randomUint[0] % length
  if (exclude === undefined || candidate !== exclude) return candidate
  return (candidate + 1) % length
}

/**
 * Returns gifs[0] on first paint so server HTML and hydration match, then a
 * random pick that differs from the previous load in this tab. Static export
 * freezes server-side randomness at build time, so the pick runs on the client.
 */
export function useLogoGif(gifs: string[]): string | undefined {
  const [picked, setPicked] = useState<string | undefined>(undefined)
  const signature = gifs.join("|")

  useEffect(() => {
    if (gifs.length === 0) {
      setPicked(undefined)
      return
    }
    let previous: number | undefined
    try {
      const stored = window.sessionStorage.getItem(LOGO_GIF_INDEX_SESSION_KEY)
      const parsed = stored === null ? NaN : Number.parseInt(stored, 10)
      if (parsed >= 0 && parsed < gifs.length) previous = parsed
    } catch {
      previous = undefined
    }
    const next = pickRandomIndex(gifs.length, previous)
    try {
      window.sessionStorage.setItem(LOGO_GIF_INDEX_SESSION_KEY, String(next))
    } catch {}
    setPicked(gifs[next])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])

  return picked ?? gifs[0]
}
