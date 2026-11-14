import downloads from "@/data/npm-downloads.json"
import { cn } from "@/lib/utils"

const WIDTH = 96
const HEIGHT = 24
const BAR_GAP = 2

type Props = {
  name: string
  className?: string
}

export function NpmDownloads({ name, className }: Props) {
  const pkg = downloads.packages.find((entry) => entry.name === name)
  if (!pkg || pkg.weekly.length === 0) return null

  const max = Math.max(...pkg.weekly, 1)
  const barWidth =
    (WIDTH - BAR_GAP * (pkg.weekly.length - 1)) / pkg.weekly.length
  const through = new Date(downloads.through).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })

  return (
    <div
      className={cn("flex items-end justify-between gap-4", className)}
      title={`Weekly npm downloads, last 12 weeks through ${through}`}
    >
      <p className="text-sm text-foreground/90">
        <strong className="text-lg font-semibold tabular-nums text-foreground">
          {pkg.lastWeek.toLocaleString()}
        </strong>{" "}
        downloads / week
      </p>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH}
        height={HEIGHT}
        role="img"
        aria-label={`Weekly downloads over the last 12 weeks, from ${pkg.weekly[0]} to ${pkg.lastWeek}`}
        className="shrink-0"
      >
        {pkg.weekly.map((value, index) => {
          const height = Math.max(1, (value / max) * HEIGHT)
          const last = index === pkg.weekly.length - 1
          return (
            <rect
              key={index}
              x={index * (barWidth + BAR_GAP)}
              y={HEIGHT - height}
              width={barWidth}
              height={height}
              rx={1}
              className={
                last ? "fill-lime-600 dark:fill-lime-400" : "fill-foreground/20"
              }
            />
          )
        })}
      </svg>
    </div>
  )
}
