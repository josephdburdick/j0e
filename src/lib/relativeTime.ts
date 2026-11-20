const TIME_ZONE = "America/New_York"

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const RELATIVE_LIMIT = 30 * DAY

function yearIn(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date)
}

/**
 * "Nov 18", or "Dec 1, 2025" when the year differs from `now`'s. Fixed locale
 * and time zone so the static HTML and the hydrated client render the same
 * string.
 */
export function formatPostDate(iso: string, now: Date = new Date()) {
  const date = new Date(iso)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(yearIn(date) !== yearIn(now) && { year: "numeric" }),
    timeZone: TIME_ZONE,
  })
}

/** Full date and time for tooltips, e.g. "Nov 18, 2026, 11:58 AM". */
export function formatPostDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: TIME_ZONE,
  })
}

function plural(count: number, unit: string) {
  return `${count} ${unit}${count === 1 ? "" : "s"} ago`
}

/**
 * "2 hours ago" (`long`) or "2H" (`tiny`). Future times, which happen because
 * Bluesky trusts the posting client's clock, read as just now. Past 30 days
 * it falls back to the date.
 */
export function formatRelative(iso: string, now: Date, style: "long" | "tiny") {
  const elapsed = Math.max(0, now.getTime() - new Date(iso).getTime())
  const tiny = style === "tiny"

  if (elapsed < MINUTE) return tiny ? "NOW" : "just now"
  if (elapsed < HOUR) {
    const minutes = Math.floor(elapsed / MINUTE)
    return tiny ? `${minutes}M` : plural(minutes, "minute")
  }
  if (elapsed < DAY) {
    const hours = Math.floor(elapsed / HOUR)
    return tiny ? `${hours}H` : plural(hours, "hour")
  }
  if (elapsed < WEEK) {
    const days = Math.floor(elapsed / DAY)
    return tiny ? `${days}D` : plural(days, "day")
  }
  if (elapsed < RELATIVE_LIMIT) {
    const weeks = Math.floor(elapsed / WEEK)
    return tiny ? `${weeks}W` : plural(weeks, "week")
  }
  const date = formatPostDate(iso, now)
  return tiny ? date.toUpperCase() : date
}
