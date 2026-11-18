import Icon from "@/components/global/Icon"
import type { BlueskyPost } from "@/lib/bluesky.mjs"
import { cn } from "@/lib/utils"

function PostImages({ images }: Pick<BlueskyPost, "images">) {
  if (images.length === 0) return null
  const single = images.length === 1

  return (
    <div className={cn("grid gap-1", single ? "max-w-[400px]" : "grid-cols-2")}>
      {images.map((image) => (
        <a
          key={image.fullsize}
          href={image.fullsize}
          target="_blank"
          rel="noreferrer"
          className="block bg-sunk"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- remote CDN image in a static export */}
          <img
            src={image.thumb}
            alt={image.alt}
            loading="lazy"
            width={image.aspectRatio?.width}
            height={image.aspectRatio?.height}
            className={cn(
              "h-auto w-full object-cover",
              single ? "max-h-[32rem]" : "aspect-square",
            )}
          />
        </a>
      ))}
    </div>
  )
}

function hostname(uri: string) {
  try {
    return new URL(uri).hostname
  } catch {
    return uri
  }
}

export default function PostMedia({ post }: { post: BlueskyPost }) {
  const { external, quote, video } = post

  return (
    <>
      <PostImages images={post.images} />

      {video && (
        <a
          href={post.url}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "relative block max-w-[400px] border border-line bg-sunk",
            !video.thumbnail && "aspect-video",
          )}
        >
          {video.thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element -- remote CDN image in a static export
            <img
              src={video.thumbnail}
              alt={video.alt}
              loading="lazy"
              className="h-auto max-h-[32rem] w-full object-cover"
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="border-2 border-ink bg-paper p-3 text-ink">
              <Icon.play className="h-5 w-5" aria-hidden />
            </span>
          </span>
          <span className="sr-only">Watch video on Bluesky</span>
        </a>
      )}

      {external && (
        <a
          href={external.uri}
          target="_blank"
          rel="noreferrer"
          className="block max-w-[480px] border border-line transition-colors hover:bg-sunk"
        >
          {external.thumb && (
            // eslint-disable-next-line @next/next/no-img-element -- remote CDN image in a static export
            <img
              src={external.thumb}
              alt=""
              loading="lazy"
              className="aspect-[1.91/1] w-full bg-sunk object-cover"
            />
          )}
          <span className="flex flex-col gap-1 p-3 text-sm">
            <span className="font-semibold text-ink">{external.title}</span>
            {external.description && (
              <span className="line-clamp-2 text-dim">
                {external.description}
              </span>
            )}
            <span className="label truncate text-[11px] text-dim">
              {hostname(external.uri)}
            </span>
          </span>
        </a>
      )}

      {quote && (
        <a
          href={quote.url}
          target="_blank"
          rel="noreferrer"
          className="flex max-w-[480px] flex-col gap-1 border border-line p-3 text-sm transition-colors hover:bg-sunk"
        >
          <span className="label text-[11px] text-dim">@{quote.author}</span>
          {quote.text && (
            <span className="line-clamp-4 whitespace-pre-line text-ink">
              {quote.text}
            </span>
          )}
        </a>
      )}
    </>
  )
}
