export interface NavTab {
  href: string
  label: string
  icon?: React.ReactNode
}

export interface NavPrimaryLink {
  href: string
  label: string
}

export const primaryLinks: NavPrimaryLink[] = [
  { href: "/", label: "Inicio" },
]

export const homeTabs: NavTab[] = []

export const tabs: NavTab[] = [
  { href: "/", label: "Mis Cursos" },
]
