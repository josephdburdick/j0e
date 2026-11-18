/**
 * Fetches recent Bluesky posts for the profile owner and writes a snapshot to
 * src/data/bluesky-posts.json, so posts render in the static HTML. The client
 * refreshes from the public API on load (see useBlueskyPosts).
 * If the fetch fails but a previous snapshot exists, the stale snapshot is kept.
 * Set BLUESKY_ACTOR to preview another account's posts locally.
 */
import fs from "fs/promises"
import path from "path"

import { BLUESKY_HANDLE, fetchPosts } from "../src/lib/bluesky.mjs"

const ACTOR = process.env.BLUESKY_ACTOR || BLUESKY_HANDLE
const OUT_FILE = path.join(process.cwd(), "src/data/bluesky-posts.json")

async function hasSnapshot() {
  try {
    await fs.access(OUT_FILE)
    return true
  } catch {
    return false
  }
}

let posts
try {
  posts = await fetchPosts(ACTOR)
  if (posts.length === 0 && (await hasSnapshot()))
    throw new Error("empty feed response")
} catch (error) {
  if (await hasSnapshot()) {
    console.warn(
      `Failed to fetch Bluesky posts (${error.message}) — keeping existing snapshot.`,
    )
    process.exit(0)
  }
  console.warn(
    `Failed to fetch Bluesky posts (${error.message}) — writing an empty snapshot.`,
  )
  posts = []
}

const snapshot = {
  handle: ACTOR,
  fetchedAt: new Date().toISOString(),
  posts,
}

await fs.writeFile(OUT_FILE, `${JSON.stringify(snapshot, null, 2)}\n`)
console.log(`Wrote ${OUT_FILE}: ${posts.length} posts from @${ACTOR}.`)
