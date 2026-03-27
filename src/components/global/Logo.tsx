"use client"

import { useApi } from "@/components/providers/DataProvider"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useId, useMemo, useRef, useState } from "react"

type LogoProps = {
  url?: string
  width?: number
  height?: number
  alt?: string
  name?: string
  logoSlot?: React.ReactNode
  href?: string
  svgFillUrl?: string
  svgHoverFillUrls?: string[]
  svgHoverCycleMs?: number
  svgRandomizeOnLoad?: boolean
}

const SVG_FILLABLE_TAGS = new Set([
  "path",
  "rect",
  "circle",
  "ellipse",
  "polygon",
  "polyline",
  "text",
])

const SVG_NO_FILL_TAGS = new Set([
  "defs",
  "clipPath",
  "mask",
  "pattern",
  "linearGradient",
  "radialGradient",
  "stop",
  "title",
  "desc",
  "metadata",
  "style",
  "script",
  "image",
])

const HOVER_INTENT_DELAY_MS = 150

function shouldAvoidHeavyPreload(): boolean {
  if (typeof navigator === "undefined") return false
  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string }
  }).connection
  if (!connection) return false
  return (
    connection.saveData === true ||
    connection.effectiveType === "slow-2g" ||
    connection.effectiveType === "2g"
  )
}

function parseSvgViewBox(svg: React.ReactElement): {
  x: number
  y: number
  width: number
  height: number
} {
  const vb = svg.props.viewBox
  if (typeof vb === "string") {
    const parts = vb
      .trim()
      .split(/[\s,]+/)
      .map(Number)
    if (
      parts.length === 4 &&
      parts.every((n) => typeof n === "number" && !Number.isNaN(n))
    ) {
      return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] }
    }
  }
  const parseLen = (v: unknown): number | null => {
    if (typeof v === "number" && !Number.isNaN(v)) return v
    if (typeof v === "string") {
      const n = parseFloat(v)
      return Number.isNaN(n) ? null : n
    }
    return null
  }
  const w = parseLen(svg.props.width)
  const h = parseLen(svg.props.height)
  if (w !== null && h !== null) {
    return { x: 0, y: 0, width: w, height: h }
  }
  return { x: 0, y: 0, width: 162, height: 50 }
}

function normalizeSvgColor(value: string | undefined): string {
  if (!value) return ""
  return value.trim().toLowerCase()
}

function isWhitePaint(color: string): boolean {
  const c = normalizeSvgColor(color)
  return (
    c === "#fff" ||
    c === "#ffffff" ||
    c === "white" ||
    c === "rgb(255, 255, 255)" ||
    c === "rgb(255,255,255)"
  )
}

function isBlackPaint(color: string): boolean {
  const c = normalizeSvgColor(color)
  return (
    c === "#000" ||
    c === "#000000" ||
    c === "black" ||
    c === "rgb(0, 0, 0)" ||
    c === "rgb(0,0,0)"
  )
}

/** Luminance mask: white = show GIF, black = transparent outside shapes. */
function maskFillFromLogoFill(fill: string | undefined): string {
  if (!fill || fill === "none" || fill === "transparent") return "none"
  if (isWhitePaint(fill)) return "#000"
  if (isBlackPaint(fill)) return "#fff"
  return "#fff"
}

