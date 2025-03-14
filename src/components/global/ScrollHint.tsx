"use client"

import Icon from "@/components/global/Icon"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import React from "react"

interface ScrollHintProps {
  // You can keep any existing props you might need, but we'll remove
  // the scrollHintOpacity and scrollHintRef props since they'll be handled internally
}

const ScrollHint = (props: ScrollHintProps) => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollHintRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollHintOpacity = Math.max(
    0,
    1 - scrollPosition / (window.innerHeight / 1.25),
  )

  return (
    <div
      ref={scrollHintRef}
      style={{ opacity: scrollHintOpacity }}
      className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 transform sm:flex"
    >
      <div className="flex flex-col items-center gap-2 text-gray-200 dark:text-gray-700">
        <span className="text-xs">Scroll</span>
        <div className="animate-bounce">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M12 19L19 12M12 19L5 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default ScrollHint
