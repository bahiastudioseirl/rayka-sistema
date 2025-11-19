import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react'; // Agregamos Menu y X
import { menuItems, type MenuItem, type SubMenuItem } from '../context/items-sidebar';
import logoRayka from '../../assets/LogoRayka.png';

export const Sidebar = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Nuevo estado para móvil

  // Cierra el menú móvil automáticamente cuando cambia la ruta
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleExpand = (titulo: string) => {
    setExpandedItems(prev =>
      prev.includes(titulo)
        ? prev.filter(item => item !== titulo)
        : [...prev, titulo]
    );
  };

  const isItemActive = (item: MenuItem | SubMenuItem): boolean => {
    if ('link' in item && item.link) {
      return location.pathname === item.link;
    }
    if ('subMenu' in item && item.subMenu) {
      return item.subMenu.some(subItem => location.pathname === subItem.link);
    }
    return false;
  };

  const isExpanded = (titulo: string): boolean => {
    return expandedItems.includes(titulo);
  };

  return (
    <>
      {/* --- BARRA SUPERIOR MÓVIL (Solo visible en pantallas pequeñas) --- */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4 shadow-sm">
        <div className="h-8 w-auto">
             {/* Logo versión pequeña para la barra móvil */}
             <img src={logoRayka} alt="Logo Rayka" className="h-full w-auto object-contain" />
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* --- OVERLAY (Fondo oscuro al abrir en móvil) --- */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[45] md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR PRINCIPAL --- */}
      <div className={`
        fixed inset-y-0 left-0 z-[50] w-64 bg-white shadow-lg border-r border-gray-200 h-full
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:block
      `}>
        
        {/* Header del Sidebar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="mx-auto md:mx-0 w-full flex flex-col items-center">
             <div className="h-10 w-40 rounded-full flex items-center justify-center mb-1">
                <img src={logoRayka} alt="Logo Rayka" className="max-h-full" />
             </div>
             <p className="text-sm text-gray-600 text-center">Panel Administrativo</p>
          </div>

          {/* Botón cerrar (Solo visible en móvil dentro del sidebar) */}
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden absolute top-4 right-4 p-1 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items (Scrollable si hay muchos items) */}
        <nav className="p-4 overflow-y-auto h-[calc(100%-80px)]">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.titulo}>
                {/* Item Principal */}
                {item.link ? (
                  <Link
                    to={item.link}
                    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isItemActive(item)
                        ? 'bg-[#224666]/20 text-[#132436] border-l-4 border-red-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.titulo}
                  </Link>
                ) : (
                  <button
                    onClick={() => toggleExpand(item.titulo)}
                    className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isItemActive(item)
                        ? 'bg-[#224666]/20 text-[#132436]'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.titulo}
                    </div>
                    {isExpanded(item.titulo) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}

                {/* Submenú */}
                {item.subMenu && isExpanded(item.titulo) && (
                  <ul className="mt-2 ml-6 space-y-1">
                    {item.subMenu.map((subItem) => (
                      <li key={subItem.titulo}>
                        <Link
                          to={subItem.link}
                          className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                            isItemActive(subItem)
                              ? 'bg-[#224666]/20 text-[#132436] border-l-2 border-[#CD321A]'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                          }`}
                        >
                          <subItem.icon className="w-4 h-4 mr-3" />
                          {subItem.titulo}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Espaciador para empujar el contenido hacia abajo en móvil debido a la barra fija superior */}
      <div className="md:hidden h-16"></div>
    </>
  );
};