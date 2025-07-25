import { cn } from "@/lib/utils"

type Props = {
  reverse?: boolean
}
export default function WorkAvailability(props: Props) {
  const { reverse = false } = props
  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-center gap-2 text-foreground dark:text-muted-foreground",
          reverse && "flex-row-reverse",
        )}
      >
        <span className="inline-flex h-2 w-2 rounded-full bg-lime-500 md:h-3 md:w-3">
          <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-lime-400 md:h-3 md:w-3"></span>
        </span>
        <span className="flex items-center justify-center text-xs md:text-sm">
          Available for work
        </span>
      </div>
    </div>
  )
}
