import { DataProvider } from "@/components/providers/DataProvider"
import type { Metadata, Viewport } from "next"
import { Archivo, Inter, JetBrains_Mono } from "next/font/google"

import api from "../api"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f4f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0e13" },
  ],
}

const SOCIAL_IMAGE = {
  url: "/assets/images/meta/social-card.png",
  width: 1200,
  height: 630,
  alt: "Joe Burdick: I design and build the whole product.",
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await api()
  const { title, description } = data.meta.attributes

  return {
    metadataBase: new URL("https://j0e.me"),
    title: {
      default: title,
      template: "%s | Joe Burdick",
    },
    description,
    authors: [{ name: "Joe Burdick", url: "https://j0e.me" }],
    creator: "Joe Burdick",
    publisher: "Joe Burdick",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/assets/images/meta/icon.png", sizes: "192x192" },
        {
          url: "/assets/images/meta/icon.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      apple: [{ url: "/assets/images/meta/icon.png", sizes: "180x180" }],
      shortcut: "/assets/images/meta/icon.png",
      other: [
        {
          rel: "apple-touch-startup-image",
          url: "/assets/images/meta/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png",
          media:
            "screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://j0e.me",
      title,
      description,
      siteName: "Joe Burdick",
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@josephdburdick",
      site: "@josephdburdick",
      images: [SOCIAL_IMAGE],
    },
    alternates: {
      canonical: "https://j0e.me",
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const data = await api()
  const { description } = data.meta.attributes
  const darkModeBootstrapScript = `(() => {
    try {
      const storedPreference = window.localStorage.getItem("darkMode")
      if (storedPreference === "true") {
        document.documentElement.classList.add("dark")
      } else if (storedPreference === "false") {
        document.documentElement.classList.remove("dark")
      }
    } catch {
      // Ignore when storage is unavailable.
    }
  })();`

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          id="dark-mode-bootstrap"
          dangerouslySetInnerHTML={{
            __html: darkModeBootstrapScript,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Joe Burdick",
              alternateName: "Joseph D Burdick",
              description,
              url: "https://j0e.me",
              sameAs: [
                "https://linkedin.com/in/josephdburdick",
                "https://github.com/josephdburdick",
                "https://instagr.am/d00m.exe",
              ],
              jobTitle: "Founder & Principal Engineer",
              worksFor: {
                "@type": "Organization",
                name: "Present Day",
                url: "https://present.day",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Brooklyn",
                addressRegion: "NY",
                addressCountry: "US",
              },
              knowsAbout: [
                "React",
                "TypeScript",
                "JavaScript",
                "Web Development",
                "Design Systems",
                "UX/UI",
                "Frontend Development",
                "Software Engineering",
                "Product Development",
              ],
              hasOccupation: {
                "@type": "Occupation",
                name: "Software Engineer",
                occupationLocation: {
                  "@type": "City",
                  name: "New York",
                },
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Joe Burdick",
              url: "https://j0e.me",
              description,
              inLanguage: "en-US",
              author: {
                "@type": "Person",
                name: "Joe Burdick",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${archivo.variable} ${jetbrainsMono.variable}`}
      >
        <DataProvider initialData={data}>{children}</DataProvider>
      </body>
    </html>
  )
}
