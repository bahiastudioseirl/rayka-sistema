import type { FC } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // 👈 añade useNavigate
import { LogOut } from "lucide-react";
import LOGORAYKA from "../../assets/LOGO_RAYKA2.png";

export interface NavbarProps {
  appName: string;
  subtitle?: string;
  logoSrc: string;
  userName?: string;
  // 👇 permite onLogout async o sync
  onLogout?: () => Promise<void> | void;
  tabs: { href: string; label: string }[];
}

export const Navbar: FC<NavbarProps> = ({

  userName,
  onLogout,
  tabs,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  const handleLogout = async () => {
    try {
      await onLogout?.(); 
      localStorage.removeItem('authToken');
    } catch (e) {
      console.error("Error al cerrar sesión", e);
    } finally {
      const next = `${location.pathname}${location.search || ""}` || "/";
      // Como viene de location, es seguro (ruta interna).
      navigate(`/login?next=${encodeURIComponent(next)}`, { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="shrink-0">
            <img
              src={LOGORAYKA}
              alt="logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <div className="truncate"></div>
        </div>


        <div className="flex items-center gap-4">
          {userName && (
            <div className="hidden sm:flex flex-col text-right leading-tight">
              <span className="text-xs text-slate-500">Bienvenido, Hola</span>
              <span className="text-sm font-medium text-slate-900">{userName}</span>
            </div>
          )}
          {/* Línea divisoria */}
          <div className="h-6 w-px bg-slate-300"></div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-white hover:bg-slate-50 transition">
            <LogOut className="h-4 w-4 text-[#CD321A]" />
            <span className="text-[#CD321A]">Salir</span>
          </button>
        </div>
      </div>

      {tabs?.length > 0 && <div className="w-full h-px bg-slate-200"></div>}
      {tabs?.length > 0 && (
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-6 text-sm">
            {tabs.map((t) => (
              <li key={t.href}>
                <Link
                  to={t.href}
                  className={`inline-flex h-12 items-center border-b-2 transition-all duration-200 font-medium
                    ${isActive(t.href)
                      ? "border-emerald-600 text-emerald-700 bg-emerald-50/50"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"}`}
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
