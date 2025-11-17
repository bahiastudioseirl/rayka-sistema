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



// Exportación por defecto (para compatibilidad)
export const tabs: NavTab[] = [
  { href: "/", label: "Mis Cursos" },
]
