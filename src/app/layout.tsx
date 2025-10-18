import { DataProvider } from "@/components/providers/DataProvider"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import api from "../api"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
  themeColor: "#000000",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://j0e.me"),
  title: {
    default: "Joe Burdick - Senior Software Engineer & Web Developer",
    template: "%s | Joe Burdick",
  },
  description:
    "Senior Software Engineer with 20+ years of experience building innovative web applications. Expert in React, TypeScript, design systems, and user experience. Currently at Unqork, previously founded E3R platform.",
  keywords: [
    "Joe Burdick",
    "software engineer",
    "web developer",
    "React",
    "TypeScript",
    "design systems",
    "UX",
    "UI",
    "frontend developer",
    "full stack developer",
    "New York",
    "Brooklyn",
    "Unqork",
    "web development",
    "JavaScript",
    "portfolio",
    "senior engineer",
    "tech lead",
    "product development",
  ],
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
  verification: {
    // oogle: "your-google-verification-code", // Add when available
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://j0e.me",
    title: "Joe Burdick - Senior Software Engineer & Web Developer",
    description:
      "Senior Software Engineer with 20+ years of experience building innovative web applications. Expert in React, TypeScript, design systems, and user experience.",
    siteName: "Joe Burdick Portfolio",
    images: [
      {
        url: "/assets/images/profile.webp",
        width: 96,
        height: 96,
        alt: "Joe Burdick - Professional Profile Picture",
      },
      {
        url: "/assets/images/meta/icon.png",
        width: 512,
        height: 512,
        alt: "Joe Burdick - Senior Software Engineer Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joe Burdick - Senior Software Engineer",
    description:
      "Senior Software Engineer with 20+ years of experience building innovative web applications. Expert in React, TypeScript, design systems, and UX.",
    creator: "@josephdburdick",
    site: "@josephdburdick",
    images: ["/assets/images/profile.webp", "/assets/images/meta/icon.png"],
  },
  alternates: {
    canonical: "https://j0e.me",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const data = await api()

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Joe Burdick",
              alternateName: "Joseph D Burdick",
              description:
                "Senior Software Engineer with 20+ years of experience building innovative web applications. Expert in React, TypeScript, design systems, and user experience.",
              url: "https://j0e.me",
              sameAs: [
                "https://linkedin.com/in/josephdburdick",
                "https://github.com/josephdburdick",
                "https://instagr.am/d00m.exe",
              ],
              jobTitle: "Senior Software Engineer",
              worksFor: {
                "@type": "Organization",
                name: "Present Day",
                url: "https://presentday.io",
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
              name: "Joe Burdick Portfolio",
              url: "https://j0e.me",
              description:
                "Portfolio and personal website of Joe Burdick, Senior Software Engineer",
              inLanguage: "en-US",
              author: {
                "@type": "Person",
                name: "Joe Burdick",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://j0e.me/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <DataProvider initialData={data}>{children}</DataProvider>
      </body>
    </html>
  )
}
