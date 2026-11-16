export type Screenshot = {
  src: string
  alt: string
  kind: "wide" | "desktop" | "mobile"
  /** Pixel size of the file in public/assets/images/shots. */
  width: number
  height: number
}
