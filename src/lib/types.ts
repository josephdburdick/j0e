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
  date: {
    start: string
    end: string | null
  }
  duration: string
  location?: string
  remote?: boolean
  description: string
  skills: string[]
}

export interface Job {
  company: string
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
