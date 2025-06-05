"use client"

import { useApi } from "@/components/providers/DataProvider"
import Image from "next/image"
import Link from "next/link"
import React from "react"

type LogoProps = {
  url?: string
  width?: number
  height?: number
  alt?: string
  name?: string
  logoSlot?: React.ReactNode
  href?: string
}

export default function Logo({
  url,
  width,
  height,
  alt,
  name,
  logoSlot,
  href = "/",
}: LogoProps) {
  const { data } = useApi()
  const logo = url
    ? { url, width, height, alt }
    : data?.profile?.attributes?.logo
  const displayName = name || data?.profile?.attributes?.name

  return (
    <h1 className="z-50 dark:invert">
      <Link href={href}>
        {logoSlot ||
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
