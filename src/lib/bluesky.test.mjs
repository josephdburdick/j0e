import assert from "node:assert/strict"
import { test } from "node:test"

import {
  keepNonEmpty,
  normalizeFeed,
  rkeyFromHash,
  summarizePost,
  toSegments,
} from "./bluesky.mjs"

const link = (byteStart, byteEnd, uri) => ({
  index: { byteStart, byteEnd },
  features: [{ $type: "app.bsky.richtext.facet#link", uri }],
})

const feedItem = (overrides = {}) => ({
  post: {
    uri: "at://did:plc:x/app.bsky.feed.post/3abc",
    author: { handle: "j0e.me" },
    record: { text: "hi", createdAt: "2026-11-18T12:00:00.000Z" },
    indexedAt: "2026-11-18T12:00:01.000Z",
    ...overrides.post,
  },
  ...overrides.item,
})

const basePost = {
  uri: "at://did:plc:x/app.bsky.feed.post/3abc",
  rkey: "3abc",
  url: "https://bsky.app/profile/j0e.me/post/3abc",
  createdAt: "2026-11-18T12:00:00.000Z",
  text: "",
  segments: [],
  images: [],
  counts: { likes: 0, reposts: 0, replies: 0 },
}

test("toSegments wraps a link after an emoji", () => {
  const text = "👋 see https://x.co"
  assert.deepEqual(toSegments(text, [link(9, 21, "https://x.co")]), [
    { text: "👋 see " },
    { text: "https://x.co", href: "https://x.co" },
  ])
})

test("toSegments maps mentions and tags", () => {
  const segments = toSegments("@a #foo bar", [
    {
      index: { byteStart: 0, byteEnd: 2 },
      features: [
        { $type: "app.bsky.richtext.facet#mention", did: "did:plc:a" },
      ],
    },
    {
      index: { byteStart: 3, byteEnd: 11 },
      features: [{ $type: "app.bsky.richtext.facet#tag", tag: "foo bar" }],
    },
  ])
  assert.equal(segments[0].href, "https://bsky.app/profile/did:plc:a")
  assert.equal(segments[2].href, "https://bsky.app/hashtag/foo%20bar")
})

test("normalizeFeed drops reposts and replies", () => {
  const posts = normalizeFeed([
    feedItem({
      item: { reason: { $type: "app.bsky.feed.defs#reasonRepost" } },
    }),
    feedItem({
      post: {
        record: { text: "re", reply: { parent: {}, root: {} } },
      },
    }),
    feedItem(),
  ])
  assert.equal(posts.length, 1)
})

test("normalizeFeed sets rkey and url", () => {
  const [post] = normalizeFeed([feedItem()])
  assert.equal(post.rkey, "3abc")
  assert.equal(post.url, "https://bsky.app/profile/j0e.me/post/3abc")
})

test("normalizeFeed unwraps recordWithMedia", () => {
  const [post] = normalizeFeed([
    feedItem({
      post: {
        embed: {
          $type: "app.bsky.embed.recordWithMedia#view",
          media: {
            $type: "app.bsky.embed.images#view",
            images: [{ thumb: "t", fullsize: "f", alt: "a" }],
          },
          record: {
            $type: "app.bsky.embed.record#view",
            record: {
              $type: "app.bsky.embed.record#viewRecord",
              uri: "at://did:plc:y/app.bsky.feed.post/3q",
              author: { handle: "someone.bsky.social" },
              value: { text: "quoted" },
            },
          },
        },
      },
    }),
  ])
  assert.equal(post.images.length, 1)
  assert.equal(post.quote.author, "someone.bsky.social")
})

test("summarizePost collapses whitespace", () => {
  assert.equal(summarizePost({ ...basePost, text: "  a\n b " }), "a b")
})

test("summarizePost falls back by media", () => {
  const image = { thumb: "t", fullsize: "f", alt: "" }
  assert.equal(
    summarizePost({ ...basePost, images: [image] }),
    "Shared a photo",
  )
  assert.equal(
    summarizePost({ ...basePost, video: { alt: "" } }),
    "Shared a video",
  )
  assert.equal(
    summarizePost({
      ...basePost,
      external: { uri: "https://x.co", title: "T", description: "" },
    }),
    "T",
  )
  assert.equal(summarizePost(basePost), "New post")
})

test("rkeyFromHash reads the id and survives malformed escapes", () => {
  assert.equal(rkeyFromHash("#3abc"), "3abc")
  assert.equal(rkeyFromHash(""), null)
  assert.equal(rkeyFromHash("#"), null)
  assert.doesNotThrow(() => rkeyFromHash("#%"))
  assert.equal(rkeyFromHash("#%"), null)
})

test("keepNonEmpty keeps current posts when a fetch comes back empty", () => {
  const current = [basePost]
  assert.equal(keepNonEmpty(current, []), current)
  const fresh = [{ ...basePost, rkey: "new" }]
  assert.equal(keepNonEmpty(current, fresh), fresh)
  assert.deepEqual(keepNonEmpty([], []), [])
})