function applyMaskToSvgChildren(node: React.ReactNode): React.ReactNode {
  return React.Children.map(node, (child) => {
    if (!React.isValidElement(child)) return child
    if (typeof child.type !== "string") {
      if (!child.props.children) return child
      return React.cloneElement(child, {
        children: applyMaskToSvgChildren(child.props.children),
      })
    }

    const tag = child.type
    if (SVG_NO_FILL_TAGS.has(tag)) {
      return child
    }

    const updatedChildren = child.props.children
      ? applyMaskToSvgChildren(child.props.children)
      : child.props.children

    if (SVG_FILLABLE_TAGS.has(tag)) {
      const fillProp = child.props.fill as string | undefined
      const strokeProp = child.props.stroke as string | undefined
      const hasExplicitFill =
        fillProp !== undefined &&
        fillProp !== "none" &&
        fillProp !== "transparent"
      const hasStroke =
        strokeProp !== undefined &&
        strokeProp !== "none" &&
        strokeProp !== "transparent"

      const maskFill = hasExplicitFill ? maskFillFromLogoFill(fillProp) : "none"
      const maskStroke = hasStroke ? "#fff" : "none"

      return React.cloneElement(child, {
        ...child.props,
        fill: maskFill,
        stroke: maskStroke,
        children: updatedChildren,
      })
    }

    if (updatedChildren !== child.props.children) {
      return React.cloneElement(child, {
        ...child.props,
        children: updatedChildren,
      })
    }

    return child
  })
}

