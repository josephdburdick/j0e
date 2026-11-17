import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export function ChapterMark({
  number,
  children,
}: {
  number: string
  children: ReactNode
}) {
  return (
    <div className="label flex items-baseline gap-3">
      <span className="text-dim">{number}</span>
      <span aria-hidden="true" className="text-brand">
        /
      </span>
      <span>{children}</span>
    </div>
  )
}

export function ChapterIntro({
  id,
  headline,
  intro,
}: {
  id: string
  headline: string
  intro?: string
}) {
  return (
    <div className="flex flex-wrap items-end gap-x-16 gap-y-6">
      <h2
        id={id}
        className="display flex-[1_1_460px] text-balance text-[clamp(30px,3.6vw,50px)] leading-[1.04] tracking-[-0.01em]"
      >
        {headline}
      </h2>
      {intro && <p className="flex-[1_1_340px] text-dim">{intro}</p>}
    </div>
  )
}

export function Chapter({
  id,
  className,
  children,
  labelledBy,
}: {
  id?: string
  className?: string
  labelledBy?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "flex scroll-mt-6 flex-col gap-10 border-t border-line py-[72px]",
        className,
      )}
    >
      {children}
    </section>
  )
}
