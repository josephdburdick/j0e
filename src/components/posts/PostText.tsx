import type { Segment } from "@/lib/bluesky.mjs"
import { cn } from "@/lib/utils"

type Props = {
  segments: Segment[]
  className?: string
}

export default function PostText({ segments, className }: Props) {
  return (
    <p className={cn("whitespace-pre-line break-words", className)}>
      {segments.map((segment, index) =>
        segment.href ? (
          <a
            key={index}
            href={segment.href}
            target="_blank"
            rel="noreferrer"
            className="text-brand underline underline-offset-4 hover:text-ink"
          >
            {segment.text}
          </a>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </p>
  )
}
