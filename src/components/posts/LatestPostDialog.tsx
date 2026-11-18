"use client"

import Icon from "@/components/global/Icon"
import type { BlueskyPost } from "@/lib/bluesky.mjs"
import * as Dialog from "@radix-ui/react-dialog"

import PostCounts from "./PostCounts"
import PostMedia from "./PostMedia"
import PostText from "./PostText"
import PostTime from "./PostTime"

export default function LatestPostDialog({ post }: { post: BlueskyPost }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content className="fixed inset-x-4 top-24 z-50 mx-auto flex max-h-[calc(100dvh-8rem)] max-w-[480px] flex-col border-2 border-ink bg-surface text-ink shadow-[6px_6px_0_var(--ink)] focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <Dialog.Title className="label flex items-center gap-2.5 text-[12px] text-dim">
            <Icon.bluesky className="h-3.5 w-3.5 text-[#1185fe]" aria-hidden />
            <span>
              Latest <span className="text-brand">/</span>{" "}
              <PostTime iso={post.createdAt} />
            </span>
          </Dialog.Title>
          <Dialog.Close
            aria-label="Close"
            className="grid size-8 place-items-center border border-line text-ink transition-colors hover:bg-sunk"
          >
            <Icon.x className="h-4 w-4" aria-hidden />
          </Dialog.Close>
        </div>
        <Dialog.Description className="sr-only">
          Latest post from @j0e.me on Bluesky
        </Dialog.Description>

        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-5">
          {post.text && (
            <PostText
              segments={post.segments}
              className="text-lg leading-normal"
            />
          )}
          <PostMedia post={post} />
          <PostCounts counts={post.counts} />
        </div>

        <div className="grid grid-cols-2 border-t-2 border-ink text-[15px] font-semibold">
          <a
            href={post.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 border-r-2 border-ink px-4 py-3.5 transition-colors hover:bg-sunk"
          >
            <Icon.bluesky className="h-3.5 w-3.5 text-[#1185fe]" aria-hidden />
            Bluesky ↗
          </a>
          <a
            href={`/posts#${post.rkey}`}
            className="bg-ink px-4 py-3.5 text-center text-paper transition-colors hover:bg-brand hover:text-on-brand"
          >
            All posts →
          </a>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
