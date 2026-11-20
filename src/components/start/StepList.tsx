import { STEP_NAMES, type StepId } from "@/lib/startForm"
import { cn } from "@/lib/utils"

export default function StepList({
  steps,
  current,
  done,
}: {
  steps: StepId[]
  current: number
  done: boolean
}) {
  return (
    <ol
      aria-label="Progress"
      className="flex gap-4 border-b-2 border-line md:flex-col md:gap-1 md:self-start md:border-b-0 md:border-l-2"
    >
      {steps.map((step, index) => {
        const isCurrent = !done && index === current
        return (
          <li
            key={step}
            aria-current={isCurrent ? "step" : undefined}
            className={cn(
              "label -mb-0.5 flex-1 whitespace-nowrap border-b-2 border-transparent pb-2 text-xs md:-ml-0.5 md:mb-0 md:border-b-0 md:border-l-2 md:py-1.5 md:pl-3.5",
              isCurrent && "border-brand text-ink",
              !isCurrent && (done || index < current) ? "text-ink" : "",
              !isCurrent && !done && index > current && "text-dim",
            )}
          >
            <span className="mr-2 text-brand md:inline-block md:w-6">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={cn(!isCurrent && "max-md:sr-only")}>
              {STEP_NAMES[step]}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
