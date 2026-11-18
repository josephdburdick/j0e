import type { BlueskyPost } from "@/lib/bluesky.mjs"
import { cn } from "@/lib/utils"

const LABELS = [
  ["likes", "like"],
  ["reposts", "repost"],
  ["replies", "reply", "replies"],
] as const

function countLabel(count: number, singular: string, pluralForm?: string) {
  return `${count} ${count === 1 ? singular : (pluralForm ?? `${singular}s`)}`
}

type Props = {
  counts: BlueskyPost["counts"]
  className?: string
}

export default function PostCounts({ counts, className }: Props) {
  const shown = LABELS.filter(([key]) => counts[key] > 0)
  if (shown.length === 0) return null

  return (
    <p className={cn("label flex gap-4 text-[11px] text-dim", className)}>
      {shown.map(([key, singular, pluralForm]) => (
        <span key={key}>{countLabel(counts[key], singular, pluralForm)}</span>
      ))}
    </p>
  )
}
