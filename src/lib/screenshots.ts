export type Screenshot = {
  src: string
  alt: string
  kind: "desktop" | "tablet" | "mobile"
}

// Must match the pixel sizes of the files in public/assets/images/shots.
export const SCREENSHOT_SIZES: Record<
  Screenshot["kind"],
  { width: number; height: number }
> = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 900, height: 1200 },
  mobile: { width: 590, height: 989 },
}
