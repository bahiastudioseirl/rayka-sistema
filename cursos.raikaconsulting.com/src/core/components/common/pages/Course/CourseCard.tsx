import type { FC } from "react"


export interface CourseCardProps {
  title: string;
  description: string;
  progressPct: number;
  ctaText?: string;
  onClick?: () => void;
  imageUrl?: string;
}
export const CourseCard: FC<CourseCardProps> = ({
  title,
  description,
  progressPct,
  imageUrl,
  ctaText = "Continuar",
  onClick,
}) => {
  const pct = Math.max(0, Math.min(100, progressPct))

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden w-full max-w-md">
      {/* Banda superior tipo cover */}
      <div className="h-28 w-full relative bg-[#224666]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#224666]" />
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{description}</p>

        {/* Progreso */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-700">Progreso</span>
            <span className="font-semibold text--900">{pct}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full rounded-full bg-blue-100">
            <div
              className="h-2.5 rounded-full bg-[#224666] transition-[width]"
              style={{ width: `${pct}%` }}
              aria-label={`Progreso ${pct}%`}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onClick}
          className="mt-5 w-full rounded-lg bg-[#132436] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#224666] active:translate-y-px"
        >
          {ctaText}
        </button>
      </div>
    </div>
  )
}

export default CourseCard
