import { useState } from "react"
import { useLocation } from "react-router-dom"
import Navbar from "./Navbar"
import { MobileMenu } from "./MobileMenu"
import { homeTabs, appTabs } from "./navLinks"


export const NavbarSection = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Determinar qué tabs mostrar según la página actual
  const getTabsForCurrentPage = () => {
    // Si estamos en la página home, no mostrar tabs
    if (location.pathname === '/') {
      return homeTabs // Array vacío
    }
    // En cualquier otra página, mostrar navegación completa
    return appTabs
  }

  const currentTabs = getTabsForCurrentPage()

  return (
    <>
      <Navbar
        appName="Rayka Academy"
        subtitle="Bienvenido"
        logoSrc="{logo}"
        userName="Juan García"
        onLogout={() => console.log("logout")}
        tabs={currentTabs}
      />
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} tabs={currentTabs} />
    </>
  )
}
