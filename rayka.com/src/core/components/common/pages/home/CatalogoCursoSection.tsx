import type { FC } from "react"
import { Link } from "react-router-dom"
import { BookOpen, NotebookPen, TrendingUp } from "lucide-react"

interface ActionCard {
  to: string
  title: string
  description: string
  cta?: string
  icon: React.ReactElement
}

interface CatalogoCursoSectionProps {
  items?: ActionCard[]
}

export const CatalogoCursoSection: FC<CatalogoCursoSectionProps> = ({
  items = [
    {
      to: "/cursos",
      title: "Mis Cursos",
      description: "Continúa con los cursos en los que estás inscrito",
      cta: "Explorar →",
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      to: "/progreso",
      title: "Mi Progreso",
      description: "Revisa tu avance, calificaciones y estadísticas",
      cta: "Explorar →",
      icon: <TrendingUp className="h-6 w-6" />,
    },
  ],
}) => {
  return (
    <section className="mt-8 mb-20">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">¿Qué deseas hacer?</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((item, idx) => (
          <Link
            key={idx}
            to={item.to}
            className="rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-sm p-5 transition-colors"
          >
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100 text-blue-600">
              {item.icon}
            </div>

            <h4 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h4>
            <p className="mt-1 text-sm text-slate-600">{item.description}</p>

            <span className="mt-4 inline-block text-sm font-medium text-emerald-700">
              {item.cta ?? "Ver más →"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CatalogoCursoSection
