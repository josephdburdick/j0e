"use client"

import snapshot from "@/data/bluesky-posts.json"
import { type BlueskyPost, fetchPosts } from "@/lib/bluesky.mjs"
import { useEffect, useState } from "react"

const initialPosts = snapshot.posts as BlueskyPost[]

/** One live fetch per page load, shared by every component that asks. */
let livePosts: Promise<BlueskyPost[]> | null = null

/**
 * Starts from the build-time snapshot so posts are in the static HTML, then
 * swaps in the live feed. Network failures keep the snapshot.
 */
export default function useBlueskyPosts() {
  const [posts, setPosts] = useState<BlueskyPost[]>(initialPosts)

  useEffect(() => {
    let active = true
    livePosts ??= fetchPosts(snapshot.handle)
    livePosts
      .then((fresh) => {
        if (active) setPosts(fresh)
      })
      .catch(() => {
        livePosts = null
      })
    return () => {
      active = false
    }
  }, [])

  return { posts, handle: snapshot.handle }
}
