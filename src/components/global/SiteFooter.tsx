import api from "@/api"
import Link from "next/link"

type FooterLink = { label: string; url: string }

export async function SiteFooter() {
  const data = await api()
  const { contact, footer } = data.site.attributes
  const { name } = data.profile.attributes

  return (
    <>
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="bg-brand text-on-brand"
      >
        <div className="shell flex flex-wrap items-end justify-between gap-x-16 gap-y-8 py-24">
          <h2
            id="contact-title"
            className="display flex-[2_1_480px] text-balance text-[clamp(36px,4.8vw,72px)] leading-none tracking-[-0.02em]"
          >
            {contact.headline}
          </h2>
          <div className="flex flex-[1_1_280px] flex-col items-start gap-4">
            <a
              href={contact.cta.url}
              className="bg-on-brand px-[26px] py-4 font-semibold text-brand transition-opacity hover:opacity-90"
            >
              {contact.cta.label}
            </a>
            <p className="text-[15px]">{contact.note}</p>
          </div>
        </div>
      </section>
      <footer className="shell flex flex-col gap-5 pb-8 pt-10">
        <p
          aria-hidden="true"
          className="pl-[0.05em] font-display text-[clamp(64px,15vw,220px)] font-black leading-[0.85] tracking-[-0.04em] [font-stretch:125%]"
        >
          j<span className="text-brand">0</span>e.me
        </p>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-dim">
          <span>{name}, Brooklyn</span>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {(footer as FooterLink[]).map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  className="inline-block py-3 underline underline-offset-4 hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/links"
                className="inline-block py-3 underline underline-offset-4 hover:text-ink"
              >
                All links
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}
