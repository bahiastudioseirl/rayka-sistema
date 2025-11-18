import { useState } from "react"
import { useLocation } from "react-router-dom"
import Navbar from "./Navbar"
import { MobileMenu } from "./MobileMenu"
import { homeTabs} from "./navLinks"


export const NavbarSection = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Determinar qué tabs mostrar según la página actual
  const getTabsForCurrentPage = () => {
    // Si estamos en la página principal (lista de cursos), no mostrar tabs
    if (location.pathname === '/') {
      return homeTabs // Array vacío
    }
    // Si estamos dentro de un curso, mostrar navegación con "Mis Cursos"
    
    // Por defecto, no mostrar tabs
    return homeTabs
  }

  const currentTabs = getTabsForCurrentPage()

  return (
    <>
      <Navbar
        appName="Rayka Academy"
        subtitle="Plataforma de Cursos"
        logoSrc="{logo}"
        userName="Plataforma de Cursos"
        onLogout={() => console.log("logout")}
        tabs={currentTabs}
      />
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} tabs={currentTabs} />
    </>
  )
}
