type Props = {
  date: {
    start: string
    end: string | null
  }
}

export default function DateSpan({ date }: Props) {
  const renderDate = (dateProp: string | null) => {
    if (!dateProp) return "Present"

    const date = new Date(dateProp)
    const month = date.toLocaleString("default", {
      month: "short",
      timeZone: "UTC",
    })

    const year = date.toLocaleString("default", {
      year: "2-digit",
      timeZone: "UTC",
    })

    return `${month} '${year}`
  }

  const startDate = date.start ? new Date(date.start).toISOString() : undefined
  const endDate = date.end ? new Date(date.end).toISOString() : undefined

  return (
    <div
      className="flex flex-wrap items-center justify-start gap-2"
      role="group"
      aria-label="Employment duration"
    >
      <time dateTime={startDate} aria-label="Start date">
        {renderDate(date.start)}
      </time>
      <span
        className="h-px max-w-6 grow border-t border-muted-foreground"
        aria-hidden="true"
      >
        <span className="sr-only">to</span>
      </span>
      <time dateTime={endDate} aria-label="End date">
        {renderDate(date.end)}
      </time>
    </div>
  )
}
