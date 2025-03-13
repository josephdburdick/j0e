import Icon from "@/components/global/Icon"
import { cn } from "@/lib/utils"
import React from "react"

interface ScrollHintProps {
  scrollHintOpacity: number
  scrollHintRef: React.RefObject<HTMLDivElement>
}

const ScrollHint: React.FC<ScrollHintProps> = ({
  scrollHintOpacity,
  scrollHintRef,
}) => {
  return (
    <div
      ref={scrollHintRef}
      className={cn(
        "absolute inset-x-0 bottom-0 hidden items-center justify-center pb-4 transition-opacity md:flex",
      )}
      style={{
        opacity: scrollHintOpacity,
      }}
    >
      <Icon.arrowBigDownDash className="animate-bounce text-muted" size={50} />
    </div>
  )
}

export default ScrollHint
