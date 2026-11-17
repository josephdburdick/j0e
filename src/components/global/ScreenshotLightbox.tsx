"use client"

import { triggerHaptic } from "@/lib/haptics"
import type { Screenshot } from "@/lib/screenshots"
import { cn } from "@/lib/utils"
import { Carousel } from "@present-day/carousel"
import * as Dialog from "@radix-ui/react-dialog"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
} from "@radix-ui/react-icons"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const navButton =
  "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-0 sm:grid"

export function ScreenshotLightbox({
  title,
  screenshots,
  index,
  onClose,
  returnFocusTo,
}: {
  title: string
  screenshots: Screenshot[]
  /** The slide to open on; null keeps the lightbox closed. */
  index: number | null
  onClose: () => void
  /** Focused on close, since the lightbox opens without a Dialog.Trigger. */
  returnFocusTo?: HTMLElement | null
}) {
  const content = useRef<HTMLDivElement>(null)
  // Keeps the gallery rendered while the close animation plays.
  const [shown, setShown] = useState(index)
  if (index !== null && index !== shown) setShown(index)

  return (
    <Dialog.Root
      open={index !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          ref={content}
          tabIndex={-1}
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            content.current?.focus()
          }}
          onCloseAutoFocus={(event) => {
            if (!returnFocusTo) return
            event.preventDefault()
            returnFocusTo.focus()
          }}
          className="fixed inset-0 z-50 flex flex-col text-white outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        >
          {shown !== null && (
            <Gallery
              key={shown}
              title={title}
              screenshots={screenshots}
              initial={shown}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Gallery({
  title,
  screenshots,
  initial,
}: {
  title: string
  screenshots: Screenshot[]
  initial: number
}) {
  const [slide, setSlide] = useState(initial)
  const last = screenshots.length - 1

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const step =
        event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0
      // The thumbnail tablist moves itself with the arrow keys.
      const inTablist =
        event.target instanceof Element &&
        event.target.closest('[role="tablist"]')
      if (!step || inTablist) return
      setSlide((current) => {
        const next = Math.min(Math.max(current + step, 0), last)
        if (next !== current) triggerHaptic("selection")
        return next
      })
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [last])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between gap-4 px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
        <div className="min-w-0">
          <Dialog.Title className="truncate text-sm font-semibold">
            {title}
          </Dialog.Title>
          <p className="text-xs tabular-nums text-white/60" aria-live="polite">
            {slide + 1} of {screenshots.length}
          </p>
        </div>
        <Dialog.Close
          className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Close"
        >
          <Cross2Icon className="size-5" />
        </Dialog.Close>
      </header>

      <Carousel
        aria-label={`${title} screenshots`}
        slide={slide}
        onSlideChange={setSlide}
        align="center"
        className="relative flex min-h-0 flex-1 flex-col"
        classNames={{
          track:
            "flex min-h-0 flex-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          slide: "flex w-full shrink-0 flex-col items-center gap-3 px-4 py-2",
        }}
      >
        {screenshots.map((shot) => (
          <Carousel.Slide key={shot.src}>
            <div className="flex min-h-0 w-full flex-1 items-center justify-center">
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                sizes="100vw"
                className={cn(
                  "max-h-full w-auto max-w-full object-contain shadow-2xl",
                  shot.kind === "mobile" ? "rounded-[1.75rem]" : "rounded-xl",
                )}
                draggable={false}
              />
            </div>
            <p className="max-w-prose text-balance text-center text-sm text-white/80">
              {shot.alt}
            </p>
          </Carousel.Slide>
        ))}
        <Carousel.Prev className={cn(navButton, "left-4")}>
          <ChevronLeftIcon className="size-6" />
        </Carousel.Prev>
        <Carousel.Next className={cn(navButton, "right-4")}>
          <ChevronRightIcon className="size-6" />
        </Carousel.Next>
        <Carousel.Markers
          aria-label="Choose a screenshot"
          classNames={{
            list: "flex justify-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3",
            marker:
              "overflow-hidden rounded-md ring-2 ring-transparent transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white aria-[selected=false]:opacity-50 aria-[selected=false]:hover:opacity-80 aria-selected:ring-white",
          }}
          renderMarker={(i) => {
            const shot = screenshots[i]
            const { width, height } = shot
            return (
              <Image
                src={shot.src}
                alt=""
                width={width}
                height={height}
                sizes="64px"
                className="block h-12 w-auto"
              />
            )
          }}
        />
      </Carousel>
    </div>
  )
}
