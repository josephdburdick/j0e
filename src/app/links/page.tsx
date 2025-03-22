import api from "@/api"
import Icon from "@/components/global/Icon"
import MainHeader from "@/components/global/MainHeader"
import QRCodeDialog from "@/components/global/QRCodeDialog"
import LinkTree from "@/components/links/LinkTree"
import QRCodeButton from "@/components/links/QRCodeButton"
import { Button, buttonVariants } from "@/components/ui/button"
import { ContactLink } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Metadata, Viewport } from "next"
import { headers } from "next/headers"
import Link from "next/link"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: "Links",
  description: "All my important links in one place",
}

export default async function Links() {
  const data = await api()

  const additionalLinks: ContactLink[] = [
    {
      url: "https://j0e.me",
      label: "Website",
      icon: "globe",
    },
    {
      url: "https://docs.google.com/document/d/e/2PACX-1vRVYrg2Shu06oIPDsL1hbEJikpC--95EiFc_1WWw0LFGGlulfwDTiiltayjEBNJAWoXnvm0dYlcWc2f/pub",
      label: "Resume",
      icon: "fileText",
    },
    {
      url: "https://maps.app.goo.gl/NfePJCr5DY3wmy676",
      label: "My Pool Table Map",
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
        <MainHeader className="flex shrink flex-col justify-center gap-3 p-8" />
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "absolute left-4 top-6 rounded-full",
          )}
        >
          <Icon.arrowLeft />
        </Link>

        <QRCodeButton />

        <div className="container relative z-20 mx-auto flex flex-1 flex-col px-4">
          <div className="flex flex-1 flex-col items-center justify-start">
            <LinkTree links={links} className="mx-auto w-full max-w-md" />
          </div>
        </div>

        <footer className="shrink py-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Present Day</p>
        </footer>
      </div>
    </main>
  )
}
