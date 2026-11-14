"use client"

import { useApi } from "@/components/providers/DataProvider"
import { triggerHaptic } from "@/lib/haptics"

type NowItem = {
  lead?: string
  name: string
  tail?: string
  href?: string
}

const formatUpdated = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })

export function NowLine() {
  const { data } = useApi()
  const now = data.now?.attributes
  if (!now?.items?.length) return null
  const items: NowItem[] = now.items

  return (
    <aside
      aria-label="What I'm doing now"
      className="not-prose mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-3xl border border-border px-4 py-2 text-sm text-foreground/90 md:rounded-full"
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-500/15 px-2 py-0.5 text-xs font-semibold text-lime-700 dark:text-lime-400">
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-current motion-safe:animate-pulse"
        />
        Now
      </span>
      {items.map((item) => (
        <span key={item.name}>
          {item.lead && <>{item.lead} </>}
          {item.href ? (
            <a
              href={item.href}
              onClick={() => triggerHaptic("selection")}
              className="font-semibold text-foreground underline-offset-4 hover:underline"
              {...(item.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {item.name}
            </a>
          ) : (
            <b className="font-semibold text-foreground">{item.name}</b>
          )}
          {item.tail && <> {item.tail}</>}
        </span>
      ))}
      {now.updated && (
        <time
          dateTime={new Date(now.updated).toISOString().slice(0, 10)}
          className="text-xs tabular-nums text-muted-foreground"
        >
          Updated {formatUpdated(now.updated)}
        </time>
      )}
    </aside>
  )
}
