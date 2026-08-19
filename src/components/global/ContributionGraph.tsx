import contributions from "@/data/github-contributions.json"
import { cn } from "@/lib/utils"

const CELL = 10
const GAP = 3
const STEP = CELL + GAP

const LEVEL_CLASSES = [
  "fill-foreground/10",
  "fill-lime-500/30",
  "fill-lime-500/50",
  "fill-lime-600/75 dark:fill-lime-500/75",
  "fill-lime-600 dark:fill-lime-400",
]

type Props = {
  className?: string
}

export function ContributionGraph({ className }: Props) {
  const { weeks, total } = contributions
  const width = weeks.length * STEP - GAP
  const height = 7 * STEP - GAP

  return (
    <figure className={cn("w-full space-y-3", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={`GitHub contribution graph: ${total.toLocaleString()} contributions in the last year`}
      >
        {weeks.map((week, x) =>
          week.map((level, y) =>
            level >= 0 ? (
              <rect
                key={`${x}-${y}`}
                x={x * STEP}
                y={y * STEP}
                width={CELL}
                height={CELL}
                rx={2}
                className={LEVEL_CLASSES[level] ?? LEVEL_CLASSES[0]}
              />
            ) : null,
          ),
        )}
      </svg>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 text-xs text-foreground/90 md:text-sm">
        <span>
          <strong className="font-semibold text-foreground">
            {total.toLocaleString()}
          </strong>{" "}
          contributions in the last year
        </span>
        <span
          className="flex items-center gap-1.5"
          aria-label="Legend: less to more"
        >
          Less
          {LEVEL_CLASSES.map((levelClass, key) => (
            <svg key={key} width="10" height="10" aria-hidden="true">
              <rect width="10" height="10" rx="2" className={levelClass} />
            </svg>
          ))}
          More
        </span>
      </figcaption>
    </figure>
  )
}
