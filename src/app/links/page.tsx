import api from "@/api"
import Icon from "@/components/global/Icon"
import Logo from "@/components/global/Logo"
import MainHeader from "@/components/global/MainHeader"
import LinkTree from "@/components/links/LinkTree"
import QRCodeButton from "@/components/links/QRCodeButton"
import { buttonVariants } from "@/components/ui/button"
import { ContactLink } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Metadata, Viewport } from "next"
import Link from "next/link"

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
      images: [
        {
          url: "/assets/images/profile.webp",
          width: 96,
          height: 96,
          alt: `${name} - Professional Profile Picture`,
        },
        {
          url: "/assets/images/meta/icon.png",
          width: 512,
          height: 512,
          alt: `${name} - Contact Information & Links Logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} - Contact & Links`,
      description: `All important links and contact information for ${name}. Find social media profiles, resume, portfolio, and professional contact details.`,
      images: ["/assets/images/profile.webp", "/assets/images/meta/icon.png"],
    },
    alternates: {
      canonical: "https://j0e.me/links",
    },
  }
}

export default async function Links() {
  const data = await api()
  const { logo } = data.site.attributes
  const { name } = data.profile.attributes

  const additionalLinks: ContactLink[] = [
    {
      url: "https://cue.quest",
      label: "Cue Quest",
      icon: "mapPin",
    },
    {
      url: "https://j0e.me",
      label: "j0e.me",
      icon: "globe",
    },
    {
      url: "https://docs.google.com/document/d/e/2PACX-1vRVYrg2Shu06oIPDsL1hbEJikpC--95EiFc_1WWw0LFGGlulfwDTiiltayjEBNJAWoXnvm0dYlcWc2f/pub",
      label: "Resume",
      icon: "fileText",
    },
    {
      url: "https://maps.app.goo.gl/NfePJCr5DY3wmy676",
      label: "Pool Table Map",
      icon: "map",
    },
  ]

  const links: ContactLink[] = [
    ...Object.values({
      ...(data.profile.attributes.links as Record<string, ContactLink>),
    }),
    ...additionalLinks,
  ]

  return (
    <main className="duration-1000 animate-in fade-in">
      <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-background to-background/80">
        <header className="relative top-0 z-0 flex flex-col items-center justify-center gap-3 p-4">
          <div className="flex w-full items-center justify-between gap-4">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
              )}
            >
              <Icon.arrowLeft />
            </Link>

            <Logo
              logoSlot={null}
              url={logo.url}
              width={logo.width}
              height={logo.height}
              alt={logo.alt}
              name={name}
            />

            <QRCodeButton />
          </div>
        </header>

        <div className="container relative z-20 mx-auto flex flex-1 flex-col px-4">
          <div className="flex flex-1 flex-col items-center justify-start">
            <LinkTree links={links} className="mx-auto w-full max-w-md" />
          </div>
        </div>

        <footer className="shrink py-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Present Day</p>
        </footer>
      </div>
    </main>
  )
}
