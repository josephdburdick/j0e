"use client"

import { ScreenshotLightbox } from "@/components/global/ScreenshotLightbox"
import { triggerHaptic } from "@/lib/haptics"
import { SCREENSHOT_SIZES, type Screenshot } from "@/lib/screenshots"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"

function Shot({
  shot,
  className,
  sizes,
  onOpen,
}: {
  shot: Screenshot
  className?: string
  sizes: string
  onOpen: (opener: HTMLButtonElement) => void
}) {
  const { width, height } = SCREENSHOT_SIZES[shot.kind]
  return (
    <button
      type="button"
      onClick={(event) => onOpen(event.currentTarget)}
      aria-haspopup="dialog"
      className={cn(
        "block cursor-zoom-in overflow-hidden border border-border bg-background shadow-md transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none",
        className,
      )}
    >
      <Image
        src={shot.src}
        alt={shot.alt}
        width={width}
        height={height}
        sizes={sizes}
        loading="lazy"
        className="block h-auto w-full"
      />
    </button>
  )
}

export function AppScreens({
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
  const large = screenshots.find((shot) => shot.kind !== "mobile")
  const phones = screenshots.filter((shot) => shot.kind === "mobile")
  const phone = phones[0]
  if (!large && !phone) return null

  const shot = (
    item: Screenshot,
    props: { className: string; sizes: string },
  ) => (
    <Shot
      key={item.src}
      shot={item}
      {...props}
      onOpen={(button) => {
        triggerHaptic("selection")
        setOpener(button)
        setOpen(screenshots.indexOf(item))
      }}
    />
  )

  const lightbox = (
    <ScreenshotLightbox
      title={title}
      screenshots={screenshots}
      index={open}
      onClose={() => setOpen(null)}
      returnFocusTo={opener}
    />
  )

  if (!large && phones.length > 1) {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        {phones.map((item, index) =>
          shot(item, {
            sizes: "(min-width: 768px) 120px, 30vw",
            className: cn(
              "w-1/3 max-w-[150px] rounded-xl",
              index % 2 === 1 && "-translate-y-3 hover:-translate-y-3.5",
            ),
          }),
        )}
        {lightbox}
      </div>
    )
  }

  // Tablet frames are portrait, so they sit side by side with the phone.
  if (large?.kind === "tablet") {
    return (
      <div className={cn("flex items-end justify-center gap-3", className)}>
        {shot(large, {
          sizes: "(min-width: 768px) 240px, 50vw",
          className: "w-[58%] max-w-[240px] rounded-xl",
        })}
        {phone &&
          shot(phone, {
            sizes: "(min-width: 768px) 140px, 30vw",
            className: "w-[34%] max-w-[140px] rounded-2xl",
          })}
        {lightbox}
      </div>
    )
  }

  return (
    <div className={cn("relative pb-6 pr-6", className)}>
      {large &&
        shot(large, {
          sizes: "(min-width: 768px) 280px, 90vw",
          className: "rounded-lg",
        })}
      {phone &&
        shot(phone, {
          sizes: "(min-width: 768px) 90px, 28vw",
          className: "absolute bottom-0 right-0 w-[30%] rounded-xl",
        })}
      {lightbox}
    </div>
  )
}
