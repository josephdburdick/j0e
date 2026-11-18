"use client"

import {
  formatPostDate,
  formatPostDateTime,
  formatRelative,
} from "@/lib/relativeTime"
import { useEffect, useState } from "react"

const REFRESH_MS = 60_000

/** Ticks once a minute; null until mounted so server HTML shows the date. */
export function useNow() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), REFRESH_MS)
    return () => window.clearInterval(id)
  }, [])

  return now
}

export function postTimeLabel(
  iso: string,
  now: Date | null,
  variant: "long" | "tiny",
) {
  return now ? formatRelative(iso, now, variant) : formatPostDate(iso)
}

type Props = {
  iso: string
  variant?: "long" | "tiny"
  className?: string
}

export default function PostTime({ iso, variant = "long", className }: Props) {
  const now = useNow()

  return (
    <time
      dateTime={iso}
      title={formatPostDateTime(iso)}
      className={className}
      suppressHydrationWarning
    >
      {postTimeLabel(iso, now, variant)}
    </time>
  )
}
