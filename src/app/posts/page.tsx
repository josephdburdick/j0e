import api from "@/api"
import Icon from "@/components/global/Icon"
import { SiteFooter } from "@/components/global/SiteFooter"
import { SiteHeader } from "@/components/global/SiteHeader"
import PostTimeline from "@/components/posts/PostTimeline"
import { BLUESKY_HANDLE, BLUESKY_PROFILE_URL } from "@/lib/bluesky.mjs"
import { SOCIAL_IMAGE } from "@/lib/socialImage"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const data = await api()
  const { name } = data.profile.attributes
  const description = `Recent posts from ${name} (@${BLUESKY_HANDLE}) on Bluesky.`

  return {
    title: "Posts",
    description,
    openGraph: {
      title: `${name} - Posts`,
      description,
      url: "https://j0e.me/posts",
      type: "website",
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} - Posts`,
      description,
      images: [SOCIAL_IMAGE],
    },
    alternates: {
      canonical: "https://j0e.me/posts",
    },
  }
}

export default function Posts() {
  return (
    <>
      <SiteHeader />
      <main className="shell text-[17px] leading-[1.55]">
        <section
          aria-labelledby="posts-title"
          className="flex flex-wrap items-end gap-x-16 gap-y-6 border-b border-line pb-10 pt-16 md:pt-[88px]"
        >
          <p className="label flex w-full items-baseline gap-3">
            <span className="text-dim">@{BLUESKY_HANDLE}</span>
            <span aria-hidden="true" className="text-brand">
              /
            </span>
            <span>Posts</span>
          </p>
          <h1
            id="posts-title"
            className="display flex-[1_1_420px] text-balance text-[clamp(34px,4.4vw,60px)] leading-none tracking-[-0.02em]"
          >
            Notes, half-thoughts and things I shipped.
          </h1>
          <div className="flex flex-[1_1_260px] flex-col items-start gap-3 text-dim">
            <p>Short posts from Bluesky, newest first.</p>
            <a
              href={BLUESKY_PROFILE_URL}
              target="_blank"
              rel="me noreferrer"
              className="inline-flex items-center gap-2 border-2 border-ink px-3.5 py-2.5 font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              <Icon.bluesky
                className="h-3.5 w-3.5 text-[#1185fe]"
                aria-hidden
              />
              Follow on Bluesky ↗
            </a>
          </div>
        </section>

        <PostTimeline />

        <p className="py-10 text-center md:py-14">
          <a href={BLUESKY_PROFILE_URL} className="text-link">
            See everything on Bluesky ↗
          </a>
        </p>
      </main>
      <SiteFooter />
    </>
  )
}
