import type { FC } from "react"

export interface StatItem {
  value: string | number
  label: string
  bg?: string
  text?: string
}

interface EstadisticaSectionProps {
  stats?: StatItem[]
}

export const EstadisticaSection: FC<EstadisticaSectionProps> = ({
  stats = [
    { value: 2, label: "Cursos en progreso", bg: "bg-blue-100", text: "text-blue-700" },
    { value: 12.5, label: "Horas aprendidas", bg: "bg-green-100", text: "text-green-700" },
    { value: 5, label: "Sesiones completadas", bg: "bg-violet-100", text: "text-violet-700" },
    { value: "85%", label: "Promedio de calificación", bg: "bg-amber-100", text: "text-orange-600" },
  ],
}) => {
  return (
    <section className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`rounded-xl ${s.bg ?? "bg-slate-100"} p-6 shadow-sm border border-white/60`}
          >
            <div className={`text-3xl font-bold ${s.text ?? "text-slate-800"}`}>{s.value}</div>
            <div className="mt-1 text-slate-600">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default EstadisticaSection
