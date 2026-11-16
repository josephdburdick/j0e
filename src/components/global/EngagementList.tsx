import ExternalLink from "@/components/global/ExternalLink"
import { Engagement } from "@/lib/types"
import { cn } from "@/lib/utils"
import Link from "next/link"

export const formatMonth = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })

const sameMonth = (a: string, b: string) =>
  new Date(a).toISOString().slice(0, 7) ===
  new Date(b).toISOString().slice(0, 7)

export function formatRange({ start, end }: Pick<Engagement, "start" | "end">) {
  if (end === null) return `${formatMonth(start)} – Present`
  if (sameMonth(start, end)) return formatMonth(start)
  return `${formatMonth(start)} – ${formatMonth(end)}`
}

type Props = {
  engagements: Engagement[]
  className?: string
}

export function EngagementList({ engagements, className }: Props) {
  return (
    <ul
      className={cn("ml-1 grid border-l border-line", className)}
      aria-label="Engagements"
    >
      {[...engagements]
        .sort(
          (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime(),
        )
        .map((engagement) => {
          const current = engagement.end === null
          const name = engagement.href ? (
            /^[#/]/.test(engagement.href) ? (
              <Link
                href={engagement.href}
                className="underline-offset-4 hover:underline"
              >
                {engagement.name}
              </Link>
            ) : (
              <ExternalLink href={engagement.href}>
                {engagement.name}
              </ExternalLink>
            )
          ) : (
            engagement.name
          )

          return (
            <li
              key={engagement.name}
              className="relative grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 py-2 pl-5 text-sm"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -left-[4.5px] top-[0.9rem] size-2 border-[1.5px]",
                  current ? "border-brand bg-brand" : "border-dim bg-paper",
                )}
              />
              <span className="font-semibold text-ink">{name}</span>
              <span className="whitespace-nowrap font-mono text-xs text-dim">
                {formatRange(engagement)}
              </span>
              {engagement.note && (
                <span className="col-span-2 text-dim">{engagement.note}</span>
              )}
            </li>
          )
        })}
    </ul>
  )
}
