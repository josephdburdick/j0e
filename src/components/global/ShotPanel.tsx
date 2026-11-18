"use client"

import { ScreenshotLightbox } from "@/components/global/ScreenshotLightbox"
import { triggerHaptic } from "@/lib/haptics"
import type { Screenshot } from "@/lib/screenshots"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { type ReactNode, useState } from "react"

function shotClassName(shot: Screenshot, screenshots: Screenshot[]) {
  if (shot.kind === "wide") return "w-full max-w-[1080px]"
  const paired = screenshots.some((other) => other.kind !== shot.kind)
  if (shot.kind === "mobile") {
    return paired ? "w-[21%]" : "w-[calc(33.33%-14px)] max-w-[215px]"
  }
  return paired ? "w-[72%]" : "w-full max-w-[620px]"
}

function shotSizes(shot: Screenshot) {
  if (shot.kind === "wide") return "(min-width: 1240px) 1080px, 90vw"
  if (shot.kind === "mobile") return "(min-width: 768px) 215px, 30vw"
  return "(min-width: 1024px) 620px, 90vw"
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="[container-type:inline-size]">
      <div className="rounded-[15cqw] bg-[#101317] p-[3cqw] shadow-[0_24px_40px_-24px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/10">
        <div className="overflow-hidden rounded-[12cqw] bg-black">
          <div className="flex h-[10cqw] items-center justify-center">
            <span className="h-[4.6cqw] w-[26cqw] rounded-full bg-[#101317]" />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

function BrowserFrame({
  url,
  children,
}: {
  url?: string
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-[clamp(6px,1.2cqw,12px)] border border-line bg-surface shadow-[0_24px_40px_-24px_rgba(0,0,0,0.35)] [container-type:inline-size]">
      <div className="flex h-[clamp(20px,4.4cqw,40px)] items-center gap-[clamp(4px,0.9cqw,8px)] border-b border-line px-[clamp(8px,1.8cqw,16px)]">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="size-[clamp(5px,1cqw,10px)] shrink-0 rounded-full bg-line"
          />
        ))}
        {url && (
          <span className="mx-auto w-[46%] truncate rounded-[clamp(3px,0.6cqw,6px)] bg-sunk px-2 py-[0.3em] text-center font-mono text-[clamp(8px,1.5cqw,13px)] leading-none text-dim">
            {url}
          </span>
        )}
        {url && <span className="w-[clamp(23px,4.8cqw,46px)] shrink-0" />}
      </div>
      {children}
    </div>
  )
}

function Framed({ shot, children }: { shot: Screenshot; children: ReactNode }) {
  if (shot.kind === "mobile") return <PhoneFrame>{children}</PhoneFrame>
  if (shot.kind === "desktop")
    return <BrowserFrame url={shot.url}>{children}</BrowserFrame>
  return children
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
          <Framed shot={shot}>
            <Image
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes={shotSizes(shot)}
              loading="lazy"
              className="block h-auto w-full"
            />
          </Framed>
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
