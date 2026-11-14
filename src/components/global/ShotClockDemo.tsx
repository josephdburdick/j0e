"use client"

import { triggerHaptic } from "@/lib/haptics"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

const SHOT = 30
const EXTENSION = 10
const SIZE = 132
const CENTER = SIZE / 2

// Server and client trig can differ in the last digit, which breaks hydration.
const round = (value: number) => Math.round(value * 100) / 100

export function ShotClockDemo({ className }: { className?: string }) {
  const [left, setLeft] = useState(SHOT)
  const [running, setRunning] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    timer.current = window.setInterval(() => {
      setLeft((value) => {
        const next = Math.max(0, value - 1)
        if (next === 0) {
          setRunning(false)
          triggerHaptic("heavy")
        } else if (next === 10 || next === 5) {
          triggerHaptic("warning")
        }
        return next
      })
    }, 1000)
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current)
    }
  }, [running])

  const tone = left <= 5 ? "red" : left <= 10 ? "amber" : "ok"
  const toneText = {
    ok: "text-foreground",
    amber: "text-amber-500",
    red: "text-red-500",
  }[tone]
  const toneStroke = {
    ok: "stroke-foreground",
    amber: "stroke-amber-500",
    red: "stroke-red-500",
  }[tone]

  const toggle = () => {
    triggerHaptic("selection")
    if (!running && left === 0) setLeft(SHOT)
    setRunning((value) => !value)
  }
  const extend = () => {
    triggerHaptic("light")
    setLeft((value) => Math.min(SHOT, value + EXTENSION))
  }
  const reset = () => {
    triggerHaptic("light")
    setRunning(false)
    setLeft(SHOT)
  }

  const buttonClass =
    "rounded-md border border-border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

  return (
    <div
      className={cn("flex flex-col items-center gap-4", className)}
      role="group"
      aria-label="Shot clock demo"
    >
      <div className="relative size-[132px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0"
          aria-hidden="true"
        >
          {Array.from({ length: SHOT }, (_, i) => {
            const angle = (i / SHOT) * Math.PI * 2 - Math.PI / 2
            const r1 = 56
            const r2 = 63
            return (
              <line
                key={i}
                x1={round(CENTER + r1 * Math.cos(angle))}
                y1={round(CENTER + r1 * Math.sin(angle))}
                x2={round(CENTER + r2 * Math.cos(angle))}
                y2={round(CENTER + r2 * Math.sin(angle))}
                strokeWidth={3}
                strokeLinecap="round"
                className={cn(
                  "transition-colors duration-200 motion-reduce:duration-0",
                  i < left ? toneStroke : "stroke-border",
                )}
              />
            )
          })}
        </svg>
        <span
          className={cn(
            "absolute inset-0 grid place-items-center text-5xl font-bold tabular-nums transition-colors duration-200 motion-reduce:duration-0",
            toneText,
          )}
        >
          {left}
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={toggle}
          className={cn(
            buttonClass,
            "border-foreground bg-foreground text-background hover:bg-foreground/90",
          )}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button type="button" onClick={extend} className={buttonClass}>
          + Extension
        </button>
        <button type="button" onClick={reset} className={buttonClass}>
          Reset
        </button>
      </div>
    </div>
  )
}
