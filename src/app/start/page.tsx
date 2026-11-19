import { SiteHeader } from "@/components/global/SiteHeader"
import StartForm from "@/components/start/StartForm"
import { SOCIAL_IMAGE } from "@/lib/socialImage"
import { FALLBACK_EMAIL } from "@/lib/startForm"
import { Metadata } from "next"

const description =
  "Tell Joe what you're building. A few quick questions, then it lands in his inbox."

export const metadata: Metadata = {
  title: "Start a project",
  description,
  openGraph: {
    title: "Start a project",
    description,
    url: "https://j0e.me/start",
    type: "website",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Start a project",
    description,
    images: [SOCIAL_IMAGE],
  },
  alternates: {
    canonical: "https://j0e.me/start",
  },
}

export default function Start() {
  return (
    <>
      <SiteHeader />
      <main className="shell min-h-[70vh] text-[17px] leading-[1.55]">
        <noscript>
          <p className="py-10 text-lg">
            This form needs JavaScript. Email me at{" "}
            <a href={`mailto:${FALLBACK_EMAIL}`} className="text-link">
              {FALLBACK_EMAIL}
            </a>
            .
          </p>
        </noscript>
        <StartForm />
      </main>
    </>
  )
}
