export type Screenshot = {
  src: string
  alt: string
  kind: "wide" | "desktop" | "mobile"
  /** Address shown in the browser frame around a desktop shot. */
  url?: string
  /** Pixel size of the file in public/assets/images/shots. */
  width: number
  height: number
}
