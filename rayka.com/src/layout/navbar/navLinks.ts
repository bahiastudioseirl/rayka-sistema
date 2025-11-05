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

// Tabs que se muestran en la página Home (vacío para no mostrar navegación)
export const homeTabs: NavTab[] = []

// Tabs que se muestran en las páginas internas
export const appTabs: NavTab[] = [
  { href: "/", label: "Home" },
  { href: "/cursos", label: "Mis Cursos" },
  { href: "/progreso", label: "Mi Progreso" },
]

// Exportación por defecto (para compatibilidad)
export const tabs: NavTab[] = [
  { href: "/cursos", label: "Mis Cursos" },
  { href: "/progreso", label: "Mi Progreso" },
]
