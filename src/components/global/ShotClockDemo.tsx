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

// Shot Clock's own palette (src/ui/theme.ts in the app), kept dark in both
// site themes because the app only ships dark.
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
    ok: "text-white",
    amber: "text-[#F59E0B]",
    red: "text-[#FF3B30]",
  }[tone]
  const toneStroke = {
    ok: "stroke-[#22C55E]",
    amber: "stroke-[#F59E0B]",
    red: "stroke-[#FF3B30]",
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
    "rounded-md border border-[#292524] px-2.5 py-1.5 text-sm font-semibold text-[#F2F2F2] transition-colors hover:bg-[#1C1917] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]"

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-2xl bg-[#0C0A09] px-3 py-5",
        className,
      )}
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
                  i < left ? toneStroke : "stroke-[#292524]",
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
      <div className="flex flex-wrap justify-center gap-1.5">
        <button
          type="button"
          onClick={toggle}
          className={cn(
            buttonClass,
            "border-[#22C55E] bg-[#22C55E] text-[#052E16] hover:bg-[#16A34A]",
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
