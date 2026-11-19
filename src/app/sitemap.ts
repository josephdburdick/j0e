import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/start", "/resume", "/links", "/posts"].map((path) => ({
    url: `https://j0e.me${path}`,
    changeFrequency: "monthly",
  }))
}