export function Logo({
  url,
  width,
  height,
  alt,
  name,
  logoSlot,
  href = "/",
  svgFillUrl,
  svgHoverFillUrls = [],
  svgHoverCycleMs = 220,
  svgRandomizeOnLoad = true,
}: LogoProps) {
  const { data } = useApi()
  const logo = url
    ? { url, width, height, alt }
    : data?.profile?.attributes?.logo
  const displayName = name || data?.profile?.attributes?.name
  const fillMaskId = useId().replace(/:/g, "")
  const hoverTimer = useRef<number | null>(null)
  const hoverIntentTimer = useRef<number | null>(null)
  /** False until mounted: mobile-safe first paint matches SSR; then reflects fine pointer + hover. */
  const [canHoverLoop, setCanHoverLoop] = useState(false)
  const [hasHoverIntent, setHasHoverIntent] = useState(false)
  const [activeSvgFillUrl, setActiveSvgFillUrl] = useState<string | undefined>(
    svgFillUrl,
  )

  const hoverFillPool = useMemo(() => {
    const values = [svgFillUrl, ...svgHoverFillUrls].filter(
      (value): value is string => Boolean(value),
    )
    return values.filter((value, index) => values.indexOf(value) === index)
  }, [svgFillUrl, svgHoverFillUrls])

  /** Which GIF is visible; falls back so SSR / pre-effect paint still shows one fill. */
  const resolvedFillUrl = useMemo(
    () => activeSvgFillUrl ?? svgFillUrl ?? hoverFillPool[0],
    [activeSvgFillUrl, svgFillUrl, hoverFillPool],
  )

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setCanHoverLoop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (hoverFillPool.length === 0) {
      setActiveSvgFillUrl(undefined)
      return
    }

    const next =
      svgRandomizeOnLoad && hoverFillPool.length > 1 && canHoverLoop
        ? hoverFillPool[Math.floor(Math.random() * hoverFillPool.length)]
        : (svgFillUrl ?? hoverFillPool[0])

    setActiveSvgFillUrl(next)
  }, [hoverFillPool, svgFillUrl, svgRandomizeOnLoad, canHoverLoop])

  useEffect(() => {
    return () => {
      if (hoverIntentTimer.current !== null) {
        window.clearTimeout(hoverIntentTimer.current)
      }
      if (hoverTimer.current !== null) {
        window.clearInterval(hoverTimer.current)
      }
    }
  }, [])

  const stopHoverCycle = () => {
    if (hoverTimer.current !== null) {
      window.clearInterval(hoverTimer.current)
      hoverTimer.current = null
    }
  }

  const startHoverCycle = () => {
    if (!canHoverLoop || hoverFillPool.length <= 1) return
    if (hoverTimer.current !== null) {
      window.clearInterval(hoverTimer.current)
      hoverTimer.current = null
    }
    let index = Math.max(hoverFillPool.indexOf(activeSvgFillUrl ?? ""), 0)
    hoverTimer.current = window.setInterval(() => {
      index = (index + 1) % hoverFillPool.length
      setActiveSvgFillUrl(hoverFillPool[index])
    }, svgHoverCycleMs)
  }

  useEffect(() => {
    if (!canHoverLoop || !hasHoverIntent || hoverFillPool.length <= 1) return
    if (shouldAvoidHeavyPreload()) return

    const currentIndex = Math.max(hoverFillPool.indexOf(resolvedFillUrl ?? ""), 0)
    const nextFillUrl = hoverFillPool[(currentIndex + 1) % hoverFillPool.length]
    if (!nextFillUrl || nextFillUrl === resolvedFillUrl) return

    const preloadNextFill = () => {
      const image = new window.Image()
      image.decoding = "async"
      image.src = nextFillUrl
    }

    const idleWindow = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (
          callback: IdleRequestCallback,
          options?: IdleRequestOptions,
        ) => number
        cancelIdleCallback?: (handle: number) => void
      }

    if (typeof idleWindow.requestIdleCallback === "function") {
      const idleId = idleWindow.requestIdleCallback(preloadNextFill, {
        timeout: 500,
      })
      return () => {
        if (typeof idleWindow.cancelIdleCallback === "function") {
          idleWindow.cancelIdleCallback(idleId)
        }
      }
    }

    const timeoutId = setTimeout(preloadNextFill, 0)
    return () => clearTimeout(timeoutId)
  }, [canHoverLoop, hasHoverIntent, hoverFillPool, resolvedFillUrl])

  const hasFillableSvgSlot =
    React.isValidElement(logoSlot) && logoSlot.type === "svg"

  const filledSvgLogo = useMemo(() => {
    if (
      !hasFillableSvgSlot ||
      !resolvedFillUrl ||
      !React.isValidElement(logoSlot)
    ) {
      return logoSlot
    }

    const maskChildren = applyMaskToSvgChildren(logoSlot.props.children)
    const { x: vbX, y: vbY, width: vbW, height: vbH } =
      parseSvgViewBox(logoSlot)

    return React.cloneElement(logoSlot, {
      children: (
        <>
          <defs>
            <mask
              id={fillMaskId}
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
              x={vbX}
              y={vbY}
              width={vbW}
              height={vbH}
            >
              <rect x={vbX} y={vbY} width={vbW} height={vbH} fill="#000" />
              {maskChildren}
            </mask>
          </defs>
          {resolvedFillUrl && (
            <image
              href={resolvedFillUrl}
              x={vbX}
              y={vbY}
              width={vbW}
              height={vbH}
              preserveAspectRatio="xMidYMid slice"
              mask={`url(#${fillMaskId})`}
              opacity={1}
            />
          )}
        </>
      ),
    })
  }, [
    resolvedFillUrl,
    fillMaskId,
    hasFillableSvgSlot,
    logoSlot,
  ])

  return (
    <h1 className="z-50 dark:invert">
      <Link
        href={href}
        onMouseEnter={() => {
          if (!canHoverLoop || hoverFillPool.length <= 1) return
          if (hasHoverIntent) {
            startHoverCycle()
            return
          }

          if (hoverIntentTimer.current !== null) {
            window.clearTimeout(hoverIntentTimer.current)
          }

          hoverIntentTimer.current = window.setTimeout(() => {
            hoverIntentTimer.current = null
            setHasHoverIntent(true)
            startHoverCycle()
          }, HOVER_INTENT_DELAY_MS)
        }}
        onMouseLeave={() => {
          if (hoverIntentTimer.current !== null) {
            window.clearTimeout(hoverIntentTimer.current)
            hoverIntentTimer.current = null
          }
          stopHoverCycle()
        }}
      >
        {filledSvgLogo ||
          (logo?.url && (
            <Image
              src={logo.url}
              width={logo.width}
              height={logo.height}
              alt={logo.alt}
            />
          ))}
        <span className="sr-only">{displayName}</span>
      </Link>
    </h1>
  )
}
