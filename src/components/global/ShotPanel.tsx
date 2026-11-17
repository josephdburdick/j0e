"use client"

import { ScreenshotLightbox } from "@/components/global/ScreenshotLightbox"
import { triggerHaptic } from "@/lib/haptics"
import type { Screenshot } from "@/lib/screenshots"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"

function shotClassName(shot: Screenshot, screenshots: Screenshot[]) {
  if (shot.kind === "wide") return "w-full max-w-[1080px]"
  const paired = screenshots.some((other) => other.kind !== shot.kind)
  if (shot.kind === "mobile") {
    return paired
      ? "w-[19%] overflow-hidden rounded-[10px]"
      : "w-[calc(33.33%-14px)] max-w-[215px] overflow-hidden rounded-2xl"
  }
  return paired ? "w-[72%]" : "w-full max-w-[620px]"
}

function shotSizes(shot: Screenshot) {
  if (shot.kind === "wide") return "(min-width: 1240px) 1080px, 90vw"
  if (shot.kind === "mobile") return "(min-width: 768px) 215px, 30vw"
  return "(min-width: 1024px) 620px, 90vw"
}

export function ShotPanel({
  title,
  screenshots,
  className,
}: {
  title: string
  screenshots: Screenshot[]
  className?: string
}) {
  const [open, setOpen] = useState<number | null>(null)
  const [opener, setOpener] = useState<HTMLButtonElement | null>(null)

  return (
    <div
      className={cn(
        "cut flex min-w-0 flex-wrap items-end justify-center gap-5 bg-sunk px-6 py-9",
        className,
      )}
    >
      {screenshots.map((shot, index) => (
        <button
          key={shot.src}
          type="button"
          aria-haspopup="dialog"
          aria-label={`Enlarge: ${shot.alt}`}
          onClick={(event) => {
            triggerHaptic("selection")
            setOpener(event.currentTarget)
            setOpen(index)
          }}
          className={cn(
            "block cursor-zoom-in transition-transform hover:-translate-y-0.5 motion-reduce:transition-none",
            shotClassName(shot, screenshots),
          )}
        >
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            sizes={shotSizes(shot)}
            loading="lazy"
            className="block h-auto w-full"
          />
        </button>
      ))}
      <ScreenshotLightbox
        title={title}
        screenshots={screenshots}
        index={open}
        onClose={() => setOpen(null)}
        returnFocusTo={opener}
      />
    </div>
  )
}
