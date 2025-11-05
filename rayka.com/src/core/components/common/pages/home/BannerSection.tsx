import type { FC } from "react"

interface BannerSectionProps {
  userName?: string
  subtitle?: string
}

export const BannerSection: FC<BannerSectionProps> = ({
  userName = "Juan García",
  subtitle = "Continúa tu viaje de aprendizaje hoy",
}) => {
  return (
    <section className="mt-4">
      <div className="rounded-2xl bg-emerald-700 text-white px-6 py-6 sm:py-8 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Bienvenido de nuevo{userName ? `, ${userName}` : ""}!
        </h2>
        <p className="mt-2 text-emerald-100">{subtitle}</p>
      </div>
    </section>
  )
}

export default BannerSection
