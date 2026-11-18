export type Logo = {
  src: string
  width: number
  height: number
}

export type ContactLink = {
  url: string
  label: string
  icon: string
}

export interface Role {
  title: string
  type: string
  /* Surface `type` as a badge alongside the role's location */
  showType?: boolean
  /* Role is left off the résumé */
  disabled?: boolean
  date: {
    start: string
    end: string | null
  }
  duration: string
  location?: string
  remote?: boolean
  description: string
  skills: string[]
  engagements?: Engagement[]
}

export type TextLink = {
  label: string
  href: string
}

export interface Engagement {
  name: string
  href?: string
  note?: string
  /** Shown under the note, for an engagement with more than one destination. */
  links?: TextLink[]
  start: string
  end: string | null
}

export interface Job {
  company: string
  /** The company's own site, linked from its Experience header. */
  url?: string
  location: string
  logo?: Logo
  /* Item is permanently disabled */
  disabled?: boolean
  roles: Role[]
}

export type FavIcon = {
  href: string
  rel: string
  sizes: string
  type?: string
}

export type Experience = {
  company: string
  /** The company's own site, linked from its Experience header. */
  url?: string
  location?: string
  logo?: Logo
  /* Item is permanently disabled */
  disabled?: boolean
  /* Item is initially hidden */
  hidden?: boolean
  roles: Role[]
}

export type Recommendation = {
  name: string
  avatar: string
  title: string
  shortTitle: string
  date: string
  relationship: string
  body: string
}
