import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/resume", "/links", "/posts"].map((path) => ({
    url: `https://j0e.me${path}`,
    changeFrequency: "monthly",
  }))
}
