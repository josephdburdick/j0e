import { Metadata } from "next"

import api from "../api"
import About from "./_content/About"
import Experience from "./_content/Experience"
import Intro from "./_content/Intro"
import Recommendations from "./_content/Recommendations"

export async function generateMetadata(): Promise<Metadata> {
  const data = await api()
  const { name, title, location, intro } = data.profile.attributes

  return {
    title: "Portfolio & Resume",
    description: `Portfolio and resume of ${name}, ${title} based in ${location}. ${intro}`,
    keywords: [
      "portfolio",
      "resume",
      "software engineer",
      "web developer",
      "React developer",
      "TypeScript",
      "design systems",
      "UX designer",
      "frontend engineer",
      "New York developer",
      "Brooklyn developer",
      name.toLowerCase(),
    ],
    openGraph: {
      title: `${name} - Portfolio & Resume`,
      description: `Portfolio and resume of ${name}, ${title} based in ${location}. ${intro}`,
      url: "https://j0e.me/",
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
          alt: `${name} - Software Engineer Portfolio Logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} - Portfolio & Resume`,
      description: `Portfolio and resume of ${name}, ${title} based in ${location}. ${intro}`,
      images: ["/assets/images/profile.webp", "/assets/images/meta/icon.png"],
    },
    alternates: {
      canonical: "https://j0e.me/",
    },
  }
}

export default async function Home() {
  return (
    <main className="duration-1000 animate-in fade-in">
      <Intro />
      <Recommendations />
      <Experience />
      <About />
    </main>
  )
}
