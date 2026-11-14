import ExternalLink from "@/components/global/ExternalLink"
import { Engagement } from "@/lib/types"
import { cn } from "@/lib/utils"

const formatMonth = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })

const sameMonth = (a: string, b: string) =>
  new Date(a).toISOString().slice(0, 7) ===
  new Date(b).toISOString().slice(0, 7)

function formatRange({ start, end }: Engagement) {
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
      className={cn("ml-1.5 grid border-l border-border", className)}
      aria-label="Engagements"
    >
      {[...engagements]
        .sort(
          (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime(),
        )
        .map((engagement) => {
          const current = engagement.end === null
          const name = engagement.href ? (
            engagement.href.startsWith("#") ? (
              <a
                href={engagement.href}
                className="underline-offset-4 hover:underline"
              >
                {engagement.name}
              </a>
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
                  "absolute -left-[4.5px] top-[0.9rem] size-2 rounded-full border-[1.5px]",
                  current
                    ? "border-lime-600 bg-lime-600 dark:border-lime-400 dark:bg-lime-400"
                    : "border-muted-foreground bg-background",
                )}
              />
              <span className="font-semibold text-foreground">{name}</span>
              <span className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                {formatRange(engagement)}
              </span>
              {engagement.note && (
                <span className="col-span-2 text-foreground/80">
                  {engagement.note}
                </span>
              )}
            </li>
          )
        })}
    </ul>
  )
}
