import { cn } from "@/lib/utils"
import Image from "next/image"

export type Screenshot = {
  src: string
  alt: string
  kind: "desktop" | "tablet" | "mobile"
}

// Must match the pixel sizes of the files in public/assets/images/shots.
const SIZES: Record<Screenshot["kind"], { width: number; height: number }> = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 900, height: 1200 },
  mobile: { width: 590, height: 989 },
}

function Shot({
  shot,
  className,
  sizes,
}: {
  shot: Screenshot
  className?: string
  sizes: string
}) {
  const { width, height } = SIZES[shot.kind]
  return (
    <a
      href={shot.src}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block overflow-hidden border border-border bg-background shadow-md transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none",
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
    </a>
  )
}

export function AppScreens({
  screenshots,
  className,
}: {
  screenshots: Screenshot[]
  className?: string
}) {
  const large = screenshots.find((shot) => shot.kind !== "mobile")
  const phone = screenshots.find((shot) => shot.kind === "mobile")
  if (!large && !phone) return null

  // Tablet frames are portrait, so they sit side by side with the phone.
  if (large?.kind === "tablet") {
    return (
      <div className={cn("flex items-end justify-center gap-3", className)}>
        <Shot
          shot={large}
          sizes="(min-width: 768px) 220px, 45vw"
          className="w-[55%] max-w-[220px] rounded-xl"
        />
        {phone && (
          <Shot
            shot={phone}
            sizes="(min-width: 768px) 130px, 28vw"
            className="w-[33%] max-w-[130px] rounded-2xl"
          />
        )}
      </div>
    )
  }

  return (
    <div className={cn("relative pb-6 pr-6", className)}>
      {large && (
        <Shot
          shot={large}
          sizes="(min-width: 768px) 280px, 90vw"
          className="rounded-lg"
        />
      )}
      {phone && (
        <Shot
          shot={phone}
          sizes="(min-width: 768px) 90px, 28vw"
          className="absolute bottom-0 right-0 w-[30%] rounded-xl"
        />
      )}
    </div>
  )
}
