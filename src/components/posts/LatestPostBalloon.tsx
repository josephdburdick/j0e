"use client"

import Icon from "@/components/global/Icon"
import useBlueskyPosts from "@/hooks/useBlueskyPosts"
import { summarizePost } from "@/lib/bluesky.mjs"
import { triggerHaptic } from "@/lib/haptics"
import * as Dialog from "@radix-ui/react-dialog"

import LatestPostDialog from "./LatestPostDialog"
import { postTimeLabel, useNow } from "./PostTime"

/** The newest Bluesky post as a speech balloon spoken by the logo. */
export default function LatestPostBalloon() {
  const { posts } = useBlueskyPosts()
  const now = useNow()
  const [latest] = posts
  if (!latest) return null

  const long = postTimeLabel(latest.createdAt, now, "long")
  const tiny = postTimeLabel(latest.createdAt, now, "tiny")

  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label={`Latest post, ${long}. Open.`}
        onClick={() => triggerHaptic("selection")}
        className="relative flex min-w-0 items-center gap-2.5 border-2 border-ink bg-surface px-2 py-1.5 text-sm font-medium text-ink shadow-[3px_3px_0_var(--ink)] transition-[transform,box-shadow] duration-75 animate-in fade-in zoom-in-75 fill-mode-both [animation-delay:400ms] [animation-duration:250ms] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_var(--ink)] motion-reduce:animate-none lg:px-3 lg:py-2 lg:shadow-[4px_4px_0_var(--ink)] xl:max-w-[300px]"
      >
        <svg
          aria-hidden
          viewBox="0 0 14 14"
          className="absolute right-full top-1/2 -mr-[2px] h-3.5 w-3.5 -translate-y-1/2 overflow-visible"
        >
          <path
            d="M14 1 L0 7 L14 13"
            fill="var(--surface)"
            stroke="var(--ink)"
            strokeWidth="2"
            strokeLinejoin="miter"
          />
        </svg>
        <Icon.bluesky
          aria-hidden
          className="hidden h-3.5 w-3.5 shrink-0 text-[#1185fe] lg:block"
        />
        <span className="hidden min-w-0 truncate xl:block">
          {summarizePost(latest)}
        </span>
        <span className="label shrink-0 text-[11px] lg:hidden">{tiny}</span>
        <span className="label hidden shrink-0 text-[11px] text-dim lg:inline">
          {long}
        </span>
      </Dialog.Trigger>
      <LatestPostDialog post={latest} />
    </Dialog.Root>
  )
}
