"use client"

import { useApi } from "@/components/providers/DataProvider"
import { triggerHaptic } from "@/lib/haptics"
import Image from "next/image"

type NowItem = {
  lead?: string
  name: string
  tail?: string
  href?: string
  icon?: string
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
      className="not-prose mx-auto -mb-8 grid w-full max-w-md gap-3 rounded-2xl border border-border bg-background/60 p-4 pb-8 text-left [mask-image:linear-gradient(to_bottom,black_calc(100%-2rem),transparent)] text-sm text-foreground/90 shadow-sm backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-500/15 px-2 py-0.5 text-xs font-semibold text-lime-700 dark:text-lime-400">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-current motion-safe:animate-pulse"
          />
          Now
        </span>
        {now.updated && (
          <time
            dateTime={new Date(now.updated).toISOString().slice(0, 10)}
            className="text-xs tabular-nums text-muted-foreground"
          >
            Updated {formatUpdated(now.updated)}
          </time>
        )}
      </div>
      <ul className="grid gap-2.5">
        {items.map((item) => (
          <li key={item.name} className="flex items-center gap-3">
            {item.icon && (
              <Image
                src={item.icon}
                alt=""
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-lg"
              />
            )}
            <span className="text-pretty leading-snug">
              {item.lead && <>{item.lead} </>}
              {item.href ? (
                <a
                  href={item.href}
                  onClick={() => triggerHaptic("selection")}
                  className="font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
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
          </li>
        ))}
      </ul>
    </aside>
  )
}
