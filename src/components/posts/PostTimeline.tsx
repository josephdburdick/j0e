"use client"

import useBlueskyPosts from "@/hooks/useBlueskyPosts"
import { BLUESKY_PROFILE_URL } from "@/lib/bluesky.mjs"
import { useEffect, useState } from "react"

import PostCounts from "./PostCounts"
import PostMedia from "./PostMedia"
import PostText from "./PostText"
import PostTime from "./PostTime"

function useHashId() {
  const [hashId, setHashId] = useState<string | null>(null)

  useEffect(() => {
    const read = () =>
      setHashId(decodeURIComponent(location.hash.slice(1)) || null)
    read()
    window.addEventListener("hashchange", read)
    return () => window.removeEventListener("hashchange", read)
  }, [])

  return hashId
}

export default function PostTimeline() {
  const { posts } = useBlueskyPosts()
  const hashId = useHashId()
  const hasTarget = posts.some((post) => post.rkey === hashId)

  // A post newer than the build only renders after the live fetch, too late
  // for the browser's own scroll to the hash.
  useEffect(() => {
    if (!hasTarget || !hashId) return
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches
    document.getElementById(hashId)?.scrollIntoView({
      block: "start",
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }, [hasTarget, hashId])

  if (posts.length === 0) {
    return (
      <p className="py-10 text-dim">
        No posts yet.{" "}
        <a href={BLUESKY_PROFILE_URL} className="text-link">
          Follow along on Bluesky
        </a>
      </p>
    )
  }

  return (
    <ol>
      {posts.map((post) => (
        <li key={post.uri} className="border-b border-line">
          <article
            id={post.rkey}
            data-highlight={post.rkey === hashId || undefined}
            className="grid scroll-mt-6 gap-2.5 py-6 data-[highlight]:-mx-5 data-[highlight]:bg-surface data-[highlight]:px-5 data-[highlight]:shadow-[inset_3px_0_0_var(--brand)] md:grid-cols-[150px_minmax(0,1fr)] md:gap-7 md:py-8 md:data-[highlight]:-mx-4 md:data-[highlight]:px-4"
          >
            <div className="label flex justify-between gap-4 pt-1 text-xs text-dim md:flex-col md:justify-start md:gap-2">
              <PostTime iso={post.createdAt} />
              <a
                href={post.url}
                target="_blank"
                rel="noreferrer"
                className="text-brand hover:text-ink"
              >
                Bluesky ↗
              </a>
            </div>
            <div className="flex max-w-[62ch] flex-col gap-3.5">
              {post.text && (
                <PostText
                  segments={post.segments}
                  className="text-[17px] leading-normal md:text-[19px]"
                />
              )}
              <PostMedia post={post} />
              <PostCounts counts={post.counts} />
            </div>
          </article>
        </li>
      ))}
    </ol>
  )
}
