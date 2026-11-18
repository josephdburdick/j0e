/**
 * Plain ESM with no imports so the build-time snapshot script, the client
 * refresh hook and `node --test` all share one normalization: the snapshot
 * JSON and a live fetch always have the same shape.
 */

export const BLUESKY_HANDLE = "j0e.me"
export const BLUESKY_PROFILE_URL = `https://bsky.app/profile/${BLUESKY_HANDLE}`
export const BLUESKY_POST_LIMIT = 50

const API = "https://public.api.bsky.app/xrpc"

/**
 * @typedef {{ text: string, href?: string }} Segment
 * @typedef {{ thumb: string, fullsize: string, alt: string, aspectRatio?: { width: number, height: number } }} PostImage
 * @typedef {{ uri: string, title: string, description: string, thumb?: string }} PostExternal
 * @typedef {{ url: string, author: string, text: string }} PostQuote
 * @typedef {{
 *   uri: string,
 *   rkey: string,
 *   url: string,
 *   createdAt: string,
 *   text: string,
 *   segments: Segment[],
 *   images: PostImage[],
 *   external?: PostExternal,
 *   video?: { thumbnail?: string, alt: string },
 *   quote?: PostQuote,
 *   counts: { likes: number, reposts: number, replies: number },
 * }} BlueskyPost
 * @typedef {{ handle: string, fetchedAt: string, posts: BlueskyPost[] }} BlueskySnapshot
 */

/** @param {string} uri at://did/app.bsky.feed.post/rkey */
function postUrl(uri, handle) {
  const rkey = uri.split("/").pop()
  return `https://bsky.app/profile/${handle}/post/${rkey}`
}

/**
 * Split post text into plain and linked runs. Facet indices are UTF-8 byte
 * offsets, so slice the encoded bytes rather than the JS string.
 * @param {string} text
 * @param {any[] | undefined} facets
 * @returns {Segment[]}
 */
export function toSegments(text, facets) {
  if (!facets?.length) return [{ text }]

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const bytes = encoder.encode(text)
  const sorted = [...facets].sort(
    (a, b) => a.index.byteStart - b.index.byteStart,
  )

  /** @type {Segment[]} */
  const segments = []
  let cursor = 0
  for (const facet of sorted) {
    const { byteStart, byteEnd } = facet.index
    if (byteStart < cursor || byteEnd > bytes.length) continue

    const feature = facet.features?.[0]
    let href
    if (feature?.$type === "app.bsky.richtext.facet#link") href = feature.uri
    if (feature?.$type === "app.bsky.richtext.facet#mention")
      href = `https://bsky.app/profile/${feature.did}`
    if (feature?.$type === "app.bsky.richtext.facet#tag")
      href = `https://bsky.app/hashtag/${encodeURIComponent(feature.tag)}`
    if (!href) continue

    if (byteStart > cursor)
      segments.push({ text: decoder.decode(bytes.slice(cursor, byteStart)) })
    segments.push({
      text: decoder.decode(bytes.slice(byteStart, byteEnd)),
      href,
    })
    cursor = byteEnd
  }
  if (cursor < bytes.length)
    segments.push({ text: decoder.decode(bytes.slice(cursor)) })
  return segments
}

/** Pull the media out of an embed view, unwrapping recordWithMedia. */
function readEmbed(embed, post) {
  if (!embed) return

  switch (embed.$type) {
    case "app.bsky.embed.images#view":
      post.images = embed.images.map((image) => ({
        thumb: image.thumb,
        fullsize: image.fullsize,
        alt: image.alt ?? "",
        ...(image.aspectRatio && { aspectRatio: image.aspectRatio }),
      }))
      break
    case "app.bsky.embed.external#view":
      post.external = {
        uri: embed.external.uri,
        title: embed.external.title ?? "",
        description: embed.external.description ?? "",
        ...(embed.external.thumb && { thumb: embed.external.thumb }),
      }
      break
    case "app.bsky.embed.video#view":
      post.video = {
        ...(embed.thumbnail && { thumbnail: embed.thumbnail }),
        alt: embed.alt ?? "",
      }
      break
    case "app.bsky.embed.record#view": {
      const record = embed.record
      if (record?.$type === "app.bsky.embed.record#viewRecord") {
        post.quote = {
          url: postUrl(record.uri, record.author.handle),
          author: record.author.handle,
          text: record.value?.text ?? "",
        }
      }
      break
    }
    case "app.bsky.embed.recordWithMedia#view":
      readEmbed(embed.media, post)
      readEmbed(embed.record, post)
      break
  }
}

/**
 * Keep only original top-level posts by the account — no reposts, no replies.
 * @param {any[]} feed getAuthorFeed `feed` array
 * @returns {BlueskyPost[]}
 */
export function normalizeFeed(feed) {
  /** @type {BlueskyPost[]} */
  const posts = []
  for (const item of feed) {
    if (item.reason || item.post.record?.reply) continue

    const { post } = item
    const text = post.record?.text ?? ""
    /** @type {BlueskyPost} */
    const normalized = {
      uri: post.uri,
      rkey: post.uri.split("/").pop(),
      url: postUrl(post.uri, post.author.handle),
      createdAt: post.record?.createdAt ?? post.indexedAt,
      text,
      segments: toSegments(text, post.record?.facets),
      images: [],
      counts: {
        likes: post.likeCount ?? 0,
        reposts: post.repostCount ?? 0,
        replies: post.replyCount ?? 0,
      },
    }
    readEmbed(post.embed, normalized)
    posts.push(normalized)
  }
  return posts
}

/**
 * @param {string} [actor]
 * @returns {Promise<BlueskyPost[]>}
 */
export async function fetchPosts(actor = BLUESKY_HANDLE) {
  const params = new URLSearchParams({
    actor,
    filter: "posts_no_replies",
    limit: String(BLUESKY_POST_LIMIT),
  })
  const response = await fetch(`${API}/app.bsky.feed.getAuthorFeed?${params}`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const json = await response.json()
  return normalizeFeed(json.feed ?? [])
}

/**
 * One line for places that can't show the whole post, with a fallback for
 * posts that have no text.
 * @param {BlueskyPost} post
 */
export function summarizePost(post) {
  const text = post.text.replace(/\s+/g, " ").trim()
  if (text) return text
  if (post.images.length) return "Shared a photo"
  if (post.video) return "Shared a video"
  if (post.external?.title) return post.external.title
  return "New post"
}
