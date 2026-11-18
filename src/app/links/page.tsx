import api from "@/api"
import { SiteHeader } from "@/components/global/SiteHeader"
import LinkTree, { type LinkItem } from "@/components/links/LinkTree"
import QRCodeButton from "@/components/links/QRCodeButton"
import { SOCIAL_IMAGE } from "@/lib/socialImage"
import { ContactLink } from "@/lib/types"
import { Metadata, Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await api()
  const { name } = data.profile.attributes

  return {
    title: "Contact & Links",
    description: `All important links and contact information for ${name}. Find social media profiles, resume, portfolio, and professional contact details in one convenient location.`,
    keywords: [
      "contact",
      "links",
      "social media",
      "resume",
      "portfolio",
      "professional links",
      "developer contacts",
      "software engineer contacts",
      name.toLowerCase(),
      "linkedin",
      "github",
      "instagram",
    ],
    openGraph: {
      title: `${name} - Contact & Links`,
      description: `All important links and contact information for ${name}. Find social media profiles, resume, portfolio, and professional contact details.`,
      url: "https://j0e.me/links",
      type: "website",
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} - Contact & Links`,
      description: `All important links and contact information for ${name}. Find social media profiles, resume, portfolio, and professional contact details.`,
      images: [SOCIAL_IMAGE],
    },
    alternates: {
      canonical: "https://j0e.me/links",
    },
  }
}

export default async function Links() {
  const data = await api()

  const links: LinkItem[] = [
    ...Object.entries(
      data.profile.attributes.links as Record<string, ContactLink>,
    ).map(([id, link]) => ({ id, ...link })),
    {
      id: "cue-quest",
      url: "https://cue.quest",
      label: "Cue Quest",
      icon: "mapPin",
    },
    {
      id: "posts",
      url: "https://j0e.me/posts",
      label: "Posts",
      icon: "send",
    },
    {
      id: "j0eme",
      url: "https://j0e.me",
      label: "j0e.me",
      icon: "globe",
    },
    {
      id: "resume",
      url: "https://j0e.me/resume",
      label: "Résumé",
      icon: "fileText",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="shell flex-1">
        <section
          aria-labelledby="links-title"
          className="flex flex-col gap-6 pb-10 pt-10 md:gap-8 md:pb-16 md:pt-[88px]"
        >
          <h1
            id="links-title"
            className="display text-[clamp(46px,8.6vw,132px)] leading-[0.96] tracking-[-0.03em]"
          >
            Links
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-x-16 gap-y-5">
            <p className="max-w-[54ch] text-xl text-dim">
              Where to find me. Open a row for a QR code to hand to another
              device.
            </p>
            <QRCodeButton />
          </div>
        </section>
        <LinkTree links={links} className="max-w-[760px]" />
      </main>
      <footer className="shell pb-8 pt-12 text-sm text-dim">
        <p>&copy; {new Date().getFullYear()} Present Day</p>
      </footer>
    </div>
  )
}
