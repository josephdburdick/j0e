import api from "@/api"
import { Chapter, ChapterMark } from "@/components/global/Chapter"
import record from "@/data/github-years.json"
import { cn } from "@/lib/utils"

const CHART_HEIGHT = 220

export default async function Record() {
  const data = await api()
  const { title, headline, intro, eras } = data.record.attributes
  const { years, labeled, currentSince } = record
  const max = Math.max(...years.map((entry) => entry.total))
  const first = years[0]
  const last = years[years.length - 1]

  return (
    <Chapter id="record" labelledBy="record-title">
      <ChapterMark number="05">{title}</ChapterMark>
      <div className="flex flex-wrap items-end gap-x-16 gap-y-10">
        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-[18px]">
          <h2
            id="record-title"
            className="display text-balance text-[clamp(30px,3.6vw,50px)] leading-[1.04] tracking-[-0.01em]"
          >
            {headline}
          </h2>
          <p className="text-dim">{intro}</p>
        </div>
        <div className="flex min-w-0 flex-[2_1_480px] flex-col gap-2.5">
          <div
            role="img"
            aria-label={`GitHub contributions per year, ${first.year} to ${last.year}. ${years
              .filter((entry) => labeled.includes(entry.year))
              .map(
                (entry) =>
                  `${entry.year}: ${entry.total.toLocaleString("en-US")}`,
              )
              .join(". ")}.`}
            className="flex flex-col gap-2.5"
          >
            <div
              className="flex items-end gap-1.5 border-b-2 border-ink pt-6"
              style={{ height: CHART_HEIGHT + 24 }}
            >
              {years.map((entry, index) => (
                <div
                  key={entry.year}
                  className="relative flex-1"
                  style={{
                    height: Math.max(
                      1,
                      Math.round((entry.total / max) * CHART_HEIGHT),
                    ),
                  }}
                >
                  {labeled.includes(entry.year) && (
                    <span
                      className={cn(
                        "absolute bottom-full left-1/2 -translate-x-1/2 pb-1 font-mono text-xs tabular-nums text-ink",
                        (years[index + 1]?.total ?? Infinity) > entry.total &&
                          "max-sm:left-auto max-sm:right-0 max-sm:translate-x-0",
                      )}
                    >
                      {entry.total.toLocaleString("en-US")}
                    </span>
                  )}
                  <div
                    className={cn(
                      "size-full",
                      entry.year >= currentSince ? "bg-brand" : "bg-dim",
                    )}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 font-mono text-xs text-dim">
              {years.map((entry) => (
                <span key={entry.year} className="flex-1 text-center">
                  <span className="sm:hidden">
                    {String(entry.year).slice(2)}
                  </span>
                  <span className="hidden sm:inline">{entry.year}</span>
                </span>
              ))}
            </div>
          </div>
          <ul className="flex flex-wrap gap-x-7 gap-y-1.5 pt-2 text-sm text-dim">
            {(eras as { label: string; current?: boolean }[]).map((era) => (
              <li key={era.label} className={cn(era.current && "text-brand")}>
                {era.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Chapter>
  )
}
